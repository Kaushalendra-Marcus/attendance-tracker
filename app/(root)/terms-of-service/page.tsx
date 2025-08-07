"use client"
import { motion } from "framer-motion"
import { Navigation } from "@/components/navigation"
import Footer from "@/components/footer"

export default function TermsOfService() {
  const sections = [
    { title: "1. Acceptance of Terms", color: "from-purple-500/20 to-indigo-500/20", text: "By accessing or using the Attendance Marker application, you agree to be bound by these Terms of Service. If you do not agree to all the terms, you may not use our service." },
    { title: "2. Service Description", color: "from-emerald-500/20 to-teal-500/20", text: "Attendance Marker is a digital solution designed to track and calculate attendance between specified dates. The service provides analytics and reporting features for attendance management." },
    { title: "3. User Responsibilities", color: "from-amber-500/20 to-orange-500/20", items: ["Account Security: You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.", "Data Accuracy: You must ensure all attendance data entered is accurate and complies with applicable laws."] },
    { title: "4. Prohibited Conduct", color: "from-rose-500/20 to-red-500/20", items: ["Using the service for illegal purposes", "Attempting to compromise system security", "Misrepresenting attendance data", "Sharing accounts with unauthorized users"] },
    { title: "5. Intellectual Property", color: "from-violet-500/20 to-purple-500/20", text: "All content, features, and functionality of Attendance Marker are the exclusive property of our company and are protected by international copyright, trademark, and other intellectual property laws." },
    { title: "6. Limitation of Liability", color: "from-fuchsia-500/20 to-pink-500/20", text: "Attendance Marker shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service." },
    { title: "7. Modifications", color: "from-cyan-500/20 to-blue-500/20", text: "We reserve the right to modify these terms at any time. Continued use after changes constitutes acceptance of the modified terms." },
    { title: "8. Governing Law", color: "from-sky-500/20 to-indigo-500/20", text: "These terms shall be governed by the laws of the jurisdiction where our company is registered, without regard to its conflict of law provisions." },
  ]

  return (
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

      {/* Floating particles */}
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

      <Navigation />

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-5xl mx-auto px-4 py-20 sm:px-6 lg:px-8"
      >
        {/* Hero */}
        <motion.div
          className="text-center mb-20"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400">
              Terms of Service
            </span>
          </h1>
          <p className="text-xl text-purple-200/80">
            Effective: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </motion.div>

        {/* Content */}
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
              {/* Glow on hover */}
              <div className={`absolute inset-0 bg-gradient-to-r ${section.color} rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />

              <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-10 group-hover:border-white/20 transition-all">
                <h2 className="text-3xl font-bold text-white mb-6">{section.title}</h2>

                {section.items ? (
                  <ul className="space-y-3">
                    {section.items.map((item, idx) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + idx * 0.05 }}
                        viewport={{ once: true }}
                        className="flex items-start gap-3"
                      >
                        <span className="text-purple-400 mt-1">•</span>
                        <span className="text-purple-100/90 leading-relaxed">{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-purple-100/90 leading-relaxed text-lg">
                    {section.text}
                  </p>
                )}
              </div>
            </motion.section>
          ))}
        </div>
      </motion.main>

      <Footer />
    </div>
  )
}