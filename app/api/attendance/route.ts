import Attendace from "@/lib/model/attendance.model";
import User from "@/lib/model/user.model";
import { connectToDB } from "@/lib/mongoose";
import { NextRequest, NextResponse } from "next/server";

type AttendanceRecord = {
    name: string;
    type: string;
    isPresent: boolean;
};

type RequestBody = {
    rollNo: string;
    presents: AttendanceRecord[];
    date: string;
};

export async function GET(req: NextRequest) {
    await connectToDB()
    const { searchParams } = new URL(req.url)
    const rollNo = searchParams.get("rollNo")
    const date = searchParams.get("date")

    if (!rollNo || !date) {
        return NextResponse.json({ message: "Roll No or date is missing" }, { status: 400 })
    }

    try {
        const user = await User.findOne({ rollno: rollNo })
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 400 })
        }

        const dateAttendance = await Attendace.findOne({ user: user._id, date })
        return NextResponse.json({
            success: true,
            data: dateAttendance ? dateAttendance.records : []
        })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ message: "Error fetching attendance" }, { status: 500 })
    }
}

export async function PUT(req: NextRequest) {
    await connectToDB()
    try {
        const { rollNo, presents, date } = await req.json() as RequestBody

        if (!rollNo || !presents || !date) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
        }

        const user = await User.findOne({ rollno: rollNo })
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 400 })
        }

        const records = presents.map((e: AttendanceRecord) => ({
            name: e.name,
            type: e.type,
            isPresent: e.isPresent
        }))

        const existing = await Attendace.findOne({ user: user._id, date })

        if (existing) {
            existing.records = records
            await existing.save()
        } else {
            await new Attendace({ user: user._id, records, date }).save()
        }

        return NextResponse.json({ message: "Attendance saved successfully" }, { status: 200 })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ message: "Error saving attendance" }, { status: 500 })
    }
}