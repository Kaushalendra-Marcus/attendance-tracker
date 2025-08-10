"use client"
import { useUser } from "@/app/context/useContext"
import Footer from "@/components/footer"
import { Navigation } from "@/components/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { div } from "framer-motion/client"
import Image from "next/image"
import { useCallback, useEffect, useState } from "react"
import Calendar from 'react-calendar'
import { Value } from "react-calendar/dist/shared/types.js"
import { FiCheck, FiX, FiCalendar, FiUser, FiHash, FiBook, FiSave, FiRotateCw } from "react-icons/fi"
import { ToastContainer, toast } from 'react-toastify';

type SubjectRecord = {
    name: string;
    type: string;
    isPresent: boolean;
}

type Subject = {
    name: string;
    type: string;
}

type Lab = {
    name: string;
    type: string;
}

type Day = {
    day: string;
    subjects: Array<Subject | Lab>;
}

type TimetableResponse = {
    data: {
        days: Day[];
    };
}

const AttendanceMarker = () => {
    const [showCalendar, setShowCalendar] = useState(false)
    const [selectedDate, setSelectedDate] = useState<Date>(new Date())
    const [dayName, setDayName] = useState("")
    const [subjects, setSubjects] = useState<Subject[]>([])
    const [labs, setLabs] = useState<Lab[]>([])
    const { name, rollNo, branch } = useUser()
    const [records, setRecords] = useState<SubjectRecord[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    const fetchExistingAttendance = useCallback(async (dateStr: string) => {
        if (!rollNo) return [];
        try {
            const res = await fetch(`/api/attendance?rollNo=${rollNo}&date=${dateStr}`)
            if (!res.ok) return []
            const data = await res.json()
            return data.data || []
        } catch (err) {
            console.error("Failed to fetch attendance:", err)
            toast.error("Failed to load attendance data")
            return []
        }
    }, [rollNo]);

    const fetchTimetableAndAttendance = useCallback(async (date: Date) => {
        if (!rollNo || !branch) return;

        setIsLoading(true)
        const dayName = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
        setDayName(dayName)

        try {
            // 1. Fetch timetable
            const timetableRes = await fetch(`/api/timetable?rollNo=${rollNo}&branch=${branch}`)
            if (!timetableRes.ok) throw new Error("Failed to fetch timetable")

            const timetableData: TimetableResponse = await timetableRes.json()
            const dayObj = timetableData.data.days.find(d => d.day.toLowerCase() === dayName)

            if (!dayObj) {
                setSubjects([])
                setLabs([])
                setRecords([])
                toast.warning("No classes scheduled for this day")
                return
            }

            const allSubjects = dayObj.subjects || []

            // 2. Format date for API (YYYY-MM-DD) in IST
            const offsetIST = 5.5 * 60 * 60 * 1000
            const istDate = new Date(date.getTime() + offsetIST)
            const dateStr = istDate.toISOString().split("T")[0]

            // 3. Fetch existing attendance
            const existingAttendance = await fetchExistingAttendance(dateStr)

            // 4. Merge data
            const mergedRecords = allSubjects.map(subject => {
                const existingRecord = existingAttendance.find(
                    r => r.name === subject.name && r.type === subject.type
                )
                return {
                    name: subject.name,
                    type: subject.type,
                    isPresent: existingRecord ? existingRecord.isPresent : false
                }
            })

            setRecords(mergedRecords)
            setSubjects(allSubjects.filter(item => item.type === "subject"))
            setLabs(allSubjects.filter(item => item.type === "lab"))

        } catch (err) {
            console.error("Error handling date change:", err)
            toast.error("Failed to load timetable data")
        } finally {
            setIsLoading(false)
        }
    }, [branch, fetchExistingAttendance, rollNo]);

    // Initialize with current date
    useEffect(() => {
        if (rollNo && branch) {
            fetchTimetableAndAttendance(new Date())
        }
    }, [rollNo, branch, fetchTimetableAndAttendance])

    const handleDateChange = useCallback(async (value: Value) => {
        if (!(value instanceof Date)) return;
        setSelectedDate(value)
        setShowCalendar(false)
        await fetchTimetableAndAttendance(value)
    }, [fetchTimetableAndAttendance]);

    // Toggle attendance
    const toggleAttendance = useCallback((name: string, type: string) => {
        setRecords(prevRecords =>
            prevRecords.map(record =>
                record.name === name && record.type === type
                    ? { ...record, isPresent: !record.isPresent }
                    : record
            )
        )
    }, []);

    // Handle submit
    const handleSubmit = useCallback(async () => {
        if (!selectedDate || !rollNo) return

        setIsSubmitting(true)
        try {
            const offsetIST = 5.5 * 60 * 60 * 1000
            const istDate = new Date(selectedDate.getTime() + offsetIST)
            const dateStr = istDate.toISOString().split("T")[0]

            const response = await fetch("/api/attendance", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    rollNo,
                    presents: records,
                    date: dateStr
                })
            })

            if (!response.ok) throw new Error("Failed to save attendance")

            toast.success("Attendance marked successfully!")
        } catch (error) {
            console.error("Error saving attendance:", error)
            toast.error("Failed to mark attendance")
        } finally {
            setIsSubmitting(false)
        }
    }, [records, rollNo, selectedDate]);

    return (
        <div className="overflow-hidden bg-black">
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:50px_50px]" />
            </div>
            <div >
                {[...Array(50)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full"
                        initial={{
                            x: Math.random() * 100,
                            y: Math.random() * 100,
                            width: Math.random() * 10 + 1,
                            height: Math.random() * 10 + 1,
                            background: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 255, ${Math.random() * 0.5 + 0.1})`,
                            filter: `blur(${Math.random() * 2}px)`,
                        }}
                        animate={{
                            y: [null, Math.random() * 200 - 100],
                            x: [null, Math.random() * 200 - 100],
                            opacity: [0.1, 1, 0.1],
                        }}
                        transition={{
                            duration: Math.random() * 20 + 10,
                            repeat: Infinity,
                            repeatType: "reverse",
                            ease: "easeInOut"
                        }}
                    />
                ))}

                <Navigation />

                <ToastContainer
                    position="top-center"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="dark"
                />
                {isLoading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-gradient-to-br from-purple-900 via-black to-indigo-900 flex items-center justify-center"
                    >

                        {[...Array(30)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute rounded-full bg-purple-300/30"
                                initial={{
                                    x: Math.random() * 100,
                                    y: Math.random() * 100,
                                    width: Math.random() * 4 + 2,
                                    height: Math.random() * 4 + 2,
                                }}
                                animate={{
                                    y: [null, Math.random() * 100 - 50],
                                    opacity: [0.2, 1, 0.2],
                                }}
                                transition={{
                                    duration: Math.random() * 4 + 3,
                                    repeat: Infinity,
                                    repeatType: "reverse",
                                    ease: "easeInOut",
                                }}
                            />
                        ))}


                        <motion.div
                            animate={{ y: [0, -15, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                            className="relative"
                        >

                            <motion.div
                                animate={{ rotate: [0, 15, -15, 0] }}
                                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                                className="text-7xl mb-4"
                            >
                                🏃‍♂️
                            </motion.div>


                            <motion.div
                                animate={{ x: [-2, 2, -2] }}
                                transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                                className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-5xl opacity-60"
                            >
                                👨‍🏫
                            </motion.div>

                            <motion.h2
                                animate={{ opacity: [1, 0.6, 1] }}
                                transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                                className="text-white text-2xl font-bold tracking-wider drop-shadow-lg"
                            >
                                Escaping Professor…
                            </motion.h2>
                            <p>Loading Subjects/Lab...</p>
                        </motion.div>


                        <motion.div
                            className="absolute bottom-20"
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        >
                            <div className="w-12 h-12 rounded-full border-4 border-purple-400 border-t-transparent" />
                        </motion.div>
                    </motion.div>
                )}
                <div className="min-h-screen">
                    <main className="p-6">
                        <div className="max-w-4xl mx-auto">

                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center mb-8"
                            >
                                <h1 className="text-4xl font-bold text-white mb-2">Mark Attendance</h1>
                                <p className="text-purple-200">Track your daily class presence</p>
                            </motion.div>


                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-purple-800/30 backdrop-blur-sm border border-purple-700/50 rounded-xl p-6 mb-8"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-purple-100">
                                    <div className="flex items-center gap-3">
                                        <FiUser className="text-purple-300" />
                                        <span className="font-medium">Name: <span className="text-white">{name}</span></span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <FiHash className="text-purple-300" />
                                        <span className="font-medium">Roll No: <span className="text-white">{rollNo}</span></span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <FiBook className="text-purple-300" />
                                        <span className="font-medium">Branch: <span className="text-white">{branch}</span></span>
                                    </div>
                                </div>
                            </motion.div>


                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="relative mb-8"
                            >
                                <button
                                    onClick={() => setShowCalendar(!showCalendar)}
                                    className="flex items-center gap-3 px-5 py-3 bg-purple-700/50 hover:bg-purple-700/70 text-white rounded-lg transition-all w-full md:w-auto justify-center"
                                >
                                    <FiCalendar className="text-xl" />
                                    {selectedDate ? selectedDate.toDateString() : "Select Date"}
                                </button>

                                <AnimatePresence>
                                    {showCalendar && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="absolute z-10 mt-2 bg-purple-900 p-4 rounded-xl shadow-xl border border-purple-700/50 backdrop-blur-sm"
                                        >
                                            <Calendar
                                                onChange={handleDateChange}
                                                value={selectedDate}
                                                className="border-none bg-transparent text-white"
                                            />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>


                            {selectedDate && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="space-y-8"
                                >
                                    {/* Subjects Section */}
                                    {subjects.length > 0 && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="bg-purple-800/30 backdrop-blur-sm border border-purple-700/50 rounded-xl p-6"
                                        >
                                            <div className="flex items-center gap-3 mb-6">
                                                <FiBook className="text-2xl text-purple-300" />
                                                <h2 className="text-2xl font-bold text-white">
                                                    Subjects for {dayName.charAt(0).toUpperCase() + dayName.slice(1)}
                                                </h2>
                                            </div>

                                            <div className="grid grid-cols-1 gap-3">
                                                {subjects.map((sub: Subject, idx: number) => {
                                                    const isPresent = records.find(r => r.name === sub.name && r.type === sub.type)?.isPresent || false;
                                                    return (
                                                        <motion.div
                                                            key={idx}
                                                            whileHover={{ scale: 1.01 }}
                                                            className="flex justify-between items-center p-4 bg-purple-900/40 rounded-lg border border-purple-700/50"
                                                        >
                                                            <span className="font-medium text-white">{sub.name}</span>

                                                            <motion.div
                                                                onClick={() => toggleAttendance(sub.name, sub.type)}
                                                                className={`w-14 h-14 rounded-full flex items-center justify-center cursor-pointer relative overflow-hidden ${isPresent ? 'bg-emerald-500/20' : 'bg-rose-500/20'
                                                                    }`}
                                                                whileTap={{ scale: 0.95 }}
                                                            >
                                                                <motion.div
                                                                    className={`absolute inset-0 rounded-full ${isPresent ? 'bg-emerald-500' : 'bg-rose-500'
                                                                        }`}
                                                                    initial={{ scale: 0 }}
                                                                    animate={{ scale: 1 }}
                                                                    transition={{ type: "spring", stiffness: 300 }}
                                                                />

                                                                <motion.div
                                                                    className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full ${isPresent ? 'bg-emerald-600' : 'bg-rose-600'
                                                                        }`}
                                                                    animate={{ rotate: isPresent ? 0 : 180 }}
                                                                    transition={{ type: "spring", stiffness: 300 }}
                                                                >
                                                                    {isPresent ? (
                                                                        <FiCheck className="text-white text-xl" />
                                                                    ) : (
                                                                        <FiX className="text-white text-xl" />
                                                                    )}
                                                                </motion.div>
                                                            </motion.div>
                                                        </motion.div>
                                                    )
                                                })}
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Labs Section */}
                                    {labs.length > 0 && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="bg-purple-800/30 backdrop-blur-sm border border-purple-700/50 rounded-xl p-6"
                                        >
                                            <div className="flex items-center gap-3 mb-6">
                                                <h2 className="text-2xl font-bold text-white">Labs</h2>
                                            </div>

                                            <div className="grid grid-cols-1 gap-3">
                                                {labs.map((lab: Lab, idx: number) => {
                                                    const isPresent = records.find(r => r.name === lab.name && r.type === lab.type)?.isPresent || false;
                                                    return (
                                                        <motion.div
                                                            key={idx}
                                                            whileHover={{ scale: 1.01 }}
                                                            className="flex justify-between items-center p-4 bg-purple-900/40 rounded-lg border border-purple-700/50"
                                                        >
                                                            <span className="font-medium text-white">{lab.name}</span>

                                                            <motion.div
                                                                onClick={() => toggleAttendance(lab.name, lab.type)}
                                                                className={`w-14 h-14 rounded-full flex items-center justify-center cursor-pointer relative overflow-hidden ${isPresent ? 'bg-emerald-500/20' : 'bg-rose-500/20'
                                                                    }`}
                                                                whileTap={{ scale: 0.95 }}
                                                            >
                                                                <motion.div
                                                                    className={`absolute inset-0 rounded-full ${isPresent ? 'bg-emerald-500' : 'bg-rose-500'
                                                                        }`}
                                                                    initial={{ scale: 0 }}
                                                                    animate={{ scale: 1 }}
                                                                    transition={{ type: "spring", stiffness: 300 }}
                                                                />

                                                                <motion.div
                                                                    className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full ${isPresent ? 'bg-emerald-600' : 'bg-rose-600'
                                                                        }`}
                                                                    animate={{ rotate: isPresent ? 0 : 180 }}
                                                                    transition={{ type: "spring", stiffness: 300 }}
                                                                >
                                                                    {isPresent ? (
                                                                        <FiCheck className="text-white text-xl font-extrabold" />
                                                                    ) : (
                                                                        <FiX className="text-white text-xl font-extrabold" />
                                                                    )}
                                                                </motion.div>
                                                            </motion.div>
                                                        </motion.div>
                                                    )
                                                })}
                                            </div>
                                        </motion.div>
                                    )}


                                    <motion.button
                                        onClick={handleSubmit}
                                        disabled={!records.length || isSubmitting}
                                        whileHover={{ scale: records.length ? 1.03 : 1 }}
                                        whileTap={{ scale: records.length ? 0.97 : 1 }}
                                        className={`flex items-center justify-center gap-3 w-full py-4 rounded-xl text-lg font-medium shadow-lg transition-all ${records.length
                                            ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white'
                                            : 'bg-gray-600 cursor-not-allowed text-gray-300'
                                            }`}
                                    >
                                        {isSubmitting ? (
                                            <motion.span
                                                animate={{ rotate: 360 }}
                                                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                            >
                                                <FiRotateCw />
                                            </motion.span>
                                        ) : (
                                            <>
                                                <FiSave />
                                                Save Attendance
                                            </>
                                        )}
                                    </motion.button>
                                </motion.div>
                            )}
                        </div>
                    </main>
                </div>
                <Footer />
            </div>
        </div>
    )
}

export default AttendanceMarker