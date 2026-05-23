const CIVIC_BASE = "https://www.googleapis.com/civicinfo/v2"
const CONGRESS_BASE = "https://api.congress.gov/v3"

export interface Representative {
  name: string
  party: string | null
  role: string
  photoUrl: string | null
  state: string | null
}

export interface MemberVote {
  memberName: string
  party: string | null
  state: string | null
  vote: "Yea" | "Nay" | "Present" | "Not Voting"
}

interface CivicOffice {
  name: string
  divisionId: string
  levels?: string[]
  roles?: string[]
  officialIndices: number[]
}

interface CivicOfficial {
  name: string
  party?: string
  photoUrl?: string
}

export async function getRepresentativesByZip(
  zipcode: string,
): Promise<Representative[]> {
  const key = process.env.GOOGLE_CIVIC_API_KEY
  if (!key) return []

  const res = await fetch(
    `${CIVIC_BASE}/representatives?address=${zipcode}&key=${key}`,
    { next: { revalidate: 3600 } },
  )
  if (!res.ok) return []

  const data = await res.json()
  const offices: CivicOffice[] = data.offices ?? []
  const officials: CivicOfficial[] = data.officials ?? []

  const reps: Representative[] = []

  for (const office of offices) {
    if (!office.levels?.includes("country")) continue
    const isSenator = office.roles?.includes("legislatorUpperBody")
    const isRep = office.roles?.includes("legislatorLowerBody")
    if (!isSenator && !isRep) continue

    const role = isSenator ? "U.S. Senator" : "U.S. Representative"
    const stateMatch = office.divisionId.match(/state:([a-z]{2})/)
    const state = stateMatch ? stateMatch[1].toUpperCase() : null

    for (const idx of office.officialIndices) {
      const official = officials[idx]
      if (!official) continue
      reps.push({
        name: official.name,
        party: official.party ?? null,
        role,
        photoUrl: official.photoUrl ?? null,
        state,
      })
    }
  }

  return reps
}

function parseBillNumber(
  billNumber: string,
): { congress: number; type: string; number: string } | null {
  const m = billNumber
    .trim()
    .match(/^(HR|S|HJRES|SJRES|HCONRES|SCONRES|HRES|SRES)\s+(\d+)$/i)
  if (!m) return null
  // 119th Congress: Jan 2025 – Jan 2027
  return { congress: 119, type: m[1].toLowerCase(), number: m[2] }
}

type RawMember = {
  fullName?: string
  firstName?: string
  lastName?: string
  party?: string
  state?: string
  vote?: string
}

function toMemberVote(m: RawMember): MemberVote {
  return {
    memberName:
      m.fullName ?? [m.firstName, m.lastName].filter(Boolean).join(" "),
    party: m.party ?? null,
    state: m.state ?? null,
    vote: (m.vote as MemberVote["vote"]) ?? "Not Voting",
  }
}

export async function getVotesForBill(billNumber: string): Promise<MemberVote[]> {
  const parsed = parseBillNumber(billNumber)
  if (!parsed) return []

  const { congress, type, number } = parsed
  const key = process.env.CONGRESS_API_KEY
  const base = `${CONGRESS_BASE}/bill/${congress}/${type}/${number}`

  // Try the direct votes endpoint first
  const votesRes = await fetch(`${base}/votes?api_key=${key}&format=json`, {
    next: { revalidate: 3600 },
  })
  if (votesRes.ok) {
    const data = await votesRes.json()
    const members: RawMember[] = data.votes ?? data.members ?? []
    if (members.length > 0) return members.map(toMemberVote)
  }

  // Fallback: actions → recordedVotes → /vote/{congress}/{chamber}/{roll}
  const actionsRes = await fetch(
    `${base}/actions?api_key=${key}&format=json&limit=50`,
    { next: { revalidate: 3600 } },
  )
  if (!actionsRes.ok) return []

  const actionsData = await actionsRes.json()
  const actions: Array<{
    recordedVotes?: Array<{ rollNumber: number; chamber: string }>
  }> = actionsData.actions ?? []

  const withVote = actions.find((a) => a.recordedVotes?.length)
  if (!withVote?.recordedVotes?.[0]) return []

  const { rollNumber, chamber } = withVote.recordedVotes[0]
  const chamberSlug = /house/i.test(chamber) ? "house" : "senate"

  const voteRes = await fetch(
    `${CONGRESS_BASE}/vote/${congress}/${chamberSlug}/${rollNumber}?api_key=${key}&format=json`,
    { next: { revalidate: 3600 } },
  )
  if (!voteRes.ok) return []

  const voteData = await voteRes.json()
  const members: RawMember[] =
    voteData.vote?.members ?? voteData.members ?? []
  return members.map(toMemberVote)
}
