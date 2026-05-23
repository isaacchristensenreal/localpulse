"use client"

import { ExternalLink, Copy } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const ACTION_BASE =
  "group flex flex-col gap-2 rounded-xl border border-border bg-white/80 p-5 text-left transition-colors hover:border-accent/40 hover:bg-accent/5 dark:bg-primary/20 dark:hover:border-accent/40"

export function TakeAction({ sourceUrl }: { sourceUrl: string }) {
  async function handleShare() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      toast.success("Link copied!")
    } catch {
      toast.error("Couldn't copy link")
    }
  }

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <a
        href="https://www.congress.gov/members/find-your-member"
        target="_blank"
        rel="noopener noreferrer"
        className={ACTION_BASE}
      >
        <ExternalLink className="h-4 w-4 text-accent" />
        <span className="text-sm font-medium text-primary dark:text-surface">
          Find your representative
        </span>
      </a>

      <button type="button" onClick={handleShare} className={cn(ACTION_BASE, "cursor-pointer")}>
        <Copy className="h-4 w-4 text-accent" />
        <span className="text-sm font-medium text-primary dark:text-surface">
          Share this bill
        </span>
      </button>

      <a
        href={sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={ACTION_BASE}
      >
        <ExternalLink className="h-4 w-4 text-accent" />
        <span className="text-sm font-medium text-primary dark:text-surface">
          View official text
        </span>
        <span className="text-[11px] text-muted">Official government source</span>
      </a>
    </div>
  )
}
