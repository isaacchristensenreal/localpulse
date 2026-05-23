import type { Metadata } from "next";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/ThemeProvider";
import { PageTransition } from "@/components/PageTransition";
import "./globals.css";

const TITLE = "LocalPulse — Government Changes That Affect You"
const DESCRIPTION =
  "Enter your ZIP code and see recent government changes affecting your rent, taxes, schools, and roads — explained in plain English. Free civic education tool."

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://localpulse-sooty.vercel.app"
  ),
  title: {
    default: "LocalPulse",
    template: "%s | LocalPulse",
  },
  description: DESCRIPTION,
  robots: { index: true, follow: true },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    siteName: "LocalPulse",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <PageTransition>
            {children}
          </PageTransition>
          <Toaster position="bottom-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
