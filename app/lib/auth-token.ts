/**
 * Centralized auth token management utility
 * Provides consistent token storage, retrieval, and removal
 */

const AUTH_TOKEN_KEY = "kss_auth";

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
  },

  /**
   * Remove the auth token from localStorage
   */
  remove(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(AUTH_TOKEN_KEY);
  },

  /**
   * Clear all auth-related data from localStorage
   */
  clear(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(AUTH_TOKEN_KEY);
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
