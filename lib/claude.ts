import OpenAI from "openai"
import type { ZipLocation } from "./geo"
import type { FRDocument } from "./federal-register"
import type { Result } from "@/types"

const openai = new OpenAI()

const SYSTEM_PROMPT = `You are a local government analyst helping residents understand recent federal actions that affect them.

Given a list of Federal Register documents and a target location, classify each relevant document and write plain-language summaries.

Return a JSON array. Each element must have exactly these fields:
{
  "id": "<document_number>",
  "category": "housing" | "taxes" | "schools",
  "title": "<concise title, 70 chars max>",
  "plain_summary": "<1-2 sentences in plain English explaining what this rule or notice does>",
  "this_means": "<1 sentence — the concrete impact for a resident of the given city>"
}

Rules:
- Only include documents clearly about housing, taxes, or schools
- Skip unrelated documents entirely
- Use plain language — no jargon, no legalese
- Return only valid JSON — no markdown, no explanation`

export async function classifyDocuments(
  docs: FRDocument[],
  location: ZipLocation,
): Promise<Result[]> {
  if (docs.length === 0) return []

  const docsText = docs
    .map(
      (d) =>
        `ID: ${d.document_number}\nTitle: ${d.title}\nAbstract: ${d.abstract ?? "None"}\nDate: ${d.publication_date}\nType: ${d.type}`,
    )
    .join("\n\n---\n\n")

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: `Location: ${location.city}, ${location.state} (ZIP ${location.zipcode})\n\nDocuments:\n\n${docsText}`,
      },
    ],
  })

  try {
    const text = response.choices[0].message.content ?? ""
    const parsed = JSON.parse(text)
    // Model may wrap the array in an object key
    const arr = Array.isArray(parsed) ? parsed : (parsed.results ?? parsed.documents ?? [])
    return arr as Result[]
  } catch {
    return []
  }
}
