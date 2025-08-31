export type PersistKey = "ssa_student_profile" | "ssa_student_answers" | "ssa_questions" | "ssa_admin_filters"

export function getLocal<T>(key: PersistKey, fallback: T): T {
  if (typeof window === "undefined") return fallback
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

export function setLocal<T>(key: PersistKey, value: T) {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
    window.dispatchEvent(new StorageEvent("storage", { key }))
  } catch {}
}
