
import TimeTable from "@/lib/model/timetable.model";
import User from "@/lib/model/user.model";
import { connectToDB } from "@/lib/mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    await connectToDB();
    const { searchParams } = new URL(req.url);
    const rollNo = searchParams.get("rollNo");
    const branch = searchParams.get("branch");

    if (!rollNo || !branch) {
        return NextResponse.json({ success: false, message: "Missing parameters" }, { status: 400 });
    }

    try {
        const user = await User.findOne({ rollno: rollNo, Branch: branch });
        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 400 });
        }

        const timetable = await TimeTable.findOne({ user: user._id });
        if (!timetable) {
            return NextResponse.json({ success: false, message: "TimeTable not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: timetable });
    } catch (err) {
        const error = err as Error
        return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
    }
}
