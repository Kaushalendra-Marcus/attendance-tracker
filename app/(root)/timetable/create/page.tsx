"use client"
import { useUser } from "@/app/context/useContext"
import { useEffect, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    FiPlus, FiSave, FiTrash2, FiChevronDown, FiUsers,
    FiEdit3, FiCopy, FiArrowRight, FiArrowLeft, FiCheck
} from "react-icons/fi"
import { Navigation } from "@/components/navigation"
import Footer from "@/components/footer"
import { GridBackground } from "@/components/PageShared"
import { toast, ToastContainer } from "react-toastify"
import { useRouter } from "next/navigation"

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]

type Subject = { id: string; name: string; type: "subject" | "lab" }
type DayAssignment = { [day: string]: string[] } // day -> subject ids
type BranchTimetable = { rollNo: string; name?: string; year?: string; days: { day: string; subjects: { name: string; type: string }[] }[] }

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

/* ── Step 1: Add all subjects ─────────────────────────────── */
const StepSubjects = ({
    subjects,
    onAdd,
    onRemove,
    onUpdate,
    onNext,
}: {
    subjects: Subject[]
    onAdd: () => void
    onRemove: (id: string) => void
    onUpdate: (id: string, field: "name" | "type", value: string) => void
    onNext: () => void
}) => (
    <motion.div key="step1" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}>
        <div className="mb-6">
            <h2 className="text-lg font-black text-white mb-1">Step 1 - Add your subjects</h2>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                Add all subjects and labs you attend. You&apos;ll assign them to days next.
            </p>
        </div>

        <div className="card p-5 mb-4 space-y-3">
            {subjects.map((sub, i) => (
                <motion.div key={sub.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }} className="flex gap-3 items-center">
                    <input
                        type="text"
                        placeholder={`Subject ${i + 1} name`}
                        value={sub.name}
                        onChange={e => onUpdate(sub.id, "name", e.target.value)}
                        className="flex-1 px-4 py-2.5 rounded-lg text-sm text-white"
                        style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", outline: "none" }}
                    />
                    <select
                        value={sub.type}
                        onChange={e => onUpdate(sub.id, "type", e.target.value as "subject" | "lab")}
                        className="px-3 py-2.5 rounded-lg text-sm text-white appearance-none"
                        style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", cursor: "pointer" }}
                    >
                        <option value="subject">Subject</option>
                        <option value="lab">Lab</option>
                    </select>
                    <button onClick={() => onRemove(sub.id)} className="p-2 rounded-lg transition-colors"
                        style={{ color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer" }}
                        onMouseEnter={e => (e.currentTarget.style.color = "#ef4444")}
                        onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}>
                        <FiTrash2 size={15} />
                    </button>
                </motion.div>
            ))}

            <button onClick={onAdd}
                className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg w-full transition-all mt-2"
                style={{ color: "var(--text-secondary)", border: "1px dashed var(--border)", background: "none", cursor: "pointer" }}>
                <FiPlus size={14} /> Add Subject / Lab
            </button>
        </div>

        <div className="flex justify-end">
            <button
                onClick={onNext}
                disabled={subjects.filter(s => s.name.trim()).length === 0}
                className="btn-primary flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
                Next - Assign to Days <FiArrowRight size={14} />
            </button>
        </div>
    </motion.div>
)

/* ── Step 2: Assign subjects to each day ──────────────────── */
const StepAssign = ({
    subjects,
    assignments,
    onToggle,
    onBack,
    onSubmit,
    isSubmitting,
}: {
    subjects: Subject[]
    assignments: DayAssignment
    onToggle: (day: string, subjectId: string) => void
    onBack: () => void
    onSubmit: () => void
    isSubmitting: boolean
}) => {
    const [activeDay, setActiveDay] = useState(DAYS[0])
    const validSubjects = subjects.filter(s => s.name.trim())

    const assignedCount = Object.values(assignments).flat().length

    return (
        <motion.div key="step2" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}>
            <div className="mb-6">
                <h2 className="text-lg font-black text-white mb-1">Step 2 - Assign to days</h2>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                    Select which subjects happen on each day. Tap to toggle.
                </p>
            </div>

            {/* Day tabs */}
            <div className="flex flex-wrap gap-1.5 mb-5">
                {DAYS.map(day => {
                    const count = (assignments[day] || []).length
                    return (
                        <button key={day} onClick={() => setActiveDay(day)}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all"
                            style={{
                                background: activeDay === day ? "var(--accent-indigo)" : count > 0 ? "rgba(99,102,241,0.15)" : "var(--bg-secondary)",
                                color: activeDay === day ? "white" : count > 0 ? "#818cf8" : "var(--text-muted)",
                                border: `1px solid ${activeDay === day ? "var(--accent-indigo)" : count > 0 ? "rgba(99,102,241,0.3)" : "var(--border)"}`,
                                cursor: "pointer",
                            }}>
                            {day.slice(0, 3)} {count > 0 && `(${count})`}
                        </button>
                    )
                })}
            </div>

            {/* Subject chips for active day */}
            <div className="card p-5 mb-5">
                <p className="text-xs font-bold uppercase tracking-widest mb-4 capitalize"
                    style={{ color: "rgba(99,102,241,0.8)" }}>
                    {activeDay}
                </p>
                <div className="flex flex-wrap gap-2">
                    {validSubjects.map(sub => {
                        const isSelected = (assignments[activeDay] || []).includes(sub.id)
                        return (
                            <button key={sub.id} onClick={() => onToggle(activeDay, sub.id)}
                                className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all"
                                style={{
                                    background: isSelected ? (sub.type === "lab" ? "rgba(239,68,68,0.18)" : "rgba(99,102,241,0.18)") : "var(--bg-secondary)",
                                    border: `1px solid ${isSelected ? (sub.type === "lab" ? "rgba(239,68,68,0.4)" : "rgba(99,102,241,0.4)") : "var(--border)"}`,
                                    color: isSelected ? (sub.type === "lab" ? "#fca5a5" : "#a5b4fc") : "var(--text-muted)",
                                    cursor: "pointer",
                                    transform: isSelected ? "scale(1.02)" : "scale(1)",
                                }}>
                                {isSelected && <FiCheck size={12} />}
                                {sub.name}
                                <span className="text-[10px] opacity-60">{sub.type === "lab" ? "lab" : "sub"}</span>
                            </button>
                        )
                    })}
                </div>
                {validSubjects.length === 0 && (
                    <p className="text-sm" style={{ color: "var(--text-muted)" }}>No subjects added yet.</p>
                )}
            </div>

            {/* Summary */}
            {assignedCount > 0 && (
                <div className="flex flex-wrap gap-2 mb-5">
                    {DAYS.filter(d => (assignments[d] || []).length > 0).map(d => (
                        <span key={d} className="text-xs px-2.5 py-1 rounded-full capitalize"
                            style={{ background: "rgba(34,197,94,0.12)", color: "#86efac", border: "1px solid rgba(34,197,94,0.25)" }}>
                            {d} - {assignments[d].length} subjects
                        </span>
                    ))}
                </div>
            )}

            <div className="flex items-center justify-between">
                <button onClick={onBack}
                    className="flex items-center gap-2 text-sm px-4 py-2.5 rounded-xl transition-all"
                    style={{ color: "var(--text-secondary)", background: "none", border: "1px solid var(--border)", cursor: "pointer" }}>
                    <FiArrowLeft size={14} /> Back
                </button>
                <button onClick={onSubmit} disabled={isSubmitting || assignedCount === 0}
                    className="btn-primary flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed">
                    {isSubmitting ? (
                        <><motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}><FiSave size={14} /></motion.span> Creating...</>
                    ) : (
                        <><FiSave size={14} /> Create Timetable</>
                    )}
                </button>
            </div>
        </motion.div>
    )
}

/* ── Browse tab ───────────────────────────────────────────── */
const BrowseTab = ({
    branch,
    year,
    rollNo,
    onCopy,
    onBack,
}: {
    branch: string
    year: string
    rollNo: string
    onCopy: (bt: BranchTimetable) => void
    onBack: () => void
}) => {
    const [timetables, setTimetables]   = useState<BranchTimetable[]>([])
    const [loading, setLoading]         = useState(false)
    const [expanded, setExpanded]       = useState<string | null>(null)
    const [copyingFrom, setCopyingFrom] = useState<string | null>(null)

    // Extract year number for query - "2nd Year" -> "2", "3" -> "3"
    const yearNum = year.replace(/\D/g, "").slice(0, 1)

    const fetchTimetables = useCallback(async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams({ branch })
            if (yearNum) params.set("year", yearNum)
            const res = await fetch(`/api/timetable/branch?${params}`)
            if (!res.ok) throw new Error("Failed")
            const data = await res.json()
            setTimetables((data.data || []).filter((t: BranchTimetable) => t.rollNo !== rollNo))
        } catch {
            toast.error("Could not load timetables")
        } finally {
            setLoading(false)
        }
    }, [branch, yearNum, rollNo])

    useEffect(() => { fetchTimetables() }, [fetchTimetables])

    const handleCopy = async (bt: BranchTimetable) => {
        setCopyingFrom(bt.rollNo)
        await onCopy(bt)
        setCopyingFrom(null)
    }

    return (
        <motion.div key="browse" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button onClick={onBack} className="text-sm mb-4 flex items-center gap-1 transition-colors"
                style={{ color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer" }}>
                <FiArrowLeft size={13} /> Back
            </button>

            {yearNum && (
                <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg w-fit"
                    style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)" }}>
                    <span className="text-xs font-semibold" style={{ color: "#a5b4fc" }}>
                        Showing Year {yearNum} timetables for {branch}
                    </span>
                </div>
            )}

            {loading ? (
                <div className="card p-10 flex items-center justify-center">
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className="w-6 h-6 rounded-full border-2 border-indigo-500 border-t-transparent" />
                </div>
            ) : timetables.length === 0 ? (
                <div className="card p-10 text-center">
                    <p className="mb-3" style={{ color: "var(--text-secondary)" }}>
                        No timetables found for {yearNum ? `Year ${yearNum}, ` : ""}{branch}.
                    </p>
                    <button onClick={onBack} className="btn-primary text-sm">
                        Build Manually Instead
                    </button>
                </div>
            ) : (
                <div className="space-y-3">
                    {timetables.map(bt => (
                        <div key={bt.rollNo} className="card overflow-hidden">
                            <button className="w-full flex items-center justify-between p-4 text-left"
                                onClick={() => setExpanded(expanded === bt.rollNo ? null : bt.rollNo)}>
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
                                        onClick={e => { e.stopPropagation(); handleCopy(bt) }}
                                        disabled={!!copyingFrom}
                                        className="btn-primary flex items-center gap-1.5 text-xs px-3 py-1.5">
                                        <FiCopy size={12} />
                                        {copyingFrom === bt.rollNo ? "Copying..." : "Use This"}
                                    </button>
                                    <motion.div animate={{ rotate: expanded === bt.rollNo ? 180 : 0 }} transition={{ duration: 0.2 }}>
                                        <FiChevronDown style={{ color: "var(--text-muted)" }} />
                                    </motion.div>
                                </div>
                            </button>

                            <AnimatePresence>
                                {expanded === bt.rollNo && (
                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t"
                                        style={{ borderColor: "var(--border)" }}>
                                        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {bt.days.map(day => (
                                                <div key={day.day} className="p-3 rounded-lg" style={{ background: "var(--bg-secondary)" }}>
                                                    <p className="text-xs font-bold text-white capitalize mb-2">{day.day}</p>
                                                    <div className="space-y-1.5">
                                                        {day.subjects.map((sub, i) => (
                                                            <div key={i} className="flex items-center justify-between">
                                                                <span className="text-xs" style={{ color: "var(--text-secondary)" }}>{sub.name}</span>
                                                                <SubjectBadge type={sub.type} />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            )}
        </motion.div>
    )
}

/* ── Main page ────────────────────────────────────────────── */
const uid = () => Math.random().toString(36).slice(2, 8)

const Page = () => {
    const [mode, setMode]               = useState<"choose" | "manual" | "browse">("choose")
    const [step, setStep]               = useState<1 | 2>(1)
    const [subjects, setSubjects]       = useState<Subject[]>([{ id: uid(), name: "", type: "subject" }])
    const [assignments, setAssignments] = useState<DayAssignment>({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { rollNo, branch, year, college, userId } = useUser()
    const router                        = useRouter()

    useEffect(() => {
        const timer = setTimeout(() => {
            const stored = localStorage.getItem("userData")
            if (!stored || !JSON.parse(stored).rollNo) router.push("/sign-up")
        }, 500)
        return () => clearTimeout(timer)
    }, [router])

    /* Subject helpers */
    const addSubject    = () => setSubjects(p => [...p, { id: uid(), name: "", type: "subject" }])
    const removeSubject = (id: string) => setSubjects(p => p.filter(s => s.id !== id))
    const updateSubject = (id: string, field: "name" | "type", value: string) =>
        setSubjects(p => p.map(s => s.id === id ? { ...s, [field]: value as "subject" | "lab" } : s))

    /* Toggle subject for a day */
    const toggleAssignment = (day: string, subjectId: string) => {
        setAssignments(prev => {
            const current = prev[day] || []
            const updated = current.includes(subjectId)
                ? current.filter(id => id !== subjectId)
                : [...current, subjectId]
            return { ...prev, [day]: updated }
        })
    }

    /* Submit manual timetable */
    const handleSubmit = async () => {
        setIsSubmitting(true)
        try {
            const days = DAYS
                .filter(day => (assignments[day] || []).length > 0)
                .map(day => ({
                    day,
                    subjects: (assignments[day] || [])
                        .map(id => subjects.find(s => s.id === id))
                        .filter(Boolean)
                        .map(s => ({ name: s!.name, type: s!.type }))
                }))
                .filter(d => d.subjects.length > 0)

            if (!days.length) { toast.error("Assign at least one subject to a day"); return }

            // Extract year number - "2nd Year" -> "2"
            const yearNum = (year || "").replace(/\D/g, "").slice(0, 1)

            const res = await fetch("/api/timetable/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ rollNo, branch, year: yearNum, days, college: college || "", userId: userId || "" })
            })
            if (!res.ok) throw new Error("Failed")
            toast.success("Timetable created!")
            setTimeout(() => router.push("/timetable"), 1000)
        } catch {
            toast.error("Failed to create timetable")
        } finally {
            setIsSubmitting(false)
        }
    }

    /* Copy from batchmate */
    const handleCopy = async (bt: BranchTimetable) => {
        try {
            const yearNum = (year || "").replace(/\D/g, "").slice(0, 1)
            const res = await fetch("/api/timetable/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ rollNo, branch, year: yearNum, days: bt.days, college: college || "", userId: userId || "" })
            })
            if (!res.ok) throw new Error("Failed")
            toast.success("Timetable copied!")
            setTimeout(() => router.push("/timetable"), 1000)
        } catch {
            toast.error("Failed to copy timetable")
        }
    }

    return (
        <div style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>
            <Navigation />
            <ToastContainer position="top-center" autoClose={3000} theme="dark" />

            <div className="relative overflow-hidden">
                <GridBackground />
                <main className="relative z-10 max-w-3xl mx-auto px-4 py-8">

                    <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                        <h1 className="text-3xl font-black text-white">Setup Timetable</h1>
                        <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
                            Create your schedule or copy from a batchmate
                        </p>
                    </motion.div>

                    {/* Step indicator - only for manual flow */}
                    {mode === "manual" && (
                        <div className="flex items-center gap-3 mb-6">
                            {[1, 2].map(n => (
                                <div key={n} className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                                        style={{
                                            background: step >= n ? "var(--accent-indigo)" : "var(--bg-secondary)",
                                            color: step >= n ? "white" : "var(--text-muted)",
                                            border: `1px solid ${step >= n ? "var(--accent-indigo)" : "var(--border)"}`,
                                        }}>
                                        {step > n ? <FiCheck size={12} /> : n}
                                    </div>
                                    <span className="text-xs font-medium" style={{ color: step >= n ? "var(--text-primary)" : "var(--text-muted)" }}>
                                        {n === 1 ? "Add subjects" : "Assign to days"}
                                    </span>
                                    {n < 2 && <div className="w-8 h-px" style={{ background: step > n ? "var(--accent-indigo)" : "var(--border)" }} />}
                                </div>
                            ))}
                        </div>
                    )}

                    <AnimatePresence mode="wait">
                        {/* Choose mode */}
                        {mode === "choose" && (
                            <motion.div key="choose" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
                                className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <button onClick={() => setMode("browse")}
                                    className="card card-hover p-6 text-left flex flex-col gap-3">
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                                        style={{ background: "rgba(99,102,241,0.15)" }}>
                                        <FiUsers className="text-indigo-400 text-lg" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-white">Copy from Batchmate</p>
                                        <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
                                            Browse {year ? `Year ${year.replace(/\D/g, "").slice(0, 1)}, ` : ""}{branch} timetables and copy in one click
                                        </p>
                                    </div>
                                </button>

                                <button onClick={() => setMode("manual")}
                                    className="card card-hover p-6 text-left flex flex-col gap-3">
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                                        style={{ background: "rgba(99,102,241,0.15)" }}>
                                        <FiEdit3 className="text-indigo-400 text-lg" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-white">Build Manually</p>
                                        <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
                                            Add subjects then assign them to each day
                                        </p>
                                    </div>
                                </button>
                            </motion.div>
                        )}

                        {/* Manual - step 1 */}
                        {mode === "manual" && step === 1 && (
                            <StepSubjects
                                subjects={subjects}
                                onAdd={addSubject}
                                onRemove={removeSubject}
                                onUpdate={updateSubject}
                                onNext={() => setStep(2)}
                            />
                        )}

                        {/* Manual - step 2 */}
                        {mode === "manual" && step === 2 && (
                            <StepAssign
                                subjects={subjects}
                                assignments={assignments}
                                onToggle={toggleAssignment}
                                onBack={() => setStep(1)}
                                onSubmit={handleSubmit}
                                isSubmitting={isSubmitting}
                            />
                        )}

                        {/* Browse */}
                        {mode === "browse" && (
                            <BrowseTab
                                branch={branch || ""}
                                year={year || ""}
                                rollNo={rollNo || ""}
                                onCopy={handleCopy}
                                onBack={() => setMode("choose")}
                            />
                        )}
                    </AnimatePresence>
                </main>
            </div>
            <Footer />
        </div>
    )
}

export default Page
