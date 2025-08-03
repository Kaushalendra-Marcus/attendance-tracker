import React from 'react'
import Link from 'next/link'
const Footer = () => {
    return (
        <div>
            <footer className="bg-purple-900/80 backdrop-blur-md border-t border-purple-700/50">
                <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-white">
                            <span>© {new Date().getFullYear()} MyAttendance</span>
                            <span className="hidden sm:block">•</span>
                            <span>All rights reserved</span>
                        </div>
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
                </div>
            </footer>
        </div>
    )
}

export default Footer
