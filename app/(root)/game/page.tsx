"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { FiPlus, FiLogIn, FiAward, FiTag, FiX } from "react-icons/fi"
import { useUser } from "@/app/context/useContext"
import { GridBackground } from "@/components/PageShared"
import Footer from "@/components/footer"
import { Navigation } from "@/components/navigation"

type LeaderEntry = { name: string; rollNo: string; best: number; games: number }

const TAG_SUGGESTIONS = ["#tech", "#cs", "#webdev", "#funny", "#general"]

export default function GameLobby() {
    const { rollNo, name } = useUser()
    const router = useRouter()
    const [tab, setTab] = useState<"create" | "join">("create")
    const [tags, setTags] = useState<string[]>([])
    const [tagInput, setTagInput] = useState("")
    const [joinCode, setJoinCode] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [leaderboard, setLeaderboard] = useState<LeaderEntry[]>([])

    useEffect(() => {
        fetch("/api/game/leaderboard").then(r => r.json()).then(d => setLeaderboard(d.data || []))
    }, [])

    const addTag = (t: string) => {
        const clean = t.startsWith("#") ? t : `#${t}`
        if (!tags.includes(clean) && clean.length > 1) setTags(prev => [...prev, clean])
        setTagInput("")
    }

    const createRoom = async () => {
        if (!rollNo || !name) return setError("Please sign in first")
        setLoading(true); setError("")
        try {
            const res = await fetch("/api/game/room", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "create", rollNo, name, tags })
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.message)
            router.push(`/game/${data.roomCode}`)
        } catch (err) {
            setError((err as Error).message)
        } finally { setLoading(false) }
    }

    const joinRoom = async () => {
        if (!rollNo || !name) return setError("Please sign in first")
        if (!joinCode.trim()) return setError("Enter a room code")
        setLoading(true); setError("")
        try {
            const res = await fetch("/api/game/room", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "join", rollNo, name, code: joinCode.toUpperCase().trim() })
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.message)
            router.push(`/game/${joinCode.toUpperCase().trim()}`)
        } catch (err) {
            setError((err as Error).message)
        } finally { setLoading(false) }
    }

    const medals = ["🥇", "🥈", "🥉"]

    return (
        <div style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>
            <Navigation/>
            <div className="relative overflow-hidden">
                <GridBackground />
                <main className="relative z-10 max-w-4xl mx-auto px-4 py-8">

                    <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                        <h1 className="text-3xl font-black text-white">Quiz Battle</h1>
                        <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
                            Create a room or join one - first to answer wins more points
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Left - Create/Join */}
                        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card p-6">

                            {/* Tabs */}
                            <div className="flex gap-1 p-1 rounded-xl mb-6"
                                style={{ background: "var(--bg-primary)" }}>
                                {(["create", "join"] as const).map(t => (
                                    <button key={t} onClick={() => { setTab(t); setError("") }}
                                        className="flex-1 py-2 rounded-lg text-sm font-semibold capitalize transition-all"
                                        style={{
                                            background: tab === t ? "var(--bg-secondary)" : "transparent",
                                            color: tab === t ? "var(--text-primary)" : "var(--text-muted)",
                                            border: tab === t ? "1px solid var(--border)" : "1px solid transparent"
                                        }}>
                                        {t === "create" ? "Create Room" : "Join Room"}
                                    </button>
                                ))}
                            </div>

                            <AnimatePresence mode="wait">
                                {tab === "create" ? (
                                    <motion.div key="create" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-medium mb-2" style={{ color: "var(--text-muted)" }}>
                                                Question Tags <span style={{ fontWeight: 400 }}>(optional - leave empty for all)</span>
                                            </label>
                                            {/* Tag pills */}
                                            {tags.length > 0 && (
                                                <div className="flex flex-wrap gap-1.5 mb-2">
                                                    {tags.map(t => (
                                                        <span key={t} className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
                                                            style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)", color: "#a5b4fc" }}>
                                                            {t}
                                                            <button onClick={() => setTags(prev => prev.filter(x => x !== t))}>
                                                                <FiX size={10} />
                                                            </button>
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                            {/* Tag input */}
                                            <div className="flex gap-2">
                                                <input
                                                    value={tagInput}
                                                    onChange={e => setTagInput(e.target.value)}
                                                    onKeyDown={e => { if (e.key === "Enter" && tagInput.trim()) addTag(tagInput.trim()) }}
                                                    placeholder="#funny or #tech..."
                                                    className="flex-1 px-3 py-2 rounded-lg text-sm outline-none"
                                                    style={{ background: "var(--bg-primary)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
                                                />
                                                <button onClick={() => tagInput.trim() && addTag(tagInput.trim())}
                                                    className="px-3 py-2 rounded-lg transition-all"
                                                    style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)", color: "#a5b4fc" }}>
                                                    <FiTag size={14} />
                                                </button>
                                            </div>
                                            {/* Suggestions */}
                                            <div className="flex flex-wrap gap-1.5 mt-2">
                                                {TAG_SUGGESTIONS.filter(t => !tags.includes(t)).map(t => (
                                                    <button key={t} onClick={() => addTag(t)}
                                                        className="px-2 py-0.5 rounded-full text-xs transition-all"
                                                        style={{ background: "var(--bg-primary)", border: "1px solid var(--border)", color: "var(--text-muted)" }}>
                                                        {t}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <button onClick={createRoom} disabled={loading}
                                            className="btn-primary w-full flex items-center justify-center gap-2 py-3 disabled:opacity-60">
                                            <FiPlus /> {loading ? "Creating..." : "Create Room"}
                                        </button>
                                    </motion.div>
                                ) : (
                                    <motion.div key="join" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-medium mb-2" style={{ color: "var(--text-muted)" }}>Room Code</label>
                                            <input
                                                value={joinCode}
                                                onChange={e => setJoinCode(e.target.value.toUpperCase())}
                                                placeholder="Enter 5-letter code..."
                                                maxLength={5}
                                                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none font-mono tracking-widest text-center text-lg"
                                                style={{ background: "var(--bg-primary)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
                                            />
                                        </div>
                                        <button onClick={joinRoom} disabled={loading}
                                            className="btn-primary w-full flex items-center justify-center gap-2 py-3 disabled:opacity-60">
                                            <FiLogIn /> {loading ? "Joining..." : "Join Room"}
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {error && (
                                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    className="mt-3 text-xs text-center" style={{ color: "#fca5a5" }}>
                                    {error}
                                </motion.p>
                            )}
                        </motion.div>

                        {/* Right - Leaderboard */}
                        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <FiAward style={{ color: "var(--accent-indigo)" }} />
                                <p className="font-bold text-white text-sm">All-Time Leaderboard</p>
                            </div>

                            {leaderboard.length === 0 ? (
                                <p className="text-sm text-center py-8" style={{ color: "var(--text-muted)" }}>
                                    No games played yet - be the first!
                                </p>
                            ) : (
                                <div className="space-y-2">
                                    {leaderboard.map((e, i) => (
                                        <div key={e.rollNo} className="flex items-center gap-3 p-3 rounded-xl"
                                            style={{ background: "var(--bg-primary)", border: "1px solid var(--border)" }}>
                                            <div className="w-7 text-center shrink-0">
                                                {i < 3
                                                    ? <span>{medals[i]}</span>
                                                    : <span className="text-xs font-bold" style={{ color: "var(--text-muted)" }}>#{i + 1}</span>
                                                }
                                            </div>
                                            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black text-white shrink-0"
                                                style={{ background: "linear-gradient(135deg, var(--accent-indigo), var(--accent-blue))" }}>
                                                {e.name[0].toUpperCase()}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-white truncate">{e.name}</p>
                                                <p className="text-xs" style={{ color: "var(--text-muted)" }}>{e.games} game{e.games !== 1 ? "s" : ""}</p>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <p className="text-sm font-black text-white">{e.best}</p>
                                                <p className="text-xs" style={{ color: "var(--text-muted)" }}>best</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    </div>
                </main>
            </div>
            <Footer/>
        </div>
    )
}
