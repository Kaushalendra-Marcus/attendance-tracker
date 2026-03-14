"use client"
import { FiCheck, FiEdit, FiTrash2, FiMail, FiLock, FiDatabase, FiShield, FiInfo } from "react-icons/fi"
import { GridBackground } from "@/components/PageShared"
import Footer from "@/components/footer"
import { Navigation } from "@/components/navigation"



export default function PrivacyPolicy() {
    const lastUpdated = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })

    return (
        <div style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>
            <Navigation />
            <div className="relative overflow-hidden">
                <GridBackground />

                <main className="relative z-10 max-w-3xl mx-auto px-5 py-16">

                    {/* Header */}
                    <div className="mb-14">
                        <h1 className="text-4xl md:text-5xl font-black text-white mb-3">Privacy Policy</h1>
                        <p className="text-sm" style={{ color: "var(--text-muted)" }}>Last updated: {lastUpdated}</p>
                    </div>

                    <div className="space-y-10">

                        {/* 1. Introduction */}
                        <section className="card p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                                    style={{ background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.25)" }}>
                                    <FiInfo size={15} className="text-indigo-400" />
                                </div>
                                <h2 className="text-lg font-bold text-white">1. Introduction</h2>
                            </div>
                            <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                                Welcome to MyAttendance. We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you use our attendance-tracking application.
                            </p>
                        </section>

                        {/* 2. Information We Collect */}
                        <section className="card p-6">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                                    style={{ background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.25)" }}>
                                    <FiDatabase size={15} className="text-blue-400" />
                                </div>
                                <h2 className="text-lg font-bold text-white">2. Information We Collect</h2>
                            </div>

                            <div className="space-y-5">
                                <div>
                                    <p className="text-sm font-semibold text-white mb-2">Personal Information</p>
                                    <ul className="space-y-1.5">
                                        {["Name and roll number", "Branch and academic year", "Attendance records with dates"].map((item, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                                                <span className="mt-1.5 w-1 h-1 rounded-full shrink-0 bg-indigo-400" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div style={{ borderTop: "1px solid var(--border)" }} className="pt-4">
                                    <p className="text-sm font-semibold text-white mb-2">Usage Data</p>
                                    <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                                        We collect information about how you interact with the app, including which features you use and session frequency — solely to improve the experience.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* 3. How We Use Your Information */}
                        <section className="card p-6">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                                    style={{ background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.25)" }}>
                                    <FiShield size={15} className="text-indigo-400" />
                                </div>
                                <h2 className="text-lg font-bold text-white">3. How We Use Your Information</h2>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {[
                                    { title: "Attendance Tracking", desc: "Calculate and maintain accurate records between your selected dates." },
                                    { title: "App Improvement", desc: "Analyse usage patterns and enhance application functionality." },
                                    { title: "Communication", desc: "Respond to support inquiries and send important updates." },
                                    { title: "Security", desc: "Detect and prevent unauthorised access and fraudulent activity." },
                                ].map((c, i) => (
                                    <div key={i} className="rounded-xl p-4"
                                        style={{ background: "var(--bg-primary)", border: "1px solid var(--border)" }}>
                                        <p className="text-sm font-semibold text-white mb-1">{c.title}</p>
                                        <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{c.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* 4. Data Security */}
                        <section className="card p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                                    style={{ background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.25)" }}>
                                    <FiLock size={15} className="text-emerald-400" />
                                </div>
                                <h2 className="text-lg font-bold text-white">4. Data Security</h2>
                            </div>
                            <ul className="space-y-2">
                                {["Encryption of sensitive data in transit and at rest", "Secure server infrastructure with regular audits", "Strict access controls to personal information", "Passwords are hashed and never stored in plain text"].map((item, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                                        <FiCheck size={13} className="text-emerald-400 mt-0.5 shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </section>

                        {/* 5. Data Retention */}
                        <section className="card p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                                    style={{ background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.25)" }}>
                                    <FiDatabase size={15} className="text-amber-400" />
                                </div>
                                <h2 className="text-lg font-bold text-white">5. Data Retention</h2>
                            </div>
                            <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                                We retain your attendance records only for as long as necessary to provide our services. You may request deletion of your data at any time by contacting us at the email below.
                            </p>
                        </section>

                        {/* 6. Your Rights */}
                        <section className="card p-6">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                                    style={{ background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.25)" }}>
                                    <FiShield size={15} className="text-indigo-400" />
                                </div>
                                <h2 className="text-lg font-bold text-white">6. Your Rights</h2>
                            </div>
                            <div className="space-y-3">
                                {[
                                    { icon: <FiCheck size={14} className="text-emerald-400" />, text: "Right to access your personal information" },
                                    { icon: <FiEdit size={14} className="text-blue-400" />, text: "Right to correct inaccurate or outdated data" },
                                    { icon: <FiTrash2 size={14} className="text-red-400" />, text: "Right to request deletion of your account and data" },
                                ].map((r, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl text-sm"
                                        style={{ background: "var(--bg-primary)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}>
                                        <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                                            style={{ background: "var(--bg-secondary)" }}>
                                            {r.icon}
                                        </div>
                                        {r.text}
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* 7. Contact */}
                        <section className="card p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                                    style={{ background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.25)" }}>
                                    <FiMail size={15} className="text-indigo-400" />
                                </div>
                                <h2 className="text-lg font-bold text-white">7. Contact Us</h2>
                            </div>
                            <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
                                Questions about this policy? Reach out anytime.
                            </p>
                            <a
                                href="mailto:yadavkausha4a5@gmail.com"
                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
                                style={{
                                    background: "rgba(99,102,241,0.12)",
                                    border: "1px solid rgba(99,102,241,0.3)",
                                    color: "#a5b4fc"
                                }}
                            >
                                <FiMail size={14} />
                                yadavkausha4a5@gmail.com
                            </a>
                        </section>

                    </div>
                </main>
            </div>
            <Footer />
        </div>
    )
}