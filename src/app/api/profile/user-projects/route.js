import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { connectToDatabase } from "@/lib/mongoose";
import User from "@/models/User";
import Conversation from "@/models/Conversation";

/**
 * GET /api/profile/user-projects
 * Fetch all projects created by the authenticated user
 * Identity comes from session (not frontend userId)
 */
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    await connectToDatabase();

    // Get user from session
    const user = await User.findOne({ email: session.user.email }).lean();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Fetch conversations (projects) created by this user
    // Using the Conversation model which stores project references
    const conversations = await Conversation.find({
      userId: user._id
    })
      .select(
        "_id projectId projectName description createdAt updatedAt status progress priority deadline"
      )
      .sort({ createdAt: -1 })
      .lean();

    // Map conversations to project format
    const projects = conversations.map((conv) => ({
      _id: conv._id,
      title: conv.projectName,
      description: conv.description || "",
      status: conv.status || "active",
      progress: conv.progress || 0,
      priority: conv.priority || "medium",
      deadline: conv.deadline || null,
      createdAt: conv.createdAt,
      updatedAt: conv.updatedAt
    }));

    return NextResponse.json({
      success: true,
      data: projects,
      count: projects.length
    });
  } catch (error) {
    console.error("User projects fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch user projects" },
      { status: 500 }
    );
  }
}
