import type { MetadataRoute } from "next"
import { supabaseAdmin } from "@/lib/supabase"

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://localpulse.vercel.app"

const FEATURED_ZIPS = [
  "10001", "90210", "60601", "77001", "85001",
  "30301", "98101", "02101", "80201", "50309",
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data: bills } = await supabaseAdmin
    .from("updates")
    .select("id, published_at")
    .order("published_at", { ascending: false })

  const billUrls: MetadataRoute.Sitemap = (bills ?? []).map((row) => ({
    url: `${BASE_URL}/bill/${row.id}`,
    lastModified: new Date(row.published_at as string),
    changeFrequency: "weekly",
    priority: 0.6,
  }))

  const zipUrls: MetadataRoute.Sitemap = FEATURED_ZIPS.map((zip) => ({
    url: `${BASE_URL}/zip/${zip}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.8,
  }))

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    ...zipUrls,
    ...billUrls,
  ]
}
