"use client"

import { useState } from "react"
import { Database } from "lucide-react"
import { ResultsList } from "./ResultsList"
import { cn } from "@/lib/utils"
import type { Result, Category } from "@/types"

type Filter = Category | "all"

const PILLS: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "housing", label: "Housing" },
  { value: "taxes", label: "Taxes" },
  { value: "schools", label: "Schools" },
  { value: "roads", label: "Roads" },
  { value: "utilities", label: "Utilities" },
  { value: "safety", label: "Safety" },
]

interface Props {
  results: Result[]
  zipcode: string
}

export function FilterableResults({ results, zipcode }: Props) {
  const [active, setActive] = useState<Filter>("all")

  const filtered =
    active === "all" ? results : results.filter((r) => r.category === active)

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:items-start lg:gap-10">
      {/* Main results — 2/3 width */}
      <div className="min-w-0 lg:col-span-2">
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-border bg-white/60 px-8 py-16 text-center dark:bg-primary/10">
            <p className="text-sm text-muted">
              No {active} updates found for this area.
            </p>
          </div>
        ) : (
          <ResultsList results={filtered} zipcode={zipcode} />
        )}
      </div>

      {/* Sidebar — 1/3 width, sticky on desktop */}
      <aside className="flex flex-col gap-5 lg:sticky lg:top-20">
        {/* Category filter pills */}
        <div className="rounded-xl border border-border bg-white/80 p-4 dark:bg-primary/20">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">
            Filter by category
          </h3>
          <div className="flex flex-wrap gap-2">
            {PILLS.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => setActive(value)}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                  active === value
                    ? "bg-primary text-white dark:bg-white dark:text-primary"
                    : "bg-slate-100 text-muted hover:bg-slate-200 dark:bg-slate-800/60 dark:hover:bg-slate-700/60",
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* About this data */}
        <div className="rounded-xl border border-border bg-white/80 p-4 dark:bg-primary/20">
          <div className="mb-3 flex items-center gap-2">
            <Database className="h-4 w-4 shrink-0 text-accent" />
            <h3 className="text-sm font-semibold text-primary dark:text-surface">
              About this data
            </h3>
          </div>
          <p className="text-xs leading-relaxed text-muted">
            LocalPulse aggregates updates from federal and state government
            sources including{" "}
            <a
              href="https://congress.gov"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-primary dark:hover:text-surface"
            >
              Congress.gov
            </a>
            ,{" "}
            <a
              href="https://openstates.org"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-primary dark:hover:text-surface"
            >
              OpenStates
            </a>
            , and the{" "}
            <a
              href="https://federalregister.gov"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-primary dark:hover:text-surface"
            >
              Federal Register
            </a>
            . Summaries are AI-generated and may not capture every nuance of
            the original legislation.
          </p>
        </div>

        {/* AdSense placeholder */}
        <div className="flex h-[250px] w-[300px] max-w-full items-center justify-center self-start rounded border border-dashed border-border bg-slate-50/80 dark:bg-white/5">
          <p className="text-center text-[10px] uppercase tracking-widest text-muted">
            Advertisement
            <br />
            localpulse.com
          </p>
        </div>
      </aside>
    </div>
  )
}
