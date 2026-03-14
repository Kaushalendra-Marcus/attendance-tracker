"use client"
import { useUser } from "@/app/context/useContext"
import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { FiEdit2, FiCalendar, FiCopy, FiShare2, FiUsers, FiChevronDown, FiCheck, FiX } from "react-icons/fi"
import Footer from "@/components/footer"
import { Navigation } from "@/components/navigation"
import { LoadingScreen, GridBackground } from "@/components/PageShared"
import { toast, ToastContainer } from "react-toastify"

type Subject = { _id: string; name: string; type: "subject" | "lab"; time?: string }
type Day = { _id: string; day: string; subjects: Subject[] }
type TimetableData = { days: Day[] }
type BranchTimetable = { rollNo: string; name?: string; year?: string; days: Day[] }

const SubjectBadge = ({ type }: { type: string }) => (
    <span className="text-xs px-2 py-0.5 rounded-full font-medium"
        style={{
            background: type === "lab" ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)",
            color: type === "lab" ? "#fca5a5" : "#86efac",
            border: `1px solid ${type === "lab" ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}`
        }}>
        {type}
    </span>
)

const TimetableGrid = ({ days }: { days: Day[] }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {days.map((day, i) => (
            <motion.div key={day._id || day.day}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i }} className="card p-4">
                <h3 className="text-sm font-bold text-white capitalize mb-3 pb-2 border-b"
                    style={{ borderColor: "var(--border)" }}>
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
                    {day.subjects.length === 0 && (
                        <p className="text-xs py-1" style={{ color: "var(--text-muted)" }}>No classes</p>
                    )}
                </div>
            </motion.div>
        ))}
    </div>
)

const ShareModal = ({ rollNo, onClose }: { rollNo: string; onClose: () => void }) => {
    const shareUrl = typeof window !== "undefined"
        ? `${window.location.origin}/timetable/view?rollNo=${rollNo}` : ""
    const [copied, setCopied] = useState(false)
    const copy = () => { navigator.clipboard.writeText(shareUrl); setCopied(true); setTimeout(() => setCopied(false), 2000) }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{ background: "rgba(0,0,0,0.7)" }} onClick={onClose}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }} className="card p-6 w-full max-w-md"
                onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-bold text-white">Share Timetable</h3>
                    <button onClick={onClose} style={{ color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer" }}><FiX /></button>
                </div>
                <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>Anyone with this link can view your timetable.</p>
                <div className="flex items-center gap-2 p-3 rounded-lg border text-sm mb-4"
                    style={{ background: "var(--bg-secondary)", borderColor: "var(--border)" }}>
                    <span className="truncate flex-1 font-mono text-xs" style={{ color: "var(--text-secondary)" }}>{shareUrl}</span>
                    <button onClick={copy} style={{ color: copied ? "#22c55e" : "#818cf8", background: "none", border: "none", cursor: "pointer" }}>
                        {copied ? <FiCheck /> : <FiCopy />}
                    </button>
                </div>
                <button onClick={copy} className="btn-primary w-full flex items-center justify-center gap-2">
                    {copied ? <><FiCheck /> Copied!</> : <><FiCopy /> Copy Link</>}
                </button>
            </motion.div>
        </motion.div>
    )
}

const TimetablePage = () => {
    const { name, rollNo, branch, year } = useUser()
    const [timetable, setTimetable]         = useState<TimetableData | null>(null)
    const [loading, setLoading]             = useState(true)
    const [activeTab, setActiveTab]         = useState<"mine" | "browse">("mine")
    const [branchTimetables, setBranchTimetables] = useState<BranchTimetable[]>([])
    const [branchLoading, setBranchLoading] = useState(false)
    const [expandedRoll, setExpandedRoll]   = useState<string | null>(null)
    const [copyingFrom, setCopyingFrom]     = useState<string | null>(null)
    const [showShareModal, setShowShareModal] = useState(false)
    const router = useRouter()

    // Extract numeric year — "2nd Year" -> "2", "3" -> "3"
    const yearNum = (year || "").replace(/\D/g, "").slice(0, 1)

    useEffect(() => {
        if (!rollNo || !branch) return
        const fetchTimetable = async () => {
            try {
                const res = await fetch(`/api/timetable?rollNo=${rollNo}&branch=${branch}`)
                if (!res.ok) throw new Error("Not found")
                const data = await res.json()
                if (!data?.data?.days?.length) router.push("/timetable/create")
                else setTimetable(data.data)
            } catch {
                router.push("/timetable/create")
            } finally {
                setLoading(false)
            }
        }
        fetchTimetable()
    }, [router, rollNo, branch])

    const fetchBranchTimetables = useCallback(async () => {
        if (!branch || branchTimetables.length > 0) return
        setBranchLoading(true)
        try {
            const params = new URLSearchParams({ branch })
            if (yearNum) params.set("year", yearNum)
            const res = await fetch(`/api/timetable/branch?${params}`)
            if (!res.ok) throw new Error("Failed")
            const data = await res.json()
            setBranchTimetables((data.data || []).filter((t: BranchTimetable) => t.rollNo !== rollNo))
        } catch {
            toast.error("Could not load branch timetables")
        } finally {
            setBranchLoading(false)
        }
    }, [branch, rollNo, yearNum, branchTimetables.length])

    useEffect(() => {
        if (activeTab === "browse") fetchBranchTimetables()
    }, [activeTab, fetchBranchTimetables])

    const copyTimetable = async (source: BranchTimetable) => {
        if (!rollNo) return
        setCopyingFrom(source.rollNo)
        try {
            const res = await fetch("/api/timetable", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ rollNo, branch, days: source.days })
            })
            if (!res.ok) throw new Error("Failed")
            const data = await res.json()
            setTimetable(data.data)
            setActiveTab("mine")
            toast.success("Timetable copied!")
        } catch {
            toast.error("Failed to copy timetable")
        } finally {
            setCopyingFrom(null)
        }
    }

    return (
        <div style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>
            <Navigation />
            <ToastContainer position="top-center" autoClose={3000} theme="dark" />
            <AnimatePresence>{loading && <LoadingScreen />}</AnimatePresence>

            <div className="relative overflow-hidden">
                <GridBackground />
                <main className="relative z-10 max-w-6xl mx-auto px-4 py-8">

                    <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                        <h1 className="text-3xl font-black text-white">Timetable</h1>
                        <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
                            Manage your schedule or browse batchmates&apos; timetables
                        </p>
                    </motion.div>

                    {/* User info bar */}
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                        className="card p-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm">
                            {[["Name", name], ["Roll", rollNo], ["Branch", branch], ...(yearNum ? [["Year", yearNum]] : [])].map(([label, val]) => (
                                <span key={label} style={{ color: "var(--text-secondary)" }}>
                                    <span style={{ color: "var(--text-muted)" }}>{label}</span>&nbsp;{val}
                                </span>
                            ))}
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={() => setShowShareModal(true)}
                                className="flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-lg border transition-all"
                                style={{ color: "var(--text-secondary)", borderColor: "var(--border)", background: "none", cursor: "pointer" }}>
                                <FiShare2 className="text-indigo-400" /> Share
                            </button>
                            <Link href="/timetable/edit">
                                <div className="btn-primary flex items-center gap-1.5 text-sm cursor-pointer">
                                    <FiEdit2 /> Edit
                                </div>
                            </Link>
                        </div>
                    </motion.div>

                    {/* Tabs */}
                    <div className="flex gap-1 mb-6 p-1 rounded-xl w-fit" style={{ background: "var(--bg-secondary)" }}>
                        {[
                            { key: "mine",   label: "My Timetable",  icon: FiCalendar },
                            { key: "browse", label: "Browse Branch", icon: FiUsers },
                        ].map(tab => (
                            <button key={tab.key} onClick={() => setActiveTab(tab.key as "mine" | "browse")}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                                style={{
                                    background: activeTab === tab.key ? "var(--accent-indigo)" : "transparent",
                                    color: activeTab === tab.key ? "white" : "var(--text-secondary)",
                                    border: "none", cursor: "pointer",
                                }}>
                                <tab.icon /> {tab.label}
                            </button>
                        ))}
                    </div>

                    <AnimatePresence mode="wait">
                        {activeTab === "mine" && (
                            <motion.div key="mine" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                {timetable?.days?.length ? (
                                    <TimetableGrid days={timetable.days} />
                                ) : (
                                    <div className="card p-10 text-center">
                                        <p className="mb-4" style={{ color: "var(--text-secondary)" }}>No timetable found.</p>
                                        <Link href="/timetable/create">
                                            <div className="btn-primary inline-flex items-center gap-2 cursor-pointer">
                                                <FiEdit2 /> Create Timetable
                                            </div>
                                        </Link>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {activeTab === "browse" && (
                            <motion.div key="browse" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                {/* Year filter badge */}
                                {yearNum && (
                                    <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg w-fit"
                                        style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)" }}>
                                        <span className="text-xs font-semibold" style={{ color: "#a5b4fc" }}>
                                            Showing Year {yearNum} timetables
                                        </span>
                                    </div>
                                )}

                                {branchLoading ? (
                                    <div className="card p-10 flex items-center justify-center">
                                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                            className="w-6 h-6 rounded-full border-2 border-indigo-500 border-t-transparent" />
                                    </div>
                                ) : branchTimetables.length === 0 ? (
                                    <div className="card p-10 text-center">
                                        <p style={{ color: "var(--text-secondary)" }}>
                                            No timetables found for {yearNum ? `Year ${yearNum}, ` : ""}{branch}.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {branchTimetables.map((bt) => (
                                            <div key={bt.rollNo} className="card overflow-hidden">
                                                <button className="w-full flex items-center justify-between p-4 text-left"
                                                    onClick={() => setExpandedRoll(expandedRoll === bt.rollNo ? null : bt.rollNo)}>
                                                    <div>
                                                        <p className="text-sm font-semibold text-white">{bt.name || bt.rollNo}</p>
                                                        <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                                                            {bt.rollNo}
                                                            {bt.year && ` · Year ${bt.year}`}
                                                            {` · ${bt.days.length} days configured`}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); copyTimetable(bt) }}
                                                            disabled={!!copyingFrom}
                                                            className="btn-primary flex items-center gap-1.5 text-xs px-3 py-1.5">
                                                            <FiCopy size={12} />
                                                            {copyingFrom === bt.rollNo ? "Copying..." : "Copy"}
                                                        </button>
                                                        <motion.div animate={{ rotate: expandedRoll === bt.rollNo ? 180 : 0 }} transition={{ duration: 0.2 }}>
                                                            <FiChevronDown style={{ color: "var(--text-muted)" }} />
                                                        </motion.div>
                                                    </div>
                                                </button>

                                                <AnimatePresence>
                                                    {expandedRoll === bt.rollNo && (
                                                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t"
                                                            style={{ borderColor: "var(--border)" }}>
                                                            <div className="p-4">
                                                                <TimetableGrid days={bt.days} />
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </main>
                <Footer />
            </div>

            <AnimatePresence>
                {showShareModal && rollNo && (
                    <ShareModal rollNo={rollNo} onClose={() => setShowShareModal(false)} />
                )}
            </AnimatePresence>
        </div>
    )
}

export default TimetablePage