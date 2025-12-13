import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Conversation from "@/models/Conversation";

export async function GET(req) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    const now = new Date();
    const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

    // Find conversations with deadlines that are passed or within 3 days
    const query = {
      deadline: { $exists: true, $ne: null },
      status: { $ne: "closed" }
    };

    if (userId) {
      query["participants.userId"] = userId;
    }

    const conversations = await Conversation.find(query)
      .sort({ deadline: 1 })
      .lean();

    // Filter for urgent notifications (passed or within 3 days)
    const urgentConversations = conversations.filter(conv => {
      const deadline = new Date(conv.deadline);
      return deadline <= threeDaysFromNow;
    });

    // Serialize and return
    const serialized = urgentConversations.map(conv => ({
      _id: conv._id.toString(),
      projectName: conv.projectName,
      deadline: conv.deadline.toISOString(),
      status: conv.status,
    }));

    return NextResponse.json(serialized);
  } catch (error) {
    console.error("Error fetching deadline notifications:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
