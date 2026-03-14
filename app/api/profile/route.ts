import User from "@/lib/model/user.model";
import { connectToDB } from "@/lib/mongoose";
import { NextResponse } from "next/server";
import { rateLimit, getIP } from "@/lib/rateLimit";
export async function PATCH(req: Request) {
  // Rate limit: max 10 profile updates per IP per 10 minutes
  const ip = getIP(req);
  const { allowed, retryAfter } = rateLimit(ip, { windowMs: 10 * 60 * 1000, max: 10 });
  if (!allowed) {
    return NextResponse.json(
      { message: `Too many requests. Try again in ${retryAfter} seconds.` },
      { status: 429 }
    );
  }

  try {
    await connectToDB();
    const body = await req.json();

    const rollno  = (body.rollno  || "").trim().toLowerCase();
    const college = (body.college || "").trim().toLowerCase();

    if (!rollno) {
      return NextResponse.json({ message: "Roll number is required." }, { status: 400 });
    }

    // Fields allowed to update
    const updates: Record<string, string> = {};
    if (body.name   !== undefined) updates.name   = (body.name   || "").trim();
    if (body.branch !== undefined) updates.branch = (body.branch || "").trim();
    if (body.year   !== undefined) updates.year   = (body.year   || "").trim();

    // Validate
    if (updates.name !== undefined && updates.name.length === 0) {
      return NextResponse.json({ message: "Name cannot be empty." }, { status: 400 });
    }
    if (updates.name && updates.name.length > 60) {
      return NextResponse.json({ message: "Name is too long." }, { status: 400 });
    }
    if (updates.branch !== undefined && updates.branch.length === 0) {
      return NextResponse.json({ message: "Branch cannot be empty." }, { status: 400 });
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ message: "Nothing to update." }, { status: 400 });
    }

    const query = college ? { rollno, college } : { rollno };
    const user = await User.findOneAndUpdate(
      query,
      { $set: updates },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    return NextResponse.json({
      message: "Profile updated successfully.",
      user: {
        name:    user.name,
        rollno:  user.rollno,
        branch:  user.branch,
        year:    user.year    || "",
        college: user.college || "",
      }
    }, { status: 200 });

  } catch (err) {
    const error = err as Error;
    console.error("Profile update error:", error);
    return NextResponse.json({ message: "Server error. Please try again." }, { status: 500 });
  }
}