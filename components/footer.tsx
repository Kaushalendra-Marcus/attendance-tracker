"use client"
import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

const Footer = () => {
    return (
        <footer className="relative bg-black/30 backdrop-blur-xl border-t border-white/10 overflow-hidden">

            <div className="absolute inset-0">
                <motion.div
                    className="absolute -top-20 -left-20 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.2, 0.4, 0.2],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div
                    className="absolute -bottom-20 -right-20 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl"
                    animate={{
                        scale: [1.3, 1, 1.3],
                        opacity: [0.4, 0.2, 0.4],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            </div>


            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:50px_50px]" />
            </div>


            {[...Array(20)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute rounded-full"
                    initial={{
                        x: Math.random() * 100,
                        y: Math.random() * 100,
                        width: Math.random() * 3 + 1,
                        height: Math.random() * 3 + 1,
                        background: `rgba(${Math.floor(Math.random() * 100 + 155)}, ${Math.floor(Math.random() * 100 + 155)}, 255, ${Math.random() * 0.3 + 0.1})`,
                        filter: `blur(${Math.random()}px)`,
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
                        ease: "easeInOut"
                    }}
                />
            ))}

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8">

                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="flex flex-col items-center md:items-start gap-2"
                    >
                        <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
                            MyAttendance
                        </span>
                        <div className="flex items-center gap-2 text-sm text-purple-200/70">
                            <span>© {new Date().getFullYear()}</span>
                            <span className="text-purple-400">•</span>
                            <span>All rights reserved</span>
                        </div>
                    </motion.div>


                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="flex flex-wrap justify-center gap-6 md:gap-8"
                    >
                        {[
                            { href: "/about-us", label: "About Us" },
                            { href: "/contact-us", label: "Contact Us" },
                            { href: "/privacy-policy", label: "Privacy Policy" },
                            { href: "/terms-of-service", label: "Terms of Service" },
                        ].map((link, index) => (
                            <motion.div
                                key={link.href}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <Link
                                    href={link.href}
                                    className="relative text-sm text-purple-200/70 hover:text-white transition-all duration-300 group"
                                >
                                    <span className="relative z-10">{link.label}</span>
                                    <motion.div
                                        className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-indigo-400"
                                        whileHover={{ width: "100%" }}
                                        transition={{ duration: 0.3 }}
                                    />
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>


                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="flex items-center gap-4"
                    >
                        <Link href="https://x.com/Kaushal__marcus" className='cursor-pointer'>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className="relative p-3 cursor-pointer rounded-full bg-white/5 backdrop-blur-sm border border-white/10 hover:border-purple-400/50 transition-all duration-300 group"
                            >
                                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 blur opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
                                <svg className="w-5 h-5 text-purple-300 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                </svg>
                            </motion.button>
                        </Link>

                        <Link href="https://github.com/Kaushalendra-Marcus/" className='cursor-pointer'>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className="relative p-3 cursor-pointer rounded-full bg-white/5 backdrop-blur-sm border border-white/10 hover:border-purple-400/50 transition-all duration-300 group"
                            >
                                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 blur opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
                                <svg className="w-5 h-5 text-purple-300 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                </svg>

                            </motion.button>
                        </Link>
                        <Link href="#" className='cursor-pointer'>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className="relative p-3 cursor-pointer rounded-full bg-white/5 backdrop-blur-sm border border-white/10 hover:border-purple-400/50 transition-all duration-300 group"
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (navigator.share) {
                                        // Use Web Share API if available (mobile devices)
                                        navigator.share({
                                            title: 'Check out myAttendance',
                                            text: 'I found an app that can track your attendance of each subject/lab, Checkout now 👇👇',
                                            url: window.location.href,
                                        }).catch(console.error);
                                    } else {
                                        const shareUrl = `https://api.whatsapp.com/send?text=Check out my timetable: ${encodeURIComponent(window.location.href)}`;
                                        window.open(shareUrl, '_blank', 'width=600,height=400');
                                    }
                                }}
                            >
                                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 blur opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
                                <svg
                                    className="w-5 h-5 text-purple-300 group-hover:text-white transition-colors"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" />
                                </svg>
                            </motion.button>
                        </Link>
                    </motion.div>
                </div>

                <motion.div
                    className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent"
                    initial={{ opacity: 0, scaleX: 0 }}
                    whileInView={{ opacity: 1, scaleX: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    viewport={{ once: true }}
                />
            </div>
        </footer>
    )
}

export default Footer