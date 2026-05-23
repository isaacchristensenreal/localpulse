"use client"

import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { useState } from "react"

const headline = "What's happening in your neighborhood?"
const words = headline.split(" ")

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.15,
    },
  },
}

const wordVariants = {
  hidden: { opacity: 0, y: 16, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.45,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
}

const AVATARS = [
  { bg: "bg-blue-400", initial: "A" },
  { bg: "bg-emerald-400", initial: "M" },
  { bg: "bg-violet-400", initial: "S" },
]

export function HeroSection() {
  const router = useRouter()
  const [zip, setZip] = useState("")
  const [error, setError] = useState(false)

  function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    const trimmed = zip.trim()
    if (/^\d{5}$/.test(trimmed)) {
      setError(false)
      router.push(`/zip/${trimmed}`)
    } else {
      setError(true)
    }
  }

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-24 text-center">
      {/* Background blobs */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <motion.div
          className="absolute left-1/4 top-1/4 h-[480px] w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/15 blur-[120px]"
          animate={{
            rotate: [0, 360],
            scale: [0.9, 1.1, 0.9],
          }}
          transition={{
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            scale: { duration: 8, repeat: Infinity, ease: "easeInOut" },
          }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/4 h-[560px] w-[400px] translate-x-1/2 rounded-full bg-primary/10 blur-[140px]"
          animate={{
            rotate: [360, 0],
            scale: [1.1, 0.9, 1.1],
          }}
          transition={{
            rotate: { duration: 25, repeat: Infinity, ease: "linear" },
            scale: { duration: 10, repeat: Infinity, ease: "easeInOut" },
          }}
        />
      </div>

      {/* Shimmer pill badge */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="mb-5"
      >
        <div className="relative overflow-hidden rounded-full border border-accent/30 px-4 py-1.5"
          style={{ background: "rgba(37,99,235,0.08)" }}>
          <span className="relative z-10 text-xs font-semibold tracking-wide text-accent">
            Free · No signup required
          </span>
          <motion.span
            className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{ x: ["-150%", "300%"] }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "linear",
              repeatDelay: 1,
            }}
          />
        </div>
      </motion.div>

      <motion.h1
        className="mb-6 max-w-3xl text-5xl font-bold leading-[1.1] tracking-tight text-primary dark:text-surface md:text-6xl lg:text-7xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        aria-label={headline}
      >
        {words.map((word, i) => (
          <motion.span
            key={i}
            variants={wordVariants}
            className="mr-[0.22em] inline-block last:mr-0"
          >
            {word}
          </motion.span>
        ))}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.55, ease: "easeOut" }}
        className="mb-10 max-w-md text-lg leading-relaxed text-muted"
      >
        Real-time local government activity, community events, and policy
        updates — all in one place.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 44 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 26, delay: 0.65 }}
        className="w-full max-w-md"
      >
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <input
            id="zip-input"
            type="text"
            inputMode="numeric"
            maxLength={5}
            value={zip}
            onChange={(e) => {
              setError(false)
              setZip(e.target.value.replace(/\D/g, ""))
            }}
            placeholder="Enter ZIP code"
            aria-label="ZIP code"
            aria-invalid={error}
            className={[
              "h-14 w-full rounded-xl border bg-white/80 px-5 text-base text-primary sm:w-52",
              "placeholder:text-muted backdrop-blur-sm outline-none transition-colors",
              "animate-glow-pulse",
              error
                ? "border-red-400 focus:border-red-400"
                : "border-border focus:border-accent",
            ].join(" ")}
          />
          <button
            type="submit"
            className="h-14 w-full rounded-xl bg-accent px-7 text-base font-semibold text-white transition-opacity hover:opacity-90 active:opacity-75 sm:w-auto"
          >
            Explore
          </button>
        </form>

        {error && (
          <p className="mt-2 text-sm text-red-500">Please enter a valid 5-digit ZIP code.</p>
        )}

        {/* Social proof */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9, ease: "easeOut" }}
          className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
        >
          <div className="flex -space-x-2">
            {AVATARS.map(({ bg, initial }) => (
              <div
                key={initial}
                className={`flex h-7 w-7 items-center justify-center rounded-full border-2 border-white text-[10px] font-bold text-white ${bg}`}
              >
                {initial}
              </div>
            ))}
          </div>
          <p className="text-sm text-muted">Join 1,000+ people staying informed</p>
        </motion.div>
      </motion.div>
    </section>
  )
}
