const FR_BASE = "https://www.federalregister.gov/api/v1"

const AGENCIES = [
  "housing-and-urban-development-department",
  "federal-housing-finance-agency",
  "internal-revenue-service",
  "treasury-department",
  "education-department",
]

export interface FRDocument {
  document_number: string
  title: string
  abstract: string | null
  publication_date: string
  type: string
}

export async function fetchRecentDocuments(): Promise<FRDocument[]> {
  const since = new Date()
  since.setDate(since.getDate() - 90)
  const sinceStr = since.toISOString().split("T")[0]

  const params = new URLSearchParams({
    "conditions[publication_date][gte]": sinceStr,
    "per_page": "20",
    "order": "newest",
  })

  for (const type of ["RULE", "PROPOSED RULE", "NOTICE"]) {
    params.append("conditions[type][]", type)
  }
  for (const field of ["title", "abstract", "type", "publication_date", "document_number"]) {
    params.append("fields[]", field)
  }
  for (const agency of AGENCIES) {
    params.append("conditions[agencies][]", agency)
  }

  const res = await fetch(`${FR_BASE}/documents.json?${params}`, {
    next: { revalidate: 3600 },
  })

  if (!res.ok) return []
  const data = await res.json()
  return (data.results ?? []) as FRDocument[]
}
