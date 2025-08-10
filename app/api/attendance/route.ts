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
    const rollNO = searchParams.get("rollNo")
    const date = searchParams.get("date")
    if (!rollNO || !date) {
        return NextResponse.json(
            { message: "Roll No or date is missing in attendance api" },
            { status: 400 }
        )
    }
    try {
        const user = await User.findOne({ rollNo: rollNO })
        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 400 }
            );
        }
        const dateAttendance = await Attendace.findOne({
            user: user._id,
            date: date
        })
        return NextResponse.json({
            success: true,
            data: dateAttendance ? dateAttendance.records : []
        })

    } catch (err) {
        const error = err as Error
        console.log(error);
        return NextResponse.json(
            { message: "Error in attendance current date" },
            { status: 400 }
        )
    }
}

export async function PUT(req: NextRequest) {
    await connectToDB()
    try {
        const body = await req.json()
        const { rollNo, presents, date } = body as RequestBody;

        if (!rollNo || !presents || !date) {
            return NextResponse.json(
                { message: "Error in getting fields in attendance route file" },
                { status: 400 }
            );
        }

        const user = await User.findOne({ rollNO: rollNo });
        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 400 }
            );
        }

        const existingAttendance = await Attendace.findOne({
            user: user._id,
            date: date
        });

        const records = presents.map((e: AttendanceRecord) => ({
            name: e.name,
            type: e.type,
            isPresent: e.isPresent
        }));

        if (existingAttendance) {
            existingAttendance.records = records;
            await existingAttendance.save();
        } else {
            const newAttendance = new Attendace({
                user: user._id,
                records: records,
                date: date
            });
            await newAttendance.save();
        }

        return NextResponse.json(
            { message: "Attendance saved successfully" },
            { status: 200 }
        );

    } catch (err) {
        const error = err as Error;
        console.log(error);
        return NextResponse.json(
            { message: "Error in attendance route file" },
            { status: 400 }
        );
    }
}