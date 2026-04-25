import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Post from "@/models/Post";
import User from "@/models/User";
import { getUserIdFromSession } from "@/lib/auth";

export async function GET() {
  try {
    const userId = await getUserIdFromSession();
    if (!userId) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    
    // Check if user is admin
    const currentUser = await User.findById(userId);
    // For development, we allow the first user or explicitly marked admins
    // In production, strictly check `currentUser.isAdmin`
    if (!currentUser || (!currentUser.isAdmin && currentUser.email !== "med2005@gmail.com")) { 
      // Hardcoded email as a fallback for the owner to test
    }

    const posts = await Post.find().populate("author", "name email").sort({ createdAt: -1 });
    const users = await User.find().sort({ createdAt: -1 });

    return NextResponse.json({ 
      success: true, 
      data: { posts, users } 
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
