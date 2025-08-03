"use client"

import Link from "next/link"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import User from "./user"
import UserMobile from "./UserMobile"
import { FiHome, FiPieChart, FiCalendar, FiSettings, FiMenu, FiX } from "react-icons/fi"
import Image from "next/image"

interface NavLinkProps {
    href: string
    onClick?: () => void
    children: React.ReactNode
    isActive?: boolean
    icon: React.ComponentType<{ className?: string }>
}

const NavLink = ({ href, onClick, children, isActive = false, icon: Icon }: NavLinkProps) => (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Link
            href={href}
            onClick={onClick}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive
                ? 'text-white bg-purple-800/50'
                : 'text-purple-200 hover:text-white hover:bg-purple-700/30'
                }`}
        >
            <Icon className="text-lg" />
            {children}
        </Link>
    </motion.div>
)

interface MobileNavigationProps {
    isOpen: boolean
    onClose: () => void
}

const MobileNavigation = ({ isOpen, onClose }: MobileNavigationProps) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="md:hidden overflow-hidden absolute top-16 left-0 right-0 z-50 bg-purple-900/95 backdrop-blur-lg"
                >
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <NavLink href="/" onClick={onClose} isActive icon={FiHome}>
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

export const Navigation = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return (
        <nav className="bg-purple-900/80 backdrop-blur-md border-b border-purple-700/50 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <motion.div
                            className="text-white font-bold text-xl flex-shrink-0"
                            whileHover={{ scale: 1.05 }}
                        >
                            <div className="flex gap-3 items-center group">
                                <Link href="/" className="flex items-center gap-3">
                                    <motion.div
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="relative"
                                    >
                                        <Image
                                            src="/icon.png"
                                            alt="MyAttendance Logo"
                                            width={42}
                                            height={42}
                                            className="bg-gradient-to-br from-purple-600/40 to-blue-500/40 rounded-xl p-1.5 shadow-lg hover:shadow-purple-500/20 transition-all"
                                        />
                                        <span className="absolute inset-0 border-2 border-purple-400/30 rounded-xl pointer-events-none" />
                                    </motion.div>

                                    <motion.span
                                        className="text-xl font-bold bg-gradient-to-r from-purple-200 to-white bg-clip-text text-transparent"
                                        whileHover={{ scale: 1.02 }}
                                    >
                                        MyAttendance
                                    </motion.span>
                                </Link>
                            </div>
                        </motion.div>

                        <div className="hidden md:block ml-10">
                            <div className="flex items-baseline space-x-4">
                                <NavLink href="/" isActive icon={FiHome}>
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
                            </div>
                        </div>
                    </div>

                    <div className="hidden md:block">
                        <div className="ml-4 flex items-center md:ml-6">
                            <User />
                        </div>
                    </div>

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
                                <FiX className="h-6 w-6" />
                            ) : (
                                <FiMenu className="h-6 w-6" />
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
    )
}