export function ResultsSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="h-52 animate-pulse rounded-xl border-l-4 border-l-border bg-border/30"
          style={{ animationDelay: `${i * 80}ms` }}
        />
      ))}
    </div>
  )
}
