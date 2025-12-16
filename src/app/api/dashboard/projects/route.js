import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Conversation from "@/models/Conversation";
import { 
  transformToRecentProject,
  transformToInProgressProject,
  transformToCompletedProject,
  transformToDeadline 
} from "@/services/dashboardService";

/**
 * GET /api/dashboard/projects
 * Fetches dashboard project data for a user
 * Query params: userId, type (recent|in-progress|completed|deadlines)
 */
export async function GET(req) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const type = searchParams.get("type");

    if (!userId) {
      return NextResponse.json({ error: "UserId is required" }, { status: 400 });
    }

    // Handle different data types
    switch (type) {
      case 'recent':
        return await getRecentProjects(userId);
      
      case 'in-progress':
        return await getInProgressProjects(userId);
      
      case 'completed':
        return await getCompletedProjects(userId);
      
      case 'deadlines':
        return await getUpcomingDeadlines(userId);
      
      default:
        return NextResponse.json({ error: "Invalid type parameter" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error fetching dashboard projects:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

/**
 * Get recent 3 projects for sidebar
 */
async function getRecentProjects(userId) {
  const conversations = await Conversation.find({
    "participants.userId": userId,
  })
    .sort({ updatedAt: -1 })
    .limit(3)
    .lean();

  const recentProjects = conversations.map(transformToRecentProject);
  return NextResponse.json(recentProjects);
}

/**
 * Get in-progress projects
 */
async function getInProgressProjects(userId) {
  const conversations = await Conversation.find({
    "participants.userId": userId,
    status: "active",
  })
    .sort({ updatedAt: -1 })
    .lean();

  // Filter out completed projects (100% completion)
  const inProgressConversations = conversations.filter(conv => {
    const completion = conv.requirements?.message?.completion_percentage || 0;
    return completion < 100;
  });

  const projects = inProgressConversations.map(transformToInProgressProject);
  return NextResponse.json(projects);
}

/**
 * Get completed projects
 */
async function getCompletedProjects(userId) {
  const conversations = await Conversation.find({
    "participants.userId": userId,
  })
    .sort({ updatedAt: -1 })
    .lean();

  // Filter for completed projects (100% completion or closed status)
  const completedConversations = conversations.filter(conv => {
    const completion = conv.requirements?.message?.completion_percentage || 0;
    return completion >= 100 || conv.status === 'closed';
  });

  const projects = completedConversations.map(transformToCompletedProject);
  return NextResponse.json(projects);
}

/**
 * Get upcoming deadlines
 */
async function getUpcomingDeadlines(userId) {
  const now = new Date();
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  const conversations = await Conversation.find({
    "participants.userId": userId,
    deadline: { 
      $exists: true, 
      $ne: null,
      $lte: thirtyDaysFromNow 
    },
    status: "active",
  })
    .sort({ deadline: 1 })
    .limit(10)
    .lean();

  const deadlines = conversations.map(transformToDeadline);
  return NextResponse.json(deadlines);
}
