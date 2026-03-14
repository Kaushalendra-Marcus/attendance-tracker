import TimeTable from "@/lib/model/timetable.model";
import User from "@/lib/model/user.model";
import { connectToDB } from "@/lib/mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    await connectToDB();
    const { searchParams } = new URL(req.url);
    const rollNo  = searchParams.get("rollNo");
    const branch  = searchParams.get("branch");
    const college = (searchParams.get("college") || "").trim().toLowerCase();
    const userId  = searchParams.get("userId") || "";

    if (!rollNo || !branch) {
        return NextResponse.json({ success: false, message: "Missing parameters" }, { status: 400 });
    }

    try {
        let user;

        if (userId) {
            // Best: use _id directly — no rollno clash possible
            user = await User.findById(userId);
        } else if (college) {
            // College provided — rollno + college is unique combination
            user = await User.findOne({ rollno: rollNo, college });
        } else {
            // Old user — no college, match rollno + branch where college is empty
            user = await User.findOne({ rollno: rollNo, branch, college: { $in: ["", null] } });
            // Absolute fallback for very old records
            if (!user) user = await User.findOne({ rollno: rollNo, branch });
        }

        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 400 });
        }

        const timetable = await TimeTable.findOne({ user: user._id });
        if (!timetable) {
            return NextResponse.json({ success: false, message: "TimeTable not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: timetable });
    } catch (err) {
        const error = err as Error;
        console.error(error);
        return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    await connectToDB();
    try {
        const body    = await req.json();
        const rollNo  = (body.rollNo  || "").trim();
        const branch  = (body.branch  || "").trim();
        const college = (body.college || "").trim().toLowerCase();
        const userId  = (body.userId  || "").trim();
        const days    = body.days;

        if (!rollNo || !branch || !days) {
            return NextResponse.json({ success: false, message: "Missing parameters" }, { status: 400 });
        }

        let user;
        if (userId) {
            user = await User.findById(userId);
        } else if (college) {
            user = await User.findOne({ rollno: rollNo, college });
        } else {
            user = await User.findOne({ rollno: rollNo, branch, college: { $in: ["", null] } });
            if (!user) user = await User.findOne({ rollno: rollNo, branch });
        }

        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        const timetable = await TimeTable.findOneAndUpdate(
            { user: user._id },
            { $set: { days } },
            { new: true, upsert: true }
        );

        return NextResponse.json({ success: true, data: timetable });
    } catch (err) {
        const error = err as Error;
        console.error(error);
        return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
    }
}