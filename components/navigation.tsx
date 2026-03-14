"use client"
import Link from "next/link"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import User from "./user"
import UserMobile from "./UserMobile"
import { FiHome, FiPieChart, FiCalendar, FiCheckSquare, FiMenu, FiX, FiInfo, FiLogOut, FiZap, FiHeart } from "react-icons/fi"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useUser } from "@/app/context/useContext"

interface NavLinkProps {
    href: string
    onClick?: () => void
    children: React.ReactNode
    icon: React.ComponentType<{ className?: string }>
}

const NavLink = ({ href, onClick, children, icon: Icon }: NavLinkProps) => {
    const pathname = usePathname()
    const isActive = pathname === href || pathname.startsWith(href + "/")

    return (
        <Link
            href={href}
            onClick={onClick}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${isActive
                    ? "text-white bg-indigo-500/20 border border-indigo-500/40"
                    : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
        >
            <Icon className="text-base flex-shrink-0" />
            {children}
        </Link>
    )
}

const handleLogout = () => {
    localStorage.clear()
    window.location.href = "/sign-in"
}

const NAV_LINKS = [
    { href: "/", label: "Home", icon: FiHome },
    { href: "/timetable", label: "Timetable", icon: FiCalendar },
    { href: "/attendance", label: "Attendance", icon: FiCheckSquare },
    { href: "/dashboard", label: "Dashboard", icon: FiPieChart },
    { href: "/game", label: "Game", icon: FiZap },
    { href: "/appreciate", label: "Appreciate", icon: FiHeart },
    { href: "/about-us", label: "About", icon: FiInfo },
]

export const Navigation = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const { rollNo } = useUser()

    return (
        <nav
            className="sticky top-0 z-50 border-b"
            style={{
                background: "rgba(7, 13, 26, 0.85)",
                borderColor: "var(--border)",
                backdropFilter: "blur(16px)"
            }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
                        <Image src="/icon.png" alt="MyAttendance" width={32} height={32} className="rounded-lg" />
                        <span className="text-base font-bold text-white">MyAttendance</span>
                    </Link>

                    {/* Desktop links */}
                    <div className="hidden md:flex items-center gap-1">
                        {NAV_LINKS.map(l => (
                            <NavLink key={l.href} href={l.href} icon={l.icon}>{l.label}</NavLink>
                        ))}
                    </div>

                    {/* Desktop user + logout */}
                    <div className="hidden md:flex items-center gap-3">
                        <User />
                        {rollNo && (
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-1.5 text-sm font-medium text-slate-400 hover:text-red-400 transition-colors duration-200"
                            >
                                <FiLogOut />
                                Logout
                            </button>
                        )}
                    </div>

                    {/* Mobile hamburger */}
                    <button
                        className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-t overflow-hidden"
                        style={{ borderColor: "var(--border)" }}
                    >
                        <div className="px-4 py-3 space-y-1">
                            {NAV_LINKS.map(l => (
                                <NavLink key={l.href} href={l.href} icon={l.icon} onClick={() => setMobileMenuOpen(false)}>
                                    {l.label}
                                </NavLink>
                            ))}
                        </div>
                        <div className="px-4 pb-4 space-y-2">
                            <UserMobile />
                            {rollNo && (
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-red-400 px-3 py-2 rounded-lg hover:bg-white/5 transition-all"
                                >
                                    <FiLogOut />
                                    Logout
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    )
}
