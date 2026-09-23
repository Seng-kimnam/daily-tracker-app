type StatsProps = {
  total: number
  completed: number
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-border bg-card p-3 text-center">
      <p className="text-lg font-semibold">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  )
}

function Stats({ total, completed }: StatsProps) {
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0
  return (
    <div className="grid grid-cols-3 gap-3">
      <StatCard label="Total" value={total} />
      <StatCard label="Completed" value={completed} />
      <StatCard label="Done" value={`${percent}%`} />
    </div>
  )
}

export default Stats