import { connectToDB } from "@/lib/mongoose";
import { NextRequest, NextResponse } from "next/server";
import User from "@/lib/model/user.model";
import Attendance from "@/lib/model/attendance.model";

function getRangeDaysWithoutSundays(start: string, end: string): Date[] {
  const dates: Date[] = [];
  let current = new Date(start);
  const to = new Date(end);
  
  while (current <= to) {
    if (current.getDay() !== 0) { // Skip Sundays
      dates.push(new Date(current));
    }
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

export async function PUT(req: NextRequest) {
  try {
    await connectToDB();
    const body = await req.json();
    const { rollNo, subjectName, type, fromDate, toDate } = body;

    // Validate input
    if (!rollNo || !subjectName || !type || !fromDate || !toDate) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    // Find user
    const user = await User.findOne({ rollNo });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Get all dates in range (excluding Sundays)
    const allDates = getRangeDaysWithoutSundays(fromDate, toDate);

    // Find attendance records for this user in date range
    const attendanceDocs = await Attendance.find({
      user: user._id,
      date: { 
        $gte: new Date(fromDate).toISOString(), 
        $lte: new Date(toDate).toISOString() 
      }
    });

    let present = 0;
    let total = 0;
    let subjectFound = false;

    // Check each date in range
    for (const date of allDates) {
      const dateStr = date.toISOString().split('T')[0];
      
      // Find attendance record for this date
      const doc = attendanceDocs.find(d => 
        new Date(d.date).toISOString().split('T')[0] === dateStr
      );

      if (doc) {
        // Find the specific subject record
        const record = doc.records.find(r => 
          r.name.toLowerCase() === subjectName.toLowerCase() && 
          r.type === type
        );

        if (record) {
          subjectFound = true;
          total++;
          if (record.isPresent) present++;
        }
      }
    }

    if (!subjectFound) {
      return NextResponse.json({
        success: false,
        message: "No attendance records found for this subject",
        present: 0,
        total: 0,
        percentage: 0
      }, { status: 200 }); 
    }

    return NextResponse.json({
      success: true,
      present,
      total,
      percentage: total > 0 ? Math.round((present / total) * 100) : 0
    });

  } catch (error) {
    console.error("Error in percentage API:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}