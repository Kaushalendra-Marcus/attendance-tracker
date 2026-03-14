"use client"
import { FiAlertCircle, FiTool, FiUser, FiSlash, FiLock, FiShield, FiRefreshCw, FiBook } from "react-icons/fi"
import { GridBackground } from "@/components/PageShared"
import Footer from "@/components/footer"
import { Navigation } from "@/components/navigation"

const sections = [
    {
        icon: <FiAlertCircle size={15} className="text-indigo-400" />,
        iconBg: "rgba(99,102,241,0.12)", iconBorder: "rgba(99,102,241,0.25)",
        title: "1. Acceptance of Terms",
        text: "By accessing or using MyAttendance, you agree to be bound by these Terms of Service. If you do not agree to all the terms, you may not use our service."
    },
    {
        icon: <FiTool size={15} className="text-blue-400" />,
        iconBg: "rgba(59,130,246,0.12)", iconBorder: "rgba(59,130,246,0.25)",
        title: "2. Service Description",
        text: "MyAttendance is a digital tool designed to track and calculate attendance between specified dates, providing subject-wise analytics and percentage reporting."
    },
    {
        icon: <FiUser size={15} className="text-emerald-400" />,
        iconBg: "rgba(34,197,94,0.12)", iconBorder: "rgba(34,197,94,0.25)",
        title: "3. User Responsibilities",
        items: [
            "Account Security — You are responsible for maintaining confidentiality of your credentials and all activity under your account.",
            "Data Accuracy — Ensure all attendance data entered is accurate and complies with applicable rules."
        ]
    },
    {
        icon: <FiSlash size={15} className="text-red-400" />,
        iconBg: "rgba(239,68,68,0.12)", iconBorder: "rgba(239,68,68,0.25)",
        title: "4. Prohibited Conduct",
        items: [
            "Using the service for illegal purposes",
            "Attempting to compromise system security",
            "Misrepresenting attendance data",
            "Sharing accounts with unauthorised users"
        ]
    },
    {
        icon: <FiLock size={15} className="text-amber-400" />,
        iconBg: "rgba(245,158,11,0.12)", iconBorder: "rgba(245,158,11,0.25)",
        title: "5. Intellectual Property",
        text: "All content, features, and functionality of MyAttendance are the exclusive property of our team and are protected by applicable intellectual property laws."
    },
    {
        icon: <FiShield size={15} className="text-indigo-400" />,
        iconBg: "rgba(99,102,241,0.12)", iconBorder: "rgba(99,102,241,0.25)",
        title: "6. Limitation of Liability",
        text: "MyAttendance shall not be liable for any indirect, incidental, or consequential damages resulting from your use of or inability to use the service."
    },
    {
        icon: <FiRefreshCw size={15} className="text-blue-400" />,
        iconBg: "rgba(59,130,246,0.12)", iconBorder: "rgba(59,130,246,0.25)",
        title: "7. Modifications",
        text: "We reserve the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of the updated terms."
    },
    {
        icon: <FiBook size={15} className="text-indigo-400" />,
        iconBg: "rgba(99,102,241,0.12)", iconBorder: "rgba(99,102,241,0.25)",
        title: "8. Governing Law",
        text: "These terms shall be governed by the laws of the jurisdiction where our team is based, without regard to conflict of law provisions."
    },
]

export default function TermsOfService() {
    const effectiveDate = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })

    return (
        <div style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>
            <Navigation />
            <div className="relative overflow-hidden">
                <GridBackground />

                <main className="relative z-10 max-w-3xl mx-auto px-5 py-16">

                    <div className="mb-14">
                        <h1 className="text-4xl md:text-5xl font-black text-white mb-3">Terms of Service</h1>
                        <p className="text-sm" style={{ color: "var(--text-muted)" }}>Effective: {effectiveDate}</p>
                    </div>

                    <div className="space-y-4">
                        {sections.map((s, i) => (
                            <section key={i} className="card p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                                        style={{ background: s.iconBg, border: `1px solid ${s.iconBorder}` }}>
                                        {s.icon}
                                    </div>
                                    <h2 className="text-base font-bold text-white">{s.title}</h2>
                                </div>

                                {s.text && (
                                    <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{s.text}</p>
                                )}

                                {s.items && (
                                    <ul className="space-y-2">
                                        {s.items.map((item, idx) => (
                                            <li key={idx} className="flex items-start gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                                                <span className="mt-1.5 w-1 h-1 rounded-full shrink-0 bg-indigo-400" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </section>
                        ))}
                    </div>
                </main>
            </div>
            <Footer />
        </div>
    )
}