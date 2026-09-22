import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"

type Action = "up" | "in" | "out"
type Message = { type: "error" | "success"; text: string }

const inputClasses =
  "w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition placeholder:text-muted-foreground focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50"

function AuthForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState<Message | null>(null)
  const [loading, setLoading] = useState<Action | null>(null)
  const navigate = useNavigate()

  const handleSignUp = async () => {
    setLoading("up")
    setMessage(null)
    const { data, error } = await supabase.auth.signUp({ email, password })
    setLoading(null)
    if (error) {
      setMessage({ type: "error", text: error.message })
    } else if (data.user?.identities?.length === 0) {
      setMessage({
        type: "error",
        text: "An account with this email already exists. Sign in instead.",
      })
    } else {
      setMessage({
        type: "success",
        text: "Check your email for a confirmation link!",
      })
    }
  }

  const handleSignIn = async () => {
    setLoading("in")
    setMessage(null)
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    setLoading(null)
    if (error) {
      setMessage({ type: "error", text: error.message })
      return
    }
    setMessage({ type: "success", text: "Signed in successfully!" })
    navigate("/", { replace: true })
  }

  return (
    <div className="bg-background text-foreground flex min-h-screen items-center justify-center p-6">
      <div className="border-border bg-card w-full max-w-sm space-y-6 rounded-xl border p-6 shadow-xs">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Daily Tracker
          </h1>
          <p className="text-muted-foreground text-sm">
            Sign in or create an account to get started.
          </p>
        </div>

        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
            void handleSignIn()
          }}
        >
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
              className={inputClasses}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
              className={inputClasses}
            />
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => void handleSignUp()}
              disabled={loading !== null}
              className="flex-1 cursor-pointer bg-black text-white"
            >
              {loading === "up" ? "Creating…" : "Sign Up"}
            </Button>
            <Button
              type="submit"
              variant="outline"
              disabled={loading !== null}
              className="flex-1 cursor-pointer"
            >
              {loading === "in" ? "Signing in…" : "Sign In"}
            </Button>
          </div>
        </form>

        {message && (
          <p
            role={message.type === "error" ? "alert" : "status"}
            className={`text-center text-sm ${
              message.type === "error"
                ? "text-destructive"
                : "text-muted-foreground"
            }`}
          >
            {message.text}
          </p>
        )}
      </div>
    </div>
  )
}

export default AuthForm
