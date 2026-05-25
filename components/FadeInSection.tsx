"use client"

import { motion } from "framer-motion"

interface FadeInSectionProps {
  children: React.ReactNode
  className?: string
  delay?: number
  yOffset?: number
}

export function FadeInSection({
  children,
  className,
  delay = 0,
  yOffset = 28,
}: FadeInSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -50px 0px" }}
      transition={{
        duration: 0.55,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
