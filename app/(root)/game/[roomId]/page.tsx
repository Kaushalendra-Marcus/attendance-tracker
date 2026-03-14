"use client"
import { useEffect, useState, useCallback, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { FiCopy, FiCheck, FiPlay, FiZap, FiUsers } from "react-icons/fi"
import { useUser } from "@/app/context/useContext"
import { GridBackground } from "@/components/PageShared"

type Player = { rollNo: string; name: string; score: number; answeredCurrent: boolean }
type RoomState = {
    roomCode: string
    status: "waiting" | "playing" | "finished"
    currentQuestion: number
    totalQuestions: number
    questionStartedAt: string
    tags: string[]
    question: { id: number; question: string; options: string[]; tags: string[] } | null
    players: Player[]
}

const QUESTION_TIME = 20

export default function GameRoom() {
    const { rollNo, name } = useUser()
    const { roomId } = useParams<{ roomId: string }>()
    const router = useRouter()

    const [room, setRoom] = useState<RoomState | null>(null)
    const [selected, setSelected] = useState<string | null>(null)
    const [result, setResult] = useState<{ correct: boolean; correctAnswer: string } | null>(null)
    const [timeLeft, setTimeLeft] = useState(QUESTION_TIME)
    const [copied, setCopied] = useState(false)
    const [answeredIds, setAnsweredIds] = useState<Set<number>>(new Set())
    const lastQId = useRef<number | null>(null)
    const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

    const fetchRoom = useCallback(async () => {
        if (!roomId) return
        try {
            const res = await fetch(`/api/game/room?code=${roomId}`)
            if (!res.ok) return
            const data: RoomState = await res.json()
            setRoom(data)

            // Reset answer state when question changes
            if (data.question && data.question.id !== lastQId.current) {
                lastQId.current = data.question.id
                if (!answeredIds.has(data.question.id)) {
                    setSelected(null)
                    setResult(null)
                }
            }

            if (data.questionStartedAt) {
                const elapsed = (Date.now() - new Date(data.questionStartedAt).getTime()) / 1000
                setTimeLeft(Math.max(0, Math.round(QUESTION_TIME - elapsed)))
            }
        } catch { /* silent */ }
    }, [roomId, answeredIds])

    // Heartbeat + poll
    useEffect(() => {
        if (!rollNo || !roomId) return
        fetchRoom()

        const hb = setInterval(async () => {
            fetch("/api/game/room", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "heartbeat", code: roomId, rollNo })
            })
        }, 5000)

        pollRef.current = setInterval(fetchRoom, 1500)
        return () => { clearInterval(hb); if (pollRef.current) clearInterval(pollRef.current) }
    }, [rollNo, roomId, fetchRoom])

    // Timer countdown
    useEffect(() => {
        if (room?.status !== "playing") return
        const t = setInterval(() => setTimeLeft(prev => Math.max(0, prev - 1)), 1000)
        return () => clearInterval(t)
    }, [room?.status, room?.currentQuestion])

    const submitAnswer = async (option: string) => {
        if (!room?.question || selected || answeredIds.has(room.question.id)) return
        setSelected(option)
        setAnsweredIds(prev => new Set(prev).add(room.question!.id))

        try {
            const res = await fetch("/api/game/answer", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code: roomId, rollNo, questionId: room.question.id, answer: option })
            })
            const data = await res.json()
            setResult({ correct: data.correct, correctAnswer: data.correctAnswer })
        } catch { /* silent */ }
    }

    const startGame = async () => {
        await fetch("/api/game/room", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "start", code: roomId })
        })
        fetchRoom()
    }

    const copyCode = () => {
        navigator.clipboard.writeText(roomId)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    if (!room) return (
        <div style={{ background: "var(--bg-primary)", minHeight: "100vh" }} className="flex items-center justify-center">
            <div className="text-center">
                <div className="w-8 h-8 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>Loading room...</p>
            </div>
        </div>
    )

    const myScore = room.players.find(p => p.rollNo === rollNo)?.score ?? 0
    const alreadyAnswered = room.question ? answeredIds.has(room.question.id) : false
    const timerPct = (timeLeft / QUESTION_TIME) * 100
    const timerColor = timeLeft > 10 ? "#22c55e" : timeLeft > 5 ? "#f59e0b" : "#ef4444"

    return (
        <div style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>
            <div className="relative overflow-hidden">
                <GridBackground />
                <main className="relative z-10 max-w-3xl mx-auto px-4 py-8">

                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>Room Code</p>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-2xl font-black text-white font-mono tracking-widest">{roomId}</span>
                                <button onClick={copyCode} className="p-1.5 rounded-lg transition-all"
                                    style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}>
                                    {copied ? <FiCheck size={13} className="text-emerald-400" /> : <FiCopy size={13} style={{ color: "var(--text-muted)" }} />}
                                </button>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xs" style={{ color: "var(--text-muted)" }}>Your score</p>
                            <p className="text-2xl font-black text-white">{myScore}</p>
                        </div>
                    </div>

                    {/* ── WAITING ── */}
                    {room.status === "waiting" && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                            <div className="card p-6 text-center">
                                <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                                    style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)" }}>
                                    <FiUsers className="text-indigo-400" size={20} />
                                </div>
                                <p className="font-bold text-white mb-1">Waiting for players</p>
                                <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>
                                    Share code <span className="font-mono text-white">{roomId}</span> with batchmates
                                </p>
                                {room.tags.length > 0 && (
                                    <div className="flex flex-wrap justify-center gap-1.5 mb-4">
                                        {room.tags.map(t => (
                                            <span key={t} className="text-xs px-2 py-0.5 rounded-full"
                                                style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", color: "#a5b4fc" }}>
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                )}
                                <button onClick={startGame}
                                    className="btn-primary inline-flex items-center gap-2 px-6 py-2.5">
                                    <FiPlay size={14} /> Start Game
                                </button>
                            </div>

                            {/* Players in lobby */}
                            <div className="card p-4">
                                <p className="text-xs font-semibold mb-3" style={{ color: "var(--text-muted)" }}>
                                    Players ({room.players.length})
                                </p>
                                <div className="space-y-2">
                                    {room.players.map((p, i) => (
                                        <div key={i} className="flex items-center gap-2">
                                            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black text-white"
                                                style={{ background: "linear-gradient(135deg, var(--accent-indigo), var(--accent-blue))" }}>
                                                {p.name[0].toUpperCase()}
                                            </div>
                                            <span className="text-sm text-white">{p.name}</span>
                                            {p.rollNo === rollNo && <span className="text-xs text-indigo-400">(you)</span>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* ── PLAYING ── */}
                    {room.status === "playing" && room.question && (
                        <motion.div key={room.currentQuestion} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">

                            {/* Progress + Timer */}
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                                    Q {room.currentQuestion + 1}/{room.totalQuestions}
                                </span>
                                <div className="flex items-center gap-1.5">
                                    <FiZap size={12} style={{ color: timerColor }} />
                                    <span className="text-sm font-black" style={{ color: timerColor }}>{timeLeft}s</span>
                                </div>
                            </div>

                            {/* Timer bar */}
                            <div className="h-1 rounded-full overflow-hidden mb-4" style={{ background: "var(--border)" }}>
                                <motion.div className="h-full rounded-full"
                                    style={{ background: timerColor, width: `${timerPct}%` }}
                                    transition={{ duration: 0.5 }} />
                            </div>

                            {/* Tags */}
                            {room.question.tags.length > 0 && (
                                <div className="flex gap-1.5">
                                    {room.question.tags.map(t => (
                                        <span key={t} className="text-xs px-2 py-0.5 rounded-full"
                                            style={{ background: "rgba(99,102,241,0.1)", color: "#a5b4fc", border: "1px solid rgba(99,102,241,0.2)" }}>
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Question */}
                            <div className="card p-5">
                                <p className="text-lg font-bold text-white">{room.question.question}</p>
                            </div>

                            {/* Options */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {room.question.options.map((opt, i) => {
                                    const isSelected = selected === opt
                                    const isCorrect = result?.correctAnswer === opt
                                    const isWrong = isSelected && !result?.correct

                                    let bg = "var(--bg-secondary)"
                                    let border = "var(--border)"
                                    let color = "var(--text-primary)"

                                    if (result) {
                                        if (isCorrect) { bg = "rgba(34,197,94,0.15)"; border = "#22c55e"; color = "#86efac" }
                                        else if (isWrong) { bg = "rgba(239,68,68,0.15)"; border = "#ef4444"; color = "#fca5a5" }
                                    } else if (isSelected) {
                                        bg = "rgba(99,102,241,0.15)"; border = "#6366f1"; color = "#a5b4fc"
                                    }

                                    return (
                                        <motion.button key={i} whileTap={{ scale: alreadyAnswered ? 1 : 0.97 }}
                                            onClick={() => submitAnswer(opt)}
                                            disabled={alreadyAnswered}
                                            className="p-4 rounded-xl text-sm font-medium text-left transition-all disabled:cursor-default"
                                            style={{ background: bg, border: `1px solid ${border}`, color }}>
                                            <span className="font-mono mr-2" style={{ color: "var(--text-muted)" }}>
                                                {["A", "B", "C", "D"][i]}.
                                            </span>
                                            {opt}
                                        </motion.button>
                                    )
                                })}
                            </div>

                            {/* Result feedback */}
                            <AnimatePresence>
                                {result && (
                                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                                        className="card p-3 text-center text-sm font-semibold"
                                        style={{ color: result.correct ? "#86efac" : "#fca5a5" }}>
                                        {result.correct ? "Correct! Points added" : `Wrong — Answer: ${result.correctAnswer}`}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Live scoreboard */}
                            <div className="card p-4">
                                <p className="text-xs font-semibold mb-3" style={{ color: "var(--text-muted)" }}>Live Scores</p>
                                <div className="space-y-2">
                                    {room.players.map((p, i) => (
                                        <div key={i} className="flex items-center gap-2">
                                            <span className="text-xs w-4" style={{ color: "var(--text-muted)" }}>#{i + 1}</span>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-xs text-white truncate">{p.name}</span>
                                                    <span className="text-xs font-black text-white">{p.score}</span>
                                                </div>
                                                <div className="h-1 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
                                                    <motion.div className="h-full rounded-full"
                                                        style={{ background: "var(--accent-indigo)" }}
                                                        animate={{ width: `${Math.min(100, (p.score / 150) * 100)}%` }}
                                                        transition={{ duration: 0.4 }} />
                                                </div>
                                            </div>
                                            {p.answeredCurrent && (
                                                <FiCheck size={12} className="text-emerald-400 shrink-0" />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* ── FINISHED ── */}
                    {room.status === "finished" && (
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
                            <div className="card p-6 text-center"
                                style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(59,130,246,0.05))" }}>
                                <p className="text-4xl mb-2">
                                    {room.players[0]?.rollNo === rollNo ? "🏆" : "🎯"}
                                </p>
                                <p className="text-2xl font-black text-white mb-1">
                                    {room.players[0]?.rollNo === rollNo ? "You won!" : "Game Over"}
                                </p>
                                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                                    Your score: <span className="font-black text-white">{myScore}</span>
                                </p>
                            </div>

                            {/* Final standings */}
                            <div className="card p-4">
                                <p className="text-xs font-semibold mb-3" style={{ color: "var(--text-muted)" }}>Final Results</p>
                                <div className="space-y-2">
                                    {room.players.map((p, i) => (
                                        <div key={i} className="flex items-center gap-3 p-3 rounded-xl"
                                            style={{
                                                background: p.rollNo === rollNo ? "rgba(99,102,241,0.08)" : "var(--bg-primary)",
                                                border: `1px solid ${p.rollNo === rollNo ? "rgba(99,102,241,0.3)" : "var(--border)"}`
                                            }}>
                                            <span className="text-base w-6 text-center">
                                                {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
                                            </span>
                                            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black text-white"
                                                style={{ background: "linear-gradient(135deg, var(--accent-indigo), var(--accent-blue))" }}>
                                                {p.name[0].toUpperCase()}
                                            </div>
                                            <span className="flex-1 text-sm text-white font-medium">{p.name}</span>
                                            <span className="text-sm font-black text-white">{p.score} pts</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <button onClick={() => router.push("/game")}
                                className="btn-primary w-full py-3 flex items-center justify-center gap-2">
                                Play Again
                            </button>
                        </motion.div>
                    )}
                </main>
            </div>
        </div>
    )
}