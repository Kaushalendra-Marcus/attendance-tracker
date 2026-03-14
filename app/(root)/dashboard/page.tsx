"use client"
import { useUser } from "@/app/context/useContext"
import { useEffect, useState, useMemo, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FiChevronDown, FiChevronUp, FiBook, FiCheckCircle, FiAlertTriangle, FiTrendingUp, FiCalendar, FiRefreshCw } from "react-icons/fi"
import Calendar from "react-calendar"
import { Value } from "react-calendar/dist/shared/types.js"
import { Navigation } from "@/components/navigation"
import Footer from "@/components/footer"
import { GridBackground, LoadingScreen } from "@/components/PageShared"

interface SubjectStat {
    name: string
    type: "subject" | "lab"
    present: number
    total: number
    percentage: number
}

const ClassesNeeded = ({ present, total }: { present: number; total: number }) => {
    const info = useMemo(() => {
        if (total === 0) return null
        const pct = (present / total) * 100
        if (pct >= 75) {
            const canBunk = Math.floor((present - 0.75 * total) / 0.75)
            return { safe: true, msg: `Can skip ${canBunk} more class${canBunk !== 1 ? "es" : ""} and stay above 75%` }
        } else {
            const needed = Math.ceil((0.75 * total - present) / 0.25)
            return { safe: false, msg: `Attend ${needed} more class${needed !== 1 ? "es" : ""} to reach 75%` }
        }
    }, [present, total])

    if (!info) return null
    return (
        <p className="text-xs mt-2 font-medium" style={{ color: info.safe ? "#86efac" : "#fca5a5" }}>
            {info.msg}
        </p>
    )
}

const SubjectCard = ({ stat }: { stat: SubjectStat }) => {
    const [open, setOpen] = useState(false)
    const color = stat.percentage >= 75 ? "#22c55e" : stat.percentage >= 50 ? "#f59e0b" : "#ef4444"
    const bgColor = stat.percentage >= 75 ? "rgba(34,197,94,0.08)" : stat.percentage >= 50 ? "rgba(245,158,11,0.08)" : "rgba(239,68,68,0.08)"

    return (
        <motion.div
            layout
            className="rounded-xl overflow-hidden cursor-pointer"
            style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}
            onClick={() => setOpen(!open)}
        >
            <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <p className="font-semibold text-white text-sm">{stat.name}</p>
                        <p className="text-xs mt-0.5 capitalize" style={{ color: "var(--text-muted)" }}>{stat.type}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-lg font-black" style={{ color }}>{stat.percentage}%</span>
                        {open ? <FiChevronUp style={{ color: "var(--text-muted)" }} /> : <FiChevronDown style={{ color: "var(--text-muted)" }} />}
                    </div>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
                    <motion.div
                        className="h-full rounded-full"
                        style={{ background: color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${stat.percentage}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                </div>
            </div>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        style={{ borderTop: "1px solid var(--border)", background: bgColor }}
                    >
                        <div className="p-4">
                            <div className="grid grid-cols-3 gap-3 text-center">
                                {[
                                    { label: "Present", value: stat.present, icon: <FiCheckCircle className="text-emerald-400 mx-auto mb-1" size={14} /> },
                                    { label: "Absent", value: stat.total - stat.present, icon: <FiAlertTriangle className="text-red-400 mx-auto mb-1" size={14} /> },
                                    { label: "Total", value: stat.total, icon: <FiTrendingUp className="text-indigo-400 mx-auto mb-1" size={14} /> },
                                ].map(s => (
                                    <div key={s.label} className="rounded-lg p-2" style={{ background: "var(--bg-primary)" }}>
                                        {s.icon}
                                        <p className="text-lg font-black text-white">{s.value}</p>
                                        <p className="text-xs" style={{ color: "var(--text-muted)" }}>{s.label}</p>
                                    </div>
                                ))}
                            </div>
                            <ClassesNeeded present={stat.present} total={stat.total} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

const Dashboard = () => {
    const { name, rollNo, branch } = useUser()
    const [stats, setStats] = useState<SubjectStat[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    // Default: start of current year
    const defaultStart = new Date(new Date().getFullYear(), 0, 1)
    const [startDate, setStartDate] = useState<Date>(defaultStart)
    const [showCalendar, setShowCalendar] = useState(false)
    const calRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (calRef.current && !calRef.current.contains(e.target as Node)) setShowCalendar(false)
        }
        if (showCalendar) document.addEventListener("mousedown", handler)
        return () => document.removeEventListener("mousedown", handler)
    }, [showCalendar])

    const fetchStats = async (from: Date) => {
        if (!rollNo || !branch) return
        setLoading(true)
        setError("")
        setStats([])
        try {
            const ttRes = await fetch(`/api/timetable?rollNo=${rollNo}&branch=${branch}`)
            if (!ttRes.ok) throw new Error("Timetable not found. Please create your timetable first.")
            const ttData = await ttRes.json()

            const seen = new Set<string>()
            const uniqueSubjects: { name: string; type: "subject" | "lab" }[] = []
            for (const day of ttData.data.days) {
                for (const s of day.subjects) {
                    const key = `${s.name}__${s.type}`
                    if (!seen.has(key)) { seen.add(key); uniqueSubjects.push({ name: s.name, type: s.type }) }
                }
            }

            const fromDate = from.toISOString()
            const toDate = new Date().toISOString()

            const results = await Promise.all(
                uniqueSubjects.map(async (sub) => {
                    try {
                        const res = await fetch("/api/percentage", {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ rollNo, subjectName: sub.name, type: sub.type, fromDate, toDate })
                        })
                        const data = await res.json()
                        return {
                            name: sub.name, type: sub.type,
                            present: data.present ?? 0, total: data.total ?? 0,
                            percentage: data.total > 0 ? Math.round((data.present / data.total) * 100) : 0
                        }
                    } catch {
                        return { name: sub.name, type: sub.type, present: 0, total: 0, percentage: 0 }
                    }
                })
            )
            setStats(results.sort((a, b) => b.percentage - a.percentage))
        } catch (err) {
            setError((err as Error).message)
        } finally {
            setLoading(false)
        }
    }

    // Auto-fetch on load
    useEffect(() => {
        if (rollNo && branch) fetchStats(startDate)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rollNo, branch])

    const handleDateChange = (val: Value) => {
        if (!(val instanceof Date)) return
        setStartDate(val)
        setShowCalendar(false)
        fetchStats(val)
    }

    const subjects = stats.filter(s => s.type === "subject")
    const labs = stats.filter(s => s.type === "lab")

    const overall = useMemo(() => {
        const totalPresent = stats.reduce((a, s) => a + s.present, 0)
        const totalClasses = stats.reduce((a, s) => a + s.total, 0)
        return totalClasses > 0 ? Math.round((totalPresent / totalClasses) * 100) : 0
    }, [stats])

    const overallColor = overall >= 75 ? "#22c55e" : overall >= 50 ? "#f59e0b" : "#ef4444"

    const formatDate = (d: Date) => d.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })

    return (
        <div style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>
            <Navigation />
            <div className="relative overflow-hidden">
                <GridBackground />
                <AnimatePresence>{loading && <LoadingScreen />}</AnimatePresence>

                <main className="relative z-10 max-w-2xl mx-auto px-4 py-8">
                    <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
                        <h1 className="text-3xl font-black text-white">Dashboard</h1>
                        <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>{name} &middot; {rollNo}</p>
                    </motion.div>

                    {/* Date range selector */}
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-4 mb-6">
                        <p className="text-xs font-medium mb-2" style={{ color: "var(--text-muted)" }}>Showing attendance from</p>
                        <div className="flex items-center gap-3 flex-wrap">
                            <div className="relative" ref={calRef}>
                                <button
                                    onClick={() => setShowCalendar(!showCalendar)}
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all"
                                    style={{ background: "var(--bg-primary)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
                                >
                                    <FiCalendar style={{ color: "var(--accent-indigo)" }} />
                                    {formatDate(startDate)}
                                </button>
                                <AnimatePresence>
                                    {showCalendar && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -8 }}
                                            className="mt-8 z-30 bottom-full left-0 rounded-xl shadow-xl p-4"
                                            style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}
                                        >
                                            <Calendar onChange={handleDateChange} value={startDate} maxDate={new Date()} />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <span className="text-sm" style={{ color: "var(--text-muted)" }}>→ Today ({formatDate(new Date())})</span>

                            <button
                                onClick={() => { setStartDate(defaultStart); fetchStats(defaultStart) }}
                                className="ml-auto flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg transition-all"
                                style={{ background: "var(--bg-primary)", border: "1px solid var(--border)", color: "var(--text-muted)" }}
                                title="Reset to start of year"
                            >
                                <FiRefreshCw size={11} /> Reset
                            </button>
                        </div>
                    </motion.div>

                    {error && (
                        <div className="card p-4 mb-6 text-sm text-center" style={{ color: "#fca5a5" }}>{error}</div>
                    )}

                    {!loading && !error && stats.length > 0 && (
                        <>
                            {/* Overall */}
                            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card p-5 mb-6 flex items-center justify-between">
                                <div>
                                    <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Overall Attendance</p>
                                    <p className="text-4xl font-black mt-1" style={{ color: overallColor }}>{overall}%</p>
                                    <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                                        {stats.reduce((a, s) => a + s.present, 0)} present of {stats.reduce((a, s) => a + s.total, 0)} total
                                    </p>
                                </div>
                                <svg viewBox="0 0 36 36" className="w-20 h-20 shrink-0">
                                    <circle cx="18" cy="18" r="15.9" stroke="var(--border)" strokeWidth="3" fill="none" />
                                    <motion.circle
                                        cx="18" cy="18" r="15.9" stroke={overallColor}
                                        strokeWidth="3" fill="none" strokeLinecap="round"
                                        strokeDasharray="100"
                                        initial={{ strokeDashoffset: 100 }}
                                        animate={{ strokeDashoffset: 100 - overall }}
                                        transition={{ duration: 1.2, ease: "easeOut" }}
                                        transform="rotate(-90 18 18)"
                                    />
                                    <text x="18" y="20" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">{overall}%</text>
                                </svg>
                            </motion.div>

                            {subjects.length > 0 && (
                                <div className="mb-6">
                                    <div className="flex items-center gap-2 mb-3">
                                        <FiBook style={{ color: "var(--accent-indigo)" }} />
                                        <p className="text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>Subjects</p>
                                    </div>
                                    <div className="space-y-3">
                                        {subjects.map(s => <SubjectCard key={s.name} stat={s} />)}
                                    </div>
                                </div>
                            )}

                            {labs.length > 0 && (
                                <div className="mb-6">
                                    <div className="flex items-center gap-2 mb-3">
                                        <FiBook style={{ color: "var(--accent-blue)" }} />
                                        <p className="text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>Labs</p>
                                    </div>
                                    <div className="space-y-3">
                                        {labs.map(s => <SubjectCard key={s.name} stat={s} />)}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </main>
                <Footer />
            </div>
        </div>
    )
}

export default Dashboard
