"use client"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import Link from "next/link"
import { GridBackground } from "@/components/PageShared"

type Subject = { _id: string; name: string; type: "subject" | "lab"; time?: string }
type Day = { _id: string; day: string; subjects: Subject[] }

const SubjectBadge = ({ type }: { type: string }) => (
    <span
        className="text-xs px-2 py-0.5 rounded-full font-medium"
        style={{
            background: type === "lab" ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)",
            color: type === "lab" ? "#fca5a5" : "#86efac",
            border: `1px solid ${type === "lab" ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}`
        }}
    >
        {type}
    </span>
)

export default function SharedTimetablePage() {
    const searchParams = useSearchParams()
    const rollNo = searchParams.get("rollNo")
    const [days, setDays] = useState<Day[]>([])
    const [ownerName, setOwnerName] = useState("")
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        if (!rollNo) { setError("Invalid link"); setLoading(false); return }
        const fetch_ = async () => {
            try {
                const res = await fetch(`/api/timetable/public?rollNo=${rollNo}`)
                if (!res.ok) throw new Error("Not found")
                const data = await res.json()
                setDays(data.data?.days || [])
                setOwnerName(data.data?.name || rollNo)
            } catch {
                setError("Timetable not found or no longer available.")
            } finally {
                setLoading(false)
            }
        }
        fetch_()
    }, [rollNo])

    return (
        <div style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>
            <div className="relative overflow-hidden">
                <GridBackground />
                <div className="relative z-10 max-w-5xl mx-auto px-4 py-12">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>Shared timetable</p>
                            <h1 className="text-2xl font-black text-white">{ownerName}&apos;s Schedule</h1>
                        </div>
                        <Link href="/sign-up" className="btn-primary text-sm">
                            Create yours
                        </Link>
                    </div>

                    {loading && (
                        <div className="flex items-center justify-center p-20">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent"
                            />
                        </div>
                    )}

                    {error && (
                        <div className="card p-10 text-center">
                            <p style={{ color: "var(--text-secondary)" }}>{error}</p>
                        </div>
                    )}

                    {!loading && !error && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {days.map((day, i) => (
                                <motion.div
                                    key={day._id || day.day}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.05 * i }}
                                    className="card p-4"
                                >
                                    <h3 className="text-sm font-bold text-white capitalize mb-3 pb-2 border-b" style={{ borderColor: "var(--border)" }}>
                                        {day.day}
                                    </h3>
                                    <div className="space-y-2">
                                        {day.subjects.map((sub) => (
                                            <div key={sub._id} className="flex justify-between items-center py-1">
                                                <span className="text-sm" style={{ color: "var(--text-primary)" }}>{sub.name}</span>
                                                <div className="flex items-center gap-2">
                                                    {sub.time && <span className="text-xs" style={{ color: "var(--text-muted)" }}>{sub.time}</span>}
                                                    <SubjectBadge type={sub.type} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
