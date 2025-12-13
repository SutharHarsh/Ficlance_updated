import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Message from "@/models/Message";
import Conversation from "@/models/Conversation";

export async function POST(req) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { conversationId, content, userId, role, createdAt } = body;

    if (!conversationId || !content || !userId || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check conversation status
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    if (conversation.status === "closed" || (conversation.deadline && new Date() > new Date(conversation.deadline))) {
        if (conversation.status !== "closed") {
            conversation.status = "closed";
            await conversation.save();
        }
      return NextResponse.json({ error: "Conversation is closed" }, { status: 403 });
    }

    // Save User Message with provided createdAt if available
    const messageData = {
      conversationId,
      sender: { userId, role },
      content,
      type: "text",
    };
    
    // Use provided createdAt to maintain proper ordering
    if (createdAt) {
      messageData.createdAt = new Date(createdAt);
    }
    
    const userMessage = await Message.create(messageData);

    if (body.skipAI) {
        return NextResponse.json({ userMessage });
    }

    // Get conversation to extract client name
    const conv = await Conversation.findById(conversationId).lean();
    const clientName = conv?.requirements?.message?.client_name || 
                      conv?.participants?.find(p => p.role === "assistant")?.name || 
                      "AI Assistant";

    // Trigger AI with context
    const aiPayload = { 
      Question: content,
      client_name: clientName,
      conversationId: conversationId.toString()
    };
    console.log("Sending to AI Agent:", JSON.stringify(aiPayload, null, 2));

    const aiResponse = await fetch(`${process.env.AGENT_URL || "http://127.0.0.1:8000"}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(aiPayload),
    });

    if (!aiResponse.ok) {
        console.error("AI API Error", await aiResponse.text());
        // Do not break UI, just return user message
        return NextResponse.json({ userMessage });
    }

    const aiData = await aiResponse.json();
    const aiReplyContent = aiData.response || aiData.message || JSON.stringify(aiData);

    // Save AI Message with client name
    const aiMessage = await Message.create({
      conversationId,
      sender: { userId: "ai-assistant", role: "assistant", name: clientName },
      content: aiReplyContent,
      type: "text",
    });

    return NextResponse.json({ userMessage, aiMessage });

  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get("conversationId");

    if (!conversationId) {
      return NextResponse.json({ error: "ConversationId is required" }, { status: 400 });
    }

    const messages = await Message.find({ conversationId }).sort({ createdAt: 1, _id: 1 }).lean();
    
    // Serialize
    const serializedMessages = messages.map(msg => ({
        ...msg,
        _id: msg._id.toString(),
        conversationId: msg.conversationId.toString(),
        createdAt: msg.createdAt.toISOString(),
        updatedAt: msg.updatedAt.toISOString(),
    }));

    return NextResponse.json(serializedMessages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
