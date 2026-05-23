import { supabase } from "@/lib/supabase"
import { FilterableResults } from "./FilterableResults"
import type { ZipLocation } from "@/lib/geo"
import type { Result } from "@/types"

export async function ResultsFeed({ location }: { location: ZipLocation }) {
  const { data, error } = await supabase
    .from("updates")
    .select(
      "id, title, category, plain_summary, personal_impact, source_url, level, state_code, published_at, bill_number, bill_status, sponsor, sponsor_party, sponsor_state, vote_result, committee",
    )
    .or(
      `zip_codes_affected.cs.{${location.zipcode}},state_code.eq.${location.stateAbbr}`,
    )
    .order("published_at", { ascending: false })
    .limit(20)

  if (error) {
    console.error("[ResultsFeed] supabase error:", error.message)
  }

  const results: Result[] = (data ?? []).map((row) => ({
    id: row.id,
    title: row.title,
    category: row.category,
    plain_summary: row.plain_summary,
    this_means: row.personal_impact,
    bill_number: row.bill_number ?? null,
    level: row.level ?? "federal",
    bill_status: row.bill_status ?? null,
    sponsor: row.sponsor ?? null,
    sponsor_party: row.sponsor_party ?? null,
    sponsor_state: row.sponsor_state ?? null,
    vote_result: row.vote_result ?? null,
    source_url: row.source_url,
    published_at: row.published_at,
    committee: row.committee ?? null,
  }))

  if (results.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-white/60 px-8 py-20 text-center dark:bg-primary/10">
        <p className="mb-4 text-5xl">🏛️</p>
        <p className="text-lg font-semibold text-primary dark:text-surface">
          No updates yet for this area
        </p>
        <p className="mt-2 text-sm text-muted">
          We refresh daily — check back tomorrow. Federal updates are available for all ZIP codes.
        </p>
      </div>
    )
  }

  return <FilterableResults results={results} zipcode={location.zipcode} />
}
