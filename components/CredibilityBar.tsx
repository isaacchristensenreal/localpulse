import { FadeInSection } from "./FadeInSection"

const SOURCES = ["Congress.gov", "OpenStates", "Federal Register", "GPT-4o Mini"]

export function CredibilityBar() {
  return (
    <div className="w-full bg-primary">
      <FadeInSection>
        <div className="mx-auto max-w-5xl px-6 py-10">
          <p className="mb-6 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-white/35">
            Powered by official government sources
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {SOURCES.map((source) => (
              <span
                key={source}
                className="rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm font-medium text-white/60"
              >
                {source}
              </span>
            ))}
          </div>
        </div>
      </FadeInSection>
    </div>
  )
}
