import { connectToDB } from "@/lib/mongoose"
import GameRoom from "@/lib/model/gameroom.model"
import { NextResponse } from "next/server"

export async function GET() {
    await connectToDB()

    const rooms = await GameRoom.find({ status: "finished" }).lean()

    const scores: Record<string, { name: string; rollNo: string; best: number; total: number; games: number }> = {}

    for (const room of rooms) {
        for (const p of (room as any).players) {
            if (!scores[p.rollNo]) {
                scores[p.rollNo] = { name: p.name, rollNo: p.rollNo, best: 0, total: 0, games: 0 }
            }
            scores[p.rollNo].total += p.score
            scores[p.rollNo].games += 1
            if (p.score > scores[p.rollNo].best) scores[p.rollNo].best = p.score
        }
    }

    const sorted = Object.values(scores)
        .sort((a, b) => b.best - a.best)
        .slice(0, 20)

    return NextResponse.json({ data: sorted })
}