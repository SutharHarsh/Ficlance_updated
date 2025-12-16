import mongoose from "mongoose";

const { Schema } = mongoose;

const ProfileSchema = new Schema(
  {
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: "User", 
      required: true, 
      unique: true,
      index: true 
    },
    
    // Personal Information
    username: { 
      type: String, 
      unique: true, 
      sparse: true, // Allows null but enforces uniqueness when present
      trim: true,
      minlength: 3,
      maxlength: 30,
      match: /^[a-zA-Z0-9_-]+$/ // Alphanumeric, underscore, hyphen only
    },
    bio: { 
      type: String, 
      maxlength: 250,
      default: ""
    },
    skills: [{ 
      type: String, 
      trim: true 
    }],
    experienceLevel: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner"
    },
    
    // Professional Details
    preferredTechStack: [{ 
      type: String, 
      trim: true 
    }],
    careerGoal: {
      type: String,
      enum: ["job", "freelancing", "learning", "other"],
      default: "learning"
    },
    availability: {
      hoursPerWeek: { 
        type: Number, 
        min: 0, 
        max: 168, // Max hours in a week
        default: 10 
      }
    },
    portfolioLinks: {
      github: { type: String, default: "" },
      website: { type: String, default: "" },
      linkedin: { type: String, default: "" }
    },
    
    // Activity & Progress (Read-Only, updated by system)
    stats: {
      totalProjectsCompleted: { type: Number, default: 0 },
      activeSimulations: { type: Number, default: 0 },
      deadlinesMetPercentage: { type: Number, default: 0, min: 0, max: 100 },
      lastActiveDate: { type: Date, default: Date.now }
    },
    
    // Preferences
    preferences: {
      notifications: {
        deadlines: { type: Boolean, default: true },
        messages: { type: Boolean, default: true },
        projectUpdates: { type: Boolean, default: true }
      },
      theme: {
        type: String,
        enum: ["light", "dark", "system"],
        default: "system"
      },
      language: {
        type: String,
        default: "en"
      }
    },
    
    // Avatar (separate from Google image)
    customAvatar: { 
      type: String, 
      default: null 
    }
  },
  { 
    timestamps: true // Adds createdAt and updatedAt
  }
);

// Indexes for performance
ProfileSchema.index({ username: 1 });
ProfileSchema.index({ "stats.lastActiveDate": -1 });

// Virtual for full profile with user data
ProfileSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true
});

// Ensure virtuals are included in JSON
ProfileSchema.set('toJSON', { virtuals: true });
ProfileSchema.set('toObject', { virtuals: true });

const Profile = mongoose.models.Profile || mongoose.model("Profile", ProfileSchema);

export default Profile;
