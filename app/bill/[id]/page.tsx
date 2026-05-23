import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { CheckCircle, XCircle } from "lucide-react"
import { FadeInSection } from "@/components/FadeInSection"
import { Navbar } from "@/components/Navbar"
import { BillTimeline } from "@/components/BillTimeline"
import { Footer } from "@/components/Footer"
import { BackButton } from "./BackButton"
import { TakeAction } from "./TakeAction"
import { ReadingProgressBar } from "./ReadingProgressBar"
import { ShareButton } from "./ShareButton"
import { RepVotingRecord } from "@/components/RepVotingRecord"
import { supabaseAdmin } from "@/lib/supabase"
import { cn } from "@/lib/utils"

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

const STATE_NAMES: Record<string, string> = {
  IA: "Iowa",
  IL: "Illinois",
  MN: "Minnesota",
  WI: "Wisconsin",
  MO: "Missouri",
  NE: "Nebraska",
  KS: "Kansas",
  SD: "South Dakota",
  ND: "North Dakota",
}

const CATEGORY_BADGE: Record<string, string> = {
  housing: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  taxes: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  schools: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  roads: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
  utilities: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  safety: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  other: "bg-slate-100 text-slate-600 dark:bg-slate-800/50 dark:text-slate-400",
}

const LEVEL_BADGE: Record<string, { label: string; cls: string }> = {
  federal: { label: "FEDERAL", cls: "bg-[#0D1B2A] text-white dark:bg-white/15" },
  state: { label: "STATE", cls: "bg-blue-600 text-white" },
  local: { label: "LOCAL", cls: "bg-green-600 text-white" },
}

function PartyDot({ party }: { party: string | null }) {
  if (!party) return null
  const cls =
    party === "D" ? "bg-blue-500" : party === "R" ? "bg-red-500" : "bg-slate-400"
  return (
    <span
      className={cn("inline-block h-2.5 w-2.5 shrink-0 rounded-full", cls)}
      aria-hidden
    />
  )
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  } catch {
    return ""
  }
}

function parseVoteResult(voteResult: string | null) {
  if (!voteResult) return { verdict: null, counts: null }
  const verdict = /passed|agreed/i.test(voteResult)
    ? "PASSED"
    : /failed|vetoed|rejected/i.test(voteResult)
      ? "FAILED"
      : null
  const m = voteResult.match(/(\d+)\s*[-–—]\s*(\d+)/)
  return { verdict, counts: m ? `${m[1]} — ${m[2]}` : null }
}

export async function generateStaticParams() {
  const { data } = await supabaseAdmin
    .from("updates")
    .select("id")
    .order("published_at", { ascending: false })
    .limit(20)
  return (data ?? []).map((row) => ({ id: String(row.id) }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const { data } = await supabaseAdmin
    .from("updates")
    .select("title, plain_summary")
    .eq("id", id)
    .single()
  if (!data) return { title: "Not Found — LocalPulse" }
  const title = `${data.title as string} — LocalPulse`
  const description = ((data.plain_summary as string) ?? "").slice(0, 155)
  return {
    title,
    description,
    openGraph: { title, description, type: "article", siteName: "LocalPulse" },
  }
}

export default async function BillPage({ params, searchParams }: Props) {
  const { id } = await params
  const { zip } = await searchParams
  const zipcode = typeof zip === "string" && /^\d{5}$/.test(zip) ? zip : null

  const [{ data: bill, error }, { data: relatedData }] = await Promise.all([
    supabaseAdmin
      .from("updates")
      .select(
        "id, title, category, plain_summary, personal_impact, source_url, level, state_code, published_at, bill_number, bill_status, sponsor, sponsor_party, sponsor_state, vote_result, committee",
      )
      .eq("id", id)
      .single(),
    supabaseAdmin
      .from("updates")
      .select("id, title, category, bill_number")
      .order("published_at", { ascending: false })
      .limit(4),
  ])

  if (error || !bill) notFound()

  // Filter related bills: same category, not the current bill, max 3
  const relatedBills = (relatedData ?? [])
    .filter((r) => r.category === bill.category && String(r.id) !== id)
    .slice(0, 3)

  const lvl = LEVEL_BADGE[bill.level as string] ?? LEVEL_BADGE.federal
  const catBadgeCls =
    CATEGORY_BADGE[bill.category as string] ?? CATEGORY_BADGE.other
  const categoryLabel =
    (bill.category as string).charAt(0).toUpperCase() +
    (bill.category as string).slice(1)

  const backLabel = bill.state_code
    ? `${STATE_NAMES[bill.state_code as string] ?? bill.state_code} updates`
    : "results"

  const sponsorDisplay = bill.sponsor
    ? [
        bill.sponsor,
        bill.sponsor_party || bill.sponsor_state
          ? `(${[bill.sponsor_party, bill.sponsor_state].filter(Boolean).join("-")})`
          : null,
      ]
        .filter(Boolean)
        .join(" ")
    : null

  const { verdict, counts } = parseVoteResult(bill.vote_result as string | null)

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: bill.title as string,
    datePublished: bill.published_at as string,
    description: bill.plain_summary as string,
    publisher: { "@type": "Organization", name: "LocalPulse" },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <ReadingProgressBar />
      <Navbar />

      <main className="mx-auto w-full max-w-3xl px-6 py-10">
        {/* Back */}
        <FadeInSection yOffset={8} delay={0}>
          <div className="mb-8">
            <BackButton label={`Back to ${backLabel}`} />
          </div>
        </FadeInSection>

        {/* Title */}
        <FadeInSection yOffset={16} delay={0.05}>
          <h1 className="mb-6 text-3xl font-bold leading-tight tracking-tight text-primary dark:text-surface">
            {bill.title as string}
          </h1>
        </FadeInSection>

        {/* Meta row: bill number, level badge, category badge, date */}
        <FadeInSection yOffset={12} delay={0.1}>
          <div className="mb-8 flex flex-wrap items-center gap-2 text-sm">
            {bill.bill_number && (
              <span className="font-mono text-muted">{bill.bill_number as string}</span>
            )}
            <span
              className={cn(
                "rounded px-2 py-0.5 text-[10px] font-bold tracking-wider",
                lvl.cls,
              )}
            >
              {lvl.label}
            </span>
            <span
              className={cn(
                "rounded-full px-2.5 py-0.5 text-xs font-medium",
                catBadgeCls,
              )}
            >
              {categoryLabel}
            </span>
            <span className="text-border" aria-hidden>·</span>
            <span className="text-muted">{formatDate(bill.published_at as string)}</span>
          </div>
        </FadeInSection>

        {/* Timeline */}
        <FadeInSection yOffset={12} delay={0.15}>
          <section className="mb-8 rounded-xl border border-border bg-white/80 px-6 py-5 dark:bg-primary/20">
            <BillTimeline
              billStatus={bill.bill_status as string | null}
              voteResult={bill.vote_result as string | null}
            />
          </section>
        </FadeInSection>

        {/* Sponsor */}
        {sponsorDisplay && (
          <FadeInSection yOffset={12} delay={0}>
            <div className="mb-8 flex items-center gap-2 text-sm text-muted">
              <PartyDot party={bill.sponsor_party as string | null} />
              <span>
                Introduced by{" "}
                <span className="font-medium text-primary dark:text-surface">
                  {sponsorDisplay}
                </span>
              </span>
            </div>
          </FadeInSection>
        )}

        {/* Vote result — dramatic box */}
        {verdict && (
          <FadeInSection yOffset={16} delay={0}>
            <section
              className={cn(
                "mb-8 rounded-xl border-2 px-6 py-12 text-center",
                verdict === "PASSED"
                  ? "border-green-200 bg-green-50 dark:border-green-900/40 dark:bg-green-950/20"
                  : "border-red-200 bg-red-50 dark:border-red-900/40 dark:bg-red-950/20",
              )}
            >
              <div className="mb-4 flex justify-center">
                {verdict === "PASSED" ? (
                  <CheckCircle
                    className="h-16 w-16 text-green-500 dark:text-green-400"
                    strokeWidth={1.5}
                  />
                ) : (
                  <XCircle
                    className="h-16 w-16 text-red-500 dark:text-red-400"
                    strokeWidth={1.5}
                  />
                )}
              </div>
              <p
                className={cn(
                  "text-4xl font-bold tracking-widest",
                  verdict === "PASSED"
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400",
                )}
              >
                {verdict}
              </p>
              {counts && (
                <p className="mt-3 font-mono text-xl text-muted">{counts}</p>
              )}
            </section>
          </FadeInSection>
        )}

        {/* What This Bill Does */}
        <FadeInSection yOffset={16} delay={0}>
          <section className="mb-8">
            <h2 className="mb-3 text-lg font-semibold text-primary dark:text-surface">
              What This Bill Does
            </h2>
            <p className="text-lg leading-relaxed text-muted">
              {bill.plain_summary as string}
            </p>
          </section>
        </FadeInSection>

        {/* How This Affects You */}
        <FadeInSection yOffset={16} delay={0}>
          <section className="mb-8">
            <h2 className="mb-3 text-lg font-semibold text-primary dark:text-surface">
              How This Affects You
            </h2>
            <div className="rounded-xl border border-blue-100 bg-blue-50 px-6 py-5 dark:border-blue-900/30 dark:bg-blue-950/20">
              <p className="text-base leading-relaxed text-blue-800 dark:text-blue-300">
                {bill.personal_impact as string}
              </p>
            </div>
          </section>
        </FadeInSection>

        {/* Representative voting record */}
        <FadeInSection yOffset={16} delay={0}>
          <section className="mb-8">
            <h2 className="mb-3 text-lg font-semibold text-primary dark:text-surface">
              Representative Voting Record
            </h2>
            <RepVotingRecord
              zipcode={zipcode}
              billNumber={(bill.bill_number as string | null) ?? null}
            />
          </section>
        </FadeInSection>

        {/* AdSense placeholder */}
        <FadeInSection yOffset={8} delay={0}>
          <div className="mb-8 flex h-[90px] w-full items-center justify-center rounded border border-dashed border-border bg-slate-50/80 dark:bg-white/5 sm:mx-auto sm:max-w-[728px]">
            <p className="text-xs uppercase tracking-widest text-muted">Advertisement</p>
          </div>
        </FadeInSection>

        {/* Take Action */}
        <FadeInSection yOffset={16} delay={0}>
          <section className="mb-8">
            <h2 className="mb-4 text-lg font-semibold text-primary dark:text-surface">
              Take Action
            </h2>
            <TakeAction sourceUrl={bill.source_url as string} />
          </section>
        </FadeInSection>

        {/* Related Bills */}
        {relatedBills.length > 0 && (
          <FadeInSection yOffset={16} delay={0}>
            <section className="mb-8">
              <h2 className="mb-4 text-lg font-semibold text-primary dark:text-surface">
                Related Bills
              </h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {relatedBills.map((related) => (
                  <Link
                    key={related.id}
                    href={`/bill/${related.id}`}
                    className="rounded-xl border border-border bg-white/80 p-4 transition-colors hover:bg-slate-50 dark:bg-primary/20 dark:hover:bg-white/5"
                  >
                    <span
                      className={cn(
                        "mb-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium",
                        CATEGORY_BADGE[related.category as string] ?? CATEGORY_BADGE.other,
                      )}
                    >
                      {(related.category as string).charAt(0).toUpperCase() +
                        (related.category as string).slice(1)}
                    </span>
                    <p className="line-clamp-2 text-sm font-medium leading-snug text-primary dark:text-surface">
                      {related.title as string}
                    </p>
                    {related.bill_number && (
                      <p className="mt-1.5 font-mono text-xs text-muted">
                        {related.bill_number as string}
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            </section>
          </FadeInSection>
        )}
      </main>

      <Footer />

      {/* Mobile floating share button */}
      <ShareButton />
    </>
  )
}
