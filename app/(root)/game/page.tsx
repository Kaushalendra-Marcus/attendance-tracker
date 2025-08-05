"use client"

import React from 'react'
import { motion } from 'framer-motion'
const page = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900/60 via-purple-700/60 to-purple-500/60 flex items-center justify-center p-4">
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              'radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 50%, rgba(255, 119, 198, 0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 50% 20%, rgba(120, 119, 255, 0.3) 0%, transparent 50%)',
            ]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black/50 to-indigo-900/20" />
      </div>

      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      Comming soon
    </div>
  )
}

export default page
