"use client";
import Footer from "@/components/footer";
import { Hero } from "@/components/hero";
import { Navigation } from "@/components/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/context/useContext";

export default function Home() {
  const [showHome, setShowHome] = useState(false);
  const { rollNo } = useUser(); 
  const router = useRouter();

  useEffect(() => {
    const storedData = localStorage.getItem("userData");
    const localRollNo = storedData ? JSON.parse(storedData).rollNo : null;

    if (!rollNo && !localRollNo) {
      router.push("/sign-in"); // ✅ redirect to sign-in page
    } else {
      const timer = setTimeout(() => {
        setShowHome(true);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [rollNo, router]);

  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        {!showHome ? (
          <motion.div
            key="logo-screen"
            className="flex items-center justify-center w-full h-screen bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -500 }}
            transition={{ duration: 0.4 }}
          >
            <motion.div
              className="relative w-64 h-64 md:w-80 md:h-80"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{
                duration: 1,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
            >
              <Image
                src="/icon.png"
                alt="Logo"
                fill
                className="object-contain"
                priority
              />
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="main-content"
            className="min-h-screen"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.1, ease: "easeOut" }}
          >
            <Navigation />
            <Hero />
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
