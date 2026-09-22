import { useState } from "react"
import { Button } from "@/components/ui/button"

type HabitFormProps = {
  initialValue?: string
  loading: boolean
  error: string | null
  onSubmit: (name: string) => Promise<unknown>
  onCancel?: () => void
  submitLabel: string
}

function HabitForm({
  initialValue = "",
  loading,
  error,
  onSubmit,
  onCancel,
  submitLabel,
}: HabitFormProps) {
  const [name, setName] = useState(initialValue)

  const handleSubmit = async () => {
    const trimmed = name.trim()
    if (!trimmed || loading) return
    if (await onSubmit(trimmed) && !onCancel) {
      setName("")
    }
  }

  return (
    <form
      className="space-y-2"
      onSubmit={(e) => {
        e.preventDefault()
        void handleSubmit()
      }}
    >
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g. Drink 2L of water"
        maxLength={100}
        autoFocus={!onCancel}
        className="w-full rounded-md border  bg-background px-3 py-2 text-sm outline-none transition placeholder:text-muted-foreground focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50"
      />
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      <div className="flex gap-2">
        <Button type="submit" disabled={!name.trim() || loading} className="flex-1 bg-black text-white cursor-pointer">
          {loading ? "Saving…" : submitLabel}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}

export { HabitForm, type HabitFormProps }