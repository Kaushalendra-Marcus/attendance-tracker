"use client"
import Link from "next/link"
import { motion } from "framer-motion"
import { useUser } from "@/app/context/useContext"
import { FiArrowRight, FiCheckCircle, FiCalendar, FiShare2, FiTrendingUp, FiSmartphone, FiShield, FiZap } from "react-icons/fi"
import { GridBackground } from "@/components/PageShared"

const features = [
    { icon: <FiCalendar />, title: "Daily Tracking", desc: "Mark attendance day-by-day with a tap. Calendar view for full history." },
    { icon: <FiTrendingUp />, title: "75% Calculator", desc: "Instantly know how many classes you can skip or need to attend." },
    { icon: <FiShare2 />, title: "Share Timetable", desc: "Copy a batchmate's timetable with one click. No manual entry." },
    { icon: <FiSmartphone />, title: "Works Offline", desc: "Install as PWA. Works without internet once loaded." },
    { icon: <FiShield />, title: "Secure", desc: "Your data is private and tied to your roll number only." },
    { icon: <FiZap />, title: "Instant Results", desc: "Real-time percentage update every time you mark attendance." },
]

const steps = [
    { num: "01", title: "Create account", desc: "Sign up with your roll number and branch in under 30 seconds." },
    { num: "02", title: "Set up timetable", desc: "Add your subjects and labs, or copy from a batchmate instantly." },
    { num: "03", title: "Mark daily", desc: "Open the app each day, tap present or absent for each subject." },
    { num: "04", title: "Track & plan", desc: "Dashboard shows percentages. Know when you can safely skip." },
]

const faqs = [
    { q: "Is it free?", a: "Yes, completely free. No ads, no premium tier." },
    { q: "Which colleges is it for?", a: "Any college with the 75% attendance rule. Works for all branches." },
    { q: "Can I use it on mobile?", a: "Yes - install it as a PWA from your browser for a native app feel." },
    { q: "What if I share my roll number?", a: "Only you know your password. Roll number alone can't log anyone in." },
]

const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08 } }
}

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.23, 1, 0.32, 1] as const } }
}

export const Hero = () => {
    const { rollNo } = useUser()

    return (
        <div className="relative overflow-hidden" style={{ background: "var(--bg-primary)" }}>
            <GridBackground />

            {/* Top indigo glow */}
            <div className="absolute inset-0 pointer-events-none"
                style={{ background: "radial-gradient(ellipse 70% 40% at 50% -5%, rgba(99,102,241,0.18), transparent)" }} />

            {/* ─── HERO ──────────────────────────────────────────── */}
            <section className="relative z-10 max-w-5xl mx-auto px-6 pt-28 pb-24 text-center">
                <motion.div variants={stagger} initial="hidden" animate="show">
                    <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-black tracking-tight text-white leading-none mb-6">
                        Never Stress About<br />
                        <span className="text-gradient">Attendance Again</span>
                    </motion.h1>

                    <motion.p variants={fadeUp} className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                        Track every subject daily, calculate how many classes you can skip, share timetables with batchmates — all in one place.
                    </motion.p>

                    <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
                        <Link href={rollNo ? "/attendance" : "/sign-up"} className="btn-primary flex items-center gap-2 text-base px-7 py-3.5">
                            Get Started Free <FiArrowRight />
                        </Link>
                        <Link href="#how-it-works" className="text-sm font-medium flex items-center gap-1.5 transition-colors"
                            style={{ color: "var(--text-secondary)" }}>
                            See how it works <FiArrowRight className="text-xs" />
                        </Link>
                    </motion.div>

                    {/* Stats row */}
                    <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-x-10 gap-y-4">
                        {[["75%", "Rule solved"], ["Subject-wise", "Tracking"], ["1-click", "Timetable copy"], ["PWA", "Works offline"]].map(([val, label]) => (
                            <div key={label} className="text-center">
                                <p className="text-2xl font-black text-white">{val}</p>
                                <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{label}</p>
                            </div>
                        ))}
                    </motion.div>
                </motion.div>
            </section>

            {/* ─── FEATURES ─────────────────────────────────────── */}
            <section className="relative z-10 max-w-5xl mx-auto px-6 pb-24">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-black text-white">Everything you need</h2>
                    <p className="mt-3 text-sm" style={{ color: "var(--text-secondary)" }}>Built around the real problems students face with attendance</p>
                </motion.div>

                <motion.div
                    variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
                >
                    {features.map((f, i) => (
                        <motion.div key={i} variants={fadeUp} className="card card-hover p-5">
                            <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-4 text-indigo-400"
                                style={{ background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.2)" }}>
                                {f.icon}
                            </div>
                            <p className="font-bold text-white text-sm mb-1">{f.title}</p>
                            <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{f.desc}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* ─── HOW IT WORKS ─────────────────────────────────── */}
            <section id="how-it-works" className="relative z-10 py-24"
                style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", background: "rgba(255,255,255,0.015)" }}>
                <div className="max-w-5xl mx-auto px-6">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
                        <h2 className="text-3xl md:text-4xl font-black text-white">Up and running in minutes</h2>
                        <p className="mt-3 text-sm" style={{ color: "var(--text-secondary)" }}>No setup headaches. Just four simple steps.</p>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        {steps.map((s, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.5 }}
                                className="relative"
                            >
                                {/* connector line */}
                                {i < steps.length - 1 && (
                                    <div className="hidden md:block absolute top-5 left-full w-full h-px z-0"
                                        style={{ background: "linear-gradient(to right, var(--border), transparent)" }} />
                                )}
                                <div className="relative z-10">
                                    <span className="text-4xl font-black" style={{ color: "rgba(99,102,241,0.25)" }}>{s.num}</span>
                                    <p className="font-bold text-white text-sm mt-2 mb-1">{s.title}</p>
                                    <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{s.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── CHECKLIST SECTION ────────────────────────────── */}
            <section className="relative z-10 max-w-3xl mx-auto px-6 py-24 text-center">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
                    <h2 className="text-3xl md:text-4xl font-black text-white">One app, all covered</h2>
                </motion.div>
                <motion.div
                    variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left"
                >
                    {[
                        "Mark present/absent per subject every day",
                        "See live percentage for each subject",
                        "Know exactly how many classes to skip or attend",
                        "Share or copy timetable with one click",
                        "Works for subjects + labs separately",
                        "Filter attendance by custom date range",
                        "Install on phone, works offline",
                        "No app store needed — runs in browser",
                    ].map((item, i) => (
                        <motion.div key={i} variants={fadeUp}
                            className="flex items-start gap-2.5 card p-3.5 text-sm"
                            style={{ color: "var(--text-secondary)" }}>
                            <FiCheckCircle className="text-indigo-400 mt-0.5 shrink-0" />
                            {item}
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* ─── FAQ ──────────────────────────────────────────── */}
            <section className="relative z-10 py-24"
                style={{ borderTop: "1px solid var(--border)", background: "rgba(255,255,255,0.015)" }}>
                <div className="max-w-2xl mx-auto px-6">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
                        <h2 className="text-3xl font-black text-white">Quick answers</h2>
                    </motion.div>
                    <div className="space-y-3">
                        {faqs.map((faq, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.08 }}
                                className="card p-5"
                            >
                                <p className="font-bold text-white text-sm mb-1">{faq.q}</p>
                                <p className="text-sm" style={{ color: "var(--text-muted)" }}>{faq.a}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── CTA BANNER ───────────────────────────────────── */}
            <section className="relative z-10 max-w-3xl mx-auto px-6 py-24 text-center">
                <motion.div initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
                    <div className="card p-10"
                        style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.12), rgba(59,130,246,0.08))" }}>
                        <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
                            Stop guessing.<br />Start tracking.
                        </h2>
                        <p className="text-sm mb-8" style={{ color: "var(--text-secondary)" }}>
                            Takes 2 minutes to set up. Your attendance worries end today.
                        </p>
                        <Link href={rollNo ? "/attendance" : "/sign-up"} className="btn-primary inline-flex items-center gap-2 px-8 py-3.5 text-base">
                            {rollNo ? "Go to Attendance" : "Create Free Account"}
                            <FiArrowRight />
                        </Link>
                    </div>
                </motion.div>
            </section>
        </div>
    )
}