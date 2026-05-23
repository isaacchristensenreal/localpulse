const BASE = "https://api.congress.gov/v3"
const API_KEY = process.env.CONGRESS_API_KEY!

export interface CongressBill {
  title: string
  bill_number: string
  raw_text: string
  source_url: string
  level: "federal"
  state_code: null
  published_at: string
  sponsor: string | null
  sponsor_party: string | null
  sponsor_state: string | null
  bill_status: string | null
  vote_result: string | null
  committee: string | null
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()
}

function extractVoteResult(actionText: string): string | null {
  return /passed|failed|agreed|rejected|vetoed/i.test(actionText)
    ? actionText
    : null
}

async function enrichBill(
  congress: number,
  type: string,
  number: string,
): Promise<{
  raw_text: string | null
  sponsor: string | null
  sponsor_party: string | null
  sponsor_state: string | null
  bill_status: string | null
  vote_result: string | null
  committee: string | null
}> {
  const slug = `${congress}/${type.toLowerCase()}/${number}`

  const [detailRes, summaryRes, committeeRes] = await Promise.allSettled([
    fetch(`${BASE}/bill/${slug}?api_key=${API_KEY}&format=json`, {
      next: { revalidate: 3600 },
    }).then((r) => r.json()),
    fetch(`${BASE}/bill/${slug}/summaries?api_key=${API_KEY}&format=json&limit=1`, {
      next: { revalidate: 3600 },
    }).then((r) => r.json()),
    fetch(`${BASE}/bill/${slug}/committees?api_key=${API_KEY}&format=json&limit=1`, {
      next: { revalidate: 3600 },
    }).then((r) => r.json()),
  ])

  const detail = detailRes.status === "fulfilled" ? detailRes.value?.bill : null
  const summaryData = summaryRes.status === "fulfilled" ? summaryRes.value : null
  const committeeData = committeeRes.status === "fulfilled" ? committeeRes.value : null

  const primarySponsor = detail?.sponsors?.[0] ?? null
  const latestActionText: string = detail?.latestAction?.text ?? ""
  const summaryText: string | undefined = summaryData?.summaries?.[0]?.text
  const firstCommittee = committeeData?.committees?.[0] ?? null

  return {
    raw_text: summaryText ? stripHtml(summaryText) : null,
    sponsor: primarySponsor?.fullName ?? null,
    sponsor_party: primarySponsor?.party ?? null,
    sponsor_state: primarySponsor?.state ?? null,
    bill_status: latestActionText || null,
    vote_result: extractVoteResult(latestActionText),
    committee: firstCommittee?.name ?? null,
  }
}

export async function fetchRecentBills(): Promise<CongressBill[]> {
  const from = new Date()
  from.setDate(from.getDate() - 7)
  const fromDateTime = from.toISOString().split(".")[0] + "Z"

  const params = new URLSearchParams({
    api_key: API_KEY,
    limit: "20",
    fromDateTime,
    sort: "updateDate+desc",
    format: "json",
  })

  const res = await fetch(`${BASE}/bill?${params}`, {
    next: { revalidate: 3600 },
  })
  if (!res.ok) return []

  const data = await res.json()
  const bills: Array<{
    congress: number
    type: string
    number: string
    title: string
    updateDate: string
    url: string
  }> = data.bills ?? []

  const enrichments = await Promise.allSettled(
    bills.map((b) => enrichBill(b.congress, b.type, b.number)),
  )

  return bills.map((bill, i) => {
    const e = enrichments[i].status === "fulfilled" ? enrichments[i].value : null

    return {
      title: bill.title,
      bill_number: `${bill.type} ${bill.number}`,
      raw_text: e?.raw_text ?? bill.title,
      source_url: bill.url.replace(/\?.*$/, ""),
      level: "federal",
      state_code: null,
      published_at: new Date(bill.updateDate).toISOString(),
      sponsor: e?.sponsor ?? null,
      sponsor_party: e?.sponsor_party ?? null,
      sponsor_state: e?.sponsor_state ?? null,
      bill_status: e?.bill_status ?? null,
      vote_result: e?.vote_result ?? null,
      committee: e?.committee ?? null,
    }
  })
}
