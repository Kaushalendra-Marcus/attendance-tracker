"use client"
import { motion } from "framer-motion"
import { Navigation } from "@/components/navigation"
import Footer from "@/components/footer"

export default function PrivacyPolicy() {
    const sections = [
        {
            title: "1. Introduction",
            color: "from-green-500/20 to-emerald-500/20",
            text: "Welcome to Attendance Marker. We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our attendance-tracking application.",
        },
        {
            title: "2. Information We Collect",
            color: "from-blue-500/20 to-cyan-500/20",
            groups: [
                {
                    sub: "2.1 Personal Information",
                    list: ["Name and contact information", "Attendance records including dates and times", "Device information (for app functionality)"],
                },
                {
                    sub: "2.2 Usage Data",
                    text: "We collect information about how you interact with our application, including frequency of use, features accessed, and duration of sessions.",
                },
            ],
        },
        {
            title: "3. How We Use Your Information",
            color: "from-purple-500/20 to-indigo-500/20",
            cards: [
                { title: "Attendance Tracking", desc: "To calculate and maintain accurate attendance records between selected dates." },
                { title: "App Improvement", desc: "To analyze usage patterns and enhance application functionality." },
                { title: "Communication", desc: "To respond to inquiries and provide important application updates." },
                { title: "Security", desc: "To detect and prevent fraudulent activity and ensure system security." },
            ],
        },
        {
            title: "4. Data Security",
            color: "from-rose-500/20 to-pink-500/20",
            items: ["Encryption of sensitive data", "Secure server infrastructure", "Regular security audits", "Access controls to personal information"],
        },
        {
            title: "5. Data Retention",
            color: "from-amber-500/20 to-orange-500/20",
            text: "We retain your attendance records only for as long as necessary to provide our services and for legitimate business purposes. You may request deletion of your data at any time.",
        },
        {
            title: "6. Your Rights",
            color: "from-teal-500/20 to-emerald-500/20",
            rights: [
                { icon: "✅", text: "Right to access your personal information" },
                { icon: "✏️", text: "Right to correct inaccurate data" },
                { icon: "🗑️", text: "Right to request deletion of your data" },
            ],
        },
        {
            title: "7. Contact Us",
            color: "from-violet-500/20 to-purple-500/20",
            email: "yadavkausha4a5@gmail.com",
        },
    ]

    return (
        <div>
            <Navigation />
            <div className="min-h-screen relative overflow-hidden bg-black">
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:50px_50px]" />
                </div>
                <div className="absolute inset-0">
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black/50 to-indigo-900/20"
                        animate={{
                            background: [
                                'radial-gradient(circle at 20% 50%, rgba(120,119,198,.3) 0%, transparent 50%)',
                                'radial-gradient(circle at 80% 30%, rgba(255,119,198,.3) 0%, transparent 50%)',
                                'radial-gradient(circle at 50% 80%, rgba(120,119,255,.3) 0%, transparent 50%)',
                            ]
                        }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    />
                    <div className="absolute inset-0 bg-grid-pattern" />
                </div>


                {[...Array(30)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full"
                        initial={{
                            x: Math.random() * 100,
                            y: Math.random() * 100,
                            width: Math.random() * 3 + 1,
                            height: Math.random() * 3 + 1,
                            background: `rgba(${Math.floor(Math.random() * 100 + 155)}, ${Math.floor(Math.random() * 100 + 155)}, 255, ${Math.random() * 0.3 + 0.1})`,
                        }}
                        animate={{
                            y: [null, Math.random() * 100 - 50],
                            x: [null, Math.random() * 100 - 50],
                            opacity: [0.1, 1, 0.1],
                        }}
                        transition={{
                            duration: Math.random() * 10 + 10,
                            repeat: Infinity,
                            repeatType: "reverse",
                            ease: "easeInOut"
                        }}
                    />
                ))}



                <motion.main
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="relative z-10 max-w-6xl mx-auto px-4 py-20 sm:px-6 lg:px-8"
                >

                    <motion.div
                        className="text-center mb-20"
                        initial={{ y: -30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.7 }}
                    >
                        <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-4">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400">
                                Privacy Policy
                            </span>
                        </h1>
                        <p className="text-xl text-purple-200/80">
                            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </motion.div>


                    <div className="space-y-12">
                        {sections.map((section, index) => (
                            <motion.section
                                key={index}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="relative group"
                            >

                                <div className={`absolute inset-0 bg-gradient-to-r ${section.color} rounded-3xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />


                                <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10 group-hover:border-white/20 transition-all">
                                    <h2 className="text-3xl font-bold text-white mb-6">{section.title}</h2>


                                    {section.text && (
                                        <p className="text-purple-100/90 leading-relaxed text-lg">{section.text}</p>
                                    )}


                                    {section.groups?.map((grp, idx) => (
                                        <div key={idx} className={idx > 0 ? "mt-6" : ""}>
                                            <h3 className="text-xl font-semibold text-purple-300 mb-3">{grp.sub}</h3>
                                            {grp.list ? (
                                                <ul className="space-y-2">
                                                    {grp.list.map((li, i) => (
                                                        <motion.li
                                                            key={i}
                                                            initial={{ opacity: 0, x: -10 }}
                                                            whileInView={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: index * 0.1 + i * 0.05 }}
                                                            viewport={{ once: true }}
                                                            className="flex items-start gap-3"
                                                        >
                                                            <span className="text-purple-400 mt-1.5">•</span>
                                                            <span className="text-purple-100/80">{li}</span>
                                                        </motion.li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p className="text-purple-100/80">{grp.text}</p>
                                            )}
                                        </div>
                                    ))}


                                    {section.cards && (
                                        <div className="grid md:grid-cols-2 gap-4">
                                            {section.cards.map((card, idx) => (
                                                <motion.div
                                                    key={idx}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    whileInView={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.1 + idx * 0.05 }}
                                                    viewport={{ once: true }}
                                                    className="bg-white/5 rounded-2xl p-6 border border-white/10"
                                                >
                                                    <h4 className="font-bold text-white mb-2">{card.title}</h4>
                                                    <p className="text-purple-200/80 text-sm">{card.desc}</p>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Bullet list */}
                                    {section.items && (
                                        <ul className="space-y-2">
                                            {section.items.map((item, idx) => (
                                                <motion.li
                                                    key={idx}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    whileInView={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.1 + idx * 0.05 }}
                                                    viewport={{ once: true }}
                                                    className="flex items-start gap-3"
                                                >
                                                    <span className="text-purple-400 mt-1.5">•</span>
                                                    <span className="text-purple-100/80">{item}</span>
                                                </motion.li>
                                            ))}
                                        </ul>
                                    )}

                                    {/* Rights */}
                                    {section.rights && (
                                        <div className="space-y-3">
                                            {section.rights.map((r, idx) => (
                                                <motion.div
                                                    key={idx}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    whileInView={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.1 + idx * 0.05 }}
                                                    viewport={{ once: true }}
                                                    className="flex items-center gap-3"
                                                >
                                                    <span className="text-2xl">{r.icon}</span>
                                                    <span className="text-purple-100/90">{r.text}</span>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}


                                    {section.email && (
                                        <a
                                            href={`mailto:${section.email}`}
                                            className="inline-block bg-gradient-to-r from-purple-600/20 to-indigo-600/20 backdrop-blur-sm border border-purple-400/30 rounded-2xl px-6 py-3 text-white font-medium hover:border-purple-400/60 transition-all"
                                        >
                                            {section.email}
                                        </a>
                                    )}
                                </div>
                            </motion.section>
                        ))}
                    </div>
                </motion.main>

                <Footer />
            </div>
        </div>
    )
}