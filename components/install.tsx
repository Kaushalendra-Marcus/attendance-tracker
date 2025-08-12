"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface BeforeInstallPromptEvent extends Event {
    readonly platforms: string[]
    readonly userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>
    prompt(): Promise<void>
}

export default function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
    const [show, setShow] = useState(false)

    useEffect(() => {
        const handler = (e: Event) => {
            const promptEvent = e as BeforeInstallPromptEvent
            e.preventDefault?.()
            setDeferredPrompt(promptEvent)
            setShow(true)
        }
        window.addEventListener("beforeinstallprompt", handler)
        return () => window.removeEventListener("beforeinstallprompt", handler)
    }, [])

    const handleInstall = async () => {
        if (!deferredPrompt) return
        await deferredPrompt.prompt()
        const { outcome } = await deferredPrompt.userChoice
        if (outcome === "accepted") {
            console.log("PWA installed ✨")
        }
        setShow(false)
    }


    useEffect(() => {
        if (show) {
            const t = setTimeout(() => setShow(false), 10000)
            return () => clearTimeout(t)
        }
    }, [show])

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0, y: 100, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 100, scale: 0.8 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className="fixed bottom-4 right-4 z-50"
                >

                    <div className="absolute inset-0 rounded-2xl overflow-hidden">
                        {[...Array(5)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute rounded-full bg-purple-300/20"
                                initial={{ x: Math.random() * 100, y: Math.random() * 100 }}
                                animate={{
                                    x: [null, Math.random() * 60 - 30],
                                    y: [null, Math.random() * 60 - 30],
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
                    </div>

                    <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-5 w-72 shadow-2xl shadow-purple-500/30">
                        <motion.button
                            onClick={() => setShow(false)}
                            whileHover={{ rotate: 90, scale: 1.1 }}
                            className="absolute top-3 right-3 text-white/60 hover:text-white transition"
                        >
                            ✖
                        </motion.button>

                        <h3 className="text-white font-bold mb-1">Install MyAttendance</h3>
                        <p className="text-purple-200 text-sm mb-3">Get App in your mobile</p>
                        <button
                            onClick={handleInstall}
                            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold px-4 py-2 rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all"
                        >
                            Install Now
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}