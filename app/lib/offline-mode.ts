/**
 * Manual offline mode toggle.
 * Agents explicitly switch between online and offline mode;
 * we do not rely on navigator.onLine (unreliable in poor coverage areas).
 *
 * State is persisted in localStorage so it survives page refreshes.
 * Any change dispatches "kss:offline-mode-changed" so React hooks can react.
 */

const STORAGE_KEY = "kss_offline_mode";
export const OFFLINE_MODE_EVENT = "kss:offline-mode-changed";

export type OfflineModeChangedDetail = { offline: boolean };

export function isOfflineMode(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

export function setOfflineMode(offline: boolean): void {
  try {
    localStorage.setItem(STORAGE_KEY, String(offline));
  } catch {}
  window.dispatchEvent(
    new CustomEvent<OfflineModeChangedDetail>(OFFLINE_MODE_EVENT, { detail: { offline } })
  );
}
