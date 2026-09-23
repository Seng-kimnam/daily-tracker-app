const Nav = () => {
  return (
    <nav className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-2">
      <span className="text-sm font-semibold">Daily Tracker</span>
      <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
        Dashboard
      </span>
    </nav>
  )
}

export default Nav