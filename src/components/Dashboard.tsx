import { useEffect, useState } from "react"
import { Loader2, LogOut } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import Avatar from "./Avatar"
import ErrorBoundary from "./ErrorBoundary"
import Habits from "./Habits"
import Nav from "./Nav"

const Dashboard = () => {
  const [email, setEmail] = useState<string | null>(null)
  const [signingOut, setSigningOut] = useState(false)
  const [signOutError, setSignOutError] = useState<string | null>(null)

  useEffect(() => {
    let ignore = false
    void supabase.auth.getUser().then(({ data }) => {
      if (!ignore) {
        setEmail(data.user?.email ?? null)
      }
    })
    return () => {
      ignore = true
    }
  }, [])

  const handleSignOut = async () => {
    setSigningOut(true)
    setSignOutError(null)
    const { error } = await supabase.auth.signOut()
    setSigningOut(false)
    if (error) {
      setSignOutError(error.message)
    }
  }

  return (
    <main className="bg-background text-foreground mx-auto w-full max-w-xl space-y-6 p-6">
      <ErrorBoundary
        fallbackTitle="Navigation failed to load."
        fallbackDescription="The top navigation crashed."
      >
        <Nav />
      </ErrorBoundary>

      <header className="flex items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-4">
          <ErrorBoundary
            fallbackTitle="Avatar failed to load."
            onRetry={() => window.location.reload()}
          >
            <Avatar />
          </ErrorBoundary>
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">
              Daily Tracker, Hi {email || "User"}!
            </h1>
            <p className="text-muted-foreground text-sm">
              Build streaks by checking in on your habits every day.
            </p>
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => void handleSignOut()}
          disabled={signingOut}
        >
          {signingOut ? (
            <Loader2 className="animate-spin" />
          ) : (
            <LogOut className="size-4" />
          )}
          Sign Out
        </Button>
      </header>

      {signOutError && (
        <p role="alert" className="text-destructive text-sm">
          Could not sign out: {signOutError}
        </p>
      )}

      <ErrorBoundary
        fallbackTitle="Couldn't load your habits."
        fallbackDescription="The habit list failed to render."
      >
        <Habits />
      </ErrorBoundary>
    </main>
  )
}

export default Dashboard