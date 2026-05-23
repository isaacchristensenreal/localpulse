"use client"

import { Fragment } from "react"
import { motion } from "framer-motion"
import { FadeInSection } from "./FadeInSection"

interface Step {
  num: string
  emoji: string
  title: string
  desc: string
  emojiBg: string
  cardGradient: string
}

const STEPS: Step[] = [
  {
    num: "01",
    emoji: "🏛️",
    title: "Enter your ZIP",
    desc: "Type your 5-digit ZIP code to target updates from your city, county, and state.",
    emojiBg: "bg-blue-500/10 ring-1 ring-blue-500/20",
    cardGradient:
      "bg-gradient-to-br from-white to-blue-50/60 dark:from-white/5 dark:to-blue-950/20",
  },
  {
    num: "02",
    emoji: "📋",
    title: "We scan government sources",
    desc: "We pull from Congress.gov, state legislatures, and local government databases daily.",
    emojiBg: "bg-violet-500/10 ring-1 ring-violet-500/20",
    cardGradient:
      "bg-gradient-to-br from-white to-violet-50/60 dark:from-white/5 dark:to-violet-950/20",
  },
  {
    num: "03",
    emoji: "🗳️",
    title: "Get plain English results",
    desc: "Complex policy documents are translated into two-sentence summaries anyone can understand.",
    emojiBg: "bg-emerald-500/10 ring-1 ring-emerald-500/20",
    cardGradient:
      "bg-gradient-to-br from-white to-emerald-50/60 dark:from-white/5 dark:to-emerald-950/20",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-5xl px-6 py-20 md:py-28">
      <FadeInSection className="mb-20 text-center">
        <h2 className="text-3xl font-bold text-primary dark:text-surface md:text-4xl">
          How LocalPulse works
        </h2>
        <div className="mx-auto mt-3 h-0.5 w-16 rounded-full bg-accent" />
      </FadeInSection>

      {/*
        Desktop: 5-column grid — card | connector | card | connector | card
        Mobile:  single column, cards stacked vertically
      */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_48px_1fr_48px_1fr] md:gap-0">
        {STEPS.map((step, i) => (
          <Fragment key={step.num}>
            <FadeInSection
              delay={i * 0.15}
              className="relative flex flex-col items-center rounded-2xl border border-border/50 p-8 text-center shadow-sm"
            >
              {/* Card gradient background */}
              <div
                className={`absolute inset-0 rounded-2xl ${step.cardGradient}`}
                style={{ zIndex: 0 }}
              />

              {/* Faint oversized step number */}
              <span
                className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 select-none text-[8rem] font-black leading-none text-primary/[0.04] dark:text-surface/[0.04]"
                style={{ zIndex: 0 }}
                aria-hidden
              >
                {step.num}
              </span>

              {/* Emoji icon square with hover animation */}
              <motion.div
                whileHover={{ rotate: 5, scale: 1.08 }}
                transition={{ type: "spring", stiffness: 400, damping: 18 }}
                className={`relative mb-5 rounded-2xl p-4 ${step.emojiBg}`}
                style={{ zIndex: 1 }}
              >
                <span className="text-3xl leading-none" role="img" aria-hidden>
                  {step.emoji}
                </span>
              </motion.div>

              <h3 className="relative mb-2 text-base font-semibold text-primary dark:text-surface" style={{ zIndex: 1 }}>
                {step.title}
              </h3>
              <p className="relative mx-auto max-w-[220px] text-sm leading-relaxed text-muted" style={{ zIndex: 1 }}>
                {step.desc}
              </p>
            </FadeInSection>

            {/* Dashed connector — desktop only */}
            {i < STEPS.length - 1 && (
              <div
                className="hidden items-start justify-center pt-[60px] md:flex"
                aria-hidden
              >
                <div className="w-full border-t-2 border-dashed border-border" />
              </div>
            )}
          </Fragment>
        ))}
      </div>
    </section>
  )
}
