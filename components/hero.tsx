"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { useUser } from "@/app/context/useContext"

interface StatItem {
    name: string
    value: string
}

interface HeroProps {
    stats?: StatItem[]
}

export const Hero = ({ stats = [] }: HeroProps) => {
    const defaultStats = [
        { name: 'Total Users', value: '4000+' },
        { name: 'Active Today', value: '789' },
        { name: 'Trust Score', value: '4.8/5' },
        { name: 'Accuracy', value: '98.5%' },
    ]
    const { rollNo } = useUser()
    const displayStats = stats.length > 0 ? stats : defaultStats

    return (
        <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/60 via-purple-700/60 to-purple-500/60 -z-10" />

            <div className="max-w-7xl mx-auto px-6 py-24 sm:py-32 lg:px-8 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mx-auto max-w-3xl"
                >
                    <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
                        Take Control of Your <span className="text-purple-300">Attendance</span>
                    </h1>
                    <p className="mt-6 text-lg leading-8 text-purple-100 max-w-2xl mx-auto">
                        Never fall short of your 75% criteria again with our intuitive tracking system designed for students.
                    </p>
                    <div className="mt-10 flex items-center justify-center gap-x-6">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link href={rollNo ? "/attendance" : "/sign-in"}
                                className="rounded-md bg-white px-6 py-3 text-sm font-semibold text-purple-600 shadow-sm hover:bg-purple-50 transition-colors"
                            >
                                Get Started
                            </Link>


                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link
                                href="/features"
                                className="text-sm font-semibold leading-6 text-white"
                            >
                                Learn more <span aria-hidden="true">→</span>
                            </Link>
                        </motion.div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="mx-auto mt-16 max-w-7xl px-6 lg:px-8"
                >
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {displayStats.map((stat, index) => (
                            <motion.div
                                key={stat.name}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + index * 0.1 }}
                                className="bg-purple-800/30 backdrop-blur-sm border border-purple-700/50 rounded-xl p-6 text-center"
                            >
                                <p className="text-sm font-medium text-purple-200">{stat.name}</p>
                                <p className="mt-2 text-3xl font-semibold text-white">{stat.value}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    )
}