import User from "@/lib/model/user.model";
import { connectToDB } from "@/lib/mongoose";
import { NextResponse } from "next/server";
import { rateLimit, getIP } from "@/lib/rateLimit";

export async function POST(req: Request) {
  // Rate limit: max 10 login attempts per IP per 10 minutes
  const ip = getIP(req);
  const { allowed, retryAfter } = rateLimit(ip, { windowMs: 10 * 60 * 1000, max: 10 });
  if (!allowed) {
    return NextResponse.json(
      { message: `Too many login attempts. Please try again in ${retryAfter} seconds.` },
      { status: 429 }
    );
  }

  try {
    await connectToDB();
    const body = await req.json();

    const rollno  = (body.rollno  || "").trim().toLowerCase();
    const password = (body.password || "").trim();
    const college  = (body.college  || "").trim().toLowerCase();

    if (!rollno || !password) {
      return NextResponse.json({ message: "Roll number and password are required." }, { status: 400 });
    }

    // Find user — college is optional for backward compatibility
    // If college provided, match both; otherwise match rollno only
    const query = college
      ? { rollno, college }
      : { rollno };

    const user = await User.findOne(query);
    if (!user) {
      return NextResponse.json({ message: "Invalid credentials." }, { status: 401 });
    }

    if (user.password !== password) {
      return NextResponse.json({ message: "Invalid credentials." }, { status: 401 });
    }

    return NextResponse.json({
      message: "Login successful",
      user: {
        name:    user.name,
        rollno:  user.rollno,
        userId:  user._id.toString(),
        branch:  user.branch,
        year:    user.year   || "",
        college: user.college || "",
      }
    }, { status: 200 });

  } catch (err) {
    const error = err as Error;
    console.error("Signin error:", error);
    return NextResponse.json({ message: "Server error. Please try again." }, { status: 500 });
  }
}