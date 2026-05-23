import { getRepresentativesByZip } from "@/lib/representatives"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const zip = searchParams.get("zip")
  if (!zip || !/^\d{5}$/.test(zip)) {
    return Response.json({ error: "Invalid zip" }, { status: 400 })
  }
  const reps = await getRepresentativesByZip(zip)
  return Response.json(reps)
}
