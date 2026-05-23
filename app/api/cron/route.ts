import { fetchRecentBills } from "@/lib/congress"
import { fetchStateBills } from "@/lib/openstates"
import { summarizeUpdate } from "@/lib/openai"
import { supabaseAdmin } from "@/lib/supabase"

export const dynamic = "force-dynamic"

const STATE_CODES = [
  "al", "ak", "az", "ar", "ca", "co", "ct", "de", "fl", "ga",
  "hi", "id", "il", "in", "ia", "ks", "ky", "la", "me", "md",
  "ma", "mi", "mn", "ms", "mo", "mt", "ne", "nv", "nh", "nj",
  "nm", "ny", "nc", "nd", "oh", "ok", "or", "pa", "ri", "sc",
  "sd", "tn", "tx", "ut", "vt", "va", "wa", "wv", "wi", "wy",
]

export async function GET(request: Request) {
  const auth = request.headers.get("Authorization")
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // 1 & 2 — fetch federal and all state bills in parallel
    const [federalBills, ...stateBillArrays] = await Promise.all([
      fetchRecentBills(),
      ...STATE_CODES.map((code) => fetchStateBills(code)),
    ])

    const allBills = [...federalBills, ...stateBillArrays.flat()]
    const fetched = allBills.length
    console.log(`[cron] fetched ${fetched} bills`)

    // 3 — summarize all in parallel, passing metadata as context
    const summaryResults = await Promise.allSettled(
      allBills.map((bill) =>
        summarizeUpdate(
          bill.title,
          bill.raw_text,
          bill.state_code ?? "United States",
          {
            bill_number: bill.bill_number,
            sponsor: bill.sponsor,
            sponsor_party: bill.sponsor_party,
            sponsor_state: "sponsor_state" in bill ? bill.sponsor_state : null,
            bill_status: bill.bill_status,
            vote_result: "vote_result" in bill ? bill.vote_result : null,
            committee: bill.committee,
          },
        ),
      ),
    )

    // 4 — zip bills with summaries, drop any that failed
    const rows: Array<{
      title: string
      plain_summary: string
      personal_impact: string
      category: string
      source_url: string
      level: string
      state_code: string | null
      published_at: string
      bill_number: string | null
      sponsor: string | null
      sponsor_party: string | null
      sponsor_state: string | null
      bill_status: string | null
      vote_result: string | null
      committee: string | null
    }> = []

    for (let i = 0; i < allBills.length; i++) {
      const result = summaryResults[i]
      if (result.status === "rejected" || !result.value) {
        console.error(
          `[cron] summarize failed for "${allBills[i].title}":`,
          result.status === "rejected" ? result.reason : "null result",
        )
        continue
      }
      const v = result.value
      rows.push({
        title: allBills[i].title,
        plain_summary: v.plain_summary,
        personal_impact: v.personal_impact,
        category: v.category,
        source_url: allBills[i].source_url,
        level: allBills[i].level,
        state_code: allBills[i].state_code,
        published_at: allBills[i].published_at,
        bill_number: v.bill_number,
        sponsor: v.sponsor,
        sponsor_party: v.sponsor_party,
        sponsor_state: v.sponsor_state,
        bill_status: v.bill_status,
        vote_result: v.vote_result,
        committee: v.committee,
      })
    }

    const summarized = rows.length
    console.log(`[cron] summarized ${summarized}/${fetched} bills`)

    // 5 — upsert, deduplicating on source_url
    const { data: upserted, error } = await supabaseAdmin
      .from("updates")
      .upsert(rows, { onConflict: "source_url", ignoreDuplicates: true })
      .select("id")

    if (error) {
      console.error("[cron] supabase upsert error:", error.message)
      throw error
    }

    const upsertedCount = upserted?.length ?? 0
    console.log(`[cron] upserted ${upsertedCount} new rows`)

    return Response.json({ fetched, summarized, upserted: upsertedCount })
  } catch (err) {
    console.error("[cron] unhandled error:", err)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
