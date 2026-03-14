"use client"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FiDownload, FiX } from "react-icons/fi"

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
            e.preventDefault()
            setDeferredPrompt(e as BeforeInstallPromptEvent)
            setShow(true)
        }
        window.addEventListener("beforeinstallprompt", handler)
        return () => window.removeEventListener("beforeinstallprompt", handler)
    }, [])

    useEffect(() => {
        if (!show) return
        const t = setTimeout(() => setShow(false), 12000)
        return () => clearTimeout(t)
    }, [show])

    const handleInstall = async () => {
        if (!deferredPrompt) return
        await deferredPrompt.prompt()
        const { outcome } = await deferredPrompt.userChoice
        if (outcome === "accepted") setDeferredPrompt(null)
        setShow(false)
    }

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0, y: 80 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 80 }}
                    transition={{ type: "spring", stiffness: 350, damping: 28 }}
                    className="fixed bottom-5 right-5 z-50 w-72"
                >
                    <div
                        className="rounded-2xl p-5 shadow-2xl"
                        style={{
                            background: "var(--bg-secondary)",
                            border: "1px solid var(--border)",
                            boxShadow: "0 8px 32px rgba(99,102,241,0.15)"
                        }}
                    >
                        {/* Close */}
                        <motion.button
                            onClick={() => setShow(false)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="absolute top-3 right-3 p-1 rounded-full transition-colors"
                            style={{ color: "var(--text-muted)" }}
                        >
                            <FiX size={16} />
                        </motion.button>

                        {/* Icon */}
                        <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                            style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)" }}
                        >
                            <FiDownload className="text-indigo-400" size={18} />
                        </div>

                        <p className="font-bold text-white text-sm mb-0.5">Install MyAttendance</p>
                        <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>
                            Add to home screen for quick access
                        </p>

                        <div className="flex gap-2">
                            <button
                                onClick={() => setShow(false)}
                                className="flex-1 py-2 rounded-xl text-xs font-medium transition-all"
                                style={{
                                    background: "var(--bg-primary)",
                                    border: "1px solid var(--border)",
                                    color: "var(--text-muted)"
                                }}
                            >
                                Not now
                            </button>
                            <button
                                onClick={handleInstall}
                                className="btn-primary flex-1 py-2 rounded-xl text-xs font-semibold"
                            >
                                Install
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
