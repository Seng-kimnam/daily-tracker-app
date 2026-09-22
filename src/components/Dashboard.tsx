import { useState } from "react"
import { Loader2, LogOut } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import Habits from "./Habits"

const Dashboard = () => {
  const [signingOut, setSigningOut] = useState(false)
  const [signOutError, setSignOutError] = useState<string | null>(null)

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
    <main className="mx-auto w-full max-w-xl space-y-8 bg-background p-6 text-foreground">
      <header className="flex items-start justify-between gap-4 pb-2">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            Daily Tracker
          </h1>
          <p className="text-sm text-muted-foreground">
            Build streaks by checking in on your habits every day.
          </p>
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
        <p role="alert" className="text-sm text-destructive">
          Could not sign out: {signOutError}
        </p>
      )}

      <Habits />
    </main>
  )
}

export default Dashboard