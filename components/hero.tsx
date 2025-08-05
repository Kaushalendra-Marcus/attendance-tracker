"use client"
import Link from "next/link"
import { motion } from "framer-motion"
import { useUser } from "@/app/context/useContext"
import { useState, useRef } from "react"

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

    const containerRef = useRef<HTMLDivElement>(null)


    return (
        <div 
            ref={containerRef}
            className="relative min-h-screen overflow-hidden bg-black"
        >
            
            <div className="absolute inset-0">
                <motion.div
                    className="absolute inset-0"
                    animate={{
                        background: [
                            'radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%)',
                            'radial-gradient(circle at 80% 50%, rgba(255, 119, 198, 0.3) 0%, transparent 50%)',
                            'radial-gradient(circle at 50% 20%, rgba(120, 119, 255, 0.3) 0%, transparent 50%)',
                        ]
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "linear"
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black/50 to-indigo-900/20" />
            </div>

            {/* Grid overlay */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:50px_50px]" />
            </div>

            {[...Array(50)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute rounded-full"
                    initial={{
                        x: Math.random() * 100,
                        y: Math.random() * 100,
                        width: Math.random() * 4 + 1,
                        height: Math.random() * 4 + 1,
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

            
            <motion.div 
                style={{ 
                    perspective: 1000,
                    transformStyle: "preserve-3d"
                }}
                className="relative z-10 flex items-center justify-center min-h-screen"
            >
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                        className="relative"
                    >
                        
                        <motion.div
                            className="absolute -top-20 -left-20 w-40 h-40 bg-purple-500/30 rounded-full blur-3xl"
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.3, 0.6, 0.3],
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />
                        <motion.div
                            className="absolute -bottom-20 -right-20 w-40 h-40 bg-indigo-500/30 rounded-full blur-3xl "
                            animate={{
                                scale: [1.2, 1, 1.2],
                                opacity: [0.6, 0.3, 0.6],
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />

                        <h1 className="text-5xl md:text-7xl lg:text-8xl my-20 font-black tracking-tighter text-white relative z-10">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400">
                                Take Control
                            </span>
                            <br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                                of Your Attendance
                            </span>
                        </h1>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="mt-8 text-xl md:text-2xl text-purple-200/80 max-w-3xl mx-auto leading-relaxed"
                    >
                        Never fall short of your 75% criteria again with our intuitive tracking system designed for students.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6"
                    >
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="relative group"
                        >
                            <Link
                                href={rollNo ? "/attendance" : "/sign-in"}
                                className="relative block px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full text-white font-bold text-lg shadow-2xl shadow-purple-500/25 transition-all duration-300 group-hover:shadow-purple-500/50"
                            >
                                <span className="relative z-10">Get Started</span>
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                />
                            </Link>
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link
                                href="/about-us"
                                className="text-purple-200 hover:text-white font-semibold text-lg flex items-center gap-2 transition-colors duration-300"
                            >
                                Learn more 
                                <motion.span
                                    animate={{ x: [0, 5, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                    →
                                </motion.span>
                            </Link>
                        </motion.div>
                    </motion.div>

                
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                        className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto"
                    >
                        {displayStats.map((stat, index) => (
                            <motion.div
                                key={stat.name}
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 + index * 0.1 }}
                                whileHover={{ 
                                    y: -10,
                                    scale: 1.05,
                                    transition: { type: "spring", stiffness: 300 }
                                }}
                                className="relative group"
                            >
                                <div className="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 overflow-hidden mb-10">
                                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    
                                    <div className="relative z-10">
                                        <p className="text-sm font-medium text-purple-300">{stat.name}</p>
                                        <p className="mt-2 text-2xl lg:text-3xl font-black text-white">{stat.value}</p>
                                    </div>

                                    
                                    <motion.div
                                        className="absolute inset-0 border-2 border-purple-400 rounded-2xl"
                                        initial={{ opacity: 0, scale: 1.1 }}
                                        whileHover={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                </div>

                                
                                <motion.div
                                    className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                                />
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </motion.div>

            
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
        </div>
    )
}