import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "LocalPulse",
    short_name: "LocalPulse",
    description: "Government changes that affect you — in plain English",
    theme_color: "#0D1B2A",
    background_color: "#F8FAFC",
    display: "standalone",
    start_url: "/",
    icons: [
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
