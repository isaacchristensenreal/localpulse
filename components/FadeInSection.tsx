"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"

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
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.12 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: yOffset }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: yOffset }}
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
