"use client"
import {
  FaInstagram,
  FaGithub,
  FaLinkedin,
  FaGlobe,
  FaEnvelope,
} from "react-icons/fa"
import { motion, useAnimation, useInView } from "framer-motion"
import { useEffect, useRef } from "react"
import Image from "next/image"
import { Navigation } from "@/components/navigation"
import Footer from "@/components/footer"

export default function ContactPage() {
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  const socials = [
    {
      name: "GitHub",
      icon: <FaGithub />,
      link: "https://github.com/Kaushalendra-Marcus",
      color: "from-gray-600 to-gray-800",
    },
    {
      name: "LinkedIn",
      icon: <FaLinkedin />,
      link: "https://linkedin.com/in/kaushalendra-singh-45b933272",
      color: "from-blue-500 to-blue-700",
    },
    {
      name: "Instagram",
      icon: <FaInstagram />,
      link: "https://instagram.com/kaushalendra_marcus",
      color: "from-pink-500 via-purple-500 to-indigo-500",
    },
    {
      name: "Portfolio",
      icon: <FaGlobe />,
      link: "https://kaushalendra-portfolio.vercel.app",
      color: "from-green-500 to-teal-600",
    },
    {
      name: "Email",
      icon: <FaEnvelope />,
      link: "mailto:yadavkausha4a5@gmail.com",
      color: "from-red-500 to-orange-500",
    },
  ]


  useEffect(() => {
    const sequence = async () => {
      await controls.start({
        scale: [0, 1.5, 1],
        opacity: [0, 1, 1],
        rotate: [0, 360],
        transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
      })
      controls.start({
        rotate: [0, 20, -20, 10, 0],
        transition: { repeat: Infinity, repeatType: "reverse", duration: 2, ease: "easeInOut" },
      })
    }
    sequence()
  }, [controls])

  return (
    <div>
      <Navigation />
      <div className="min-h-screen relative overflow-hidden bg-black">

        <div className="absolute inset-0">
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black/50 to-indigo-900/20"
            animate={{
              background: [
                'radial-gradient(circle at 20% 50%, rgba(120,119,198,.3) 0%, transparent 50%)',
                'radial-gradient(circle at 80% 30%, rgba(255,119,198,.3) 0%, transparent 50%)',
                'radial-gradient(circle at 50% 80%, rgba(120,119,255,.3) 0%, transparent 50%)',
              ],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          <div className="absolute inset-0 bg-grid-pattern" />
        </div>


        {[...Array(35)].map((_, i) => (
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
              ease: "easeInOut",
            }}
          />
        ))}



        <main className="relative z-10 max-w-7xl mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-screen">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:50px_50px]" />
          </div>
          <motion.div
            animate={controls}
            className="mb-6"
          >
            <Image
              src="/Kaushalendra-Logo.png"
              alt="Kaushal"
              width={90}
              height={90}
              className="rounded-full border-2 border-white/30 shadow-xl drop-shadow-purple"
            />
          </motion.div>

          <motion.div
            animate={{ rotate: [0, 20, -20, 10, 0] }}
            transition={{ repeat: Infinity, repeatType: "reverse", duration: 2, ease: "easeInOut" }}
            className="text-6xl mb-6"
          >
            👋
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-6 text-center"
          >
            Let{"'"}s Connect & Collaborate
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-lg text-purple-200/80 mb-12 text-center max-w-xl"
          >
            I{"'"}m always open to new opportunities, creative projects, or just a friendly chat!
          </motion.p>

          {/* Social grid */}
          <motion.div
            ref={ref}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 w-full max-w-5xl"
          >
            {socials.map((social, index) => (
              <motion.a
                key={social.name}
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 30 }}
                animate={
                  isInView
                    ? { opacity: 1, y: [0, -15, 0] }
                    : { opacity: 0, y: 30 }
                }
                transition={{
                  delay: 1.5 + index * 0.1,
                  y: { repeat: Infinity, repeatType: "reverse", duration: 3 + index * 0.5, ease: "easeInOut" },
                }}
                whileHover={{
                  scale: 1.08,
                  boxShadow: "0 20px 40px -10px rgba(0,0,0,0.4)",
                  rotate: 2,
                }}
                className={`relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 text-white hover:border-white/30 transition-all duration-300 group`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${social.color} rounded-2xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity`} />
                <div className="relative text-3xl">{social.icon}</div>
                <span className="relative font-semibold text-sm">{social.name}</span>
              </motion.a>
            ))}
          </motion.div>

          {/* Floating chat bubbles */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 }}
            className="mt-16 relative w-full max-w-2xl"
          >
            <motion.div
              animate={{ x: [-100, 60, -20, 100], y: [-700, -600, -300, -100] }}
              transition={{ duration: 8, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
              className="absolute -left-10 -top-10 bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/20"
            >
              <span className="text-white text-sm">👨‍💻 Let{"'"}s build something!</span>
            </motion.div>

            <motion.div
              animate={{ x: [0, -150, 40, 30], y: [-600, -400, -200, -100] }}
              transition={{ duration: 10, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 0.5 }}
              className="absolute -right-10 top-20 bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/20"
            >
              <span className="text-white text-sm">💡 Got an idea?</span>
            </motion.div>
          </motion.div>

          {/* Background orbs */}
          <motion.div
            animate={{ x: [0, 100, 0], y: [0, 50, 0], rotate: [0, 180, 360] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute -left-20 top-1/4 w-48 h-48 rounded-full bg-purple-600/20 blur-2xl -z-10"
          />
          <motion.div
            animate={{ x: [0, -100, 0], y: [0, -50, 0], rotate: [0, -180, -360] }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear", delay: 10 }}
            className="absolute -right-20 bottom-1/4 w-60 h-60 rounded-full bg-pink-600/20 blur-2xl -z-10"
          />
        </main>

        <Footer />
      </div>
    </div>
  )
}