import { useCallback, useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { User } from "@supabase/supabase-js"

export type Habit = {
  id: string
  user_id: string
  name: string
  completed: boolean
  created_at: string
}

async function getCurrentUser(): Promise<User | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [listLoading, setListLoading] = useState(true)
  const [listError, setListError] = useState<string | null>(null)

  const [addLoading, setAddLoading] = useState(false)
  const [addError, setAddError] = useState<string | null>(null)

  const [editLoading, setEditLoading] = useState(false)
  const [editError, setEditError] = useState<string | null>(null)

  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [toggleError, setToggleError] = useState<string | null>(null)

  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const fetchHabits = useCallback(async () => {
    setListLoading(true)
    setListError(null)
    const { data, error } = await supabase
      .from("habits")
      .select("*")
      .order("created_at", { ascending: false })
    if (error) {
      setListError(error.message)
      setHabits([])
    } else {
      setHabits(data ?? [])
    }
    setListLoading(false)
  }, [])

  useEffect(() => {
    let ignore = false
    void (async () => {
      const { data, error } = await supabase
        .from("habits")
        .select("*")
        .order("created_at", { ascending: false })
      if (ignore) return
      if (error) {
        setListError(error.message)
        setHabits([])
      } else {
        setHabits(data ?? [])
      }
      setListLoading(false)
    })()
    return () => {
      ignore = true
    }
  }, [])

  const addHabit = useCallback(
    async (name: string): Promise<Habit | null> => {
      const trimmed = name.trim()
      if (!trimmed) {
        setAddError("Habit name is required.")
        return null
      }
      const user = await getCurrentUser()
      if (!user) {
        setAddError("You must be signed in to manage habits.")
        return null
      }
      setAddLoading(true)
      setAddError(null)
      const { data, error } = await supabase
        .from("habits")
        .insert({ name: trimmed, user_id: user.id })
        .select()
        .single()
      setAddLoading(false)
      if (error) {
        setAddError(error.message)
        return null
      }
      setHabits((prev) => [data, ...prev])
      return data
    },
    []
  )

  const editHabit = useCallback(
    async (id: string, name: string): Promise<Habit | null> => {
      const trimmed = name.trim()
      if (!trimmed) {
        setEditError("Habit name is required.")
        return null
      }
      setEditLoading(true)
      setEditError(null)
      const { data, error } = await supabase
        .from("habits")
        .update({ name: trimmed })
        .eq("id", id)
        .select()
        .single()
      setEditLoading(false)
      if (error) {
        setEditError(error.message)
        return null
      }
      setHabits((prev) => prev.map((h) => (h.id === id ? data : h)))
      return data
    },
    []
  )

  const toggleHabit = useCallback(async (habit: Habit) => {
    setTogglingId(habit.id)
    setToggleError(null)
    const { data, error } = await supabase
      .from("habits")
      .update({ completed: !habit.completed })
      .eq("id", habit.id)
      .select()
      .single()
    setTogglingId(null)
    if (error) {
      setToggleError(error.message)
      return
    }
    setHabits((prev) => prev.map((h) => (h.id === habit.id ? data : h)))
  }, [])

  const deleteHabit = useCallback(async (id: string) => {
    setDeletingId(id)
    setDeleteError(null)
    const { error } = await supabase.from("habits").delete().eq("id", id)
    setDeletingId(null)
    if (error) {
      setDeleteError(error.message)
      return
    }
    setHabits((prev) => prev.filter((h) => h.id !== id))
  }, [])

  return {
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
    clearEditError: () => setEditError(null),
    togglingId,
    toggleError,
    toggleHabit,
    clearToggleError: () => setToggleError(null),
    deletingId,
    deleteError,
    deleteHabit,
    clearDeleteError: () => setDeleteError(null),
  }
}