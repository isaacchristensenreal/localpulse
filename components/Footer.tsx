export function Footer() {
  return (
    <footer className="mt-auto border-t border-border py-8">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <p className="text-xs text-muted">
          © {new Date().getFullYear()} LocalPulse. Data sourced from{" "}
          <a
            href="https://congress.gov"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-primary"
          >
            Congress.gov
          </a>{" "}
          and{" "}
          <a
            href="https://openstates.org"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-primary"
          >
            OpenStates
          </a>
          .
        </p>
      </div>
    </footer>
  )
}
