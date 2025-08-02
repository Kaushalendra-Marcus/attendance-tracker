"use client"
import { useUser } from "@/app/context/useContext"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { FiEdit2, FiLoader, FiCalendar, FiUser, FiHash, FiBook } from "react-icons/fi"

const TimetablePage = () => {
    const { name, rollNo, branch } = useUser()
    const [timetable, setTimeTable] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        if (!rollNo || !branch) return;
        const fetchTimeTable = async () => {
            try {
                const res = await fetch(`/api/timetable?rollNo=${rollNo}&branch=${branch}`)
                if (!res.ok) throw new Error("Not Found")
                const data = await res.json()
                if (!data || data.length === 0) {
                    router.push("/timetable/create")
                } else {
                    setTimeTable(data)
                }
            } catch (error) {
                router.push("/timetable/create")
            } finally {
                setLoading(false)
            }
        }
        fetchTimeTable()
    }, [router, rollNo, branch])

    if (loading) return (
        <div className="flex justify-center items-center h-screen bg-gradient-to-br from-purple-900/60 via-purple-700/60 to-purple-500/60">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            >
                <FiLoader className="text-4xl text-purple-200" />
            </motion.div>
        </div>
    )

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900/60 via-purple-700/60 to-purple-500/60">
            {/* Navigation would be imported from your components */}

            <main className="p-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header Section */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-8"
                    >
                        <h1 className="text-4xl font-bold text-white mb-2">Your Timetable</h1>
                        <p className="text-purple-200">Manage and track your class schedule</p>
                    </motion.div>

                    {/* Profile Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-purple-800/30 backdrop-blur-sm border border-purple-700/50 rounded-xl p-6 mb-8"
                    >
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div className="space-y-3 text-purple-100">
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

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-white text-purple-900 hover:bg-purple-100 px-6 py-3 rounded-lg flex items-center gap-2 transition-all font-medium"
                            >
                                <FiEdit2 />
                                <Link href="/timetable/edit">Edit Timetable</Link>
                            </motion.button>
                        </div>
                    </motion.div>

                    {/* Timetable Section */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="bg-purple-800/30 backdrop-blur-sm border border-purple-700/50 rounded-xl p-6"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <FiCalendar className="text-2xl text-purple-300" />
                            <h2 className="text-2xl font-bold text-white">Class Schedule</h2>
                        </div>

                        {timetable?.data?.days?.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {timetable.data.days.map((day: any) => (
                                    <motion.div
                                        key={day._id}
                                        whileHover={{ y: -5 }}
                                        className="bg-purple-900 border border-purple-700/50 rounded-xl p-5 hover:shadow-lg transition-all"
                                    >
                                        <h3 className="font-bold text-lg text-white capitalize mb-4 pb-2 border-b border-purple-700/50">
                                            {day.day}
                                        </h3>
                                        <div className="space-y-3">
                                            {day.subjects.map((subject: any) => (
                                                <motion.div
                                                    key={subject._id}
                                                    whileHover={{ scale: 1.02 }}
                                                    className={`p-3 rounded-lg ${subject.type === 'lab'
                                                        ? 'bg-purple-700/40 text-purple-100 border border-purple-600/50'
                                                        : 'bg-purple-800/40 text-white border border-purple-700/50'}`}
                                                >
                                                    <div className="flex justify-between items-center">
                                                        <span className="font-medium">{subject.name}</span>
                                                        <span className={`text-xs px-2 py-1 rounded-full ${subject.type === 'lab'
                                                            ? 'bg-purple-600 text-purple-100'
                                                            : 'bg-purple-700 text-white'}`}>
                                                            {subject.type}
                                                        </span>
                                                    </div>
                                                    {subject.time && (
                                                        <div className="mt-2 text-sm text-purple-300">
                                                            {subject.time}
                                                        </div>
                                                    )}
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (

                            <div>
                                <p className="text-purple-600/90">No Time Table Found, Please Create One</p>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-white text-purple-900 hover:bg-purple-100 px-6 py-3 rounded-lg flex items-center gap-2 transition-all font-medium"
                                >
                                    <FiEdit2 />
                                    <Link href="/timetable/create">Create Timetable</Link>
                                </motion.button>
                            </div>
                        )}
                    </motion.div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-purple-900/80 backdrop-blur-md border-t border-purple-700/50 mt-12">
                <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-white">
                            <span>© {new Date().getFullYear()} MyAttendance</span>
                            <span className="hidden sm:block">•</span>
                            <span>All rights reserved</span>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-sm">
                            <Link
                                href="/privacy"
                                className="text-purple-200 hover:text-white transition-colors duration-200"
                            >
                                Privacy Policy
                            </Link>
                            <Link
                                href="/terms"
                                className="text-purple-200 hover:text-white transition-colors duration-200"
                            >
                                Terms of Service
                            </Link>
                            <Link
                                href="/contact"
                                className="text-purple-200 hover:text-white transition-colors duration-200"
                            >
                                Contact Us
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default TimetablePage