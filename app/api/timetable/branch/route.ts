import TimeTable from "@/lib/model/timetable.model";
import User from "@/lib/model/user.model";
import { connectToDB } from "@/lib/mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const branch = req.nextUrl.searchParams.get("branch");
    const year   = req.nextUrl.searchParams.get("year"); // e.g. "3"

    if (!branch) return NextResponse.json({ message: "Branch required" }, { status: 400 });

    try {
        await connectToDB();

        // Build user query — if year provided, filter by it
        const userQuery: Record<string, unknown> = { branch };
        if (year && year.trim()) {
            userQuery.year = year.trim();
        }

        const users = await User.find(userQuery).select("_id name rollno year");
        if (!users.length) return NextResponse.json({ data: [] }, { status: 200 });

        const userIds = users.map(u => u._id);
        const timetables = await TimeTable.find({ user: { $in: userIds } });

        const userMap = new Map(users.map(u => [u._id.toString(), u]));

        const result = timetables
            .map(tt => ({
                rollNo:   userMap.get(tt.user.toString())?.rollno || "",
                name:     userMap.get(tt.user.toString())?.name   || "",
                year:     userMap.get(tt.user.toString())?.year   || "",
                days:     tt.days,
                dayCount: tt.days.length,
            }))
            .sort((a, b) => b.dayCount - a.dayCount)
            .slice(0, 20)
            .map(({ dayCount: _, ...rest }) => rest);

        return NextResponse.json({ data: result }, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}