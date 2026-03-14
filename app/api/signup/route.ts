import { connectToDB } from "@/lib/mongoose";
import User from "@/lib/model/user.model";
import { NextResponse } from "next/server";
import { rateLimit, getIP } from "@/lib/rateLimit";

export async function POST(req: Request) {
  // Rate limit: max 5 signups per IP per 15 minutes
  const ip = getIP(req);
  const { allowed, retryAfter } = rateLimit(ip, { windowMs: 15 * 60 * 1000, max: 5 });
  if (!allowed) {
    return NextResponse.json(
      { message: `Too many requests. Please try again in ${retryAfter} seconds.` },
      { status: 429 }
    );
  }

  try {
    await connectToDB();
    const body = await req.json();

    // Sanitize inputs
    const name     = (body.name     || "").trim();
    const rollno   = (body.rollno   || "").trim().toLowerCase();
    const password = (body.password || "").trim();
    const branch   = (body.branch   || "").trim();
    const year     = (body.year     || "").trim();
    const college  = (body.college  || "").trim().toLowerCase();

    // Validation
    if (!name || !password || !rollno || !branch) {
      return NextResponse.json({ message: "Name, Roll No, Branch and Password are required." }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ message: "Password must be at least 6 characters." }, { status: 400 });
    }
    if (name.length > 60) {
      return NextResponse.json({ message: "Name is too long." }, { status: 400 });
    }

    // Unique check: rollno + college (college optional)
    const query = college ? { rollno, college } : { rollno };
    const userExists = await User.findOne(query);
    if (userExists) {
      return NextResponse.json({
        message: college
          ? `A user with this roll number already exists in "${college}".`
          : "User with this roll number already exists."
      }, { status: 400 });
    }

    const newUser = await User.create({ name, password, rollno, branch, year, college });

    return NextResponse.json({
      message: "Account created successfully!",
      user: {
        name:    newUser.name,
        rollno:  newUser.rollno,
        userId:  newUser._id.toString(),
        branch:  newUser.branch,
        year:    newUser.year,
        college: newUser.college,
      }
    }, { status: 201 });

  } catch (err) {
    const error = err as Error;
    console.error("Signup error:", error);
    return NextResponse.json({ message: "Server error. Please try again." }, { status: 500 });
  }
}