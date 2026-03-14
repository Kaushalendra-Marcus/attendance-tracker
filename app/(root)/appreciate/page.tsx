"use client"
import { useEffect, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FiHeart, FiAward, FiSearch, FiX, FiChevronDown } from "react-icons/fi"
import { useUser } from "@/app/context/useContext"
import { GridBackground, LoadingScreen } from "@/components/PageShared"
import Footer from "@/components/footer"
import { Navigation } from "@/components/navigation"

type TopUser = { rollNo: string; name: string; total: number }
type LikedBy = { rollNo: string; name: string; at: string }

const HeartBtn = ({ rollNo, myRollNo, initialLiked }: { rollNo: string; myRollNo: string; initialLiked: boolean }) => {
    const [liked, setLiked] = useState(initialLiked)
    const [loading, setLoading] = useState(false)

    const toggle = async () => {
        if (!myRollNo || loading) return
        setLoading(true)
        try {
            const res = await fetch("/api/likes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fromRollNo: myRollNo, toRollNo: rollNo })
            })
            const data = await res.json()
            setLiked(data.liked)
        } catch { /* silent */ }
        finally { setLoading(false) }
    }

    return (
        <motion.button
            onClick={toggle}
            whileTap={{ scale: 0.85 }}
            disabled={loading || !myRollNo || rollNo === myRollNo}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-40"
            style={{
                background: liked ? "rgba(239,68,68,0.15)" : "var(--bg-primary)",
                border: `1px solid ${liked ? "rgba(239,68,68,0.4)" : "var(--border)"}`,
                color: liked ? "#f87171" : "var(--text-muted)"
            }}
        >
            <motion.span animate={{ scale: liked ? [1, 1.4, 1] : 1 }} transition={{ duration: 0.3 }}>
                <FiHeart size={12} fill={liked ? "#f87171" : "none"} />
            </motion.span>
            {liked ? "Liked" : "Like"}
        </motion.button>
    )
}

export default function AppreciatePage() {
    const { rollNo } = useUser()  // removed unused `name`
    const [topUsers, setTopUsers] = useState<TopUser[]>([])
    const [myLikes, setMyLikes] = useState<LikedBy[]>([])
    const [myTotal, setMyTotal] = useState(0)
    const [likedByRollNos, setLikedByRollNos] = useState<Set<string>>(new Set())
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [showLikedBy, setShowLikedBy] = useState(false)

    const fetchAll = useCallback(async () => {
        setLoading(true)
        try {
            const [topRes, myRes] = await Promise.all([
                fetch("/api/likes/top"),
                rollNo ? fetch(`/api/likes?rollNo=${rollNo}`) : Promise.resolve(null)
            ])
            const topData = await topRes.json()
            setTopUsers(topData.data || [])

            if (myRes) {
                const myData = await myRes.json()
                setMyTotal(myData.total || 0)
                setMyLikes(myData.likedBy || [])
                setLikedByRollNos(new Set(myData.likedBy?.map((l: LikedBy) => l.rollNo) || []))
            }
        } catch { /* silent */ }
        finally { setLoading(false) }
    }, [rollNo])

    useEffect(() => { fetchAll() }, [fetchAll])

    const filtered = topUsers.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.rollNo.toLowerCase().includes(search.toLowerCase())
    )

    const myRank = topUsers.findIndex(u => u.rollNo === rollNo) + 1

    return (
        <div style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>
            <Navigation/>
            <div className="relative overflow-hidden">
                <GridBackground />
                <AnimatePresence>{loading && <LoadingScreen />}</AnimatePresence>

                <main className="relative z-10 max-w-2xl mx-auto px-4 py-8">

                    {/* Header */}
                    <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
                        <h1 className="text-3xl font-black text-white">Appreciate</h1>
                        <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
                            Like your batchmates - top liked students on the board
                        </p>
                    </motion.div>

                    {/* My stats */}
                    {rollNo && (
                        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card p-4 mb-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>Your appreciation</p>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1.5">
                                            <FiHeart size={16} fill="#f87171" className="text-red-400" />
                                            <span className="text-2xl font-black text-white">{myTotal}</span>
                                        </div>
                                        {myRank > 0 && (
                                            <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                                                style={{ background: "rgba(99,102,241,0.15)", color: "#a5b4fc", border: "1px solid rgba(99,102,241,0.3)" }}>
                                                #{myRank} on board
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowLikedBy(!showLikedBy)}
                                    className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg transition-all"
                                    style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-muted)" }}
                                >
                                    Who liked you
                                    <motion.span animate={{ rotate: showLikedBy ? 180 : 0 }}>
                                        <FiChevronDown size={12} />
                                    </motion.span>
                                </button>
                            </div>

                            {/* Who liked me */}
                            <AnimatePresence>
                                {showLikedBy && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="mt-4 pt-4 space-y-2" style={{ borderTop: "1px solid var(--border)" }}>
                                            {myLikes.length === 0 ? (
                                                <p className="text-xs text-center py-2" style={{ color: "var(--text-muted)" }}>No likes yet - share your profile!</p>
                                            ) : myLikes.map((l, i) => (
                                                <div key={i} className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black text-white"
                                                            style={{ background: "linear-gradient(135deg, var(--accent-indigo), var(--accent-blue))" }}>
                                                            {l.name[0].toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <p className="text-xs font-semibold text-white">{l.name}</p>
                                                            <p className="text-xs" style={{ color: "var(--text-muted)" }}>{l.rollNo}</p>
                                                        </div>
                                                    </div>
                                                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                                                        {new Date(l.at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    )}

                    {/* Search */}
                    <div className="relative mb-4">
                        <FiSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search by name or roll no..."
                            className="w-full pl-9 pr-9 py-2.5 rounded-xl text-sm outline-none"
                            style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
                        />
                        {search && (
                            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                                <FiX size={13} style={{ color: "var(--text-muted)" }} />
                            </button>
                        )}
                    </div>

                    {/* Leaderboard */}
                    {!loading && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
                            <div className="flex items-center gap-2 mb-3">
                                <FiAward style={{ color: "var(--accent-indigo)" }} size={14} />
                                <p className="text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>
                                    Most Appreciated
                                </p>
                            </div>

                            {filtered.length === 0 && (
                                <p className="text-center text-sm py-8" style={{ color: "var(--text-muted)" }}>
                                    {search ? "No results found" : "No likes yet - be the first!"}
                                </p>
                            )}

                            {filtered.map((user, i) => {
                                const isMe = user.rollNo === rollNo
                                const iLikedThem = likedByRollNos.has(user.rollNo)
                                const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : null

                                return (
                                    <motion.div
                                        key={user.rollNo}
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.04 }}
                                        className="flex items-center gap-3 p-3 rounded-xl"
                                        style={{
                                            background: isMe ? "rgba(99,102,241,0.08)" : "var(--bg-secondary)",
                                            border: `1px solid ${isMe ? "rgba(99,102,241,0.3)" : "var(--border)"}`
                                        }}
                                    >
                                        {/* Rank */}
                                        <div className="w-7 text-center shrink-0">
                                            {medal
                                                ? <span className="text-base">{medal}</span>
                                                : <span className="text-xs font-bold" style={{ color: "var(--text-muted)" }}>#{i + 1}</span>
                                            }
                                        </div>

                                        {/* Avatar */}
                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black text-white shrink-0"
                                            style={{ background: "linear-gradient(135deg, var(--accent-indigo), var(--accent-blue))" }}>
                                            {user.name[0].toUpperCase()}
                                        </div>

                                        {/* Name */}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-white truncate">
                                                {user.name} {isMe && <span className="text-xs text-indigo-400">(you)</span>}
                                            </p>
                                            <p className="text-xs" style={{ color: "var(--text-muted)" }}>{user.rollNo}</p>
                                        </div>

                                        {/* Likes count */}
                                        <div className="flex items-center gap-1 shrink-0">
                                            <FiHeart size={12} fill="#f87171" className="text-red-400" />
                                            <span className="text-sm font-black text-white">{user.total}</span>
                                        </div>

                                        {/* Like button */}
                                        {!isMe && rollNo && (
                                            <HeartBtn
                                                rollNo={user.rollNo}
                                                myRollNo={rollNo}
                                                initialLiked={iLikedThem}
                                            />
                                        )}
                                    </motion.div>
                                )
                            })}
                        </motion.div>
                    )}
                </main>
            </div>
            <Footer/>
        </div>
    )
}