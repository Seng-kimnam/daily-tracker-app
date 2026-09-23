import { useEffect, useRef, useState } from "react"
import { Camera, Loader2, User, X } from "lucide-react"
import { supabase } from "@/lib/supabase"

const MAX_SIZE = 1024 * 1024

function Avatar() {
  const [userId, setUserId] = useState<string | null>(null)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    let ignore = false
    void (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (ignore || !user) return
      setUserId(user.id)
      const { data } = await supabase
        .from("profiles")
        .select("avatar_url")
        .eq("user_id", user.id)
        .maybeSingle()
      if (!ignore) {
        setAvatarUrl(data?.avatar_url ?? null)
      }
    })()
    return () => {
      ignore = true
    }
  }, [])

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview)
      }
    }
  }, [preview])

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    event.target.value = ""
    setError(null)

    if (!file) return

    if (file.size > MAX_SIZE) {
      setError("Image must be 1 MB or smaller.")
      setPreview(null)
      return
    }

    setPreview(URL.createObjectURL(file))
    await upload(file)
  }

  const upload = async (file: File) => {
    if (!userId) {
      setError("You must be signed in to upload an avatar.")
      return
    }
    setUploading(true)
    setError(null)
    try {
      const safeName = file.name.replace(/[^\w.-]+/g, "_")
      const path = `${userId}/${Date.now()}-${safeName}`
      const { data, error } = await supabase.storage
        .from("avatars")
        .upload(path, file, {
          upsert: true,
          cacheControl: "3600",
          contentType: file.type,
        })
      if (error) throw error

      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(data.path)

      const { error: dbError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("user_id", userId)
      if (dbError) throw dbError

      setAvatarUrl(publicUrl)
      setPreview(null)
    } catch (err) {
      setPreview(null)
      setError(err instanceof Error ? err.message : "Upload failed.")
    } finally {
      setUploading(false)
    }
  }

  console.log(
    "Avatar component rendered. userId:",
    userId,
    "avatarUrl:",
    avatarUrl,
    "preview:",
    preview,
    "uploading:",
    uploading,
    "error:",
    error
  )
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <div className="border-border bg-muted flex size-16 items-center justify-center overflow-hidden rounded-full border">
          {preview || avatarUrl ? (
            <img
              src={preview ?? avatarUrl ?? ""}
              alt="Avatar preview"
              className="size-full object-cover"
            />
          ) : (
            <User className="text-muted-foreground size-8" />
          )}
        </div>
        {uploading && (
          <div className="bg-background/60 absolute inset-0 flex items-center justify-center rounded-full">
            <Loader2 className="size-5 animate-spin" />
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => void handleFileChange(e)}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="border-border bg-card hover:bg-muted inline-flex cursor-pointer items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition disabled:opacity-50"
      >
        <Camera className="size-3.5" />
        {uploading ? "Uploading…" : "Change avatar"}
      </button>

      {error && (
        <div
          role="alert"
          className="border-destructive/30 bg-destructive/10 text-destructive flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs"
        >
          {error}
          <button
            type="button"
            onClick={() => setError(null)}
            aria-label="Dismiss error"
            className="text-destructive/70 hover:text-destructive shrink-0"
          >
            <X className="size-3.5" />
          </button>
        </div>
      )}
    </div>
  )
}

export default Avatar
