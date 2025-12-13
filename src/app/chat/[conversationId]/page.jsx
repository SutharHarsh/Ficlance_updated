import { connectToDatabase } from "@/lib/mongoose";
import Conversation from "@/models/Conversation";
import Message from "@/models/Message";

import { redirect } from "next/navigation";

async function getConversation(conversationId) {
  await connectToDatabase();
  const conversation = await Conversation.findById(conversationId).lean();
  if (!conversation) return null;
  
  // Serialize dates
  conversation._id = conversation._id.toString();
  conversation.createdAt = conversation.createdAt.toISOString();
  conversation.updatedAt = conversation.updatedAt.toISOString();
  if (conversation.deadline) conversation.deadline = conversation.deadline.toISOString();
  conversation.participants = conversation.participants.map(p => ({
      ...p,
      _id: p._id ? p._id.toString() : undefined
  }));

  return conversation;
}

async function getMessages(conversationId) {
  await connectToDatabase();
  const messages = await Message.find({ conversationId }).sort({ createdAt: 1 }).lean();
  
  // Serialize dates and ensure sender is properly formatted
  return messages.map(msg => ({
    ...msg,
    _id: msg._id.toString(),
    conversationId: msg.conversationId.toString(),
    sender: msg.sender ? {
      userId: msg.sender.userId,
      role: msg.sender.role
    } : { userId: "unknown", role: "assistant" },
    content: String(msg.content || ""),
    type: msg.type || "text",
    createdAt: msg.createdAt.toISOString(),
    updatedAt: msg.updatedAt.toISOString(),
    metadata: msg.metadata || null,
  }));
}

import ChatInterface from "@/components/Chat/ChatInterface";

export default async function ChatPage({ params }) {
  const { conversationId } = params;
  const conversation = await getConversation(conversationId);

  if (!conversation) {
    redirect("/new-project"); // Or 404
  }

  const messages = await getMessages(conversationId);
  
  // Extract client name from requirements if available
  const clientName = conversation.requirements?.message?.client_name || "Client";
  const projectName = conversation.projectName || "Untitled Project";

  return (
    <ChatInterface 
      conversationId={conversationId} 
      initialMessages={messages}
      clientName={clientName}
      projectName={projectName}
      conversation={conversation}
    />
  );
}
