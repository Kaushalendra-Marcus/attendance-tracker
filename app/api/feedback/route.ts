import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
    const formData = await req.formData();
    
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const feedback = formData.get('feedback') as string;
    const file = formData.get('file') as File | null;

    if (!name || !email || !feedback) {
        return NextResponse.json(
            { message: "Name, email and feedback are required" }, 
            { status: 400 }
        );
    }

    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER, 
                pass: process.env.APP_PASSWORD
            }
        });

        const mailOptions: any = {
            from: email,
            to: process.env.EMAIL_USER,
            subject: `myAttendance Feedback from ${name}`,
            text: `Name: ${name}\nEmail: ${email}\nFeedback: ${feedback}`,
            attachments: []
        };

        if (file && file.size > 0) {
            const buffer = Buffer.from(await file.arrayBuffer());
            mailOptions.attachments.push({
                filename: file.name,
                content: buffer
            });
        }

        await transporter.sendMail(mailOptions);
        return NextResponse.json(
            { success: true, message: "Feedback sent successfully, Thank You" },
            { status: 200 }
        );
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { success: false, message: "Failed to send feedback" },
            { status: 500 }
        );
    }
}