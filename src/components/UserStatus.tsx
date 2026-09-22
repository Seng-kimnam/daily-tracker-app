import { useState, useEffect } from "react"
import { supabase } from "../lib/supabase"
import type { Session } from "@supabase/supabase-js"

function UserStatus() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession)
      }
    )

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  if (loading || !session) return null

  return (
    <p className="flex items-center gap-2 text-sm text-muted-foreground">
      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-foreground">
        {session.user.email?.charAt(0).toUpperCase() ?? "?"}
      </span>
      Signed in as{" "}
      <span className="font-medium text-foreground">{session.user.email}</span>
    </p>
  )
}

export default UserStatus