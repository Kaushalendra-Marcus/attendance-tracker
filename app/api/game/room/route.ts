import { connectToDB } from "@/lib/mongoose"
import GameRoom from "@/lib/model/gameroom.model"
import { getRandomQuestions } from "@/lib/questions"
import { NextRequest, NextResponse } from "next/server"

function makeCode() {
    return Math.random().toString(36).substring(2, 7).toUpperCase()
}

// GET /api/game/room?code=ABC12 - poll room state
export async function GET(req: NextRequest) {
    await connectToDB()
    const code = req.nextUrl.searchParams.get("code")
    if (!code) return NextResponse.json({ message: "Room code required" }, { status: 400 })

    const room = await GameRoom.findOne({ roomCode: code })
    if (!room) return NextResponse.json({ message: "Room not found" }, { status: 404 })

    // Auto-advance question after 20s
    if (room.status === "playing" && room.questionStartedAt) {
        const elapsed = (Date.now() - new Date(room.questionStartedAt).getTime()) / 1000
        if (elapsed > 20 && room.currentQuestion < room.questions.length - 1) {
            room.currentQuestion += 1
            room.questionStartedAt = new Date()
            await room.save()
        } else if (elapsed > 20 && room.currentQuestion >= room.questions.length - 1) {
            room.status = "finished"
            await room.save()
        }
    }

    const q = room.questions[room.currentQuestion]
    return NextResponse.json({
        roomCode: room.roomCode,
        status: room.status,
        tags: room.tags,
        currentQuestion: room.currentQuestion,
        totalQuestions: room.questions.length,
        questionStartedAt: room.questionStartedAt,
        question: room.status === "playing" && q ? {
            id: q.id,
            question: q.question,
            options: q.options,
            tags: q.tags,
        } : null,
        players: room.players
            .map((p: { rollNo: string; name: string; score: number; lastSeen: Date; answeredIds: number[] }) => ({
                rollNo: p.rollNo, name: p.name, score: p.score,
                answeredCurrent: q ? p.answeredIds.includes(q.id) : false,
            }))
            .sort((a: { score: number }, b: { score: number }) => b.score - a.score),
    })
}

// POST /api/game/room - create or join
export async function POST(req: NextRequest) {
    await connectToDB()
    const { action, rollNo, name, code, tags } = await req.json()

    if (action === "create") {
        let roomCode = makeCode()
        let exists = await GameRoom.findOne({ roomCode })
        while (exists) { roomCode = makeCode(); exists = await GameRoom.findOne({ roomCode }) }

        const questions = getRandomQuestions(10, tags || [])
        const room = await GameRoom.create({
            roomCode, tags: tags || [], questions,
            players: [{ rollNo, name, score: 0, answeredIds: [], lastSeen: new Date() }]
        })
        return NextResponse.json({ roomCode: room.roomCode })
    }

    if (action === "join") {
        const room = await GameRoom.findOne({ roomCode: code })
        if (!room) return NextResponse.json({ message: "Room not found" }, { status: 404 })
        if (room.status === "finished") return NextResponse.json({ message: "Game already ended" }, { status: 400 })

        const already = room.players.find((p: { rollNo: string }) => p.rollNo === rollNo)
        if (!already) {
            room.players.push({ rollNo, name, score: 0, answeredIds: [], lastSeen: new Date() })
            await room.save()
        }
        return NextResponse.json({ roomCode: room.roomCode, status: room.status })
    }

    if (action === "start") {
        const room = await GameRoom.findOne({ roomCode: code })
        if (!room) return NextResponse.json({ message: "Room not found" }, { status: 404 })
        room.status = "playing"
        room.questionStartedAt = new Date()
        await room.save()
        return NextResponse.json({ ok: true })
    }

    if (action === "heartbeat") {
        await GameRoom.updateOne(
            { roomCode: code, "players.rollNo": rollNo },
            { $set: { "players.$.lastSeen": new Date() } }
        )
        return NextResponse.json({ ok: true })
    }

    return NextResponse.json({ message: "Invalid action" }, { status: 400 })
}