import { getVotesForBill } from "@/lib/representatives"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const bill = searchParams.get("bill")
  if (!bill) {
    return Response.json({ error: "Missing bill parameter" }, { status: 400 })
  }
  const votes = await getVotesForBill(bill)
  return Response.json(votes)
}
