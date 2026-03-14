"use client"

import Image from "next/image"
import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { useUser } from "@/app/context/useContext"
import { FiEye, FiEyeOff, FiArrowRight, FiAlertCircle } from "react-icons/fi"

const Background = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
    <div className="absolute inset-0" style={{ background: "#06080f" }} />
    <div className="absolute" style={{ width: 700, height: 500, top: "-120px", left: "-100px", background: "radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 65%)", borderRadius: "50%" }} />
    <div className="absolute" style={{ width: 600, height: 500, bottom: "-100px", right: "-80px", background: "radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 65%)", borderRadius: "50%" }} />
    <div className="absolute" style={{ width: 400, height: 400, top: "40%", left: "30%", background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)", borderRadius: "50%" }} />
    <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(99,102,241,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.06) 1px, transparent 1px)", backgroundSize: "52px 52px" }} />
  </div>
)

const stats = ["75% Rule Solved", "Subject-wise Tracking", "Works Offline", "1-click Timetable", "Zero Stress", "Free Forever"]

const Ticker = () => (
  <>
    <style>{`
      @keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }
      .ticker-track { animation: ticker 22s linear infinite; }
    `}</style>
    <div className="overflow-hidden w-full" style={{ maskImage: "linear-gradient(to right, transparent, black 12%, black 88%, transparent)" }}>
      <div className="ticker-track flex gap-10 whitespace-nowrap w-max">
        {[...stats, ...stats].map((s, i) => (
          <span key={i} className="flex items-center gap-2.5 text-[11px] font-semibold tracking-[0.18em] uppercase" style={{ color: "rgba(148,163,184,0.45)" }}>
            <span style={{ width: 4, height: 4, borderRadius: "50%", background: "rgba(99,102,241,0.7)", display: "inline-block", flexShrink: 0 }} />
            {s}
          </span>
        ))}
      </div>
    </div>
  </>
)

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.52, delay, ease: [0.23, 1, 0.32, 1] as const },
})

export default function SignInPage() {
  const [rollno,   setRollno]   = useState("")
  const [college,  setCollege]  = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error,    setError]    = useState("")
  const [showPw,   setShowPw]   = useState(false)
  const [focused,  setFocused]  = useState<string | null>(null)
  const router = useRouter()
  const { setUser } = useUser()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    try {
      const res  = await fetch("/api/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rollno, college, password }),
      })
      const data = await res.json()
      if (!res.ok)    throw new Error(data.message || "Login failed")
      if (!data.user) throw new Error("User data not found")
      setUser({
        name:    data.user.name,
        rollNo:  data.user.rollno,
        branch:  data.user.branch,
        year:    data.user.year    || "",
        college: data.user.college || "",
        userId:  data.user.userId  || "",
      })
      router.push("/")
    } catch (err) {
      setError((err as Error).message || "Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const inputStyle = (name: string): React.CSSProperties => ({
    width: "100%",
    padding: "13px 16px",
    borderRadius: "10px",
    fontSize: "14px",
    color: "#ffffff",
    outline: "none",
    transition: "border 0.15s ease, box-shadow 0.15s ease, background 0.15s ease",
    background: focused === name ? "rgba(99,102,241,0.12)" : "rgba(99,102,241,0.06)",
    border: `1px solid ${focused === name ? "rgba(99,102,241,0.5)" : "rgba(99,102,241,0.18)"}`,
    boxShadow: focused === name ? "0 0 0 3px rgba(99,102,241,0.12)" : "none",
  })

  return (
    <main className="min-h-screen flex relative" style={{ background: "#06080f" }}>
      <Background />

      {/* LEFT PANEL */}
      <div className="hidden lg:flex lg:w-[50%] relative flex-col justify-between p-16 overflow-hidden">
        <motion.div {...fadeUp(0.05)} className="relative z-10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(99,102,241,0.18)", border: "1px solid rgba(99,102,241,0.25)" }}>
            <Image src="/assets/signinlogo.png" width={22} height={22} alt="Should I Attend logo" />
          </div>
          <span className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.65)" }}>Should I Attend</span>
        </motion.div>

        <div className="relative z-10 space-y-7">
          <motion.div {...fadeUp(0.12)}>
            <p className="text-xl font-bold tracking-[0.22em] uppercase mb-5" style={{ color: "rgba(255,255,255,0.8)" }}>Attendance Tracker</p>
            <h1 className="font-black text-white leading-[1.06]" style={{ fontSize: "clamp(2.6rem, 3.8vw, 3.6rem)", letterSpacing: "-0.04em" }}>
              Know exactly<br />
              <span style={{ background: "linear-gradient(135deg, #6366F1 0%, #3B82F6 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                when to skip.
              </span>
            </h1>
          </motion.div>
          <motion.p {...fadeUp(0.2)} className="text-base leading-relaxed max-w-xs" style={{ color: "rgba(148,163,184,0.7)" }}>
            Track every subject daily, calculate your 75% safety margin, and share timetables all in one place.
          </motion.p>
          <motion.div {...fadeUp(0.27)} className="flex flex-wrap gap-2">
            {["📅 Daily Tracking", "📊 75% Calculator", "🔗 Share Timetable", "📱 Works Offline"].map((f) => (
              <span key={f} className="text-xs px-3 py-1.5 rounded-full font-medium" style={{ background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.2)", color: "rgba(203,213,225,0.8)" }}>{f}</span>
            ))}
          </motion.div>
          <motion.div {...fadeUp(0.34)}><Ticker /></motion.div>
        </div>

        <motion.div {...fadeUp(0.4)} className="relative z-10 pt-6" style={{ borderTop: "1px solid rgba(99,102,241,0.15)" }}>
          <p className="text-xs italic" style={{ color: "rgba(100,116,139,0.6)" }}>&ldquo;Finally know how many lectures I can bunk.&rdquo; every engineering student ever</p>
        </motion.div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-14 relative" style={{ borderLeft: "1px solid rgba(99,102,241,0.1)" }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 70% 40% at 50% 0%, rgba(99,102,241,0.1), transparent)" }} />

        <div className="w-full max-w-[370px] relative z-10">
          <motion.div {...fadeUp(0.05)} className="flex lg:hidden items-center gap-3 mb-10">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(99,102,241,0.18)", border: "1px solid rgba(99,102,241,0.25)" }}>
              <Image src="/assets/signinlogo.png" width={18} height={18} alt="Logo" />
            </div>
            <span className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.65)" }}>Should I Attend</span>
          </motion.div>

          <motion.div {...fadeUp(0.06)} className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-5" style={{ background: "rgba(99,102,241,0.18)", border: "1px solid rgba(99,102,241,0.25)", boxShadow: "0 8px 32px rgba(99,102,241,0.2)" }}>
              <Image src="/assets/signinlogo.png" width={48} height={48} alt="Should I Attend" priority />
            </div>
            <h2 className="font-black text-white mb-1.5" style={{ fontSize: "1.75rem", letterSpacing: "-0.03em" }}>Welcome back</h2>
            <p className="text-sm text-center" style={{ color: "rgba(100,116,139,0.9)" }}>Sign in to check your attendance status</p>
          </motion.div>

          <AnimatePresence>
            {error && (
              <motion.div key="err" initial={{ opacity: 0, height: 0, marginBottom: 0 }} animate={{ opacity: 1, height: "auto", marginBottom: 20 }} exit={{ opacity: 0, height: 0, marginBottom: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl text-sm" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.22)", color: "rgba(252,165,165,0.9)" }}>
                  <FiAlertCircle size={14} className="mt-0.5 shrink-0" style={{ color: "#f87171" }} />
                  {error}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>

            {/* Roll No */}
            <motion.div {...fadeUp(0.15)}>
              <label htmlFor="rollno" className="block mb-2 text-[11px] font-semibold tracking-[0.15em] uppercase" style={{ color: "rgba(148,163,184,0.55)" }}>Roll Number</label>
              <input id="rollno" type="text" placeholder="e.g. 230110038" value={rollno}
                onChange={(e) => setRollno(e.target.value)} required autoComplete="username"
                style={inputStyle("rollno")} onFocus={() => setFocused("rollno")} onBlur={() => setFocused(null)} />
            </motion.div>

            {/* College */}
            <motion.div {...fadeUp(0.20)}>
              <label htmlFor="college" className="block mb-2 text-[11px] font-semibold tracking-[0.15em] uppercase" style={{ color: "rgba(148,163,184,0.55)" }}>
                College Name
                <span className="ml-2 normal-case tracking-normal text-[10px]" style={{ color: "rgba(148,163,184,0.35)" }}>(leave blank if none)</span>
              </label>
              <input id="college" type="text" placeholder="e.g. HBTU Kanpur"
                value={college} onChange={(e) => setCollege(e.target.value)}
                autoComplete="organization"
                style={inputStyle("college")} onFocus={() => setFocused("college")} onBlur={() => setFocused(null)} />
            </motion.div>

            {/* Password */}
            <motion.div {...fadeUp(0.26)}>
              <label htmlFor="password" className="block mb-2 text-[11px] font-semibold tracking-[0.15em] uppercase" style={{ color: "rgba(148,163,184,0.55)" }}>Password</label>
              <div className="relative">
                <input id="password" type={showPw ? "text" : "password"} placeholder="Enter your password"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  required autoComplete="current-password"
                  style={{ ...inputStyle("password"), paddingRight: "44px" }}
                  onFocus={() => setFocused("password")} onBlur={() => setFocused(null)} />
                <button type="button" onClick={() => setShowPw(p => !p)} aria-label={showPw ? "Hide password" : "Show password"}
                  style={{ position: "absolute", right: "13px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(100,116,139,0.6)", display: "flex", alignItems: "center" }}>
                  {showPw ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                </button>
              </div>
            </motion.div>

            {/* Remember me */}
            <motion.div {...fadeUp(0.31)} className="pt-0.5">
              <label className="flex items-center gap-2.5 cursor-pointer select-none w-fit">
                <input type="checkbox" id="remember" name="remember" className="w-3.5 h-3.5 rounded cursor-pointer" style={{ accentColor: "#6366F1" }} />
                <span className="text-xs font-medium" style={{ color: "rgba(100,116,139,0.65)" }}>Remember me</span>
              </label>
            </motion.div>

            {/* Submit */}
            <motion.div {...fadeUp(0.36)} className="pt-1">
              <motion.button type="submit" disabled={isLoading}
                whileHover={!isLoading ? { y: -1, boxShadow: "0 8px 28px rgba(99,102,241,0.45)" } : {}}
                whileTap={!isLoading ? { scale: 0.988 } : {}}
                className="w-full flex items-center justify-center gap-2.5 rounded-xl font-bold text-sm text-white"
                style={{ padding: "14px 20px", background: "linear-gradient(135deg, #6366F1 0%, #3B82F6 100%)", boxShadow: "0 4px 20px rgba(99,102,241,0.35)", border: "none", cursor: isLoading ? "not-allowed" : "pointer", opacity: isLoading ? 0.75 : 1, letterSpacing: "-0.01em", transition: "opacity 0.15s ease" }}>
                {isLoading ? (
                  <><svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg><span>Signing in...</span></>
                ) : (
                  <><span>Sign in</span><FiArrowRight size={15} /></>
                )}
              </motion.button>
            </motion.div>
          </form>

          <motion.div {...fadeUp(0.41)} className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px" style={{ background: "rgba(99,102,241,0.15)" }} />
            <span className="text-xs" style={{ color: "rgba(71,85,105,0.6)" }}>or</span>
            <div className="flex-1 h-px" style={{ background: "rgba(99,102,241,0.15)" }} />
          </motion.div>

          <motion.div {...fadeUp(0.46)} className="text-center">
            <p className="text-sm" style={{ color: "rgba(71,85,105,0.9)" }}>
              New here?{" "}
              <a href="/sign-up" className="font-semibold transition-colors duration-150" style={{ color: "#6366F1" }}
                onMouseEnter={e => ((e.target as HTMLElement).style.color = "#818cf8")}
                onMouseLeave={e => ((e.target as HTMLElement).style.color = "#6366F1")}>
                Create a free account
              </a>
            </p>
          </motion.div>

          <motion.p {...fadeUp(0.5)} className="text-center text-xs mt-8" style={{ color: "rgba(51,65,85,0.75)" }}>
            🔒 Private and secured, only you can access your data
          </motion.p>
        </div>
      </div>
    </main>
  )
}