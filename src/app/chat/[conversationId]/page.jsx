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
  
  // Serialize dates
  return messages.map(msg => ({
    ...msg,
    _id: msg._id.toString(),
    conversationId: msg.conversationId.toString(),
    createdAt: msg.createdAt.toISOString(),
    updatedAt: msg.updatedAt.toISOString(),
  }));
}

import ChatLayout from "@/components/Chat/ChatLayout";

export default async function ChatPage({ params }) {
  const { conversationId } = params;
  const conversation = await getConversation(conversationId);

  if (!conversation) {
    redirect("/new-project"); // Or 404
  }

  const messages = await getMessages(conversationId);

  return (
    <ChatLayout 
      projectSlug={conversationId} 
      initialConversation={conversation}
      initialMessages={messages}
    />
  );
}
