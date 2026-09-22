// src/components/ProtectedRoute.jsx
import { useState, useEffect } from "react"
import { Navigate } from "react-router-dom"
import { supabase } from "../lib/supabase"
import type { Session } from "@supabase/supabase-js"

function ProtectedRoute({ children }: { children: React.ReactNode }) {
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

    return () => listener.subscription.unsubscribe()
  }, [])

  if (loading) return <p className="p-8">Checking auth...</p>
  if (!session) return <Navigate to="/login" replace />

  return children
}

export default ProtectedRoute
