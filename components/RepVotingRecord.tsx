"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import type { Representative, MemberVote } from "@/lib/representatives"

interface MatchedRep {
  rep: Representative
  vote: MemberVote | null
}

function toPartyAbbr(party: string | null): "D" | "R" | "I" | null {
  if (!party) return null
  const p = party.toLowerCase()
  if (p.startsWith("dem")) return "D"
  if (p.startsWith("rep")) return "R"
  return "I"
}

function matchReps(reps: Representative[], votes: MemberVote[]): MatchedRep[] {
  return reps.map((rep) => {
    const repLastName = rep.name.split(/\s+/).at(-1)?.toLowerCase()
    const matched =
      votes.find((v) => {
        if (!repLastName) return false
        return (
          rep.state === v.state &&
          v.memberName.toLowerCase().includes(repLastName)
        )
      }) ?? null
    return { rep, vote: matched }
  })
}

function PartyDot({ party }: { party: string | null }) {
  const abbr = toPartyAbbr(party)
  if (!abbr) return null
  const cls =
    abbr === "D" ? "bg-blue-500" : abbr === "R" ? "bg-red-500" : "bg-slate-400"
  return (
    <span className={cn("inline-block h-2 w-2 shrink-0 rounded-full", cls)} aria-hidden />
  )
}

const VOTE_CONFIG = {
  Yea: { label: "YES", cls: "text-green-600 dark:text-green-400" },
  Nay: { label: "NO", cls: "text-red-600 dark:text-red-400" },
  Present: { label: "PRESENT", cls: "text-yellow-600 dark:text-yellow-400" },
  "Not Voting": { label: "DID NOT VOTE", cls: "text-muted" },
} satisfies Record<MemberVote["vote"], { label: string; cls: string }>

function VoteBadge({ vote }: { vote: MemberVote["vote"] | null }) {
  if (!vote) {
    return <span className="text-sm text-muted">Not available</span>
  }
  const { label, cls } = VOTE_CONFIG[vote] ?? { label: vote, cls: "text-muted" }
  return (
    <span className={cn("text-2xl font-black tracking-tight", cls)}>{label}</span>
  )
}

function Skeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-border bg-white/80 p-4 dark:bg-primary/20">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700" />
          <div className="space-y-2">
            <div className="h-3.5 w-32 rounded bg-slate-200 dark:bg-slate-700" />
            <div className="h-3 w-24 rounded bg-slate-200 dark:bg-slate-700" />
          </div>
        </div>
        <div className="h-7 w-10 rounded bg-slate-200 dark:bg-slate-700" />
      </div>
    </div>
  )
}

interface Props {
  zipcode: string | null
  billNumber: string | null
}

export function RepVotingRecord({ zipcode, billNumber }: Props) {
  const [loading, setLoading] = useState(true)
  const [matched, setMatched] = useState<MatchedRep[]>([])
  const [fetchFailed, setFetchFailed] = useState(false)

  useEffect(() => {
    if (!zipcode || !billNumber) {
      setLoading(false)
      return
    }

    Promise.all([
      fetch(`/api/representatives?zip=${zipcode}`).then((r) => {
        if (!r.ok) throw new Error("reps")
        return r.json() as Promise<Representative[]>
      }),
      fetch(`/api/votes?bill=${encodeURIComponent(billNumber)}`).then((r) => {
        if (!r.ok) throw new Error("votes")
        return r.json() as Promise<MemberVote[]>
      }),
    ])
      .then(([reps, votes]) => setMatched(matchReps(reps, votes)))
      .catch(() => setFetchFailed(true))
      .finally(() => setLoading(false))
  }, [zipcode, billNumber])

  if (loading) {
    return (
      <div className="flex flex-col gap-3">
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </div>
    )
  }

  if (fetchFailed || matched.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-xl border border-dashed border-border bg-slate-50 py-10 dark:bg-white/5">
        <p className="text-sm text-muted">Vote data not available for this bill</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {matched.map(({ rep, vote }, i) => (
        <motion.div
          key={rep.name}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            duration: 0.4,
            bounce: 0.08,
            delay: i * 0.07,
          }}
          className="rounded-xl border border-border bg-white/80 p-4 dark:bg-primary/20"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {rep.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={rep.photoUrl}
                  alt={rep.name}
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                  <span className="text-sm font-semibold text-muted">
                    {rep.name.charAt(0)}
                  </span>
                </div>
              )}
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-1.5">
                  <PartyDot party={rep.party} />
                  <span className="text-sm font-semibold text-primary dark:text-surface">
                    {rep.name}
                  </span>
                </div>
                <span className="text-xs text-muted">{rep.role}</span>
              </div>
            </div>
            <VoteBadge vote={vote?.vote ?? null} />
          </div>
        </motion.div>
      ))}
    </div>
  )
}
