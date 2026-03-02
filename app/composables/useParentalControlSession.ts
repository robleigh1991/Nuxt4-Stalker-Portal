// Manages runtime parental control session state (not persisted)
interface ParentalControlSession {
  isAuthenticated: boolean
  authenticatedAt: number | null
  expiresAt: number | null
}

export function useParentalControlSession() {
  const session = useState<ParentalControlSession>('pc-session', () => ({
    isAuthenticated: false,
    authenticatedAt: null,
    expiresAt: null,
  }))

  /**
   * Authenticate the session for a specified duration
   * @param timeoutMinutes Duration in minutes (0 = session-only, no persistence)
   */
  function authenticate(timeoutMinutes: number) {
    const now = Date.now()
    session.value = {
      isAuthenticated: true,
      authenticatedAt: now,
      expiresAt: timeoutMinutes > 0 ? now + (timeoutMinutes * 60 * 1000) : null,
    }
  }

  /**
   * Check if the current session is still valid
   */
  function isSessionValid(): boolean {
    if (!session.value.isAuthenticated) return false

    // If no expiration set (always ask mode), session is only valid for current operation
    if (!session.value.expiresAt) return false

    return Date.now() < session.value.expiresAt
  }

  /**
   * Clear the session (logout)
   */
  function clearSession() {
    session.value = {
      isAuthenticated: false,
      authenticatedAt: null,
      expiresAt: null,
    }
  }

  /**
   * Get remaining session time in minutes
   */
  function getRemainingTime(): number {
    if (!session.value.isAuthenticated || !session.value.expiresAt) return 0
    const remaining = session.value.expiresAt - Date.now()
    return Math.max(0, Math.floor(remaining / 60000))
  }

  return {
    session: readonly(session),
    authenticate,
    isSessionValid,
    clearSession,
    getRemainingTime,
  }
}
