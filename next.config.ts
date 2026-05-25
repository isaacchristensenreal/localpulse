import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,

  compiler: {
    // Strip console.log/debug/info in production; keep error and warn
    removeConsole:
      process.env.NODE_ENV === "production"
        ? { exclude: ["error", "warn"] }
        : false,
  },

  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
