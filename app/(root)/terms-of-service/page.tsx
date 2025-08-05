"use client"
import { motion } from "framer-motion";

import { Navigation } from "@/components/navigation";
import Footer from "@/components/footer";

export default function TermsOfService() {
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
            Terms of Service
          </motion.h1>
          <p className="text-lg text-purple-200">
            Effective: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <motion.div 
          className="bg-white/10 backdrop-blur-lg rounded-xl p-8 md:p-12 border border-purple-300/20 shadow-xl"
          initial={{ scale: 0.98 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
            <div className="bg-blue-50/70 p-4 rounded-lg border border-blue-200/50">
              <p className="text-blue-900">
                By accessing or using the Attendance Marker application, you agree to be bound by these Terms of Service. 
                If you do not agree to all the terms, you may not use our service.
              </p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-white mb-4">2. Service Description</h2>
            <div className="bg-green-50/70 p-4 rounded-lg border border-green-200/50">
              <p className="text-green-900">
                Attendance Marker is a digital solution designed to track and calculate attendance between specified dates. 
                The service provides analytics and reporting features for attendance management.
              </p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-white mb-4">3. User Responsibilities</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-yellow-50/70 p-4 rounded-lg border border-yellow-200/50">
                <h3 className="text-lg font-medium text-yellow-900 mb-2">Account Security</h3>
                <p className="text-yellow-800">
                  You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.
                </p>
              </div>
              <div className="bg-orange-50/70 p-4 rounded-lg border border-orange-200/50">
                <h3 className="text-lg font-medium text-orange-900 mb-2">Data Accuracy</h3>
                <p className="text-orange-800">
                  You must ensure all attendance data entered is accurate and complies with applicable laws.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-white mb-4">4. Prohibited Conduct</h2>
            <div className="bg-red-50/70 p-4 rounded-lg border border-red-200/50">
              <ul className="list-disc pl-6 space-y-2 text-red-900">
                <li>Using the service for illegal purposes</li>
                <li>Attempting to compromise system security</li>
                <li>Misrepresenting attendance data</li>
                <li>Sharing accounts with unauthorized users</li>
              </ul>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-white mb-4">5. Intellectual Property</h2>
            <div className="bg-indigo-50/70 p-4 rounded-lg border border-indigo-200/50">
              <p className="text-indigo-900">
                All content, features, and functionality of Attendance Marker are the exclusive property of our company 
                and are protected by international copyright, trademark, and other intellectual property laws.
              </p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-white mb-4">6. Limitation of Liability</h2>
            <div className="bg-purple-50/70 p-4 rounded-lg border border-purple-200/50">
              <p className="text-purple-900">
                Attendance Marker shall not be liable for any indirect, incidental, special, consequential, or punitive damages 
                resulting from your use of or inability to use the service.
              </p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-white mb-4">7. Modifications</h2>
            <div className="bg-teal-50/70 p-4 rounded-lg border border-teal-200/50">
              <p className="text-teal-900">
                We reserve the right to modify these terms at any time. Continued use after changes constitutes acceptance 
                of the modified terms.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">8. Governing Law</h2>
            <div className="bg-cyan-50/70 p-4 rounded-lg border border-cyan-200/50">
              <p className="text-cyan-900">
                These terms shall be governed by the laws of the jurisdiction where our company is registered, 
                without regard to its conflict of law provisions.
              </p>
            </div>
          </section>
        </motion.div>
      </motion.main>

      <Footer />
    </div>
  );
}