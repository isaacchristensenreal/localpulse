import Link from "next/link"
import { Suspense } from "react"
import { notFound } from "next/navigation"
import { lookupZip } from "@/lib/geo"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { ResultsFeed } from "./ResultsFeed"
import { ResultsSkeleton } from "./ResultsSkeleton"
import type { Metadata } from "next"

type Props = { params: Promise<{ zipcode: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { zipcode } = await params
  const location = await lookupZip(zipcode)
  if (!location) return { title: "Not Found — LocalPulse" }
  const title = `${location.city}, ${location.stateAbbr} (${zipcode}) — LocalPulse`
  const description = `Recent housing, tax, school, and road updates affecting ${location.city}, ${location.stateAbbr}. Updated daily from Congress.gov and OpenStates.`
  return {
    title,
    description,
    openGraph: { title, description, type: "website", siteName: "LocalPulse" },
  }
}

export default async function ZipPage({ params }: Props) {
  const { zipcode } = await params

  if (!/^\d{5}$/.test(zipcode)) notFound()

  const location = await lookupZip(zipcode)
  if (!location) notFound()

  return (
    <>
      <Navbar />

      {/* Full-width navy hero bar — pt-16 offsets the fixed navbar */}
      <div className="w-full bg-primary pt-16">
        <div className="mx-auto max-w-5xl px-6 py-10">
          <Link
            href="/"
            className="mb-3 inline-flex items-center gap-1 text-xs text-white/50 transition-colors hover:text-white/80"
          >
            ← Change ZIP
          </Link>
          <h1 className="text-3xl font-bold text-white">
            Updates for {location.city},{" "}
            <span className="font-normal text-white/70">{location.stateAbbr}</span>
          </h1>
          <p className="mt-2 text-sm text-white/60">
            Showing recent government activity that may affect this area
          </p>
        </div>
      </div>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <Suspense fallback={<ResultsSkeleton />}>
          <ResultsFeed location={location} />
        </Suspense>
      </main>

      <Footer />
    </>
  )
}
