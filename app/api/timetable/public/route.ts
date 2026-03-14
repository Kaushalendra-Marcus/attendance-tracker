import TimeTable from "@/lib/model/timetable.model";
import User from "@/lib/model/user.model";
import { connectToDB } from "@/lib/mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const rollNo = req.nextUrl.searchParams.get("rollNo");
    if (!rollNo) return NextResponse.json({ message: "Roll number required" }, { status: 400 });

    try {
        await connectToDB();

        const user = await User.findOne({ rollno: rollNo }).select("_id name rollno");
        if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

        const timetable = await TimeTable.findOne({ user: user._id });
        if (!timetable) return NextResponse.json({ message: "Timetable not found" }, { status: 404 });

        return NextResponse.json({
            data: {
                rollNo: user.rollno,
                name: user.name,
                days: timetable.days,
            }
        }, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
