import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { connectToDatabase } from "@/lib/mongoose";
import Profile from "@/models/Profile";
import { usernameSchema } from "@/utils/profileValidation";

/**
 * GET /api/profile/check-username?username=john_doe
 * Check if a username is available
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

    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    if (!username) {
      return NextResponse.json(
        { success: false, error: "Username parameter required" },
        { status: 400 }
      );
    }

    // Validate username format
    const validation = usernameSchema.safeParse(username);
    if (!validation.success) {
      return NextResponse.json(
        { 
          success: false, 
          available: false, 
          error: validation.error.errors[0].message 
        },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Check if username exists
    const existingProfile = await Profile.findOne({ username }).lean();

    return NextResponse.json({
      success: true,
      available: !existingProfile,
      username
    });

  } catch (error) {
    console.error("Username check error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to check username" },
      { status: 500 }
    );
  }
}
