import { connectToDB } from "@/lib/mongoose";
import User from "@/lib/model/user.model";
import { NextResponse } from "next/server";
export async function POST(req: Request) {
    try {
        await connectToDB()
        const { name, rollno, password,  branch } = await req.json()
        if (!name || !password || !rollno || !branch) {
            return NextResponse.json({ errror: "All field required" }, { status: 400 })
        }
        const userExists = await User.findOne({ rollno })
        if (userExists) {
            return NextResponse.json({ error: "User alrady exist" }, { status: 400 })
        }
        const newUser = await User.create({ name, password, rollno, branch })
        return NextResponse.json({
            message: "User created successfully",
            user: {
                name: newUser.name,
                rollno: newUser.rollno,
                branch: newUser.branch,
            }
        }, { status: 201 })
    } catch (err) {
        const error = err as Error
        console.log(error);
        return NextResponse.json({ error: "Server Error" }, { status: 500 })
    }
}