"use client"

import { FadeInSection } from "./FadeInSection"
import { ResultCard } from "./ResultCard"
import type { Result } from "@/types"

const EXAMPLES: Result[] = [
  {
    id: "ex1",
    category: "housing",
    title: "Iowa Rent Control Ordinance Amendment",
    plain_summary:
      "The city council voted to amend the rent stabilization ordinance capping annual increases at 5% for units built before 2010.",
    this_means:
      "This could mean your landlord cannot raise your rent more than 5% this year if you live in an older building.",
    bill_number: "HF 1234",
    level: "state",
    bill_status: "In Committee",
    sponsor: "Rep. Jane Smith",
    sponsor_party: "D",
    sponsor_state: "IA",
    vote_result: null,
    source_url: "#",
    published_at: "2026-05-01T00:00:00Z",
    committee: null,
  },
  {
    id: "ex2",
    category: "taxes",
    title: "Polk County Property Tax Assessment Update",
    plain_summary:
      "Polk County revised property assessments upward by an average of 8% following the annual review.",
    this_means:
      "This could mean your property tax bill increases by roughly $200–400 annually depending on your home value.",
    bill_number: "SB 567",
    level: "state",
    bill_status: "Passed",
    sponsor: "Sen. John Doe",
    sponsor_party: "R",
    sponsor_state: "IA",
    vote_result: "Passed 28-22",
    source_url: "#",
    published_at: "2026-04-15T00:00:00Z",
    committee: null,
  },
  {
    id: "ex3",
    category: "schools",
    title: "Des Moines School District Budget Reallocation",
    plain_summary:
      "The school board approved a $2.3M reallocation from administrative costs to classroom technology.",
    this_means:
      "This could mean better-equipped classrooms and more competitive teacher pay in your local district.",
    bill_number: "HR 890",
    level: "federal",
    bill_status: "Signed into Law",
    sponsor: "Rep. Mike Johnson",
    sponsor_party: "R",
    sponsor_state: "IA",
    vote_result: "Passed 67-33",
    source_url: "#",
    published_at: "2026-03-20T00:00:00Z",
    committee: null,
  },
  {
    id: "ex4",
    category: "roads",
    title: "I-235 Interchange Expansion Project Approved",
    plain_summary:
      "IDOT approved a $47M expansion of the I-235 and Merle Hay Road interchange with construction beginning Q3 2026.",
    this_means:
      "This could mean increased traffic and lane closures near Merle Hay Road for approximately 18 months.",
    bill_number: "SB 445",
    level: "state",
    bill_status: "Introduced",
    sponsor: "Sen. Carol White",
    sponsor_party: "D",
    sponsor_state: "IA",
    vote_result: null,
    source_url: "#",
    published_at: "2026-05-10T00:00:00Z",
    committee: null,
  },
]

export function ExampleResults() {
  function scrollToHero() {
    document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section id="examples" className="mx-auto max-w-2xl px-6 py-20 md:py-28">
      {/* Heading */}
      <FadeInSection className="mb-12 text-center">
        <h2 className="text-3xl font-bold text-primary dark:text-surface md:text-4xl">
          Here&apos;s what you&apos;ll see
        </h2>
        <p className="mt-4 text-muted">
          Real-style updates from your city, county, and state — all in plain English.
        </p>
      </FadeInSection>

      {/* Example cards */}
      <div className="flex flex-col gap-5">
        {EXAMPLES.map((result, i) => (
          <FadeInSection key={result.id} delay={i * 0.12}>
            <ResultCard result={result} index={i} />
          </FadeInSection>
        ))}
      </div>

      {/* CTA */}
      <FadeInSection className="mt-12 flex justify-center" delay={0.1}>
        <button
          type="button"
          onClick={scrollToHero}
          className="rounded-xl bg-accent px-8 py-4 text-base font-semibold text-white shadow-lg shadow-accent/20 transition-opacity hover:opacity-90 active:opacity-75"
        >
          Enter your ZIP to see real updates
        </button>
      </FadeInSection>
    </section>
  )
}
