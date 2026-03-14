"use client"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"

type Particle = {
    x: number; y: number; w: number; h: number
    opacity: number; dur: number; dy: number; dx: number
}

export const ParticleBackground = ({ count = 40 }: { count?: number }) => {
    const [particles, setParticles] = useState<Particle[]>([])

    useEffect(() => {
        setParticles(Array.from({ length: count }, () => ({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            w: Math.random() * 3 + 1,
            h: Math.random() * 3 + 1,
            opacity: Math.random() * 0.3 + 0.05,
            dur: Math.random() * 20 + 15,
            dy: Math.random() * 150 - 75,
            dx: Math.random() * 150 - 75,
        })))
    }, [count])

    return (
        <>
            {particles.map((p, i) => (
                <motion.div
                    key={i}
                    className="absolute rounded-full bg-indigo-400 pointer-events-none"
                    style={{ left: p.x, top: p.y, width: p.w, height: p.h }}
                    animate={{ y: [0, p.dy, 0], x: [0, p.dx, 0], opacity: [p.opacity, p.opacity * 4, p.opacity] }}
                    transition={{ duration: p.dur, repeat: Infinity, ease: "easeInOut" }}
                />
            ))}
        </>
    )
}

export const LoadingScreen = () => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center"
        style={{ background: "var(--bg-primary)" }}
    >
        <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="w-10 h-10 rounded-full border-2 border-indigo-500 border-t-transparent mb-4"
        />
        <p style={{ color: "var(--text-secondary)" }} className="text-sm">Loading...</p>
    </motion.div>
)

export const GridBackground = () => (
    <div className="absolute inset-0 grid-bg pointer-events-none" />
)
