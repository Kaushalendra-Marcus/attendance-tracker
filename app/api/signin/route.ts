import User from "@/lib/model/user.model";
import { connectToDB } from "@/lib/mongoose";
import { NextResponse } from "next/server";
export async function POST(req: Request) {
    try {
        await connectToDB()
        const body = await req.json()
        const { rollno, password } = body
        if (!rollno || !password) {
            return NextResponse.json({ message: "All fields are required" }, { status: 400 })
        }
        const user = await User.findOne({ rollno })
        if (!user) {
            return NextResponse.json({ message: "User does not exist" }, { status: 404 })
        }
        if (user.password !== password) {
            return NextResponse.json({ message: "Invalid password" }, { status: 401 });
        }

        return NextResponse.json({
            message: "Login successful",
            user: {
                name: user.name,
                rollno: user.rollno,
                branch: user.branch
            }
        }, { status: 200 });
    } catch (err) {
        const error = err as Error
        console.log(error);
        return NextResponse.json({ message: "Error in server" }, { status: 400 })
    }
}