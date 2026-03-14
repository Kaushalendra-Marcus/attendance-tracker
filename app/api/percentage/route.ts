import { connectToDB } from "@/lib/mongoose";
import { NextRequest, NextResponse } from "next/server";
import User from "@/lib/model/user.model";
import Attendance from "@/lib/model/attendance.model";

function normalizeString(str: string) {
    return str.toLowerCase().replace(/\s+/g, '');
}

export async function PUT(req: NextRequest) {
    try {
        await connectToDB();
        const { rollNo, subjectName, type, fromDate, toDate } = await req.json();

        if (!rollNo || !subjectName || !type || !fromDate || !toDate) {
            return NextResponse.json({ success: false, message: "All fields are required" }, { status: 400 });
        }

        const user = await User.findOne({ rollno: rollNo });
        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        const startDate = new Date(fromDate).toISOString().split('T')[0];
        const endDate = new Date(toDate).toISOString().split('T')[0];

        const attendanceDocs = await Attendance.find({
            user: user._id,
            date: { $gte: startDate, $lte: endDate }
        });

        let present = 0;
        let total = 0;
        let subjectFound = false;
        const normalizedName = normalizeString(subjectName);

        for (const doc of attendanceDocs) {
            const record = doc.records.find((r: { name: string; type: string; isPresent: boolean }) =>
                normalizeString(r.name) === normalizedName && r.type === type
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
                message: "No attendance records found for this subject",
                present: 0, total: 0, percentage: 0
            }, { status: 200 });
        }

        return NextResponse.json({ success: true, present, total, percentage: total > 0 ? Math.round((present / total) * 100) : 0 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}
