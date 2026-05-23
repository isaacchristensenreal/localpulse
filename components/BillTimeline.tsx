"use client"

import { motion, useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"

const STAGES = ["Introduced", "In Committee", "Voted", "Enacted"] as const

function getStageIndex(billStatus: string | null, voteResult: string | null): number {
  if (!billStatus) return 0
  if (/signed|enacted|became law/i.test(billStatus)) return 3
  if (/passed|failed|agreed|rejected|vetoed/i.test(billStatus) || voteResult) return 2
  if (/committee|hearing|markup|referred/i.test(billStatus)) return 1
  return 0
}

interface BillTimelineProps {
  billStatus: string | null
  voteResult: string | null
}

export function BillTimeline({ billStatus, voteResult }: BillTimelineProps) {
  const activeStage = getStageIndex(billStatus, voteResult)
  const reduceMotion = useReducedMotion()

  return (
    <div className="flex items-start" role="list" aria-label="Bill status timeline">
      {STAGES.map((label, i) => {
        const done = i <= activeStage
        const isLast = i === STAGES.length - 1

        return (
          <div key={label} className={cn("flex flex-col items-center", !isLast && "flex-1")}>
            {/* Dot + connecting line row */}
            <div className="flex w-full items-center">
              <motion.div
                initial={reduceMotion ? false : { scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  type: "spring",
                  duration: 0.4,
                  bounce: 0.25,
                  delay: i * 0.08,
                }}
                className={cn(
                  "h-5 w-5 shrink-0 rounded-full border-2 transition-colors duration-300",
                  done
                    ? "border-accent bg-accent"
                    : "border-border bg-white dark:bg-primary/50",
                )}
                role="listitem"
                aria-current={i === activeStage ? "step" : undefined}
                aria-label={label}
              />
              {!isLast && (
                <div
                  className={cn(
                    "h-px flex-1 transition-colors duration-500",
                    i < activeStage ? "bg-accent" : "bg-border",
                  )}
                />
              )}
            </div>

            {/* Label */}
            <span
              className={cn(
                "mt-2 text-[10px] font-medium uppercase tracking-wide text-center leading-tight",
                done ? "text-accent" : "text-muted",
              )}
            >
              {label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
