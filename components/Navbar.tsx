'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from 'framer-motion'
import { Sun, Moon, Menu, X } from 'lucide-react'
import { useTheme } from 'next-themes'

const NAV_LINKS = [
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Examples', href: '#examples' },
  { label: 'About', href: '/about' },
]

function NavLink({
  label,
  href,
  onClick,
}: {
  label: string
  href: string
  onClick?: () => void
}) {
  const isHash = href.startsWith('#')

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isHash) {
      e.preventDefault()
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
    }
    onClick?.()
  }

  return (
    <Link
      href={href}
      onClick={handleClick}
      className="relative text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
    >
      {label}
      <motion.span
        className="absolute -bottom-0.5 left-0 right-0 h-px bg-accent origin-left block"
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      />
    </Link>
  )
}

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  return (
    <motion.button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      animate={{ rotate: isDark ? 180 : 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
      aria-label="Toggle theme"
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </motion.button>
  )
}

function LogoMark() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="32" cy="32" r="30" fill="#0D1B2A" />
      <text
        x="32"
        y="41"
        textAnchor="middle"
        fontFamily="'Geist', 'Inter', 'Helvetica Neue', Arial, sans-serif"
        fontSize="22"
        fontWeight="700"
        fill="#FFFFFF"
        letterSpacing="-0.5"
      >
        LP
      </text>
      <circle cx="47" cy="17" r="5" fill="#2563EB" className="animate-pulse-dot" />
    </svg>
  )
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (y) => {
    setScrolled(y > 50)
  })

  const scrollToZip = (e: React.MouseEvent) => {
    e.preventDefault()
    const el =
      document.getElementById('zip-input') ||
      document.querySelector('input[type="text"]')
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        scrolled
          ? 'bg-white/95 dark:bg-[#0D1B2A]/95 backdrop-blur-md'
          : 'bg-transparent'
      }`}
      animate={
        scrolled
          ? { boxShadow: '0 1px 24px rgba(0,0,0,0.08)' }
          : { boxShadow: '0 0px 0px rgba(0,0,0,0)' }
      }
      transition={{ duration: 0.2 }}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <LogoMark />
          <span className="text-lg font-bold text-primary dark:text-white">
            Local<span style={{ color: '#2563EB' }}>Pulse</span>
          </span>
        </Link>

        {/* Center links — desktop only */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.href} label={link.label} href={link.href} />
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <a
            href="#zip-input"
            onClick={scrollToZip}
            className="hidden sm:inline-flex items-center px-4 py-2 text-sm font-semibold text-white rounded-full transition-colors hover:opacity-90"
            style={{ backgroundColor: '#2563EB' }}
          >
            Try it free
          </a>
          <button
            className="md:hidden p-2 rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-drawer"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="md:hidden border-t border-border bg-white/95 dark:bg-[#0D1B2A]/95 backdrop-blur-md"
          >
            <nav className="flex flex-col gap-4 px-6 py-5">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.href}
                  label={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                />
              ))}
              <a
                href="#zip-input"
                onClick={(e) => {
                  scrollToZip(e)
                  setMobileOpen(false)
                }}
                className="inline-flex justify-center items-center px-4 py-2 text-sm font-semibold text-white rounded-full hover:opacity-90 transition-opacity"
                style={{ backgroundColor: '#2563EB' }}
              >
                Try it free
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
