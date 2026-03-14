import { connectToDB } from "@/lib/mongoose"
import GameRoom from "@/lib/model/gameroom.model"
import { NextRequest, NextResponse } from "next/server"

const POINTS_FAST = 15   // answer in < 5s
const POINTS_MID = 10    // answer in < 12s
const POINTS_SLOW = 5    // correct but slow

export async function POST(req: NextRequest) {
    await connectToDB()
    const { code, rollNo, questionId, answer } = await req.json()

    const room = await GameRoom.findOne({ roomCode: code })
    if (!room || room.status !== "playing") return NextResponse.json({ message: "Room not active" }, { status: 400 })

    const q = room.questions[room.currentQuestion]
    if (!q || q.id !== questionId) return NextResponse.json({ message: "Wrong question" }, { status: 400 })

    const player = room.players.find((p: { rollNo: string }) => p.rollNo === rollNo)
    if (!player) return NextResponse.json({ message: "Player not in room" }, { status: 404 })

    if (player.answeredIds.includes(questionId)) {
        return NextResponse.json({ message: "Already answered", correct: false })
    }

    player.answeredIds.push(questionId)
    const correct = answer === q.answer

    if (correct) {
        const elapsed = (Date.now() - new Date(room.questionStartedAt).getTime()) / 1000
        const points = elapsed < 5 ? POINTS_FAST : elapsed < 12 ? POINTS_MID : POINTS_SLOW
        player.score += points
    }

    await room.save()
    return NextResponse.json({ correct, correctAnswer: q.answer })
}