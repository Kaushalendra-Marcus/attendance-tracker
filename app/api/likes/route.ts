import { connectToDB } from "@/lib/mongoose"
import Like from "@/lib/model/like.model"
import User from "@/lib/model/user.model"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
    await connectToDB()
    const rollNo = req.nextUrl.searchParams.get("rollNo")
    if (!rollNo) return NextResponse.json({ message: "rollNo required" }, { status: 400 })

    try {
        const likes = await Like.find({ toRollNo: rollNo }).sort({ createdAt: -1 })
        return NextResponse.json({
            total: likes.length,
            likedBy: likes.map(l => ({ rollNo: l.fromRollNo, name: l.fromName, at: l.createdAt }))
        })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ message: "Server error" }, { status: 500 })
    }
}

// POST /api/likes → toggle like
export async function POST(req: NextRequest) {
    await connectToDB()
    try {
        const { fromRollNo, toRollNo } = await req.json()
        if (!fromRollNo || !toRollNo) return NextResponse.json({ message: "Missing fields" }, { status: 400 })
        if (fromRollNo === toRollNo) return NextResponse.json({ message: "Cannot like yourself" }, { status: 400 })

        const [fromUser, toUser] = await Promise.all([
            User.findOne({ rollno: fromRollNo }),
            User.findOne({ rollno: toRollNo }),
        ])
        if (!fromUser || !toUser) return NextResponse.json({ message: "User not found" }, { status: 404 })

        const existing = await Like.findOne({ fromRollNo, toRollNo })
        if (existing) {
            await Like.deleteOne({ fromRollNo, toRollNo })
            return NextResponse.json({ liked: false, message: "Like removed" })
        } else {
            await Like.create({ fromRollNo, fromName: fromUser.name, toRollNo, toName: toUser.name })
            return NextResponse.json({ liked: true, message: "Liked!" })
        }
    } catch (err) {
        console.error(err)
        return NextResponse.json({ message: "Server error" }, { status: 500 })
    }
}
