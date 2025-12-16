import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectToDatabase } from "@/lib/mongoose";
import Conversation from "@/models/Conversation";
import { transformToDeadline } from "@/services/dashboardService";

export async function GET(req) {
  try {
    await connectToDatabase();
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.email;
    const now = new Date();
    const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

    // Strict tenant scoping: only conversations where the current user is a participant
    const conversations = await Conversation.find({
      "participants.userId": userId,
      deadline: { $exists: true, $ne: null, $lte: threeDaysFromNow, $gte: now },
      status: { $ne: "closed" },
    })
      .sort({ deadline: 1 })
      .lean();

    // Defensive assertion: throw if any conversation is not owned by this user
    const tenantSafe = conversations.every((conv) =>
      (conv.participants || []).some((p) => p.userId === userId)
    );
    if (!tenantSafe) {
      throw new Error("Multi-tenant violation: conversation without matching participant");
    }

    // Normalize shape for the UI
    const serialized = conversations.map((conv) => transformToDeadline(conv));

    return NextResponse.json(serialized);
  } catch (error) {
    console.error("Error fetching deadline notifications:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
