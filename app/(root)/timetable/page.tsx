"use client"
import { useUser } from "@/app/context/useContext"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { FiEdit2, FiLoader, FiCalendar, FiUser, FiHash, FiBook } from "react-icons/fi"
import Footer from "@/components/footer"
import { Navigation } from "@/components/navigation"

type Subject = { _id: string; name: string; type: "subject" | "lab"; time?: string }
type Day = { _id: string; day: string; subjects: Subject[] }
type TimetableData = { data: { days: Day[] } }

const TimetablePage = () => {
    const { name, rollNo, branch } = useUser()
    const [timetable, setTimeTable] = useState<TimetableData | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        if (!rollNo || !branch) return
        const fetchTimeTable = async () => {
            try {
                const res = await fetch(`/api/timetable?rollNo=${rollNo}&branch=${branch}`)
                if (!res.ok) throw new Error("Not Found")
                const data = await res.json()
                !data?.data?.days?.length ? router.push("/timetable/create") : setTimeTable(data)
            } catch {
                router.push("/timetable/create")
            } finally {
                setLoading(false)
            }
        }
        fetchTimeTable()
    }, [router, rollNo, branch])

    if (loading)
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="text-4xl text-purple-400 drop-shadow-purple"
                >
                    <FiLoader />
                </motion.div>
            </div>
        )

    return (
        <div className="min-h-screen relative overflow-hidden bg-black">
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:50px_50px]" />
            </div>
            

            
           

            <Navigation />

            <main className="relative z-10 p-6">
                <div className="max-w-7xl mx-auto space-y-14">
                    
                    <motion.div
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                    >
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400">
                                Your Timetable
                            </span>
                        </h1>
                        <p className="text-purple-200/80 mt-2">Manage and track your class schedule.</p>
                    </motion.div>

                    {/* Profile Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row justify-center items-start md:items-center gap-6"
                    >
                        <div className="space-y-3 text-purple-100">
                            <div className="flex items-center gap-3"><FiUser className="text-purple-300" /> Name: <span className="text-white font-medium">{name}</span></div>
                            <div className="flex items-center gap-3"><FiHash className="text-purple-300" /> Roll No: <span className="text-white font-medium">{rollNo}</span></div>
                            <div className="flex items-center gap-3"><FiBook className="text-purple-300" /> Branch: <span className="text-white font-medium">{branch}</span></div>
                        </div>

                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-semibold shadow-lg shadow-purple-500/20"
                        >
                            <FiEdit2 />
                            <Link href="/timetable/create">Edit Timetable</Link>
                        </motion.div>
                    </motion.div>

                    {/* Timetable */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
                    >
                        <div className="absolute inset-0">
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:50px_50px]" />
                    </div>
                        <div className="flex items-center gap-3 mb-6">
                            <FiCalendar className="text-2xl text-purple-300" />
                            <h2 className="text-2xl font-bold text-white">Class Schedule</h2>
                        </div>

                        {timetable?.data?.days?.length ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {timetable.data.days.map((day, i) => (
                                    <motion.div
                                        key={day._id}
                                        initial={{ opacity: 0, y: 40 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 * i }}
                                        whileHover={{ y: -6 }}
                                        className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:shadow-purple-500/20 hover:shadow-xl transition-all"
                                    >
                                        <h3 className="text-lg font-bold text-white capitalize mb-4 pb-2 border-b border-white/10">
                                            {day.day}
                                        </h3>
                                        <div className="space-y-3">
                                            {day.subjects.map((sub) => (
                                                <motion.div
                                                    key={sub._id}
                                                    whileHover={{ scale: 1.03 }}
                                                    className={`p-3 rounded-xl border ${sub.type === "lab"
                                                        ? "bg-purple-700/20 border-purple-600/50"
                                                        : "bg-purple-800/20 border-purple-700/50"
                                                        }`}
                                                >
                                                    <div className="flex justify-between items-center">
                                                        <span className="font-medium text-white">{sub.name}</span>
                                                        <span className={`text-xs px-2 py-1 rounded-full ${sub.type === "lab"
                                                            ? "bg-red-600 text-white"
                                                            : "bg-green-600 text-white"
                                                            }`}>
                                                            {sub.type}
                                                        </span>
                                                    </div>
                                                    {sub.time && <div className="mt-1 text-sm text-purple-300">{sub.time}</div>}
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-4">
                                <p className="text-purple-200">No timetable found.</p>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-semibold"
                                >
                                    <FiEdit2 />
                                    <Link href="/timetable/create">Create Timetable</Link>
                                </motion.button>
                            </div>
                        )}
                    </motion.div>
                </div>
            </main>

            <Footer />
        </div>
    )
}

export default TimetablePage