"use client"
import { useUser } from "@/app/context/useContext"
import Link from "next/link"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FiLogIn, FiBook, FiHash, FiEdit2, FiCalendar, FiAlertCircle, FiCheck, FiLoader, FiX } from "react-icons/fi"
import { Branches } from "@/constants"

/* ── Reuse same modal logic inline for mobile ─────────────── */
const ProfileEditModal = ({ onClose }: { onClose: () => void }) => {
  const { name, rollNo, branch, year, college, setUser } = useUser()

  const [editName,     setEditName]     = useState(name   || "")
  const [editBranch,   setEditBranch]   = useState(branch || "")
  const [customBranch, setCustomBranch] = useState("")
  const [editYear,     setEditYear]     = useState(year   || "")
  const [isLoading,    setIsLoading]    = useState(false)
  const [error,        setError]        = useState("")
  const [success,      setSuccess]      = useState(false)
  const [focused,      setFocused]      = useState<string | null>(null)

  const isCustomBranch = editBranch === "Other (Custom)"

  const inputStyle = (f: string): React.CSSProperties => ({
    width: "100%", padding: "10px 14px", borderRadius: "9px",
    fontSize: "13px", color: "#fff", outline: "none",
    transition: "all 0.15s ease",
    background: focused === f ? "rgba(99,102,241,0.12)" : "rgba(99,102,241,0.06)",
    border: `1px solid ${focused === f ? "rgba(99,102,241,0.5)" : "rgba(99,102,241,0.18)"}`,
    boxShadow: focused === f ? "0 0 0 3px rgba(99,102,241,0.1)" : "none",
  })

  const handleSave = async () => {
    setError("")
    const finalBranch = isCustomBranch ? customBranch.trim() : editBranch.trim()
    if (!editName.trim()) { setError("Name cannot be empty."); return }
    if (!finalBranch)     { setError("Branch cannot be empty."); return }

    setIsLoading(true)
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rollno: rollNo, college, name: editName.trim(), branch: finalBranch, year: editYear.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Update failed")
      setUser({ name: data.user.name, branch: data.user.branch, year: data.user.year })
      setSuccess(true)
      setTimeout(() => { setSuccess(false); onClose() }, 1200)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] as const }}
        className="w-full max-w-sm rounded-2xl overflow-hidden"
        style={{ background: "#0d1020", border: "1px solid rgba(99,102,241,0.2)", boxShadow: "0 24px 64px rgba(0,0,0,0.6)" }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: "1px solid rgba(99,102,241,0.12)" }}>
          <p className="text-sm font-bold text-white">Edit Profile</p>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(100,116,139,0.7)", display: "flex" }}>
            <FiX size={16} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.18 }}
                className="flex items-start gap-2 px-3 py-2.5 rounded-lg text-xs overflow-hidden"
                style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.22)", color: "rgba(252,165,165,0.9)" }}>
                <FiAlertCircle size={13} className="mt-0.5 shrink-0" style={{ color: "#f87171" }} />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <label className="block mb-1.5 text-[11px] font-semibold tracking-[0.12em] uppercase" style={{ color: "rgba(148,163,184,0.5)" }}>Full Name</label>
            <input type="text" value={editName} onChange={e => setEditName(e.target.value)} placeholder="Your name"
              style={inputStyle("name")} onFocus={() => setFocused("name")} onBlur={() => setFocused(null)} />
          </div>

          <div>
            <label className="block mb-1.5 text-[11px] font-semibold tracking-[0.12em] uppercase" style={{ color: "rgba(148,163,184,0.5)" }}>Branch / Course</label>
            <select value={editBranch} onChange={e => setEditBranch(e.target.value)}
              style={{ ...inputStyle("branch"), appearance: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='rgba(148,163,184,0.5)' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center", paddingRight: "36px", cursor: "pointer" }}
              onFocus={() => setFocused("branch")} onBlur={() => setFocused(null)}>
              <option value="" style={{ background: "#111827" }}>Select branch / course</option>
              {Branches.map(b => <option key={b} value={b} style={{ background: "#111827", color: "#fff" }}>{b}</option>)}
            </select>
            {isCustomBranch && (
              <input type="text" value={customBranch} onChange={e => setCustomBranch(e.target.value)}
                placeholder="Type your branch / course"
                style={{ ...inputStyle("custom"), marginTop: "8px" }}
                onFocus={() => setFocused("custom")} onBlur={() => setFocused(null)} />
            )}
          </div>

          <div>
            <label className="block mb-1.5 text-[11px] font-semibold tracking-[0.12em] uppercase" style={{ color: "rgba(148,163,184,0.5)" }}>Year</label>
            <input type="text" value={editYear} onChange={e => setEditYear(e.target.value)}
              placeholder="e.g. 2nd Year, 3rd Semester"
              style={inputStyle("year")} onFocus={() => setFocused("year")} onBlur={() => setFocused(null)} />
          </div>
        </div>

        <div className="px-5 pb-5 flex gap-2.5">
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(148,163,184,0.7)", cursor: "pointer" }}>
            Cancel
          </button>
          <motion.button onClick={handleSave} disabled={isLoading || success}
            whileTap={!isLoading ? { scale: 0.97 } : {}}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2"
            style={{
              background: success ? "rgba(34,197,94,0.8)" : "linear-gradient(135deg, #6366F1 0%, #3B82F6 100%)",
              border: "none", boxShadow: success ? "none" : "0 4px 16px rgba(99,102,241,0.3)",
              cursor: isLoading ? "not-allowed" : "pointer", opacity: isLoading ? 0.8 : 1, transition: "all 0.2s ease",
            }}>
            {success ? <><FiCheck size={14} /><span>Saved!</span></>
              : isLoading ? <><span className="animate-spin"><FiLoader size={14} /></span><span>Saving...</span></>
              : <><FiCheck size={14} /><span>Save Changes</span></>}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ── UserMobile ────────────────────────────────────────────── */
const UserMobile = () => {
  const { name, rollNo, branch, year, college } = useUser()
  const [editOpen, setEditOpen] = useState(false)

  if (!name) {
    return (
      <Link href="/sign-in">
        <motion.div whileTap={{ scale: 0.97 }}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold mt-2"
          style={{ background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.35)", color: "#a5b4fc" }}>
          <FiLogIn size={15} />
          Sign In
        </motion.div>
      </Link>
    )
  }

  const initials = name.split(" ").map((w: string) => w[0]).slice(0, 2).join("").toUpperCase()

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        className="w-full mt-2 rounded-xl overflow-hidden"
        style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}>

        {/* User info row */}
        <div className="flex items-center gap-4 p-4">
          <div className="relative shrink-0">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-sm font-black text-white select-none"
              style={{ background: "linear-gradient(135deg, #6366F1, #3B82F6)" }}>
              {initials}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2"
              style={{ background: "#22c55e", borderColor: "var(--bg-secondary)" }} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-white leading-none truncate">{name}</p>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1.5">
              {rollNo && (
                <span className="flex items-center gap-1 text-xs" style={{ color: "var(--text-muted)" }}>
                  <FiHash size={10} />{rollNo}
                </span>
              )}
              {college && (
                <span className="flex items-center gap-1 text-xs truncate" style={{ color: "var(--text-muted)" }}>
                  {college}
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {branch && (
                <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-lg"
                  style={{ background: "rgba(99,102,241,0.12)", color: "rgba(165,180,252,0.85)", border: "1px solid rgba(99,102,241,0.18)" }}>
                  <FiBook size={9} />{branch.length > 20 ? branch.slice(0, 20) + "..." : branch}
                </span>
              )}
              {year && (
                <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-lg"
                  style={{ background: "rgba(59,130,246,0.1)", color: "rgba(147,197,253,0.85)", border: "1px solid rgba(59,130,246,0.15)" }}>
                  <FiCalendar size={9} />{year}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Edit button */}
        <button
          onClick={() => setEditOpen(true)}
          className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-semibold transition-all duration-150"
          style={{
            borderTop: "1px solid rgba(99,102,241,0.1)",
            background: "none", border: "none",
            color: "rgba(165,180,252,0.8)", cursor: "pointer",
          }}
          onMouseEnter={e => (e.currentTarget.style.background = "rgba(99,102,241,0.07)")}
          onMouseLeave={e => (e.currentTarget.style.background = "none")}
        >
          <FiEdit2 size={12} />
          Edit Profile
        </button>
      </motion.div>

      <AnimatePresence>
        {editOpen && <ProfileEditModal onClose={() => setEditOpen(false)} />}
      </AnimatePresence>
    </>
  )
}

export default UserMobile