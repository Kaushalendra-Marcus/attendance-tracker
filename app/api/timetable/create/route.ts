import TimeTable from "@/lib/model/timetable.model";
import User from "@/lib/model/user.model";
import { connectToDB } from "@/lib/mongoose";
import { NextRequest, NextResponse } from "next/server";

type Subject = { name: string; type: string; time?: string };
type Day = { day: string; subjects: Subject[] };

export async function POST(req: NextRequest) {
    await connectToDB();
    try {
        const body = await req.json();
        const rollNo  = (body.rollNo  || "").trim();
        const college = (body.college || "").trim().toLowerCase();
        const userId  = (body.userId  || "").trim();
        const days: Day[] = body.days;

        if (!rollNo || !days || !days.length) {
            return NextResponse.json({
                success: false,
                message: "Roll number and at least one day are required"
            }, { status: 400 });
        }

        // Find user — userId is most reliable, then college+rollno, then rollno alone
        let user;
        if (userId) {
            user = await User.findById(userId);
        } else if (college) {
            user = await User.findOne({ rollno: rollNo, college });
        } else {
            user = await User.findOne({ rollno: rollNo, college: { $in: ["", null] } });
            if (!user) user = await User.findOne({ rollno: rollNo });
        }

        if (!user) {
            return NextResponse.json({
                success: false,
                message: "User not found"
            }, { status: 404 });
        }

        const timetable = await TimeTable.findOneAndUpdate(
            { user: user._id },
            { $set: { user: user._id, days } },
            { new: true, upsert: true }
        );

        return NextResponse.json({
            success: true,
            message: "Timetable saved successfully",
            data: timetable
        }, { status: 200 });

    } catch (err) {
        const error = err as Error;
        console.error(error);
        return NextResponse.json({
            success: false,
            message: error.message || "Server error"
        }, { status: 500 });
    }
}