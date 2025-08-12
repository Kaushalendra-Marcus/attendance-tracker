import { connectToDB } from "@/lib/mongoose";
import { NextRequest, NextResponse } from "next/server";
import User from "@/lib/model/user.model";
import Attendance from "@/lib/model/attendance.model";

function getRangeDaysWithoutSundays(start: string, end: string): string[] {
  const dates: string[] = [];
  const current = new Date(start);
  const to = new Date(end);

  while (current <= to) {
    if (current.getDay() !== 0) {
      dates.push(current.toISOString().split('T')[0]);
    }
    current.setDate(current.getDate() + 1);
  }
  return dates;
}
console.log(getRangeDaysWithoutSundays);


function normalizeString(str: string) {
  return str.toLowerCase().replace(/\s+/g, '');
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

    // Normalize dates
    const startDate = new Date(fromDate).toISOString().split('T')[0];
    const endDate = new Date(toDate).toISOString().split('T')[0];

    // Find attendance records
    const attendanceDocs = await Attendance.find({
      user: user._id,
      date: {
        $gte: startDate,
        $lte: endDate
      }
    });

    let present = 0;
    let total = 0;
    let subjectFound = false;

    // Normalize subject name for comparison
    const normalizedSubjectName = normalizeString(subjectName);

    // Check each attendance record
    for (const doc of attendanceDocs) {
      const record = doc.records.find(r =>
        normalizeString(r.name) === normalizedSubjectName &&
        r.type === type
      );

      if (record) {
        subjectFound = true;
        total++;
        if (record.isPresent) present++;
      }
    }

    if (!subjectFound) {
      return NextResponse.json({
        success: false,
        message: "Enter correct subject/lab name, No record found for given subject/lab",
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


