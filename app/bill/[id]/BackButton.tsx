"use client"

import { useRouter } from "next/navigation"

export function BackButton({ label }: { label: string }) {
  const router = useRouter()
  return (
    <button
      onClick={() => router.back()}
      className="flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-primary dark:hover:text-surface"
    >
      <span aria-hidden>←</span>
      {label}
    </button>
  )
}
