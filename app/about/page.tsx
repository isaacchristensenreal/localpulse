import type { Metadata } from "next"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { FadeInSection } from "@/components/FadeInSection"

export const metadata: Metadata = {
  title: "About",
  description:
    "LocalPulse exists to make government accessible to everyone — especially young Americans who deserve to understand the laws being made in their name.",
}

const DATA_SOURCES = [
  {
    name: "Congress.gov",
    url: "https://congress.gov",
    desc: "Federal bills, votes, and legislative activity from the U.S. Congress",
  },
  {
    name: "OpenStates",
    url: "https://openstates.org",
    desc: "State legislature bills, votes, and representative data across all 50 states",
  },
  {
    name: "Federal Register",
    url: "https://federalregister.gov",
    desc: "Federal regulatory notices, rule changes, and executive orders",
  },
]

const HOW_IT_WORKS = [
  [
    "Enter your ZIP code",
    "We use your ZIP code to pull government activity at the federal, state, and local level that directly affects your area.",
  ],
  [
    "We scan official sources",
    "Every day, we pull the latest bills, votes, and regulatory changes from official government databases.",
  ],
  [
    "AI summarizes in plain English",
    "We use GPT-4o Mini to translate dense legislative language into two-sentence summaries anyone can understand.",
  ],
]

export default function AboutPage() {
  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-2xl px-6 pb-24 pt-28">
        {/* Header */}
        <FadeInSection>
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            About
          </span>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-primary dark:text-surface">
            What is LocalPulse?
          </h1>
        </FadeInSection>

        {/* Mission */}
        <FadeInSection delay={0.1} className="mt-12">
          <h2 className="mb-4 text-xl font-semibold text-primary dark:text-surface">
            Our Mission
          </h2>
          <p className="text-lg leading-relaxed text-muted">
            LocalPulse exists to make government accessible to everyone —
            especially young Americans who deserve to understand the laws being
            made in their name.
          </p>
          <p className="mt-4 leading-relaxed text-muted">
            Government decisions shape where we live, how much we pay in taxes,
            what our schools teach, and the roads we drive on. But policy
            documents are written by lawyers for lawyers. LocalPulse translates
            them into plain English so everyone can stay informed.
          </p>
        </FadeInSection>

        {/* How it works */}
        <FadeInSection delay={0.15} className="mt-12">
          <h2 className="mb-6 text-xl font-semibold text-primary dark:text-surface">
            How It Works
          </h2>
          <ol className="space-y-5">
            {HOW_IT_WORKS.map(([title, desc], i) => (
              <li key={i} className="flex gap-4">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-bold text-accent">
                  {i + 1}
                </span>
                <div>
                  <p className="font-semibold text-primary dark:text-surface">
                    {title}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-muted">
                    {desc}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </FadeInSection>

        {/* Data sources */}
        <FadeInSection delay={0.2} className="mt-12">
          <h2 className="mb-4 text-xl font-semibold text-primary dark:text-surface">
            Data Sources
          </h2>
          <div className="flex flex-col gap-3">
            {DATA_SOURCES.map((source) => (
              <a
                key={source.name}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-border bg-white/80 p-4 transition-colors hover:bg-slate-50 dark:bg-primary/20 dark:hover:bg-white/5"
              >
                <p className="font-semibold text-accent">{source.name}</p>
                <p className="mt-0.5 text-sm text-muted">{source.desc}</p>
              </a>
            ))}
          </div>
        </FadeInSection>

        {/* Footer note */}
        <FadeInSection delay={0.25} className="mt-16 border-t border-border pt-10 text-center">
          <p className="text-sm text-muted">Built with ❤️ for civic engagement</p>
          <p className="mt-2 text-xs text-muted/60">
            LocalPulse is free, non-partisan, and always will be. AI summaries
            may not capture every nuance of the original legislation — always
            read the source.
          </p>
        </FadeInSection>
      </main>

      <Footer />
    </>
  )
}
