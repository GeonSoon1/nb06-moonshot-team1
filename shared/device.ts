const KEY = "device_id";

export function getOrCreateDeviceId(): string {
  if (typeof window === "undefined") return "server";

  const existing = window.localStorage.getItem(KEY);
  if (existing) return existing;

  const created =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  window.localStorage.setItem(KEY, created);
  return created;
}
