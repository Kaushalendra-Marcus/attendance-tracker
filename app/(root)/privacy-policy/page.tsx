"use client"
import { motion } from "framer-motion";

import { Navigation } from "@/components/navigation";
import Footer from "@/components/footer";

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen relative overflow-hidden">
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:50px_50px]" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/60 via-purple-700/60 to-purple-500/60 -z-10" />

            <Navigation />

            <motion.main
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8 relative"
            >
                <div className="text-center mb-12">
                    <motion.h1
                        className="text-4xl font-bold text-white mb-4"
                        initial={{ y: -20 }}
                        animate={{ y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        Privacy Policy
                    </motion.h1>
                    <p className="text-lg text-purple-200">
                        Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>

                <motion.div
                    className="bg-white/10 backdrop-blur-lg rounded-xl p-8 md:p-12 border border-purple-300/20 shadow-xl"
                    initial={{ scale: 0.98 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-white mb-4">1. Introduction</h2>
                        <div className="bg-green-50 p-4 rounded-lg mb-4">
                            <p className="text-gray-600 mb-4">
                                Welcome to Attendance Marker ("we", "our", or "us"). We are committed to protecting your privacy and ensuring the security of your personal information.
                            </p>
                            <p className="text-gray-600">
                                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our attendance tracking application that calculates attendance between two dates.
                            </p>
                        </div>

                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-white mb-4">2. Information We Collect</h2>
                        <div className="bg-blue-50 p-4 rounded-lg mb-4">
                            <h3 className="text-lg font-medium text-purple-700 mb-2">2.1 Personal Information</h3>
                            <ul className="list-disc pl-6 text-gray-600 space-y-2">
                                <li>Name and contact information</li>
                                <li>Attendance records including dates and times</li>
                                <li>Device information (for app functionality)</li>
                            </ul>
                        </div>

                        <div className="bg-yellow-50 rounded-lg p-4">
                            <h3 className="text-lg font-medium text-yellow-700 mb-2">2.2 Usage Data</h3>
                            <p className="text-gray-600">
                                We may collect information about how you interact with our application, including frequency of use, features accessed, and duration of sessions.
                            </p>
                        </div>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-white mb-4">3. How We Use Your Information</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <h3 className="text-lg font-medium text-blue-700 mb-2">Attendance Tracking</h3>
                                <p className="text-gray-600">
                                    To calculate and maintain accurate attendance records between selected dates.
                                </p>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg">
                                <h3 className="text-lg font-medium text-green-700 mb-2">App Improvement</h3>
                                <p className="text-gray-600">
                                    To analyze usage patterns and enhance application functionality.
                                </p>
                            </div>
                            <div className="bg-purple-50 p-4 rounded-lg">
                                <h3 className="text-lg font-medium text-purple-700 mb-2">Communication</h3>
                                <p className="text-gray-600">
                                    To respond to inquiries and provide important application updates.
                                </p>
                            </div>
                            <div className="bg-yellow-50 p-4 rounded-lg">
                                <h3 className="text-lg font-medium text-yellow-700 mb-2">Security</h3>
                                <p className="text-gray-600">
                                    To detect and prevent fraudulent activity and ensure system security.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-white mb-4">4. Data Security</h2>
                        <div className="bg-blue-50 rounded-lg p-4">
                            <p className="text-gray-600 mb-4">
                                We implement appropriate technical and organizational measures to protect your personal information, including:
                            </p>
                            <ul className="list-disc pl-6 text-gray-600 space-y-2">
                                <li>Encryption of sensitive data</li>
                                <li>Secure server infrastructure</li>
                                <li>Regular security audits</li>
                                <li>Access controls to personal information</li>
                            </ul>
                        </div>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-white mb-4">5. Data Retention</h2>
                        <div className="bg-blue-50 rounded-lg p-4">
                            <p className="text-gray-600">
                                We retain your attendance records only for as long as necessary to provide our services and for legitimate business purposes. You may request deletion of your data at any time.
                            </p>
                        </div>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-white mb-4">6. Your Rights</h2>
                        <div className="bg-purple-50 rounded-lg p-4">
                            <div className="space-y-3">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 h-5 w-5 text-purple-300 mt-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="green">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <p className="ml-3 text-gray-600">Right to access your personal information</p>
                                </div>
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 h-5 w-5 text-purple-300 mt-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="green">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <p className="ml-3 text-gray-600">Right to correct inaccurate data</p>
                                </div>
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 h-5 w-5 text-purple-300 mt-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="green">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <p className="ml-3 text-gray-600">Right to request deletion of your data</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">7. Contact Us</h2>
                        <div className="bg-purple-900/30 rounded-lg p-4">
                            <p className="text-purple-100 mb-3">
                                If you have any questions about this Privacy Policy, please contact us at:
                            </p>
                            <a 
                            href="mailto:yadavkausha4a5@gmail.com"
                            target="_blank"
                            >
                            <div className="bg-purple-800/50 p-3 block rounded-lg border border-purple-700/30 cursor-pointer">
                                <p className="text-purple-50 text-center break-words">yadavkausha4a5@gmail.com</p>
                            </div>
                            </a>
                        </div>
                    </section>
                </motion.div>
            </motion.main>

            <Footer />
        </div>
    );
}