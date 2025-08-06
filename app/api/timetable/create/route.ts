import TimeTable from "@/lib/model/timetable.model";
import User from "@/lib/model/user.model";
import { connectToDB } from "@/lib/mongoose";
import { NextRequest, NextResponse } from "next/server";

type Subject = {
  name: string;
  type: string;
  time?: string;
};

type Day = {
  day: string;
  subjects: Subject[];
};

type RequestBody = {
  rollNo: string;
  days: Day[];
};

export async function POST(req: NextRequest) {
    await connectToDB();
    try {
        const { rollNo, days } = await req.json() as RequestBody;
        
        if (!rollNo || !days || !days.length) {
            return NextResponse.json({ 
                success: false, 
                message: "Roll number and at least one day with subjects are required" 
            }, { status: 400 });
        }

        const user = await User.findOne({ rollno: rollNo });
        if (!user) {
            return NextResponse.json({ 
                success: false, 
                message: "User not found" 
            }, { status: 404 });
        }

        let timetable = await TimeTable.findOne({ user: user._id });
        
        if (!timetable) {
            timetable = new TimeTable({
                user: user._id,
                days: days
            });
        } else {
            days.forEach((newDay: Day) => {
                const existingDayIndex = timetable.days.findIndex((d: Day) => d.day === newDay.day);
                if (existingDayIndex !== -1) {
                    timetable.days[existingDayIndex].subjects = newDay.subjects;
                } else {
                    timetable.days.push(newDay);
                }
            });
        }

        await timetable.save();
        return NextResponse.json({ 
            success: true, 
            message: "Timetable updated successfully" 
        }, { status: 200 });
    } catch (err) {
        const error = err as Error;
        console.error(error);
        return NextResponse.json({ 
            success: false, 
            message: error.message || "Error in timetable creation" 
        }, { status: 500 });
    }
}