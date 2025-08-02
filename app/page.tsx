"use client"
import Link from "next/link"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import User from "@/components/user"
import UserMobile from "@/components/UserMobile"

// Mock data - replace with actual data from your database
const stats = [
  { name: 'Total Users', value: '4000+' },
  { name: 'Active Today', value: '789' },
  { name: 'Trust Score', value: '4.8/5' },
  { name: 'Accuracy', value: '98.5%' },
]

const MobileNavigation = ({
  isOpen,
  onClose
}: {
  isOpen: boolean
  onClose: () => void
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden overflow-hidden"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavLink href="/" onClick={onClose} isActive>
              Home
            </NavLink>
            <NavLink href="/dashboard" onClick={onClose}>
              Dashboard
            </NavLink>
            <NavLink href="/timetable" onClick={onClose}>
              TimeTable
            </NavLink>
            <NavLink href="/settings" onClick={onClose}>
              Settings
            </NavLink>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="pt-4 pb-3 border-t border-purple-700/50"
          >
            <div className="flex items-center px-5">
              <UserMobile />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const NavLink = ({
  href,
  onClick,
  children,
  isActive = false
}: {
  href: string
  onClick?: () => void
  children: React.ReactNode
  isActive?: boolean
}) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <Link
      href={href}
      onClick={onClick}
      className={`block px-3 py-2 rounded-md text-sm font-medium ${isActive
          ? 'text-white bg-purple-800/50'
          : 'text-purple-200 hover:text-white hover:bg-purple-700/30'
        }`}
    >
      {children}
    </Link>
  </motion.div>
)

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900/60 via-purple-700/60 to-purple-500/60">
      {/* Navigation */}
      <nav className="bg-purple-900/80 backdrop-blur-md border-b border-purple-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <motion.span
                  className="text-white font-bold text-xl"
                  whileHover={{ scale: 1.05 }}
                >
                  MyAttendance
                </motion.span>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <NavLink href="/" isActive>
                    Home
                  </NavLink>
                  <NavLink href="/dashboard">
                    Dashboard
                  </NavLink>
                  <NavLink href="/timetable">
                    TimeTable
                  </NavLink>
                  <NavLink href="/settings">
                    Settings
                  </NavLink>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">
                <User />
              </div>
            </div>
            {/* Mobile menu button */}
            <div className="-mr-2 flex md:hidden">
              <motion.button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-purple-200 hover:text-white hover:bg-purple-700 focus:outline-none"
                aria-controls="mobile-menu"
                aria-expanded="false"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                whileTap={{ scale: 0.9 }}
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </motion.button>
            </div>
          </div>
        </div>

        <MobileNavigation
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        />
      </nav>

      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">My Attendance</h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">Track your 75% attendance criteria with our reliable system</p>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12">
            {stats.map((stat) => (
              <div key={stat.name} className="bg-purple-800/30 backdrop-blur-sm border border-purple-700/50 rounded-lg p-6 text-center">
                <p className="text-sm font-medium text-purple-200">{stat.name}</p>
                <p className="mt-2 text-3xl font-semibold text-white">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="bg-purple-800/30 backdrop-blur-sm border border-purple-700/50 rounded-xl p-8 mb-12">
            <div className="md:flex items-center justify-between">
              <div className="md:w-2/3 mb-6 md:mb-0">
                <h2 className="text-2xl font-bold text-white mb-2">Start Tracking Now</h2>
                <p className="text-purple-200">Join thousands of students who are managing their attendance effectively.</p>
              </div>
              <div className="flex-shrink-0">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-purple-900 bg-white hover:bg-purple-50 transition-colors"
                >
                  Go to Dashboard
                </Link>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-8 text-center">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-purple-800/30 backdrop-blur-sm border border-purple-700/50 rounded-lg p-6">
                <div className="text-purple-300 mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-white mb-2">Easy Tracking</h3>
                <p className="text-purple-200">Simply flip the buttons to mark your daily attendance with ease.</p>
              </div>
              <div className="bg-purple-800/30 backdrop-blur-sm border border-purple-700/50 rounded-lg p-6">
                <div className="text-purple-300 mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-white mb-2">Real-time Analytics</h3>
                <p className="text-purple-200">Get instant insights into your attendance patterns and progress.</p>
              </div>
              <div className="bg-purple-800/30 backdrop-blur-sm border border-purple-700/50 rounded-lg p-6">
                <div className="text-purple-300 mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-white mb-2">Secure & Private</h3>
                <p className="text-purple-200">Your data is encrypted and never shared with third parties.</p>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center text-white/60 text-sm">
            <p>Flip the buttons to mark your attendance</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-purple-900/80 backdrop-blur-md border-t border-purple-700/50 mt-12">
  <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
      {/* Copyright section */}
      <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-white">
        <span>© {new Date().getFullYear()} MyAttendance</span>
        <span className="hidden sm:block">•</span>
        <span>All rights reserved</span>
      </div>

      {/* Links section */}
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-sm">
        <Link 
          href="/privacy" 
          className="text-purple-200 hover:text-white transition-colors duration-200"
        >
          Privacy Policy
        </Link>
        <Link 
          href="/terms" 
          className="text-purple-200 hover:text-white transition-colors duration-200"
        >
          Terms of Service
        </Link>
        <Link 
          href="/contact" 
          className="text-purple-200 hover:text-white transition-colors duration-200"
        >
          Contact Us
        </Link>
      </div>
    </div>

    {/* Optional additional footer content */}
    <div className="mt-8 pt-6 border-t border-purple-700/50 text-center text-xs text-purple-300">
      <p>MyAttendance is not affiliated with any educational institution.</p>
    </div>
  </div>
</footer>
    </div>
  )
}