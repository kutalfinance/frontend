/**
 * Centralized auth token management utility
 * Provides consistent token storage, retrieval, and removal
 */

const AUTH_TOKEN_KEY = "kss_auth";

// Mirror the token to IndexedDB so the service worker can read it for Background Sync.
// Uses raw IDB API to avoid a circular dependency with lib/offline.ts.
function mirrorTokenToIdb(token: string | null) {
  if (typeof indexedDB === "undefined") return;
  const req = indexedDB.open("kss-offline", 2);
  req.onsuccess = () => {
    const db = req.result;
    try {
      const tx = db.transaction("offline-misc", "readwrite");
      if (token) {
        tx.objectStore("offline-misc").put({ key: "sw-auth-token", value: token });
      } else {
        tx.objectStore("offline-misc").delete("sw-auth-token");
      }
      tx.oncomplete = () => db.close();
    } catch {
      db.close();
    }
  };
}

export const authToken = {
  /**
   * Get the current auth token from localStorage
   */
  get(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(AUTH_TOKEN_KEY);
  },

  /**
   * Set the auth token in localStorage
   */
  set(token: string): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    mirrorTokenToIdb(token);
  },

  /**
   * Remove the auth token from localStorage
   */
  remove(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(AUTH_TOKEN_KEY);
    mirrorTokenToIdb(null);
  },

  /**
   * Clear all auth-related data from localStorage
   */
  clear(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(AUTH_TOKEN_KEY);
    mirrorTokenToIdb(null);
  },

  /**
   * Check if user is authenticated (has valid token)
   */
  isAuthenticated(): boolean {
    return !!this.get();
  },

  /**
   * Get Authorization header value for API requests
   */
  getAuthHeader(): string | null {
    const token = this.get();
    return token ? `Bearer ${token}` : null;
  },
} as const;
