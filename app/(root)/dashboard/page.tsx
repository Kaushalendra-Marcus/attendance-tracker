"use client"
import { useUser } from "@/app/context/useContext"
import Image from "next/image"
import { useEffect, useState, useMemo } from "react"
import { ToastContainer, toast } from 'react-toastify'
import { motion } from "framer-motion"
import { FiCalendar, FiUser, FiHash, FiBook, FiSave, FiRotateCw } from "react-icons/fi"
import Calendar from "react-calendar"
import { Value } from "react-calendar/dist/shared/types.js"
import { Navigation } from "@/components/navigation"
import Footer from "@/components/footer"

type SubjectType = 'subject' | 'lab' | null
interface Subject {
    name: string
}
interface Day {
    subjects: Subject[]
}
interface TimetableResponse {
    data: {
        days: Day[];
    };
}
const Dashboard = () => {
    const [startDate, setStartDate] = useState<Date | null>(null)
    const [endDate, setEndDate] = useState<Date | null>(null)
    const [subjectNames, setSubjectNames] = useState<string[]>([])
    const [selectedSubject, setSelectedSubject] = useState<string>("")
    const [type, setType] = useState<SubjectType>(null)
    const [loading, setLoading] = useState(false)
    const [showLoading, setShowLoading] = useState(false)
    const [attendanceData, setAttendanceData] = useState<{
        present: number
        total: number
        percentage: number
    } | null>(null)
    const { name, rollNo, branch } = useUser()
    const [showStartCalendar, setShowStartCalendar] = useState(false)
    const [showEndCalendar, setShowEndCalendar] = useState(false)


    const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedSubject(e.target.value)
    }

    useEffect(() => {
        if (startDate && endDate && startDate > endDate) {
            toast.error("Start date cannot be after end date")
            setEndDate(null)
        }
    }, [startDate, endDate])


    useEffect(() => {
        let timer: NodeJS.Timeout
        if (loading) {
            timer = setTimeout(() => setShowLoading(true), 300)
        } else {
            setShowLoading(false)
        }
        return () => clearTimeout(timer)
    }, [loading])

    const handleDateSelect = (
        value: Value,
        type: 'start' | 'end'
    ): void => {
        if (!(value instanceof Date)) return;

        const date = value;
        if (type === 'start') {
            if (endDate && date > endDate) {
                toast.error("Start date cannot be after end date")
                return;
            }
            setStartDate(date);
            setShowStartCalendar(false);
        } else {
            if (startDate && date < startDate) {
                toast.error("End date cannot be before start date")
                return;
            }
            setEndDate(date);
            setShowEndCalendar(false);
        }
    };
    useEffect(() => {
        const fetchSubjectList = async () => {
            try {
                console.log("-> calling /api/timetable");
                const res = await fetch(`/api/timetable?rollNo=${rollNo}&branch=${branch}`)
                if (!res.ok) return;
                const data: TimetableResponse = await res.json()
                const allSubjects = data.data.days.flatMap((day: Day) => day.subjects);
                const uniqueNames = Array.from(new Set(allSubjects.map((sub: Subject) => sub.name)))
                setSubjectNames(uniqueNames)
            } catch (err) {
                const error = err as Error
                console.error("Error in Subject List", error);
                toast.error(error.message || "Failed to fetch Subject")
            }
        }
        fetchSubjectList()
    }, [rollNo, branch])

    const fetchAttendance = async () => {
        if (!rollNo || !selectedSubject || !type || !startDate || !endDate) {
            toast.error("Please fill all fields")
            return
        }

        setLoading(true)
        setAttendanceData(null)

        try {
            const res = await fetch("/api/percentage", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    rollNo,
                    subjectName: selectedSubject,
                    type,
                    fromDate: startDate.toISOString(),
                    toDate: endDate.toISOString()
                })
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.message || "Failed to fetch attendance data")
            }

            if (data.success === false) {
                if (data.message === "No attendance records found for this subject") {
                    setAttendanceData({
                        present: 0,
                        total: 0,
                        percentage: 0
                    })
                    toast.warning(data.message)
                    return
                }
                throw new Error(data.message)
            }

            setAttendanceData({
                present: data.present,
                total: data.total,
                percentage: data.total > 0 ? Math.round((data.present / data.total) * 100) : 0
            })
            toast.success("Attendance fetched successfully!")
        } catch (err) {
            const error = err as Error
            console.error("Attendance fetch error:", error)
            toast.error(error.message || "Failed to fetch attendance")
            setAttendanceData(null)
        } finally {
            setLoading(false)
        }
    }




    const formatDate = (date: Date | null) => {
        return date ? date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }) : "Select date"
    }

    const percentage = useMemo(() => {
        return attendanceData ? attendanceData.percentage : 0
    }, [attendanceData])

    const isFormValid = rollNo && selectedSubject && type && startDate && endDate && startDate <= endDate

    return (
        <div>
            <Navigation />
            <div className="min-h-screen bg-gradient-to-br from-purple-900/60 via-purple-700/60 to-purple-500/60 p-4">

                <ToastContainer
                    position="top-center"
                    autoClose={2000}
                    theme="colored"
                />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-4xl min-h-screen mx-auto bg-purple-900/20 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-purple-700/50 p-6"
                >
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-white mb-2">Attendance Analytics</h1>
                        <p className="text-purple-200">Track your class attendance percentage</p>
                    </div>

                    {/* Profile Card */}
                    <motion.div
                        whileHover={{ scale: 1.01 }}
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

                    {/* Subject Selection */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-purple-100 mb-2">Subject/Lab Name</label>
                        <motion.div whileHover={{ scale: 1.01 }}>
                            <select
                                value={selectedSubject}
                                onChange={handleSubjectChange}
                                className="w-full px-4 py-3 bg-purple-900/90 border border-purple-700/70 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-purple-400"
                            >
                                <option value="">Select a subject</option>
                                {subjectNames.map((name: string) => (
                                    <option value={name} key={name}>
                                        {name}
                                    </option>
                                ))}
                            </select>
                        </motion.div>
                    </div>
                    {/* Date Selection */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {/* Start Date */}
                        <div>
                            <label className="block text-sm font-medium text-purple-100 mb-2">Start Date</label>
                            <div className="relative">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => {
                                        setShowStartCalendar(!showStartCalendar)
                                        setShowEndCalendar(false)
                                    }}
                                    className="w-full px-4 py-3 bg-purple-800/50 text-white rounded-lg hover:bg-purple-700/60 transition-all flex justify-between items-center border border-purple-700/50"
                                    aria-label="Select start date"
                                >
                                    <span>{formatDate(startDate)}</span>
                                    <FiCalendar className="text-purple-300" />
                                </motion.button>

                                {showStartCalendar && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="absolute z-10 mt-2 bg-purple-900 p-4 rounded-xl shadow-xl border border-purple-700/50"
                                    >
                                        <Calendar
                                            onChange={(value) => handleDateSelect(value, 'start')}
                                            value={startDate}
                                            maxDate={endDate || undefined}
                                            className="border-0 bg-purple-900 text-white "
                                        />
                                    </motion.div>
                                )}
                            </div>
                        </div>

                        {/* End Date */}
                        <div>
                            <label className="block text-sm font-medium text-purple-100 mb-2">End Date</label>
                            <div className="relative">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => {
                                        setShowEndCalendar(!showEndCalendar)
                                        setShowStartCalendar(false)
                                    }}
                                    className="w-full px-4 py-3 bg-purple-800/50 text-white rounded-lg hover:bg-purple-700/60 transition-all flex justify-between items-center border border-purple-700/50"
                                    aria-label="Select end date"
                                >
                                    <span>{formatDate(endDate)}</span>
                                    <FiCalendar className="text-purple-300" />
                                </motion.button>

                                {showEndCalendar && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="absolute z-10 mt-2 bg-purple-900 p-4 rounded-xl shadow-xl border border-purple-700/50"
                                    >
                                        <Calendar
                                            onChange={(value) => handleDateSelect(value, 'end')}
                                            value={endDate}
                                            minDate={startDate || undefined}
                                            className="border-0 bg-purple-900 text-white"
                                        />
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* Type Selection */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-purple-100 mb-2">Type</label>
                        <div className="flex space-x-4">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setType('subject')}
                                className={`px-4 py-2 rounded-lg transition-all ${type === 'subject' ? 'bg-green-600 text-white shadow-md' : 'bg-purple-900/40 text-purple-200 border border-purple-700/50'}`}
                                aria-label={type === 'subject' ? "Subject selected" : "Select subject"}
                            >
                                Subject
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setType('lab')}
                                className={`px-4 py-2 rounded-lg transition-all ${type === 'lab' ? 'bg-red-600 text-white shadow-md' : 'bg-purple-900/40 text-purple-200 border border-purple-700/50'}`}
                                aria-label={type === 'lab' ? "Lab selected" : "Select lab"}
                            >
                                Lab
                            </motion.button>
                        </div>
                    </div>



                    {/* Submit Button */}
                    <motion.button
                        whileHover={{ scale: isFormValid ? 1.02 : 1 }}
                        whileTap={{ scale: isFormValid ? 0.98 : 1 }}
                        onClick={fetchAttendance}
                        disabled={loading || !isFormValid}
                        className={`w-full py-3.5 text-white rounded-lg transition-all flex items-center justify-center shadow-lg border ${loading
                            ? 'bg-purple-800/50 border-purple-700/50'
                            : !isFormValid
                                ? 'bg-gray-600 cursor-not-allowed border-gray-500'
                                : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 border-purple-500/30'
                            }`}
                        aria-label="Get attendance data"
                    >
                        {loading ? (
                            <>
                                <motion.span
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                    className="mr-2"
                                >
                                    <FiRotateCw />
                                </motion.span>
                                Processing...
                            </>
                        ) : (
                            <>
                                <FiSave className="mr-2" />
                                Get Attendance
                            </>
                        )}
                    </motion.button>

                    {/* Results Section */}
                    {attendanceData && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-8 p-6 bg-purple-900/30 backdrop-blur-sm border border-purple-700/50 rounded-2xl"
                        >
                            {/* stats row */}
                            <div className="flex justify-around text-center mb-6">
                                {[
                                    { label: "Present", value: attendanceData.present },
                                    { label: "Total", value: attendanceData.total },
                                ].map((stat, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ y: 20 }}
                                        animate={{ y: 0 }}
                                        transition={{ delay: 0.2 + i * 0.1 }}
                                        className="flex flex-col"
                                    >
                                        <span className="text-3xl font-bold text-white">{stat.value}</span>
                                        <span className="text-sm text-purple-300">{stat.label}</span>
                                    </motion.div>
                                ))}
                            </div>

                            {/* simple circle bar */}
                            <div className="flex justify-center">
                                <svg viewBox="0 0 36 36" className="w-32 h-32">
                                    <circle
                                        cx="18"
                                        cy="18"
                                        r="15.9"
                                        stroke="#4c1d95"
                                        strokeWidth="3"
                                        fill="none"
                                    />
                                    <motion.circle
                                        cx="18"
                                        cy="18"
                                        r="15.9"
                                        stroke="#10b981"
                                        strokeWidth="3"
                                        fill="none"
                                        strokeLinecap="round"
                                        strokeDasharray="100"
                                        strokeDashoffset={100 - percentage}
                                        initial={{ strokeDashoffset: 100 }}
                                        animate={{ strokeDashoffset: 100 - percentage }}
                                        transition={{ duration: 1.2, ease: "easeOut" }}
                                        transform="rotate(-90 18 18)"
                                    />
                                    <text
                                        x="18"
                                        y="22"
                                        textAnchor="middle"
                                        className="fill-white text-[10px] font-bold text-center"
                                    >
                                        {percentage}%
                                    </text>
                                </svg>
                            </div>

                            {/* status pill */}
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
                                className="mt-4 text-center text-sm font-semibold"
                            >
                                {percentage >= 75 ? "🎉 Excellent! You're meeting the 75% criteria!, you are eligible for paper 😊" : percentage >= 50 ? "👍 Close" : "⚠️ Need more classes"}
                            </motion.div>
                        </motion.div>
                    )}

                    {/* Loading State */}
                    {showLoading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-8 flex flex-col items-center justify-center p-6"
                        >
                            <div className="w-49 h-49 relative">
                                <Image
                                    priority
                                    src="/floss_loading.gif"
                                    alt="loading"
                                    width={400}
                                    height={400}
                                    className="object-contain"
                                />
                            </div>
                            <p className="text-purple-200 mt-4 text-lg">Fetching your attendance data...</p>
                        </motion.div>
                    )}
                </motion.div>
            </div>
            <Footer />
        </div>
    )
}

export default Dashboard