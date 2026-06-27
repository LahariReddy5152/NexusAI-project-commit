/** Remote app_state persistence via SQLite API */
import { api, getToken } from "./api-client.js";

const pending = new Map();

export async function loadRemoteState(key, fallback = null) {
  if (!getToken()) return fallback;
  const { ok, data } = await api(`/progress/state/${encodeURIComponent(key)}`);
  if (ok && data.data != null) return data.data;
  return fallback;
}

export async function saveRemoteState(key, value) {
  if (!getToken()) return false;
  const { ok } = await api(`/progress/state/${encodeURIComponent(key)}`, {
    method: "PUT",
    body: JSON.stringify(value)
  });
  return ok;
}

export function saveRemoteStateDebounced(key, value, delayMs = 400) {
  if (!getToken()) return;
  if (pending.has(key)) clearTimeout(pending.get(key));
  pending.set(
    key,
    setTimeout(() => {
      pending.delete(key);
      saveRemoteState(key, value).catch(() => {});
    }, delayMs)
  );
}
