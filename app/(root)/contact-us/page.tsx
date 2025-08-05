"use client";
import { FaInstagram, FaGithub, FaLinkedin, FaGlobe, FaEnvelope } from "react-icons/fa";
import { motion, useAnimation, useInView } from "framer-motion";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { Navigation } from "@/components/navigation";

export default function ContactPage() {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const logoRef = useRef(null);

  const socials = [
    {
      name: "GitHub",
      icon: <FaGithub className="text-xl" />,
      link: "https://github.com/Kaushalendra-Marcus",
      color: "from-gray-900 to-gray-700",
    },
    {
      name: "LinkedIn",
      icon: <FaLinkedin className="text-xl" />,
      link: "https://www.linkedin.com/in/kaushalendra-singh-45b933272/",
      color: "from-blue-700 to-blue-500",
    },
    {
      name: "Instagram",
      icon: <FaInstagram className="text-xl" />,
      link: "https://www.instagram.com/kaushalendra_marcus/?hl=en",
      color: "from-pink-600 to-purple-600",
    },
    {
      name: "Portfolio",
      icon: <FaGlobe className="text-xl" />,
      link: "https://kaushalendra-portfolio.vercel.app/",
      color: "from-green-600 to-teal-500",
    },
    {
      name: "Email",
      icon: <FaEnvelope className="text-xl" />,
      link: "mailto:yadavkausha4a5@gmail.com",
      color: "from-red-500 to-orange-400",
    },
  ];

  // Logo burst animation on page load
  useEffect(() => {
    const sequence = async () => {
      await controls.start({
        scale: [0, 1.5, 1],
        opacity: [0, 1, 1],
        rotate: [0, 360],
        transition: {
          duration: 1.2,
          ease: [0.16, 1, 0.3, 1]
        }
      });
      
      // Start the waving animation after burst
      controls.start({
        rotate: [0, 20, -20, 10, 0],
        transition: {
          repeat: Infinity,
          repeatType: "reverse",
          duration: 2,
          ease: "easeInOut"
        }
      });
    };
    
    sequence();
  }, [controls]);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-900/60 via-purple-700/60 to-purple-500/60">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 flex flex-col items-center justify-center min-h-screen">
       
        <motion.div
          ref={logoRef}
          animate={controls}
          className="rounded-full pb-6"
          initial={{ scale: 0, opacity: 0 }}
        >
          <Image
            src="/Kaushalendra-Logo.png"
            alt="Kaushal"
            width={80}
            height={80}
            className="rounded-full border-2 border-white/30 shadow-lg"
          />
        </motion.div>

        {/* Waving hand animation */}
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: [0, 20, -20, 10, 0] }}
          transition={{ 
            repeat: Infinity,
            repeatType: "reverse",
            duration: 2,
            ease: "easeInOut",
            delay: 1.2 // Start after logo animation
          }}
          className="text-6xl mb-6"
        >
          👋
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="text-4xl md:text-5xl font-bold text-white mb-6 text-center"
        >
          Let's Connect & Collaborate
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-purple-100 mb-12 text-center max-w-xl text-lg"
        >
          I'm always open to new opportunities, creative projects, or just a friendly chat!
        </motion.p>

        {/* Floating social links */}
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 w-full max-w-4xl">
          {socials.map((social, index) => (
            <motion.a
              key={social.name}
              href={social.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { 
                opacity: 1, 
                y: [0, -15, 0],
              } : {}}
              transition={{ 
                delay: 1.5 + index * 0.1,
                y: {
                  repeat: Infinity,
                  repeatType: "reverse",
                  duration: 3 + index * 0.5,
                  ease: "easeInOut"
                }
              }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)"
              }}
              className={`bg-gradient-to-br ${social.color} p-6 rounded-2xl shadow-xl backdrop-blur-sm bg-opacity-20 border border-white/10 flex flex-col items-center justify-center gap-3 text-white hover:shadow-2xl transition-all duration-300`}
            >
              <div className="text-3xl">
                {social.icon}
              </div>
              <span className="font-medium">{social.name}</span>
            </motion.a>
          ))}
        </div>

        {/* Floating message bubbles */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          className="mt-16 relative w-full max-w-2xl"
        >
          <motion.div
            animate={{
              x: [-100, 60, -20, 100],
              y: [-700, -600, -300, -100]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
            className="absolute -left-10 -top-10 bg-white/10 backdrop-blur-sm p-4 rounded-full border border-white/20"
          >
            <span className="text-white">👨‍💻 Let's build something!</span>
          </motion.div>

          <motion.div
            animate={{
              x: [0, -150, 40, 30],
              y: [-600, -400, -200, -100]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
              delay: 0.5
            }}
            className="absolute -right-10 top-20 bg-white/10 backdrop-blur-sm p-4 rounded-full border border-white/20"
          >
            <span className="text-white">💡 Got an idea?</span>
          </motion.div>
        </motion.div>

        {/* Animated background elements */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear"
          }}
          className="absolute -left-20 top-1/4 w-40 h-40 rounded-full bg-purple-600/20 blur-xl -z-10"
        />

        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
            rotate: [0, -180, -360]
          }}
          transition={{
            duration: 40,
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear",
            delay: 10
          }}
          className="absolute -right-20 bottom-1/4 w-60 h-60 rounded-full bg-pink-600/20 blur-xl -z-10 mb-96"
        />
      </div>
    </div>
  );
}