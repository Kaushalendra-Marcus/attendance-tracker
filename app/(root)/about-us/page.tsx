"use client"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { FaStar } from "react-icons/fa"
import { FiArrowRight, FiCalendar, FiCheckSquare, FiPieChart } from "react-icons/fi"
import { Navigation } from "@/components/navigation"
import Footer from "@/components/footer"
import { GridBackground } from "@/components/PageShared"

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, delay, ease: [0.23, 1, 0.32, 1] as const },
})

const steps = [
  {
    icon: FiArrowRight,
    title: "Sign In",
    desc: "Create your account with roll number and college. Takes under 30 seconds.",
    num: "01",
  },
  {
    icon: FiCalendar,
    title: "Create Timetable",
    desc: "Add all your subjects and labs, then assign them to each day of the week.",
    num: "02",
  },
  {
    icon: FiCheckSquare,
    title: "Mark Attendance",
    desc: "Each day, tap present or absent for each subject. One tap per subject.",
    num: "03",
  },
  {
    icon: FiPieChart,
    title: "Track Percentage",
    desc: "Dashboard shows live percentages. Know exactly when you can safely skip.",
    num: "04",
  },
]

const features = [
  { title: "75% Rule Calculator", desc: "Instantly see how many classes you can skip or need to attend to stay safe." },
  { title: "Subject-wise Tracking", desc: "Separate attendance for each subject and lab — no averaging across the board." },
  { title: "Share Timetable", desc: "Copy a batchmate's timetable with one click. No manual entry needed." },
  { title: "Works Offline", desc: "Install as a PWA and use it without internet once loaded on your device." },
  { title: "Custom Date Range", desc: "Filter your attendance history by any date range from the dashboard." },
  { title: "Zero Cost", desc: "Completely free. No ads, no premium tier, no credit card ever." },
]

export default function AboutPage() {
  const [rating,    setRating]    = useState(0)
  const [hover,     setHover]     = useState(0)
  const [name,      setName]      = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [focused,   setFocused]   = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!rating) return
    setSubmitted(true)
  }

  return (
    <div style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>
      <Navigation />

      <div className="relative overflow-hidden">
        <GridBackground />

        {/* Top glow */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 70% 35% at 50% 0%, rgba(99,102,241,0.15), transparent)" }} />

        <main className="relative z-10 max-w-5xl mx-auto px-4 py-20 sm:px-6">

          {/* ── Hero ─────────────────────────────────────────── */}
          <motion.section className="text-center mb-24" {...fadeUp(0)}>
            <motion.p
              className="text-xs font-bold tracking-[0.22em] uppercase mb-4"
              style={{ color: "rgba(99,102,241,0.8)" }}
              {...fadeUp(0.05)}>
              About MyAttendance
            </motion.p>
            <motion.h1
              className="text-4xl md:text-6xl font-black tracking-tight text-white mb-6"
              style={{ letterSpacing: "-0.04em" }}
              {...fadeUp(0.1)}>
              Built for students,<br />
              <span style={{
                background: "linear-gradient(135deg, #6366F1 0%, #3B82F6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                by a student.
              </span>
            </motion.h1>
            <motion.p
              className="text-lg max-w-2xl mx-auto leading-relaxed"
              style={{ color: "rgba(148,163,184,0.75)" }}
              {...fadeUp(0.15)}>
              MyAttendance removes the mental load of tracking attendance manually.
              Know your percentage in real time, plan your bunks smartly, and never
              stress about the 75% rule again.
            </motion.p>
          </motion.section>

          {/* ── How to use ───────────────────────────────────── */}
          <section className="mb-24">
            <motion.div className="text-center mb-14" {...fadeUp(0)}>
              <h2 className="text-3xl md:text-4xl font-black text-white" style={{ letterSpacing: "-0.03em" }}>
                How it works
              </h2>
              <p className="mt-3 text-sm" style={{ color: "rgba(148,163,184,0.6)" }}>
                Up and running in under 2 minutes
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {steps.map((s, i) => (
                <motion.div key={s.num} {...fadeUp(i * 0.08)}
                  className="relative p-5 rounded-2xl group"
                  style={{
                    background: "rgba(255,255,255,0.015)",
                    border: "1px solid rgba(99,102,241,0.15)",
                  }}>
                  {/* Number */}
                  <span className="text-4xl font-black mb-3 block"
                    style={{ color: "rgba(99,102,241,0.2)" }}>
                    {s.num}
                  </span>
                  {/* Icon */}
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.2)" }}>
                    <s.icon size={16} style={{ color: "#818cf8" }} />
                  </div>
                  <p className="text-sm font-bold text-white mb-1.5">{s.title}</p>
                  <p className="text-xs leading-relaxed" style={{ color: "rgba(148,163,184,0.6)" }}>{s.desc}</p>

                  {/* Connector line desktop */}
                  {i < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-full w-5 h-px z-10"
                      style={{ background: "rgba(99,102,241,0.2)" }} />
                  )}
                </motion.div>
              ))}
            </div>
          </section>

          {/* ── Features ─────────────────────────────────────── */}
          <section className="mb-24">
            <motion.div className="text-center mb-14" {...fadeUp(0)}>
              <h2 className="text-3xl md:text-4xl font-black text-white" style={{ letterSpacing: "-0.03em" }}>
                Everything you need
              </h2>
              <p className="mt-3 text-sm" style={{ color: "rgba(148,163,184,0.6)" }}>
                No fluff — just the tools that actually matter
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {features.map((f, i) => (
                <motion.div key={f.title} {...fadeUp(i * 0.06)}
                  className="p-5 rounded-2xl"
                  style={{
                    background: "rgba(99,102,241,0.06)",
                    border: "1px solid rgba(99,102,241,0.15)",
                  }}>
                  <p className="text-sm font-bold text-white mb-1.5">{f.title}</p>
                  <p className="text-xs leading-relaxed" style={{ color: "rgba(148,163,184,0.6)" }}>{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ── Rating ───────────────────────────────────────── */}
          <section className="max-w-md mx-auto">
            <motion.div className="text-center mb-10" {...fadeUp(0)}>
              <h2 className="text-3xl font-black text-white" style={{ letterSpacing: "-0.03em" }}>
                Rate your experience
              </h2>
              <p className="mt-3 text-sm" style={{ color: "rgba(148,163,184,0.6)" }}>
                Your feedback helps improve the app for everyone
              </p>
            </motion.div>

            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.div key="form"
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.25 }}>
                  <div className="p-6 rounded-2xl"
                    style={{
                      background: "rgba(255,255,255,0.015)",
                      border: "1px solid rgba(99,102,241,0.2)",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                    }}>

                    <form onSubmit={handleSubmit} className="space-y-5">
                      {/* Name */}
                      <div>
                        <label className="block text-[11px] font-semibold tracking-[0.14em] uppercase mb-2"
                          style={{ color: "rgba(148,163,184,0.55)" }}>
                          Your Name
                        </label>
                        <input
                          type="text"
                          value={name}
                          onChange={e => setName(e.target.value)}
                          placeholder="e.g. Kaushalendra"
                          required
                          style={{
                            width: "100%",
                            padding: "12px 16px",
                            borderRadius: "10px",
                            fontSize: "14px",
                            color: "#fff",
                            outline: "none",
                            background: focused ? "rgba(99,102,241,0.12)" : "rgba(99,102,241,0.06)",
                            border: `1px solid ${focused ? "rgba(99,102,241,0.5)" : "rgba(99,102,241,0.18)"}`,
                            boxShadow: focused ? "0 0 0 3px rgba(99,102,241,0.1)" : "none",
                            transition: "all 0.15s ease",
                          }}
                          onFocus={() => setFocused(true)}
                          onBlur={() => setFocused(false)}
                        />
                      </div>

                      {/* Stars */}
                      <div>
                        <label className="block text-[11px] font-semibold tracking-[0.14em] uppercase mb-3"
                          style={{ color: "rgba(148,163,184,0.55)" }}>
                          Rating
                        </label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <motion.button
                              key={star}
                              type="button"
                              onClick={() => setRating(star)}
                              onMouseEnter={() => setHover(star)}
                              onMouseLeave={() => setHover(0)}
                              whileHover={{ scale: 1.25 }}
                              whileTap={{ scale: 0.9 }}
                              style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                              <FaStar size={28} style={{
                                color: star <= (hover || rating) ? "#fbbf24" : "rgba(255,255,255,0.12)",
                                transition: "color 0.15s ease",
                              }} />
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      {/* Submit */}
                      <motion.button
                        type="submit"
                        disabled={!rating || !name.trim()}
                        whileHover={rating && name.trim() ? { y: -1, boxShadow: "0 8px 24px rgba(99,102,241,0.4)" } : {}}
                        whileTap={rating && name.trim() ? { scale: 0.98 } : {}}
                        className="w-full flex items-center justify-center gap-2 rounded-xl font-bold text-sm text-white"
                        style={{
                          padding: "13px 20px",
                          background: "linear-gradient(135deg, #6366F1 0%, #3B82F6 100%)",
                          boxShadow: "0 4px 16px rgba(99,102,241,0.3)",
                          border: "none",
                          cursor: !rating || !name.trim() ? "not-allowed" : "pointer",
                          opacity: !rating || !name.trim() ? 0.5 : 1,
                          transition: "opacity 0.15s ease",
                        }}>
                        Submit Rating
                      </motion.button>
                    </form>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="success"
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}>
                  <div className="p-8 rounded-2xl text-center"
                    style={{
                      background: "rgba(34,197,94,0.06)",
                      border: "1px solid rgba(34,197,94,0.2)",
                    }}>
                    <motion.div
                      initial={{ scale: 0 }} animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                      className="text-5xl mb-4">
                      ✨
                    </motion.div>
                    <h3 className="text-xl font-black text-white mb-2">
                      Thanks, {name}!
                    </h3>
                    <p className="text-sm mb-5" style={{ color: "rgba(148,163,184,0.7)" }}>
                      You gave us {rating} star{rating !== 1 ? "s" : ""}. Really appreciate it.
                    </p>
                    <div className="flex justify-center gap-1.5">
                      {[...Array(rating)].map((_, i) => (
                        <motion.div key={i}
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ delay: i * 0.08, type: "spring" }}>
                          <FaStar size={20} style={{ color: "#fbbf24" }} />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

        </main>
        <Footer />
      </div>
    </div>
  )
}