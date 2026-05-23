"use client"

import { motion } from "framer-motion"

export default function Loading() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex min-h-screen flex-col items-center justify-center gap-4"
    >
      <svg
        width="48"
        height="48"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <circle cx="32" cy="32" r="30" fill="#0D1B2A" />
        <text
          x="32"
          y="41"
          textAnchor="middle"
          fontFamily="'Geist', 'Inter', 'Helvetica Neue', Arial, sans-serif"
          fontSize="22"
          fontWeight="700"
          fill="#FFFFFF"
          letterSpacing="-0.5"
        >
          LP
        </text>
        <circle cx="47" cy="17" r="5" fill="#2563EB" className="animate-pulse-dot" />
      </svg>
      <p className="text-sm text-muted">Loading updates…</p>
    </motion.div>
  )
}
