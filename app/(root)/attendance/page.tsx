"use client"
import Footer from "@/components/footer"
import { Navigation } from "@/components/navigation"
import { useCallback, useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Calendar from 'react-calendar'
import { Value } from "react-calendar/dist/shared/types.js"
import { FiCheck, FiX, FiCalendar, FiUser, FiHash, FiBook, FiSave, FiRotateCw } from "react-icons/fi"
import { ToastContainer, toast } from 'react-toastify'
import { useUser } from "@/app/context/useContext"
import { GridBackground, LoadingScreen } from "@/components/PageShared"

type SubjectRecord = { name: string; type: string; isPresent: boolean }
type Subject = { name: string; type: string }

const AttendanceCard = ({
    items, records, title, onToggle
}: {
    items: Subject[]
    records: SubjectRecord[]
    title: string
    onToggle: (name: string, type: string) => void
}) => {
    if (!items.length) return null

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-6">
            <div className="flex items-center gap-3 mb-5">
                <FiBook style={{ color: "var(--accent-indigo)" }} />
                <h2 className="text-lg font-bold text-white">{title}</h2>
            </div>

            <div className="space-y-3">
                {items.map((item, idx) => {
                    const isPresent = records.find(r => r.name === item.name && r.type === item.type)?.isPresent ?? false
                    return (
                        <div
                            key={idx}
                            className="flex justify-between items-center p-4 rounded-xl"
                            style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}
                        >
                            <span className="font-medium text-white">{item.name}</span>

                            <motion.button
                                onClick={() => onToggle(item.name, item.type)}
                                whileTap={{ scale: 0.9 }}
                                aria-label={`Toggle attendance for ${item.name}`}
                                className="w-12 h-12 rounded-full flex items-center justify-center transition-colors"
                                style={{
                                    background: isPresent ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)",
                                    border: `2px solid ${isPresent ? "#22c55e" : "#ef4444"}`
                                }}
                            >
                                <motion.div
                                    animate={{ rotate: isPresent ? 0 : 180 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    {isPresent
                                        ? <FiCheck className="text-lg" style={{ color: "#22c55e" }} />
                                        : <FiX className="text-lg" style={{ color: "#ef4444" }} />
                                    }
                                </motion.div>
                            </motion.button>
                        </div>
                    )
                })}
            </div>
        </motion.div>
    )
}

type TimetableResponse = { data: { days: Array<{ day: string; subjects: Subject[] }> } }

const AttendanceMarker = () => {
    const [showCalendar, setShowCalendar] = useState(false)
    const [selectedDate, setSelectedDate] = useState<Date>(new Date())
    const [dayName, setDayName] = useState("")
    const [subjects, setSubjects] = useState<Subject[]>([])
    const [labs, setLabs] = useState<Subject[]>([])
    const { name, rollNo, branch } = useUser()
    const [records, setRecords] = useState<SubjectRecord[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const calendarRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (calendarRef.current && !calendarRef.current.contains(e.target as Node)) {
                setShowCalendar(false)
            }
        }
        if (showCalendar) document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [showCalendar])

    const fetchExistingAttendance = useCallback(async (dateStr: string) => {
        if (!rollNo) return []
        try {
            const res = await fetch(`/api/attendance?rollNo=${rollNo}&date=${dateStr}`)
            if (!res.ok) return []
            const data = await res.json()
            return data.data || []
        } catch {
            toast.error("Failed to load attendance data")
            return []
        }
    }, [rollNo])

    const fetchTimetableAndAttendance = useCallback(async (date: Date) => {
        if (!rollNo || !branch) return
        setIsLoading(true)

        const day = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
        setDayName(day)

        try {
            const res = await fetch(`/api/timetable?rollNo=${rollNo}&branch=${branch}`)
            if (!res.ok) throw new Error("Failed to fetch timetable")
            const timetableData: TimetableResponse = await res.json()
            const dayObj = timetableData.data.days.find(d => d.day.toLowerCase() === day)

            if (!dayObj) {
                setSubjects([]); setLabs([]); setRecords([])
                toast.warning("No classes scheduled for this day")
                return
            }

            const allSubjects = dayObj.subjects || []
            const dateStr = new Date(date.getTime() + 5.5 * 60 * 60 * 1000).toISOString().split("T")[0]
            const existingAttendance = await fetchExistingAttendance(dateStr)

            setRecords(allSubjects.map(subject => {
                const existing = existingAttendance.find((r: SubjectRecord) => r.name === subject.name && r.type === subject.type)
                return { name: subject.name, type: subject.type, isPresent: existing ? existing.isPresent : false }
            }))
            setSubjects(allSubjects.filter(i => i.type === "subject"))
            setLabs(allSubjects.filter(i => i.type === "lab"))
        } catch {
            toast.error("Failed to load timetable data")
        } finally {
            setIsLoading(false)
        }
    }, [branch, fetchExistingAttendance, rollNo])

    useEffect(() => {
        if (rollNo && branch) fetchTimetableAndAttendance(new Date())
    }, [rollNo, branch, fetchTimetableAndAttendance])

    const handleDateChange = useCallback(async (value: Value) => {
        if (!(value instanceof Date)) return
        setSelectedDate(value)
        setShowCalendar(false)
        await fetchTimetableAndAttendance(value)
    }, [fetchTimetableAndAttendance])

    const toggleAttendance = useCallback((name: string, type: string) => {
        setRecords(prev => prev.map(r =>
            r.name === name && r.type === type ? { ...r, isPresent: !r.isPresent } : r
        ))
    }, [])

    const handleSubmit = useCallback(async () => {
        if (!selectedDate || !rollNo) return
        setIsSubmitting(true)
        try {
            const dateStr = new Date(selectedDate.getTime() + 5.5 * 60 * 60 * 1000).toISOString().split("T")[0]
            const res = await fetch("/api/attendance", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ rollNo, presents: records, date: dateStr })
            })
            if (!res.ok) throw new Error("Failed")
            toast.success("Attendance saved!")
        } catch {
            toast.error("Failed to save attendance")
        } finally {
            setIsSubmitting(false)
        }
    }, [records, rollNo, selectedDate])

    return (
        <div style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>
            <Navigation />
            <div className="relative overflow-hidden">
                <GridBackground />
                <ToastContainer position="top-center" autoClose={4000} theme="dark" />
                <AnimatePresence>{isLoading && <LoadingScreen />}</AnimatePresence>

                <main className="relative z-10 max-w-3xl mx-auto px-4 py-8">
                    <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                        <h1 className="text-3xl font-black text-white">Mark Attendance</h1>
                        <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>Track your daily class presence</p>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card p-4 mb-6">
                        <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
                            {[["Name", name], ["Roll No", rollNo], ["Branch", branch]].map(([label, val]) => (
                                <span key={label} style={{ color: "var(--text-secondary)" }}>
                                    <span className="mr-1" style={{ color: "var(--text-muted)" }}>
                                        {label === "Name" ? <FiUser className="inline mr-1" /> : label === "Roll No" ? <FiHash className="inline mr-1" /> : <FiBook className="inline mr-1" />}
                                    </span>
                                    {val}
                                </span>
                            ))}
                        </div>
                    </motion.div>

                    <div className="relative mb-6" ref={calendarRef}>
                        <button
                            onClick={() => setShowCalendar(!showCalendar)}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all"
                            style={{
                                background: "var(--bg-secondary)",
                                border: "1px solid var(--border)",
                                color: "var(--text-primary)"
                            }}
                        >
                            <FiCalendar style={{ color: "var(--accent-indigo)" }} />
                            {selectedDate.toDateString()}
                        </button>

                        <AnimatePresence>
                            {showCalendar && (
                                <motion.div
                                    initial={{ opacity: 0, y: -8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    className="absolute z-20 mt-2 left-0 p-3 rounded-xl shadow-xl"
                                    style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}
                                >
                                    <Calendar onChange={handleDateChange} value={selectedDate} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="space-y-4">
                        <AttendanceCard
                            items={subjects}
                            records={records}
                            title={`Subjects — ${dayName.charAt(0).toUpperCase() + dayName.slice(1)}`}
                            onToggle={toggleAttendance}
                        />
                        <AttendanceCard
                            items={labs}
                            records={records}
                            title="Labs"
                            onToggle={toggleAttendance}
                        />

                        {records.length > 0 && (
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="btn-primary w-full flex items-center justify-center gap-2 py-3 disabled:opacity-50"
                            >
                                {isSubmitting
                                    ? <><motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}><FiRotateCw /></motion.span> Saving...</>
                                    : <><FiSave /> Save Attendance</>
                                }
                            </button>
                        )}
                    </div>
                </main>
                <Footer />
            </div>
        </div>
    )
}

export default AttendanceMarker