import { useState } from "react"
import { Check, Loader2, Pencil, Plus, Trash2 } from "lucide-react"
import { useHabits } from "@/hooks/useHabits"
import { HabitForm } from "./HabitForm"
import { Button } from "@/components/ui/button"

function Habits() {
  const {
    habits,
    listLoading,
    listError,
    fetchHabits,
    addLoading,
    addError,
    addHabit,
    editLoading,
    editError,
    editHabit,
    clearEditError,
    togglingId,
    toggleError,
    toggleHabit,
    clearToggleError,
    deletingId,
    deleteError,
    deleteHabit,
    clearDeleteError,
  } = useHabits()

  const [editingId, setEditingId] = useState<string | null>(null)
  const completedCount = habits.filter((h) => h.completed).length

  return (
    <section className="space-y-5">
      <header className="flex items-baseline justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Habits</h2>
          <p className="text-sm text-muted-foreground">
            {habits.length === 0
              ? "No habits yet. Add your first one below."
              : `${completedCount} of ${habits.length} completed`}
          </p>
        </div>
        <span className="rounded-full border border-border bg-muted px-2 py-0.5 text-xs text-muted-foreground">
          {habits.length}
        </span>
      </header>

      <HabitForm
        loading={addLoading}
        error={addError}
        onSubmit={addHabit}
        submitLabel="Add Habit"
      />

      {listLoading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Loading habits…
        </div>
      ) : listError ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          <p role="alert">Failed to load habits: {listError}</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => void fetchHabits()}
            className="mt-2"
          >
            Retry
          </Button>
        </div>
      ) : (
        <ul className="space-y-2">
          {habits.map((habit) =>
            editingId === habit.id ? (
              <li
                key={habit.id}
                className="rounded-lg border border-border bg-card p-3"
              >
                <HabitForm
                  initialValue={habit.name}
                  loading={editLoading}
                  error={editError}
                  onSubmit={(name) => editHabit(habit.id, name)}
                  onCancel={() => {
                    setEditingId(null)
                    clearEditError()
                  }}
                  submitLabel="Save"
                />
              </li>
            ) : (
              <li
                key={habit.id}
                className="flex items-center gap-3 rounded-lg border border-border bg-card p-3"
              >
                <button
                  type="button"
                  onClick={() => void toggleHabit(habit)}
                  disabled={togglingId === habit.id}
                  aria-label={
                    habit.completed
                      ? `Mark ${habit.name} as not done`
                      : `Mark ${habit.name} as done`
                  }
                  className={`flex size-5 shrink-0 items-center justify-center rounded-full border transition disabled:opacity-50 ${
                    habit.completed
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-input bg-background hover:border-primary"
                  }`}
                >
                  {togglingId === habit.id ? (
                    <Loader2 className="size-3 animate-spin" />
                  ) : habit.completed ? (
                    <Check className="size-3" />
                  ) : null}
                </button>

                <span
                  className={`flex-1 text-sm ${
                    habit.completed
                      ? "text-muted-foreground line-through"
                      : ""
                  }`}
                >
                  {habit.name}
                </span>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => {
                    clearEditError()
                    setEditingId(habit.id)
                  }}
                  aria-label={`Edit ${habit.name}`}
                >
                  <Pencil />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => void deleteHabit(habit.id)}
                  disabled={deletingId === habit.id}
                  aria-label={`Delete ${habit.name}`}
                  className="text-destructive hover:text-destructive"
                >
                  {deletingId === habit.id ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <Trash2 />
                  )}
                </Button>
              </li>
            )
          )}

          {habits.length === 0 && !listLoading && !listError && (
            <li className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              <Plus className="size-5" />
              Add a habit above to start tracking.
            </li>
          )}
        </ul>
      )}

      {(toggleError || deleteError) && (
        <div
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
        >
          {toggleError ?? deleteError}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="mt-1 h-auto p-0 text-destructive hover:text-destructive"
            onClick={() => {
              clearToggleError()
              clearDeleteError()
            }}
          >
            Dismiss
          </Button>
        </div>
      )}
    </section>
  )
}

export default Habits