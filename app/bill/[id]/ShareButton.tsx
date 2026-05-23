"use client"

import { Share2 } from "lucide-react"
import { toast } from "sonner"
import { motion } from "framer-motion"

export function ShareButton() {
  async function handleShare() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      toast.success("Link copied to clipboard!")
    } catch {
      toast.error("Couldn't copy link")
    }
  }

  return (
    <motion.button
      onClick={handleShare}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full bg-accent px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-accent/30 sm:hidden"
      aria-label="Share this bill"
    >
      <Share2 size={16} />
      Share
    </motion.button>
  )
}
