"use client"
import { useState, ChangeEvent } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FiSend, FiPaperclip, FiX, FiCheck, FiAlertCircle } from "react-icons/fi"
import { GridBackground } from "@/components/PageShared"

export default function FeedbackPage() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [feedback, setFeedback] = useState("")
    const [file, setFile] = useState<File | null>(null)
    const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle")
    const [message, setMessage] = useState("")

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFile(e.target.files?.[0] || null)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setStatus("sending")
        setMessage("")

        try {
            const formData = new FormData()
            formData.append("name", name)
            formData.append("email", email)
            formData.append("feedback", feedback)
            if (file) formData.append("file", file)

            const res = await fetch("/api/feedback", { method: "POST", body: formData })
            const data = await res.json()

            if (res.ok) {
                setStatus("success")
                setMessage(data.message || "Thank you for your feedback!")
                setName(""); setEmail(""); setFeedback(""); setFile(null)
            } else {
                setStatus("error")
                setMessage(data.message || "Something went wrong. Please try again.")
            }
        } catch {
            setStatus("error")
            setMessage("Failed to send feedback. Check your connection.")
        }
    }

    const inputStyle = {
        background: "var(--bg-secondary)",
        border: "1px solid var(--border)",
        color: "var(--text-primary)",
    }

    return (
        <div style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>
            <div className="relative overflow-hidden">
                <GridBackground />

                <main className="relative z-10 max-w-lg mx-auto px-4 py-12">
                    <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
                        <h1 className="text-3xl font-black text-white">Share Feedback</h1>
                        <p className="text-sm mt-2" style={{ color: "var(--text-secondary)" }}>
                            Your suggestions help shape future updates
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="card p-6"
                    >
                        <AnimatePresence mode="wait">
                            {status === "success" ? (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="py-10 text-center"
                                >
                                    <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                                        style={{ background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)" }}>
                                        <FiCheck className="text-2xl text-emerald-400" />
                                    </div>
                                    <p className="text-white font-semibold text-lg">Feedback Sent!</p>
                                    <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>{message}</p>
                                    <button
                                        onClick={() => setStatus("idle")}
                                        className="mt-6 text-sm px-4 py-2 rounded-lg transition-all"
                                        style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}
                                    >
                                        Send another
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.form
                                    key="form"
                                    onSubmit={handleSubmit}
                                    className="space-y-5"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>Name</label>
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={e => setName(e.target.value)}
                                                placeholder="Your name"
                                                required
                                                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                                                style={inputStyle}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>Email</label>
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={e => setEmail(e.target.value)}
                                                placeholder="you@gmail.com"
                                                required
                                                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                                                style={inputStyle}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>Feedback</label>
                                        <textarea
                                            rows={5}
                                            value={feedback}
                                            onChange={e => setFeedback(e.target.value)}
                                            placeholder="What features would you love to see? Any bugs to report? Tell us anything..."
                                            required
                                            className="w-full px-3 py-2.5 rounded-lg text-sm outline-none resize-none"
                                            style={inputStyle}
                                        />
                                        <p className="text-xs mt-1 text-right" style={{ color: "var(--text-muted)" }}>
                                            {feedback.length} chars
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>
                                            Attachment <span style={{ fontWeight: 400 }}>(optional)</span>
                                        </label>
                                        {file ? (
                                            <div className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm"
                                                style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)" }}>
                                                <span className="text-indigo-300 truncate max-w-[80%] text-sm">{file.name}</span>
                                                <button type="button" onClick={() => setFile(null)}>
                                                    <FiX className="text-red-400 hover:text-red-300" />
                                                </button>
                                            </div>
                                        ) : (
                                            <label className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm cursor-pointer transition-all hover:opacity-80"
                                                style={{ ...inputStyle, color: "var(--text-muted)" }}>
                                                <FiPaperclip style={{ color: "var(--accent-indigo)" }} />
                                                Choose a file
                                                <input type="file" onChange={handleFileChange} className="hidden" />
                                            </label>
                                        )}
                                    </div>

                                    <AnimatePresence>
                                        {status === "error" && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0 }}
                                                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm"
                                                style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#fca5a5" }}
                                            >
                                                <FiAlertCircle />
                                                {message}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <button
                                        type="submit"
                                        disabled={status === "sending"}
                                        className="btn-primary w-full flex items-center justify-center gap-2 py-3 disabled:opacity-60 disabled:cursor-not-allowed"
                                    >
                                        {status === "sending" ? (
                                            <motion.span
                                                animate={{ rotate: 360 }}
                                                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                                className="inline-block"
                                            >↻</motion.span>
                                        ) : (
                                            <><FiSend /> Submit Feedback</>
                                        )}
                                    </button>
                                </motion.form>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </main>
            </div>
        </div>
    )
}
