import Attendace from "@/lib/model/attendance.model";
import User from "@/lib/model/user.model";
import { connectToDB } from "@/lib/mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
    await connectToDB()
    try {
        const body = await req.json()
        const { rollNo, day, days } = await body
        if (!rollNo || !day || !days) {
            return NextResponse.json({ message: "Error in getting feilds in attendance route file" }, { status: 400 })
        }
        const user = await User.findOne({ rollNO: rollNo })
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 400 })
        }
        const attendaceList = days[day]
        if (!Array.isArray(attendaceList)) {
            return NextResponse.json(
                { message: "No attendance data for selected day" },
                { status: 400 }
            );
        }
        const records = attendaceList.map((e: any) => ({
            name: e.name,
            type: e.type,
            isPresent: e.isPresent
        }))
        const newAttendance = new Attendace({
            user: user._id,
            day: day,
            records: records,
        })
        await newAttendance.save()
        return NextResponse.json(
            { message: "Attendance saved successfully" },
            { status: 200 }
        );

    } catch (error: any) {
        console.log(error)
        return NextResponse.json({ message: "Error in attendance route file" }, { status: 400 })
    }
}