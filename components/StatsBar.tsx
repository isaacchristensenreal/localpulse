"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import { FadeInSection } from "./FadeInSection"

const STATS = [
  { value: "50", label: "States covered", numeric: 50 },
  { value: "3", label: "Government layers", numeric: 3 },
  { value: "Daily", label: "Data refresh", numeric: null },
  { value: "Free", label: "Always", numeric: null },
]

function AnimatedNumber({ target }: { target: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [display, setDisplay] = useState(0)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return
    const start = performance.now()
    const duration = 1500
    let raf: number
    const step = (now: number) => {
      const p = Math.min((now - start) / duration, 1)
      const eased = 1 - (1 - p) ** 3
      setDisplay(Math.round(eased * target))
      if (p < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [isInView, target])

  return <span ref={ref}>{display}</span>
}

function StatItem({
  value,
  label,
  numeric,
}: (typeof STATS)[0]) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })

  return (
    <div ref={ref} className="relative flex flex-col items-center text-center">
      {/* Pulsing ring behind the number */}
      <motion.div
        className="absolute top-0 left-1/2 h-16 w-16 -translate-x-1/2 -translate-y-2 rounded-full border-2 border-accent/25"
        animate={
          isInView
            ? { scale: [1, 1.7, 1], opacity: [0.5, 0, 0.5] }
            : { scale: 1, opacity: 0 }
        }
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
      />
      <span className="relative text-3xl font-black text-accent">
        {numeric !== null ? <AnimatedNumber target={numeric} /> : value}
      </span>
      <span className="mt-1.5 text-sm text-white/70">{label}</span>
    </div>
  )
}

export function StatsBar() {
  return (
    <div className="w-full border-y border-white/5 bg-[#0D1B2A]">
      <div className="mx-auto max-w-5xl px-6 py-20 md:py-28">
        <FadeInSection className="mb-14 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/35">
            By the numbers
          </p>
        </FadeInSection>
        <div className="grid grid-cols-2 gap-12 md:grid-cols-4">
          {STATS.map((stat) => (
            <StatItem key={stat.label} {...stat} />
          ))}
        </div>
      </div>
    </div>
  )
}
