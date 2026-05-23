const BASE = "https://v3.openstates.org"
const API_KEY = process.env.OPENSTATES_API_KEY!

export interface StateBill {
  title: string
  bill_number: string
  raw_text: string
  source_url: string
  level: "state"
  state_code: string
  published_at: string
  sponsor: string | null
  sponsor_party: string | null
  bill_status: string | null
  committee: string | null
}

interface Sponsorship {
  name: string
  entity_type: "person" | "organization"
  primary: boolean
  classification: string
  person?: {
    name: string
    party: string
  }
}

function toPartyAbbr(party: string | null | undefined): string | null {
  if (!party) return null
  const p = party.toLowerCase()
  if (p.startsWith("dem")) return "D"
  if (p.startsWith("rep")) return "R"
  return "I"
}

export async function fetchStateBills(stateCode: string): Promise<StateBill[]> {
  const from = new Date()
  from.setDate(from.getDate() - 7)
  const updatedSince = from.toISOString().split("T")[0]

  const params = new URLSearchParams({
    jurisdiction: stateCode.toLowerCase(),
    updated_since: updatedSince,
    per_page: "10",
    apikey: API_KEY,
  })
  params.append("include", "abstracts")
  params.append("include", "sponsorships")

  const res = await fetch(`${BASE}/bills?${params}`, {
    next: { revalidate: 3600 },
  })
  if (!res.ok) return []

  const data = await res.json()
  const bills: Array<{
    identifier: string
    title: string
    abstracts: Array<{ abstract: string }> | undefined
    sponsorships: Sponsorship[] | undefined
    openstates_url: string
    updated_at: string
    latest_action_description: string | null
  }> = data.results ?? []

  return bills.map((bill) => {
    const personSponsor = bill.sponsorships?.find(
      (s) => s.entity_type === "person" && s.primary,
    )
    const orgSponsor = bill.sponsorships?.find(
      (s) => s.entity_type === "organization",
    )

    return {
      title: bill.title,
      bill_number: bill.identifier,
      raw_text: bill.abstracts?.[0]?.abstract ?? bill.title,
      source_url: bill.openstates_url,
      level: "state",
      state_code: stateCode.toUpperCase(),
      published_at: new Date(bill.updated_at).toISOString(),
      sponsor: personSponsor?.person?.name ?? personSponsor?.name ?? null,
      sponsor_party: toPartyAbbr(personSponsor?.person?.party),
      bill_status: bill.latest_action_description ?? null,
      committee: orgSponsor?.name ?? null,
    }
  })
}
