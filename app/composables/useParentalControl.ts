/**
 * Parental Control Composable
 *
 * Provides content detection and access control for censored/adult content
 * Supports both Stalker Portal and Xtream Codes providers
 */

export function useParentalControl() {
  const settings = useSettingsStore()
  const session = useParentalControlSession()
  const toast = useToast()

  /**
   * Detect if content item is censored/adult
   * @param item The content item (channel, movie, series)
   * @param category The category object
   * @param providerType 'stalker' or 'xtream'
   */
  function isCensoredContent(item: any, category: any, providerType: string): boolean {
    if (providerType === 'stalker') {
      // Stalker uses 'censored' field (1 = censored)
      return item?.censored === 1 || category?.censored === 1
    } else if (providerType === 'xtream') {
      // Xtream uses 'is_adult' field
      if (item?.is_adult === '1' || item?.is_adult === 1) return true

      // Also check category name for adult keywords
      const catName = (category?.category_name || '').toLowerCase()
      const keywords = ['adult', 'xxx', '18+', 'porn', 'erotic', 'nsfw']
      return keywords.some(kw => catName.includes(kw))
    }
    return false
  }

  /**
   * Detect if category is censored/adult
   * @param category The category object
   * @param providerType 'stalker' or 'xtream'
   */
  function isCensoredCategory(category: any, providerType: string): boolean {
    if (providerType === 'stalker') {
      return category?.censored === 1
    } else if (providerType === 'xtream') {
      const catName = (category?.category_name || '').toLowerCase()
      const keywords = ['adult', 'xxx', '18+', 'porn', 'erotic', 'nsfw']
      return keywords.some(kw => catName.includes(kw))
    }
    return false
  }

  /**
   * Check if user has access to censored content
   * Returns true if access granted, false if denied
   *
   * @param item The content item
   * @param category The category object
   * @param providerType 'stalker' or 'xtream'
   * @param promptCallback Async function that shows PIN prompt and returns entered PIN (or null if cancelled)
   */
  async function checkContentAccess(
    item: any,
    category: any,
    providerType: string,
    promptCallback: () => Promise<string | null>
  ): Promise<boolean> {
    // If parental control disabled, allow access
    if (!settings.parentalControl.enabled) return true

    // If content is not censored, allow access
    if (!isCensoredContent(item, category, providerType)) return true

    // If valid session exists, allow access
    if (session.isSessionValid()) return true

    // Need PIN - show prompt via callback
    const pin = await promptCallback()
    if (!pin) return false // User cancelled

    // Verify PIN
    const valid = await settings.verifyPin(pin)
    if (!valid) {
      toast.add({
        title: 'Incorrect PIN',
        description: 'The PIN you entered is incorrect.',
        color: 'red',
      })
      return false
    }

    // Start authenticated session
    session.authenticate(settings.parentalControl.sessionTimeout)
    return true
  }

  return {
    // Computed properties
    isEnabled: computed(() => settings.parentalControl.enabled),
    hasPin: computed(() => !!settings.parentalControl.pinHash),
    hideAdultCategories: computed(() => settings.parentalControl.hideAdultCategories),
    sessionTimeout: computed(() => settings.parentalControl.sessionTimeout),

    // Detection methods
    isCensoredContent,
    isCensoredCategory,

    // Access control
    checkContentAccess,

    // Session management
    clearSession: session.clearSession,
    isSessionValid: session.isSessionValid,
    getRemainingTime: session.getRemainingTime,
  }
}
