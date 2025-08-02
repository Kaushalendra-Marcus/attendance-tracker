"use client"
import Link from "next/link"
import { useUser } from "@/app/context/useContext"
import { motion, AnimatePresence } from "framer-motion"

export const MobileNavigation = ({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean
  onClose: () => void 
}) => {
  const { name, rollNo, branch } = useUser()

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
            <NavLink href="/analytics" onClick={onClose}>
              Analytics
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
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-medium">
                  {name?.charAt(0).toUpperCase() || 'U'}
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">{name || 'User'}</p>
                <p className="text-xs text-purple-200">
                  {rollNo && `${rollNo} • `}{branch || 'Student'}
                </p>
              </div>
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
  onClick: () => void
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
      className={`block px-3 py-2 rounded-md text-base font-medium ${
        isActive 
          ? 'text-white bg-purple-800/50' 
          : 'text-purple-200 hover:text-white hover:bg-purple-700/30'
      }`}
    >
      {children}
    </Link>
  </motion.div>
)