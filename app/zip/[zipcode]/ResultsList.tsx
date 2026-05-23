"use client"

import { ResultCard } from "@/components/ResultCard"
import type { Result } from "@/types"

export function ResultsList({
  results,
  zipcode,
}: {
  results: Result[]
  zipcode: string
}) {
  return (
    <div className="flex flex-col gap-5">
      {results.map((result, index) => (
        <ResultCard key={result.id} result={result} index={index} zipcode={zipcode} />
      ))}
    </div>
  )
}
