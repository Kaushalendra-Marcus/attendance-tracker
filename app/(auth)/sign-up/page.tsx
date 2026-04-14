"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useUser } from "@/app/context/useContext"
import { Branches } from "@/constants"
import { FiEye, FiEyeOff, FiArrowRight, FiAlertCircle } from "react-icons/fi"
import Link from "next/link"

const Background = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
    <div className="absolute inset-0" style={{ background: "#06080f" }} />
    <div className="absolute" style={{ width: 700, height: 500, top: "-120px", left: "-100px", background: "radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 65%)", borderRadius: "50%" }} />
    <div className="absolute" style={{ width: 600, height: 500, bottom: "-100px", right: "-80px", background: "radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 65%)", borderRadius: "50%" }} />
    <div className="absolute" style={{ width: 400, height: 400, top: "40%", left: "30%", background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)", borderRadius: "50%" }} />
    <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(99,102,241,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.06) 1px, transparent 1px)", backgroundSize: "52px 52px" }} />
  </div>
)

const steps = [
  { num: "01", title: "Create account", desc: "Sign up with your roll number and college in under 30 seconds." },
  { num: "02", title: "Set up timetable", desc: "Add your subjects and labs, or copy from a batchmate instantly." },
  { num: "03", title: "Mark daily", desc: "Tap present or absent for each subject every day." },
  { num: "04", title: "Track and plan", desc: "Dashboard shows percentages. Know when you can safely skip." },
]

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.52, delay, ease: [0.23, 1, 0.32, 1] as const },
})

const selectStyle = (focused: string | null, name: string): React.CSSProperties => ({
  width: "100%",
  padding: "12px 40px 12px 16px",
  borderRadius: "10px",
  fontSize: "14px",
  color: "#ffffff",
  outline: "none",
  appearance: "none" as const,
  WebkitAppearance: "none" as const,
  transition: "border 0.15s ease, box-shadow 0.15s ease, background 0.15s ease",
  background: focused === name ? "rgba(99,102,241,0.12)" : "rgba(99,102,241,0.06)",
  border: `1px solid ${focused === name ? "rgba(99,102,241,0.5)" : "rgba(99,102,241,0.18)"}`,
  boxShadow: focused === name ? "0 0 0 3px rgba(99,102,241,0.12)" : "none",
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='rgba(148,163,184,0.5)' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 14px center",
  cursor: "pointer",
})

export default function SignUpPage() {
  const [name, setName] = useState("")
  const [rollno, setRollno] = useState("")
  const [college, setCollege] = useState("")
  const [branch, setBranch] = useState("")
  const [customBranch, setCustomBranch] = useState("")
  const [year, setYear] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPw, setShowPw] = useState(false)
  const [focused, setFocused] = useState<string | null>(null)
  const router = useRouter()
  const { setUser } = useUser()

  const isCustomBranch = branch === "Other (Custom)"
  const finalBranch = isCustomBranch ? customBranch.trim() : branch

  // Extract numeric year - "2nd Year" -> "2", "3rd" -> "3"
  const yearNum = year.replace(/\D/g, "").slice(0, 1)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isCustomBranch && !customBranch.trim()) {
      setError("Please enter your branch name.")
      return
    }
    setIsLoading(true)
    setError("")
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, rollno, password, branch: finalBranch, college, year: yearNum }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Signup failed")
      if (data.user) {
        setUser({
          name: data.user.name,
          rollNo: data.user.rollno,
          branch: data.user.branch,
          year: data.user.year || "",
          college: data.user.college || "",
          userId: data.user.userId || "",
        })
      }
      router.push("/")
    } catch (err) {
      setError((err as Error).message || "Signup failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const inputStyle = (name: string): React.CSSProperties => ({
    width: "100%",
    padding: "12px 16px",
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
      <div className="hidden lg:flex lg:w-[48%] relative flex-col justify-between p-16 overflow-hidden">
        <motion.div {...fadeUp(0.05)} className="relative z-10 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3" aria-label="Go to homepage">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(99,102,241,0.18)", border: "1px solid rgba(99,102,241,0.25)" }}>
              <Image src="/assets/signinlogo.png" width={22} height={22} alt="Should I Attend logo" />
            </div>
            <span className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.65)" }}>Should I Attend</span>
          </Link>
        </motion.div>

        <div className="relative z-10 space-y-8">
          <motion.div {...fadeUp(0.12)}>
            <p className="text-xs font-bold tracking-[0.22em] uppercase mb-5" style={{ color: "rgba(99,102,241,0.8)" }}>Get Started Free</p>
            <h1 className="font-black text-white leading-[1.06]" style={{ fontSize: "clamp(2.4rem, 3.5vw, 3.4rem)", letterSpacing: "-0.04em" }}>
              Up and running<br />
              <span style={{ background: "linear-gradient(135deg, #6366F1 0%, #3B82F6 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                in 2 minutes.
              </span>
            </h1>
          </motion.div>
          <motion.p {...fadeUp(0.2)} className="text-base leading-relaxed max-w-xs" style={{ color: "rgba(148,163,184,0.7)" }}>
            No complex setup. Just sign up, add your subjects and start tracking from day one.
          </motion.p>
          <motion.div {...fadeUp(0.28)} className="space-y-5">
            {steps.map((s, i) => (
              <div key={i} className="flex items-start gap-4">
                <span className="text-xl font-black shrink-0 leading-none mt-0.5" style={{ color: "rgba(99,102,241,0.25)" }}>{s.num}</span>
                <div>
                  <p className="text-sm font-bold text-white mb-0.5">{s.title}</p>
                  <p className="text-xs leading-relaxed" style={{ color: "rgba(148,163,184,0.55)" }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div {...fadeUp(0.4)} className="relative z-10 pt-6" style={{ borderTop: "1px solid rgba(99,102,241,0.15)" }}>
          <p className="text-xs italic" style={{ color: "rgba(100,116,139,0.6)" }}>&ldquo;Takes 2 minutes to set up. Your attendance worries end today.&rdquo;</p>
        </motion.div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 relative" style={{ borderLeft: "1px solid rgba(99,102,241,0.1)" }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 70% 40% at 50% 0%, rgba(99,102,241,0.1), transparent)" }} />

        <div className="w-full max-w-[370px] relative z-10">
          <motion.div {...fadeUp(0.05)} className="flex lg:hidden items-center gap-3 mb-8">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(99,102,241,0.18)", border: "1px solid rgba(99,102,241,0.25)" }}>
              <Image src="/assets/signinlogo.png" width={18} height={18} alt="Logo" />
            </div>
            <span className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.65)" }}>Should I Attend</span>
          </motion.div>

          <motion.div {...fadeUp(0.06)} className="flex flex-col items-center mb-7">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-5" style={{ background: "rgba(99,102,241,0.18)", border: "1px solid rgba(99,102,241,0.25)", boxShadow: "0 8px 32px rgba(99,102,241,0.2)" }}>
              <Image src="/assets/signinlogo.png" width={48} height={48} alt="Should I Attend" priority />
            </div>
            <h2 className="font-black text-white mb-1.5" style={{ fontSize: "1.75rem", letterSpacing: "-0.03em" }}>Create account</h2>
            <p className="text-sm text-center" style={{ color: "rgba(100,116,139,0.9)" }}>Join thousands of students tracking smarter</p>
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

          <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>

            {/* Full Name */}
            <motion.div {...fadeUp(0.12)}>
              <label htmlFor="name" className="block mb-1.5 text-[11px] font-semibold tracking-[0.15em] uppercase" style={{ color: "rgba(148,163,184,0.55)" }}>Full Name</label>
              <input id="name" type="text" placeholder="e.g. Kaushalendra" value={name}
                onChange={e => setName(e.target.value)} required autoComplete="name"
                style={inputStyle("name")} onFocus={() => setFocused("name")} onBlur={() => setFocused(null)} />
            </motion.div>

            {/* Roll Number */}
            <motion.div {...fadeUp(0.17)}>
              <label htmlFor="rollno" className="block mb-1.5 text-[11px] font-semibold tracking-[0.15em] uppercase" style={{ color: "rgba(148,163,184,0.55)" }}>Roll Number</label>
              <input id="rollno" type="text" placeholder="e.g. 230110038" value={rollno}
                onChange={e => setRollno(e.target.value)} required autoComplete="username"
                style={inputStyle("rollno")} onFocus={() => setFocused("rollno")} onBlur={() => setFocused(null)} />
            </motion.div>

            {/* College */}
            <motion.div {...fadeUp(0.22)}>
              <label htmlFor="college" className="block mb-1.5 text-[11px] font-semibold tracking-[0.15em] uppercase" style={{ color: "rgba(148,163,184,0.55)" }}>
                College Name
                <span className="ml-2 normal-case tracking-normal text-[10px]" style={{ color: "rgba(148,163,184,0.35)" }}>(optional)</span>
              </label>
              <input id="college" type="text" placeholder="e.g. HBTU Kanpur" value={college}
                onChange={e => setCollege(e.target.value)} autoComplete="organization"
                style={inputStyle("college")} onFocus={() => setFocused("college")} onBlur={() => setFocused(null)} />
            </motion.div>

            {/* Branch */}
            <motion.div {...fadeUp(0.27)}>
              <label htmlFor="branch" className="block mb-1.5 text-[11px] font-semibold tracking-[0.15em] uppercase" style={{ color: "rgba(148,163,184,0.55)" }}>Branch / Course</label>
              <select id="branch" value={branch} onChange={e => setBranch(e.target.value)} required
                style={selectStyle(focused, "branch")}
                onFocus={() => setFocused("branch")} onBlur={() => setFocused(null)}>
                <option value="" style={{ background: "#111827", color: "rgba(148,163,184,0.6)" }}>Select your branch</option>
                {Branches.map((b) => (
                  <option key={b} value={b} style={{ background: "#111827", color: "#fff" }}>{b}</option>
                ))}
              </select>
              {/* Custom branch input */}
              <AnimatePresence>
                {isCustomBranch && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.18 }} className="overflow-hidden">
                    <input type="text" placeholder="Type your branch / course name" value={customBranch}
                      onChange={e => setCustomBranch(e.target.value)}
                      style={{ ...inputStyle("custom"), marginTop: "8px" }}
                      onFocus={() => setFocused("custom")} onBlur={() => setFocused(null)} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Year */}
            <motion.div {...fadeUp(0.32)}>
              <label htmlFor="year" className="block mb-1.5 text-[11px] font-semibold tracking-[0.15em] uppercase" style={{ color: "rgba(148,163,184,0.55)" }}>
                Year
                <span className="ml-2 normal-case tracking-normal text-[10px]" style={{ color: "rgba(148,163,184,0.35)" }}>(optional)</span>
              </label>
              <input id="year" type="text" placeholder="e.g. 2nd Year, 3rd Semester" value={year}
                onChange={e => setYear(e.target.value)}
                style={inputStyle("year")} onFocus={() => setFocused("year")} onBlur={() => setFocused(null)} />
            </motion.div>

            {/* Password */}
            <motion.div {...fadeUp(0.37)}>
              <label htmlFor="password" className="block mb-1.5 text-[11px] font-semibold tracking-[0.15em] uppercase" style={{ color: "rgba(148,163,184,0.55)" }}>Password</label>
              <div className="relative">
                <input id="password" type={showPw ? "text" : "password"} placeholder="Create a password (min 6 chars)"
                  value={password} onChange={e => setPassword(e.target.value)}
                  required autoComplete="new-password"
                  style={{ ...inputStyle("password"), paddingRight: "44px" }}
                  onFocus={() => setFocused("password")} onBlur={() => setFocused(null)} />
                <button type="button" onClick={() => setShowPw(p => !p)} aria-label={showPw ? "Hide password" : "Show password"}
                  style={{ position: "absolute", right: "13px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(100,116,139,0.6)", display: "flex", alignItems: "center" }}>
                  {showPw ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                </button>
              </div>
            </motion.div>

            {/* Submit */}
            <motion.div {...fadeUp(0.42)} className="pt-1">
              <motion.button type="submit" disabled={isLoading}
                whileHover={!isLoading ? { y: -1, boxShadow: "0 8px 28px rgba(99,102,241,0.45)" } : {}}
                whileTap={!isLoading ? { scale: 0.988 } : {}}
                className="w-full flex items-center justify-center gap-2.5 rounded-xl font-bold text-sm text-white"
                style={{ padding: "14px 20px", background: "linear-gradient(135deg, #6366F1 0%, #3B82F6 100%)", boxShadow: "0 4px 20px rgba(99,102,241,0.35)", border: "none", cursor: isLoading ? "not-allowed" : "pointer", opacity: isLoading ? 0.75 : 1, letterSpacing: "-0.01em", transition: "opacity 0.15s ease" }}>
                {isLoading ? (
                  <><svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg><span>Creating account...</span></>
                ) : (
                  <><span>Create account</span><FiArrowRight size={15} /></>
                )}
              </motion.button>
            </motion.div>
          </form>

          <motion.div {...fadeUp(0.47)} className="flex items-center gap-4 my-5">
            <div className="flex-1 h-px" style={{ background: "rgba(99,102,241,0.15)" }} />
            <span className="text-xs" style={{ color: "rgba(71,85,105,0.6)" }}>or</span>
            <div className="flex-1 h-px" style={{ background: "rgba(99,102,241,0.15)" }} />
          </motion.div>

          <motion.div {...fadeUp(0.51)} className="text-center">
            <p className="text-sm" style={{ color: "rgba(71,85,105,0.9)" }}>
              Already have an account?{" "}
              <a href="/sign-in" className="font-semibold transition-colors duration-150" style={{ color: "#6366F1" }}
                onMouseEnter={e => ((e.target as HTMLElement).style.color = "#818cf8")}
                onMouseLeave={e => ((e.target as HTMLElement).style.color = "#6366F1")}>
                Sign in
              </a>
            </p>
          </motion.div>

          <motion.p {...fadeUp(0.55)} className="text-center text-xs mt-6" style={{ color: "rgba(51,65,85,0.75)" }}>
            Free forever. No credit card needed.
          </motion.p>
        </div>
      </div>
    </main>
  )
}
