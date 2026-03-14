import { connectToDB } from "@/lib/mongoose"
import Like from "@/lib/model/like.model"
import { NextResponse } from "next/server"

export async function GET() {
    await connectToDB()
    try {
        const top = await Like.aggregate([
            { $group: { _id: "$toRollNo", name: { $first: "$toName" }, total: { $sum: 1 } } },
            { $sort: { total: -1 } },
            { $limit: 20 },
            { $project: { _id: 0, rollNo: "$_id", name: 1, total: 1 } }
        ])
        return NextResponse.json({ data: top })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ message: "Server error" }, { status: 500 })
    }
}
