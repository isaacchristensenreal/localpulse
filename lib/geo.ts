export interface ZipLocation {
  zipcode: string
  city: string
  state: string
  stateAbbr: string
}

export async function lookupZip(zipcode: string): Promise<ZipLocation | null> {
  try {
    const res = await fetch(`https://api.zippopotam.us/us/${zipcode}`, {
      next: { revalidate: 86400 },
    })
    if (!res.ok) return null
    const data = await res.json()
    const place = data.places?.[0]
    if (!place) return null
    return {
      zipcode,
      city: place["place name"],
      state: place["state"],
      stateAbbr: place["state abbreviation"],
    }
  } catch {
    return null
  }
}
