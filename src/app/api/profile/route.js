import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { connectToDatabase } from "@/lib/mongoose";
import Profile from "@/models/Profile";
import User from "@/models/User";
import { updateProfileSchema, usernameSchema } from "@/utils/profileValidation";

/**
 * GET /api/profile
 * Fetch the current user's profile
 * Returns merged user + profile data
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    await connectToDatabase();

    // Find user by email (session-scoped)
    const user = await User.findOne({ email: session.user.email }).lean();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Find or create profile
    let profile = await Profile.findOne({ userId: user._id }).lean();

    // If no profile exists, create default one
    if (!profile) {
      profile = await Profile.create({
        userId: user._id,
        stats: {
          totalProjectsCompleted: 0,
          activeSimulations: 0,
          deadlinesMetPercentage: 0,
          lastActiveDate: new Date()
        }
      });
      profile = profile.toObject();
    }

    // Merge user and profile data
    const mergedProfile = {
      // User data (read-only)
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      image: user.image,
      emailVerified: user.emailVerified,
      roles: user.roles,
      createdAt: user.createdAt,
      
      // Profile data (editable)
      username: profile.username || null,
      bio: profile.bio || "",
      skills: profile.skills || [],
      experienceLevel: profile.experienceLevel || "beginner",
      
      preferredTechStack: profile.preferredTechStack || [],
      careerGoal: profile.careerGoal || "learning",
      availability: profile.availability || { hoursPerWeek: 10 },
      portfolioLinks: profile.portfolioLinks || {
        github: "",
        website: "",
        linkedin: ""
      },
      
      stats: profile.stats || {
        totalProjectsCompleted: 0,
        activeSimulations: 0,
        deadlinesMetPercentage: 0,
        lastActiveDate: new Date()
      },
      
      preferences: profile.preferences || {
        notifications: {
          deadlines: true,
          messages: true,
          projectUpdates: true
        },
        theme: "system",
        language: "en"
      },
      
      customAvatar: profile.customAvatar || null,
      profileUpdatedAt: profile.updatedAt
    };

    return NextResponse.json({
      success: true,
      data: mergedProfile
    });

  } catch (error) {
    console.error("Profile GET error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/profile
 * Update the current user's profile
 * Only updates fields provided in request body
 */
export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate request body
    const validation = updateProfileSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Validation failed", 
          details: validation.error.flatten() 
        },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Find user by session email
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Prepare update object
    const updateData = {};

    // Personal info updates
    if (body.personal) {
      if (body.personal.username !== undefined) {
        // Check username uniqueness if changing
        if (body.personal.username) {
          const existingProfile = await Profile.findOne({
            username: body.personal.username,
            userId: { $ne: user._id }
          });

          if (existingProfile) {
            return NextResponse.json(
              { success: false, error: "Username already taken" },
              { status: 409 }
            );
          }
        }
        updateData.username = body.personal.username || null;
      }

      if (body.personal.bio !== undefined) updateData.bio = body.personal.bio;
      if (body.personal.skills !== undefined) updateData.skills = body.personal.skills;
      if (body.personal.experienceLevel !== undefined) {
        updateData.experienceLevel = body.personal.experienceLevel;
      }
    }

    // Professional info updates
    if (body.professional) {
      if (body.professional.preferredTechStack !== undefined) {
        updateData.preferredTechStack = body.professional.preferredTechStack;
      }
      if (body.professional.careerGoal !== undefined) {
        updateData.careerGoal = body.professional.careerGoal;
      }
      if (body.professional.availability !== undefined) {
        updateData.availability = body.professional.availability;
      }
      if (body.professional.portfolioLinks !== undefined) {
        updateData.portfolioLinks = body.professional.portfolioLinks;
      }
    }

    // Preferences updates
    if (body.preferences) {
      if (body.preferences.notifications !== undefined) {
        updateData["preferences.notifications"] = body.preferences.notifications;
      }
      if (body.preferences.theme !== undefined) {
        updateData["preferences.theme"] = body.preferences.theme;
      }
      if (body.preferences.language !== undefined) {
        updateData["preferences.language"] = body.preferences.language;
      }
    }

    // Custom avatar update
    if (body.customAvatar !== undefined) {
      updateData.customAvatar = body.customAvatar || null;
    }

    // Update last active date
    updateData["stats.lastActiveDate"] = new Date();

    // Update or create profile
    const profile = await Profile.findOneAndUpdate(
      { userId: user._id },
      { $set: updateData },
      { 
        new: true, 
        upsert: true, 
        runValidators: true 
      }
    ).lean();

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      data: profile
    });

  } catch (error) {
    console.error("Profile PUT error:", error);

    // Handle unique constraint violation
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: "Username already taken" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to update profile" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/profile
 * Delete user account and all associated data
 * Requires explicit confirmation
 */
export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const { confirmation } = await request.json();

    // Require explicit confirmation
    if (confirmation !== "DELETE_MY_ACCOUNT") {
      return NextResponse.json(
        { success: false, error: "Invalid confirmation" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Find user
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Delete profile
    await Profile.deleteOne({ userId: user._id });

    // Delete user (cascade delete handled by application logic)
    await User.deleteOne({ _id: user._id });

    // TODO: Delete associated data:
    // - Sessions
    // - Accounts
    // - Conversations
    // - Messages
    // - Projects
    // This should be implemented based on your data relationships

    return NextResponse.json({
      success: true,
      message: "Account deleted successfully"
    });

  } catch (error) {
    console.error("Profile DELETE error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete account" },
      { status: 500 }
    );
  }
}
