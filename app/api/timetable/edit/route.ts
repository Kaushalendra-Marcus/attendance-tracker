import TimeTable from "@/lib/model/timetable.model";
import User from "@/lib/model/user.model";
import { connectToDB } from "@/lib/mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
    await connectToDB()
    try {
        const { rollNo, branch, day, subjects } = await req.json()
        if (!rollNo || !branch || !day || !subjects) {
            return NextResponse.json({ success: false, message: "Missing fields" }, { status: 400 });
        }
        const user = await User.findOne({ rollno: rollNo, branch })
        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }
        const timetable = await TimeTable.findOne({ user: user._id })
        if (!timetable) {
            return NextResponse.json({ success: false, message: "Timetable not found" }, { status: 404 });
        }
        const dayIndex = timetable.days.findIndex((d: any) => d.day.toLowerCase() === day.toLowerCase())
        if (dayIndex === -1) {
            return NextResponse.json({ success: false, message: "Day not found in timetable" }, { status: 404 });
        }
        timetable.days[dayIndex].subjects = subjects;
        await timetable.save()
        return NextResponse.json({ success: true, message: "Timetable updated successfully" });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
    }
}