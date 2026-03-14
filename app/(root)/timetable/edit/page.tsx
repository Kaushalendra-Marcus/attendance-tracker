"use client"
import { useUser } from "@/app/context/useContext"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FiPlus, FiSave, FiTrash2, FiArrowRight, FiArrowLeft, FiCheck, FiLoader } from "react-icons/fi"
import { Navigation } from "@/components/navigation"
import Footer from "@/components/footer"
import { GridBackground, LoadingScreen } from "@/components/PageShared"
import { useRouter } from "next/navigation"

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]

type Subject = { id: string; name: string; type: "subject" | "lab" }
type DayAssignment = { [day: string]: string[] }

const uid = () => Math.random().toString(36).slice(2, 8)

/* ── Step 1: Edit subjects list ───────────────────────────── */
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
            <h2 className="text-lg font-black text-white mb-1">Step 1 - Your subjects</h2>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                Add or remove subjects and labs. You&apos;ll assign them to days next.
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
                    <button onClick={() => onRemove(sub.id)}
                        className="p-2 rounded-lg transition-colors"
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

/* ── Step 2: Assign subjects to days ──────────────────────── */
const StepAssign = ({
    subjects,
    assignments,
    onToggle,
    onBack,
    onSubmit,
    isSubmitting,
    saved,
}: {
    subjects: Subject[]
    assignments: DayAssignment
    onToggle: (day: string, subjectId: string) => void
    onBack: () => void
    onSubmit: () => void
    isSubmitting: boolean
    saved: boolean
}) => {
    const [activeDay, setActiveDay] = useState(DAYS[0])
    const validSubjects = subjects.filter(s => s.name.trim())
    const assignedCount = Object.values(assignments).flat().length

    return (
        <motion.div key="step2" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}>
            <div className="mb-6">
                <h2 className="text-lg font-black text-white mb-1">Step 2 - Assign to days</h2>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                    Tap subjects to toggle them on/off for each day.
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

            {/* Subject chips */}
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
                    <p className="text-sm" style={{ color: "var(--text-muted)" }}>No subjects added.</p>
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
                <button onClick={onSubmit}
                    disabled={isSubmitting || assignedCount === 0}
                    className="btn-primary flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed">
                    {saved ? (
                        <><FiCheck size={14} /><span>Saved!</span></>
                    ) : isSubmitting ? (
                        <><motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}><FiLoader size={14} /></motion.span><span>Saving...</span></>
                    ) : (
                        <><FiSave size={14} /><span>Save Changes</span></>
                    )}
                </button>
            </div>
        </motion.div>
    )
}

/* ── Main page ────────────────────────────────────────────── */
const Page = () => {
    const [step, setStep]               = useState<1 | 2>(1)
    const [subjects, setSubjects]       = useState<Subject[]>([])
    const [assignments, setAssignments] = useState<DayAssignment>({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isLoading, setIsLoading]     = useState(true)
    const [saved, setSaved]             = useState(false)
    const [error, setError]             = useState("")
    const { rollNo, branch, college, userId } = useUser()
    const router = useRouter()

    useEffect(() => {
        const timer = setTimeout(() => {
            const stored = localStorage.getItem("userData")
            if (!stored || !JSON.parse(stored).rollNo) router.push("/sign-up")
        }, 500)
        return () => clearTimeout(timer)
    }, [router])

    // Load existing timetable and convert to subjects + assignments
    useEffect(() => {
        if (!rollNo || !branch) return
        const fetchTimetable = async () => {
            try {
                const params = new URLSearchParams({ rollNo, branch })
                if (college) params.set("college", college)
                if (userId)  params.set("userId",  userId)
                const res  = await fetch(`/api/timetable?${params}`)
                const data = await res.json()

                if (data.success && data.data?.days?.length) {
                    // Collect all unique subjects across all days
                    const subjectMap = new Map<string, Subject>()
                    const newAssignments: DayAssignment = {}

                    data.data.days.forEach((d: { day: string; subjects: { name: string; type: string }[] }) => {
                        newAssignments[d.day] = []
                        d.subjects.forEach((s) => {
                            // Deduplicate by name+type
                            const key = `${s.name}__${s.type}`
                            if (!subjectMap.has(key)) {
                                const id = uid()
                                subjectMap.set(key, { id, name: s.name, type: s.type as "subject" | "lab" })
                            }
                            newAssignments[d.day].push(subjectMap.get(key)!.id)
                        })
                    })

                    setSubjects(Array.from(subjectMap.values()))
                    setAssignments(newAssignments)
                }
            } catch {
                setError("Failed to load timetable")
            } finally {
                setIsLoading(false)
            }
        }
        fetchTimetable()
    }, [rollNo, branch, college, userId])

    /* Subject helpers */
    const addSubject    = () => setSubjects(p => [...p, { id: uid(), name: "", type: "subject" }])
    const removeSubject = (id: string) => {
        setSubjects(p => p.filter(s => s.id !== id))
        // Remove from all day assignments too
        setAssignments(prev => {
            const updated = { ...prev }
            Object.keys(updated).forEach(day => {
                updated[day] = updated[day].filter(sid => sid !== id)
            })
            return updated
        })
    }
    const updateSubject = (id: string, field: "name" | "type", value: string) =>
        setSubjects(p => p.map(s => s.id === id ? { ...s, [field]: value as "subject" | "lab" } : s))

    const toggleAssignment = (day: string, subjectId: string) => {
        setAssignments(prev => {
            const current = prev[day] || []
            const updated = current.includes(subjectId)
                ? current.filter(id => id !== subjectId)
                : [...current, subjectId]
            return { ...prev, [day]: updated }
        })
    }

    const handleSubmit = async () => {
        setIsSubmitting(true)
        setError("")
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

            if (!days.length) { setError("Assign at least one subject to a day"); return }

            const res = await fetch("/api/timetable/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    rollNo,
                    branch,
                    days,
                    college: college || "",
                    userId:  userId  || "",
                })
            })

            if (!res.ok) throw new Error("Failed to update")
            setSaved(true)
            setTimeout(() => setSaved(false), 2500)
        } catch {
            setError("Update failed. Try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>
            <Navigation />
            <AnimatePresence>{isLoading && <LoadingScreen />}</AnimatePresence>

            <div className="relative overflow-hidden">
                <GridBackground />
                <main className="relative z-10 max-w-3xl mx-auto px-4 py-8">

                    <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                        <h1 className="text-3xl font-black text-white">Edit Timetable</h1>
                        <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
                            Update your weekly class schedule
                        </p>
                    </motion.div>

                    {/* Step indicator */}
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
                                <span className="text-xs font-medium"
                                    style={{ color: step >= n ? "var(--text-primary)" : "var(--text-muted)" }}>
                                    {n === 1 ? "Edit subjects" : "Assign to days"}
                                </span>
                                {n < 2 && (
                                    <div className="w-8 h-px"
                                        style={{ background: step > n ? "var(--accent-indigo)" : "var(--border)" }} />
                                )}
                            </div>
                        ))}
                    </div>

                    {error && (
                        <p className="text-sm mb-4 text-red-400">{error}</p>
                    )}

                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <StepSubjects
                                subjects={subjects}
                                onAdd={addSubject}
                                onRemove={removeSubject}
                                onUpdate={updateSubject}
                                onNext={() => setStep(2)}
                            />
                        )}
                        {step === 2 && (
                            <StepAssign
                                subjects={subjects}
                                assignments={assignments}
                                onToggle={toggleAssignment}
                                onBack={() => setStep(1)}
                                onSubmit={handleSubmit}
                                isSubmitting={isSubmitting}
                                saved={saved}
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
