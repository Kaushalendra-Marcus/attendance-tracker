"use client"

import { useUser } from "@/app/context/useContext"
import Footer from "@/components/footer"
import { Navigation } from "@/components/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import Calendar from "react-calendar"
import { FiCheck, FiX, FiCalendar, FiUser, FiHash, FiBook, FiSave, FiRotateCw } from "react-icons/fi"

type SubjectRecord = {
    name: string;
    type: string;
    isPresent: boolean;
}

const AttendanceMarker = () => {
    const [showCalendar, setShowCalendar] = useState(false)
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)
    const [dayName, setDayName] = useState("")
    const [subjects, setSubjects] = useState<any[]>([])
    const [labs, setLabs] = useState<any[]>([])
    const { name, rollNo, branch } = useUser()
    const [records, setRecords] = useState<SubjectRecord[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleDateChange = (date: any) => {
        setSelectedDate(date)
        setShowCalendar(false)
        const Name = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
        setDayName(Name)
    }

    useEffect(() => {
        if (!rollNo || !branch || !dayName) return;

        const fetchTimeTable = async () => {
            try {
                const res = await fetch(`/api/timetable?rollNo=${rollNo}&branch=${branch}`)
                if (!res.ok) throw new Error("Not Found")

                const data = await res.json()
                const dayObj = data.data.days.find((d: any) => d.day.toLowerCase() === dayName)

                if (dayObj) {
                    const allSubjects = dayObj.subjects || []
                    const onlySubjects = allSubjects.filter((item: any) => item.type === "subject")
                    const onlyLabs = allSubjects.filter((item: any) => item.type === "lab")

                    setSubjects(onlySubjects)
                    setLabs(onlyLabs)

                    const initialRecords = allSubjects.map((item: any) => ({
                        name: item.name,
                        type: item.type,
                        isPresent: false
                    }))
                    setRecords(initialRecords)
                } else {
                    setSubjects([])
                    setLabs([])
                    setRecords([])
                }
            } catch (err) {
                console.error("Failed to fetch timetable:", err)
            }
        }
        fetchTimeTable()
    }, [rollNo, branch, dayName])

    const toggleAttendance = (name: string, type: string) => {
        setRecords(prevRecords =>
            prevRecords.map(record =>
                record.name === name && record.type === type
                    ? { ...record, isPresent: !record.isPresent }
                    : record
            )
        )
    }

    const handleSubmit = async () => {
        if (!selectedDate || !rollNo) return;

        setIsSubmitting(true)
        try {
            const response = await fetch("/api/attendance", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    rollNo,
                    presents: records,
                    date: selectedDate
                })
            });

            if (!response.ok) throw new Error("Failed to save attendance");

            const result = await response.json();
            alert(result.message || "Attendance saved successfully");
        } catch (error) {
            console.error("Error saving attendance:", error);
            alert("Failed to save attendance");
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div>
            <Navigation />
            <div className="min-h-screen bg-gradient-to-br from-purple-900/60 via-purple-700/60 to-purple-500/60">
                <main className="p-6">
                    <div className="max-w-4xl mx-auto">
                        {/* Header Section */}
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center mb-8"
                        >
                            <h1 className="text-4xl font-bold text-white mb-2">Mark Attendance</h1>
                            <p className="text-purple-200">Track your daily class presence</p>
                        </motion.div>

                        {/* Profile Card */}
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

                        {/* Date Picker */}
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

                        {/* Attendance Section */}
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
                                            {subjects.map((sub: any, idx: number) => {
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
                                            {/* <FiFlask className="text-2xl text-purple-300" /> */}
                                            <h2 className="text-2xl font-bold text-white">Labs</h2>
                                        </div>

                                        <div className="grid grid-cols-1 gap-3">
                                            {labs.map((lab: any, idx: number) => {
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

                                {/* Submit Button */}
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
    )
}

export default AttendanceMarker