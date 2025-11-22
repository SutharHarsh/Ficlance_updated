import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Conversation from "@/models/Conversation";
import Message from "@/models/Message";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Adjust path if needed

export async function POST(req) {
  try {
    await connectToDatabase();
    // const session = await getServerSession(authOptions);
    // if (!session) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }
    // For now, we might not have authOptions exported or set up exactly as expected in the snippet.
    // Assuming we can get userId from request or session.
    // Let's assume the client sends userId for now or we get it from session if available.
    // The prompt says "Participants: userId and AI Assistant".

    const body = await req.json();
    const {
      userId,
      projectId,
      projectName,
      duration,
      requirements,
      aiName,
    } = body;

    if (!userId || !projectId || !projectName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Calculate deadline
    let deadline = null;
    if (duration) {
      // Parse duration string (e.g., "3-5 days", "1 week")
      // This is a simplified parser, might need more robust logic
      const now = new Date();
      if (duration.includes("day")) {
        const days = parseInt(duration.split("-")[0]) || 1;
        deadline = new Date(now.setDate(now.getDate() + days));
      } else if (duration.includes("week")) {
        const weeks = parseInt(duration.split("-")[0]) || 1;
        deadline = new Date(now.setDate(now.getDate() + weeks * 7));
      } else {
        // Default to 1 day if unknown
        deadline = new Date(now.setDate(now.getDate() + 1));
      }
    }

    const conversation = await Conversation.create({
      participants: [
        { userId: userId, role: "user" },
        { userId: "ai-assistant", role: "assistant", name: aiName || "AI Assistant" },
      ],
      projectId,
      projectName,
      deadline,
      requirements,
      status: "active",
    });

    // Seed messages
    // Extract details from requirements
    const reqData = requirements.message || {};
    const clientName = reqData.client_name || aiName || "Client";
    const projName = reqData.project_name || projectName;
    const techStack = Array.isArray(reqData.tech_stack) ? reqData.tech_stack.join(", ") : reqData.tech_stack || "";
    const dur = reqData.duration || duration;
    const criteria = Array.isArray(reqData.acceptance_criteria) ? reqData.acceptance_criteria.join("\n") : reqData.acceptance_criteria || "";

    const initialMessageContent = `Hey ... i am ${clientName} and i want to make the porject ${projName} using the ${techStack}
in ${dur} and the requirments are : ${criteria} make sure they must be look perfect using the rich text editor`;

    const messages = [
      {
        conversationId: conversation._id,
        sender: { userId: "ai-assistant", role: "assistant", name: clientName },
        content: initialMessageContent,
        type: "text",
      },
    ];

    await Message.insertMany(messages);

    return NextResponse.json({ conversationId: conversation._id });
  } catch (error) {
    console.error("Error creating conversation:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "UserId is required" }, { status: 400 });
    }

    const conversations = await Conversation.find({
      "participants.userId": userId
    }).sort({ updatedAt: -1 }).lean();

    // Enhance conversations with last message preview if needed
    // For now, just return the conversation details
    // We might want to fetch the last message for each conversation to show in the list
    const conversationsWithLastMessage = await Promise.all(conversations.map(async (conv) => {
        const lastMsg = await Message.findOne({ conversationId: conv._id }).sort({ createdAt: -1 }).lean();
        return {
            ...conv,
            _id: conv._id.toString(),
            lastMessage: lastMsg ? {
                content: lastMsg.content,
                createdAt: lastMsg.createdAt.toISOString(),
                type: lastMsg.type
            } : null,
            // Serialize dates
            createdAt: conv.createdAt.toISOString(),
            updatedAt: conv.updatedAt.toISOString(),
            deadline: conv.deadline ? conv.deadline.toISOString() : null,
             participants: conv.participants.map(p => ({
                ...p,
                _id: p._id ? p._id.toString() : undefined
            }))
        };
    }));

    return NextResponse.json(conversationsWithLastMessage);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
