"use client"

import { memo, useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { ChevronDown, ExternalLink, Copy } from "lucide-react"
import { toast } from "sonner"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { Result, Category, Level } from "@/types"

const MotionLink = motion(Link)

const categoryConfig: Record<
  Category,
  { border: string; badge: string; label: string }
> = {
  housing: {
    border: "border-l-blue-500",
    badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    label: "Housing",
  },
  taxes: {
    border: "border-l-green-500",
    badge: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
    label: "Taxes",
  },
  schools: {
    border: "border-l-orange-500",
    badge: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
    label: "Schools",
  },
  roads: {
    border: "border-l-yellow-500",
    badge: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
    label: "Roads",
  },
  utilities: {
    border: "border-l-purple-500",
    badge: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
    label: "Utilities",
  },
  safety: {
    border: "border-l-red-500",
    badge: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
    label: "Safety",
  },
  other: {
    border: "border-l-slate-400",
    badge: "bg-slate-100 text-slate-600 dark:bg-slate-800/50 dark:text-slate-400",
    label: "Other",
  },
}

const levelConfig: Record<Level, { label: string; cls: string }> = {
  federal: {
    label: "FEDERAL",
    cls: "bg-[#0D1B2A] text-white dark:bg-white/15 dark:text-white",
  },
  state: {
    label: "STATE",
    cls: "bg-blue-600 text-white",
  },
  local: {
    label: "LOCAL",
    cls: "bg-green-600 text-white",
  },
}

function classifyStatus(status: string | null): { label: string; cls: string } {
  if (!status) return { label: "", cls: "" }
  if (/signed|enacted|became law/i.test(status))
    return {
      label: "Signed into Law",
      cls: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    }
  if (/passed|agreed to/i.test(status))
    return {
      label: "Passed",
      cls: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
    }
  if (/failed|vetoed|rejected|tabled/i.test(status))
    return {
      label: "Failed",
      cls: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
    }
  if (/committee|hearing|markup|referred/i.test(status))
    return {
      label: "In Committee",
      cls: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
    }
  if (/introduced/i.test(status))
    return {
      label: "Introduced",
      cls: "bg-slate-100 text-slate-600 dark:bg-slate-800/60 dark:text-slate-400",
    }
  return {
    label: status.length > 44 ? status.slice(0, 41) + "…" : status,
    cls: "bg-slate-100 text-slate-600 dark:bg-slate-800/60 dark:text-slate-400",
  }
}

function PartyDot({ party }: { party: string | null }) {
  if (!party) return null
  const cls =
    party === "D"
      ? "bg-blue-500"
      : party === "R"
        ? "bg-red-500"
        : "bg-slate-400"
  return (
    <span className={cn("inline-block h-2 w-2 shrink-0 rounded-full", cls)} aria-hidden />
  )
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  } catch {
    return ""
  }
}

const FALLBACK = categoryConfig.other

interface ResultCardProps {
  result: Result
  index: number
  zipcode?: string
}

export const ResultCard = memo(function ResultCard({ result, index, zipcode }: ResultCardProps) {
  const [actionOpen, setActionOpen] = useState(false)

  const {
    id,
    category,
    title,
    plain_summary,
    this_means,
    bill_number,
    level,
    bill_status,
    sponsor,
    sponsor_party,
    sponsor_state,
    vote_result,
    source_url,
    published_at,
  } = result

  const config = categoryConfig[category] ?? FALLBACK
  const lvl = levelConfig[level] ?? levelConfig.federal
  const status = classifyStatus(bill_status)
  const reduceMotion = useReducedMotion()

  async function handleShare() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      toast.success("Copied!")
    } catch {
      toast.error("Couldn't copy link")
    }
  }

  const sponsorLabel = sponsor
    ? [
        sponsor,
        sponsor_party || sponsor_state
          ? `(${[sponsor_party, sponsor_state].filter(Boolean).join("-")})`
          : null,
      ]
        .filter(Boolean)
        .join(" ")
    : null

  return (
    <motion.div
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -32 }}
      animate={reduceMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
      whileHover={reduceMotion ? undefined : { scale: 1.018 }}
      transition={{
        default: {
          type: "spring",
          duration: 0.4,
          bounce: 0.08,
          delay: reduceMotion ? 0 : index * 0.06,
        },
        scale: { type: "spring", duration: 0.2, bounce: 0 },
      }}
      className="cursor-default"
    >
      <Card
        className={cn(
          "border-l-4 bg-white/80 dark:bg-primary/20 ring-1 ring-foreground/8",
          config.border,
        )}
      >
        <div className="flex flex-col gap-3 p-4 sm:p-5">
          {/* Row 1: bill number + level badge */}
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-xs text-muted">
              {bill_number ?? ""}
            </span>
            <span
              className={cn(
                "rounded px-2 py-0.5 text-[10px] font-bold tracking-wider",
                lvl.cls,
              )}
            >
              {lvl.label}
            </span>
          </div>

          {/* Row 2: title */}
          <h3 className="text-base font-semibold leading-snug text-primary dark:text-surface">
            {title}
          </h3>

          {/* Row 3: status pill + category badge */}
          <div className="flex flex-wrap items-center gap-2">
            {status.label && (
              <span
                className={cn(
                  "rounded-full px-2.5 py-0.5 text-xs font-medium",
                  status.cls,
                )}
              >
                {status.label}
              </span>
            )}
            <span
              className={cn(
                "rounded-full px-2.5 py-0.5 text-xs font-medium",
                config.badge,
              )}
            >
              {config.label}
            </span>
          </div>

          {/* Row 4: sponsor */}
          {sponsorLabel && (
            <div className="flex items-center gap-1.5 text-xs text-muted">
              <PartyDot party={sponsor_party} />
              <span>Introduced by {sponsorLabel}</span>
            </div>
          )}

          {/* Row 5: plain summary */}
          <p className="text-sm leading-relaxed text-muted">{plain_summary}</p>

          {/* Row 6: personal impact */}
          <div className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 dark:border-blue-900/30 dark:bg-blue-950/20">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
              This means…
            </p>
            <p className="text-sm leading-relaxed text-blue-800 dark:text-blue-300">
              {this_means}
            </p>
          </div>

          {/* Row 7: vote result (conditional) */}
          {vote_result && (
            <div className="rounded border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700/40 dark:bg-slate-800/30">
              <p className="text-xs text-muted">
                <span className="font-medium text-primary dark:text-surface">
                  Vote:{" "}
                </span>
                {vote_result}
              </p>
            </div>
          )}

          {/* Row 8: footer */}
          <div className="flex items-center justify-between border-t border-border pt-3 text-xs text-muted">
            <MotionLink
              href={zipcode ? `/bill/${id}?zip=${zipcode}` : `/bill/${id}`}
              className="flex items-center gap-1 font-medium text-accent"
              initial="rest"
              whileHover="hover"
              animate="rest"
            >
              View full bill
              <motion.span
                variants={{ rest: { x: 0 }, hover: { x: 4 } }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              >
                →
              </motion.span>
            </MotionLink>
            <span>{formatDate(published_at)}</span>
          </div>

          {/* Row 9: Take Action */}
          <div className="border-t border-border pt-3">
            <button
              type="button"
              onClick={() => setActionOpen((o) => !o)}
              className="flex w-full cursor-pointer items-center justify-between text-xs font-semibold uppercase tracking-wide text-muted transition-colors hover:text-primary dark:hover:text-surface"
            >
              <span>Take Action</span>
              <motion.span
                animate={{ rotate: actionOpen ? 180 : 0 }}
                transition={{ type: "spring", duration: 0.3, bounce: 0 }}
                className="flex items-center"
              >
                <ChevronDown className="h-3.5 w-3.5" />
              </motion.span>
            </button>

            <AnimatePresence initial={false}>
              {actionOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
                  style={{ overflow: "hidden" }}
                >
                  <div className="flex flex-col pt-2">
                    <a
                      href="https://www.congress.gov/members/find-your-member"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm text-primary transition-colors hover:bg-slate-50 dark:text-surface dark:hover:bg-white/5"
                    >
                      <ExternalLink className="h-3.5 w-3.5 shrink-0 text-muted" />
                      Find your representative
                    </a>
                    <a
                      href={source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm text-primary transition-colors hover:bg-slate-50 dark:text-surface dark:hover:bg-white/5"
                    >
                      <ExternalLink className="h-3.5 w-3.5 shrink-0 text-muted" />
                      Read the full bill
                    </a>
                    <button
                      type="button"
                      onClick={handleShare}
                      className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-left text-sm text-primary transition-colors hover:bg-slate-50 dark:text-surface dark:hover:bg-white/5"
                    >
                      <Copy className="h-3.5 w-3.5 shrink-0 text-muted" />
                      Share this update
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Card>
    </motion.div>
  )
})
