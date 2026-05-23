"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"

export default function NotFound() {
  return (
    <>
      <Navbar />
      <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-24 text-center">
        {/* Faint "404" background */}
        <span
          className="pointer-events-none absolute select-none text-[clamp(10rem,30vw,20rem)] font-black leading-none text-primary/[0.04] dark:text-surface/[0.04]"
          aria-hidden
        >
          404
        </span>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative flex flex-col items-center gap-4"
        >
          <h1 className="text-3xl font-bold text-primary dark:text-surface">
            Page not found
          </h1>
          <p className="max-w-sm text-base text-muted">
            The bill or ZIP code you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link
            href="/"
            className="mt-2 inline-flex items-center rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 active:opacity-75"
          >
            Go back home
          </Link>
        </motion.div>
      </div>
      <Footer />
    </>
  )
}
