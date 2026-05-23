export type Category =
  | "housing"
  | "taxes"
  | "schools"
  | "roads"
  | "utilities"
  | "safety"
  | "other"

export type Level = "federal" | "state" | "local"

export interface Result {
  id: string
  category: Category
  title: string
  plain_summary: string
  this_means: string
  bill_number: string | null
  level: Level
  bill_status: string | null
  sponsor: string | null
  sponsor_party: string | null
  sponsor_state: string | null
  vote_result: string | null
  source_url: string
  published_at: string
  committee: string | null
}
