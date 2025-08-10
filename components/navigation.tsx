"use client"
import Link from "next/link"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import User from "./user"
import UserMobile from "./UserMobile"
import { FiHome, FiPieChart, FiCalendar, FiSettings, FiMenu, FiX, FiInfo,FiPhone } from "react-icons/fi"
import Image from "next/image"
import { usePathname } from "next/navigation"

interface NavLinkProps {
  href: string
  onClick?: () => void
  children: React.ReactNode
  icon: React.ComponentType<{ className?: string }>
}

const NavLink = ({ href, onClick, children, icon: Icon }: NavLinkProps) => {
  const pathname = usePathname()
  const isActive = pathname === href
  
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative group"
    >
      <Link
        href={href}
        onClick={onClick}
        className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300
          ${isActive
            ? 'text-white bg-gradient-to-r from-purple-500/30 to-indigo-500/30 border border-purple-400/50 shadow-lg shadow-purple-500/20'
            : 'text-purple-200 hover:text-white hover:bg-white/5 border border-transparent'
          }`}
      >
        <Icon className="text-lg" />
        {children}
      </Link>
      {isActive && (
        <motion.div
          className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/20 to-indigo-500/20 blur"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </motion.div>
  )
}

interface MobileNavigationProps {
  isOpen: boolean
  onClose: () => void
}
const handleLogout = () => {
  localStorage.clear();
  window.location.href = "/sign-in";
}
const MobileNavigation = ({ isOpen, onClose }: MobileNavigationProps) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="md:hidden absolute top-full left-0 right-0 z-50"
      >
        <div className="mx-4 mt-2">
          <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 space-y-2 shadow-2xl">
            <NavLink href="/" onClick={onClose} icon={FiHome}>
              Home
            </NavLink>
            <NavLink href="/timetable" onClick={onClose} icon={FiCalendar}>
              TimeTable
            </NavLink>
            <NavLink href="/attendance" onClick={onClose} icon={FiSettings}>
              Attendance
            </NavLink>
            <NavLink href="/dashboard" onClick={onClose} icon={FiPieChart}>
              Dashboard
            </NavLink>
            <NavLink href="/contact-us" onClick={onClose} icon={FiPhone}>
              Contact Us
            </NavLink>
            <NavLink href="/about-us" onClick={onClose} icon={FiInfo}>
              About Us
            </NavLink>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-4"
          >
            <UserMobile />
            <motion.button
              onClick={handleLogout}
              whileTap={{ scale: 0.95 }}
              className="w-full text-left mt-4 text-sm font-semibold bg-black/80 text-white hover:text-white px-4 py-2 rounded-xl border-1 border-gray-800  hover:bg-red-600 transition-all duration-300"
            >
              Logout
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
)

export const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className=" bg-black/20 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">

      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-10 -left-10 w-20 h-20 bg-purple-500/20 rounded-full blur-2xl"
          animate={{
            scale: [1, 1.5, 1],
            x: [0, 50, 0],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-10 -right-10 w-20 h-20 bg-indigo-500/20 rounded-full blur-2xl"
          animate={{
            scale: [1.5, 1, 1.5],
            x: [0, -50, 0],
            opacity: [0.4, 0.2, 0.4],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>


      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          initial={{
            x: Math.random() * 100,
            y: Math.random() * 100,
            width: Math.random() * 10 + 1,
            height: Math.random() * 10 + 1,
            background: `rgba(${Math.floor(Math.random() * 100 + 155)}, ${Math.floor(Math.random() * 100 + 155)}, 255, ${Math.random() * 0.3 + 0.1})`,
          }}
          animate={{
            y: [null, Math.random() * 50 - 25],
            x: [null, Math.random() * 50 - 25],
            opacity: [0.1, 1, 0.1],
          }}
          transition={{
            duration: Math.random() * 8 + 8,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        />
      ))}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          <motion.div
            className="flex-shrink-0"
            whileHover={{ scale: 1.02 }}
          >
            <Link href="/" className="flex items-center gap-3">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/40 to-indigo-500/40 rounded-xl blur-lg" />
                <Image
                  src="/icon.png"
                  alt="MyAttendance Logo"
                  width={44}
                  height={44}
                  className="relative bg-gradient-to-br from-purple-600/40 to-indigo-500/40 rounded-xl p-2 shadow-lg"
                />
                <div className="absolute inset-0 border border-purple-400/30 rounded-xl" />
              </motion.div>

              <motion.span
                className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-300 via-white to-indigo-300"
                whileHover={{ scale: 1.05 }}
              >
                MyAttendance
              </motion.span>
            </Link>
          </motion.div>


          <div className="hidden md:block">
            <div className="flex items-center space-x-1">
              <NavLink href="/" icon={FiHome}>
                Home
              </NavLink>
              <NavLink href="/timetable" icon={FiCalendar}>
                TimeTable
              </NavLink>
              <NavLink href="/attendance" icon={FiSettings}>
                Attendance
              </NavLink>
              <NavLink href="/dashboard" icon={FiPieChart}>
                Dashboard
              </NavLink>
              <NavLink href="/about-us" icon={FiInfo}>
                About Us
              </NavLink>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <User />
            </motion.div>
            <motion.button
              onClick={handleLogout}
              whileTap={{ scale: 0.95 }}
              className="text-sm font-semibold bg-transparent cursor-pointer text-white hover:text-white px-4 py-2 rounded-xl border-1 border-gray-800  hover:bg-red-600 transition-all duration-300"
            >
              Logout
            </motion.button>
          </div>

          <div className="md:hidden ">
            <motion.button
              type="button"
              className="relative p-2 rounded-xl text-purple-200 hover:text-white hover:bg-white/5 transition-all duration-300"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              whileTap={{ scale: 0.9 }}
            >
              <span className="sr-only">Open menu</span>
              <motion.div
                animate={{ rotate: mobileMenuOpen ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                {mobileMenuOpen ? (
                  <FiX className="h-6 w-6" />
                ) : (
                  <FiMenu className="h-6 w-6" />
                )}
              </motion.div>
            </motion.button>
          </div>
        </div>
      </div>

      <MobileNavigation
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </nav>
  )
}