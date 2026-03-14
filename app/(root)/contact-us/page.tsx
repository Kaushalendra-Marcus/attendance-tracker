"use client"
import { FaInstagram, FaGithub, FaLinkedin, FaGlobe, FaEnvelope } from "react-icons/fa"
import { motion } from "framer-motion"
import Image from "next/image"
import { Navigation } from "@/components/navigation"
import Footer from "@/components/footer"
import { GridBackground } from "@/components/PageShared"

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.52, delay, ease: [0.23, 1, 0.32, 1] as const },
})

const socials = [
  {
    name: "GitHub",
    icon: <FaGithub size={22} />,
    link: "https://github.com/Kaushalendra-Marcus",
    desc: "Check out my projects",
    accent: "rgba(255,255,255,0.12)",
    accentBorder: "rgba(255,255,255,0.15)",
  },
  {
    name: "LinkedIn",
    icon: <FaLinkedin size={22} />,
    link: "https://linkedin.com/in/kaushalendra-singh-45b933272",
    desc: "Connect professionally",
    accent: "rgba(59,130,246,0.12)",
    accentBorder: "rgba(59,130,246,0.25)",
  },
  {
    name: "Instagram",
    icon: <FaInstagram size={22} />,
    link: "https://instagram.com/kaushalendra_marcus",
    desc: "Follow my journey",
    accent: "rgba(236,72,153,0.1)",
    accentBorder: "rgba(236,72,153,0.2)",
  },
  {
    name: "Portfolio",
    icon: <FaGlobe size={22} />,
    link: "https://kaushalendra-portfolio.vercel.app",
    desc: "See my full work",
    accent: "rgba(34,197,94,0.1)",
    accentBorder: "rgba(34,197,94,0.2)",
  },
  {
    name: "Email",
    icon: <FaEnvelope size={22} />,
    link: "mailto:yadavkausha4a5@gmail.com",
    desc: "Drop me a message",
    accent: "rgba(99,102,241,0.12)",
    accentBorder: "rgba(99,102,241,0.25)",
  },
]

export default function ContactPage() {
  return (
    <div style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>
      <Navigation />

      <div className="relative overflow-hidden">
        <GridBackground />

        {/* Top glow */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 60% 35% at 50% 0%, rgba(99,102,241,0.14), transparent)" }} />

        {/* Bottom-right glow */}
        <div className="absolute pointer-events-none"
          style={{
            width: 500, height: 500, bottom: "-80px", right: "-80px",
            background: "radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)",
            borderRadius: "50%",
          }} />

        <main className="relative z-10 max-w-3xl mx-auto px-4 py-20 flex flex-col items-center">

          {/* ── Avatar ───────────────────────────────────────── */}
          <motion.div {...fadeUp(0)} className="mb-6 relative">
            <div className="w-24 h-24 rounded-2xl overflow-hidden"
              style={{
                border: "1px solid rgba(99,102,241,0.3)",
                boxShadow: "0 8px 32px rgba(99,102,241,0.2)",
              }}>
              <Image
                src="/Kaushalendra-Logo.png"
                alt="Kaushalendra"
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Online dot */}
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 flex items-center justify-center"
              style={{ background: "#22c55e", borderColor: "var(--bg-primary)" }} />
          </motion.div>

          {/* ── Heading ──────────────────────────────────────── */}
          <motion.p {...fadeUp(0.07)} className="text-xs font-bold tracking-[0.22em] uppercase mb-3"
            style={{ color: "rgba(99,102,241,0.8)" }}>
            Get in touch
          </motion.p>

          <motion.h1 {...fadeUp(0.12)}
            className="text-3xl md:text-5xl font-black text-white text-center mb-4"
            style={{ letterSpacing: "-0.04em" }}>
            Let&apos;s connect<br />
            <span style={{
              background: "linear-gradient(135deg, #6366F1 0%, #3B82F6 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              and collaborate.
            </span>
          </motion.h1>

          <motion.p {...fadeUp(0.17)} className="text-sm text-center mb-14 max-w-sm"
            style={{ color: "rgba(148,163,184,0.7)" }}>
            Open to new opportunities, creative projects, or just a friendly chat.
            Feel free to reach out through any of these.
          </motion.p>

          {/* ── Social cards ─────────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full">
            {socials.map((s, i) => (
              <motion.a
                key={s.name}
                href={s.link}
                target="_blank"
                rel="noopener noreferrer"
                {...fadeUp(0.2 + i * 0.07)}
                whileHover={{ y: -3, boxShadow: `0 12px 32px rgba(0,0,0,0.3)` }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 no-underline"
                style={{
                  background: s.accent,
                  border: `1px solid ${s.accentBorder}`,
                  textDecoration: "none",
                }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.85)" }}>
                  {s.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-white leading-none mb-0.5">{s.name}</p>
                  <p className="text-xs truncate" style={{ color: "rgba(148,163,184,0.6)" }}>{s.desc}</p>
                </div>
              </motion.a>
            ))}
          </div>

        </main>
        <Footer />
      </div>
    </div>
  )
}