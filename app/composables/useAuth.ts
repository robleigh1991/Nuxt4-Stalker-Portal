/**
 * Authentication composable
 * 
 * Provides unified authentication management with secure credential storage
 */

// Type imports only (types are always imported)
import type { ProviderType, StoredCredentials, SessionData } from '~/types/app';
import type { StalkerCredentials } from '~/types/stalker';
import type { XtreamCredentials } from '~/types/xtream';
import { apiCache } from '~/utils/cache';

// Note: storeCredentials, retrieveCredentials, removeCredentials, hasStoredCredentials
// are auto-imported from app/utils/crypto.ts

const CREDENTIALS_KEY = 'iptv_credentials';
const SESSION_KEY = 'iptv_session';
const REMEMBER_KEY = 'iptv_remember';

export const useAuth = () => {
  const stalkerStore = useStalkerStore();
  const xtreamStore = useXtreamStore();
  const toast = useToast();
  const router = useRouter();

  const isLoading = ref(false);
  const rememberMe = ref(false);

  /**
   * Initialize auth - load stored credentials (no auto-login)
   */
  const init = async () => {
    if (!process.client) return;

    try {
      // Check if user wants credentials remembered
      const shouldRemember = localStorage.getItem(REMEMBER_KEY) === 'true';
      rememberMe.value = shouldRemember;

      // Note: We no longer auto-login, just indicate credentials are available
      // The login page will retrieve and pre-fill them
    } catch (error) {
      console.error('Failed to initialize auth:', error);
    }
  };

  /**
   * Load stored credentials (for pre-filling form)
   */
  const loadStoredCredentials = async () => {
    if (!process.client) return null;

    try {
      const shouldRemember = localStorage.getItem(REMEMBER_KEY) === 'true';
      if (!shouldRemember) {
        return null;
      }

      const stored = await retrieveCredentials<StoredCredentials>(CREDENTIALS_KEY);
      if (!stored) {
        return null;
      }

      return {
        providerType: stored.providerType,
        credentials: JSON.parse(stored.data),
      };
    } catch (error) {
      console.error('Failed to load stored credentials:', error);
      return null;
    }
  };

  /**
   * Login with Stalker credentials
   */
  const loginStalker = async (
    portalUrl: string,
    macAddress: string,
    remember = false
  ): Promise<boolean> => {
    isLoading.value = true;

    try {
      const accountsStore = useAccountsStore();

      // Clear all cache and reset stores to prevent data contamination
      apiCache.clearAll();
      stalkerStore.$reset();
      if (xtreamStore.isAuthenticated) {
        xtreamStore.logout();
      }

      // Normalize portal URL (same normalization as in store)
      let normalizedPortalUrl = portalUrl.trim().replace(/\/+$/, '');
      if (!normalizedPortalUrl.endsWith('/c')) {
        normalizedPortalUrl += '/c';
      }

      // Authenticate (handshake only, don't load data yet)
      const result = await stalkerStore.makeHandshake(portalUrl, macAddress);

      if (!result?.success) {
        throw new Error('Authentication failed');
      }

      // Find or create account in multi-account system BEFORE loading data
      // Use normalized URL to prevent duplicates
      const credentials = { portalUrl: normalizedPortalUrl, macAddress: macAddress.trim() };
      let accountId: string | null = null;

      // Check if account already exists by comparing normalized credentials
      const stalkerAccounts = accountsStore.accounts.filter(acc => acc.providerType === 'stalker');
      for (const account of stalkerAccounts) {
        const existingCreds = await accountsStore.getAccountCredentials(account.id) as any;
        if (existingCreds?.portalUrl === normalizedPortalUrl &&
            existingCreds?.macAddress === macAddress.trim()) {
          accountId = account.id;
          break;
        }
      }

      // Create new account if not found
      if (!accountId) {
        const hostname = new URL(normalizedPortalUrl).hostname;
        const accountName = `Stalker - ${hostname}`;
        const result = await accountsStore.addAccount(accountName, 'stalker', credentials);
        if (result.success && result.accountId) {
          accountId = result.accountId;
        }
      }

      // Set as active account BEFORE loading data so cache uses correct prefix
      if (accountId) {
        accountsStore.setActiveAccount(accountId);

        // Update cache account ID to use the correct prefix
        apiCache.setAccountId(accountId);
      }

      // NOW load initial data with correct cache account ID
      await stalkerStore.getAllInfo();

      // Reload per-account stores
      if (accountId) {
        const favoritesStore = useFavoritesStore();
        const watchHistoryStore = useWatchHistoryStore();
        const channelMgmtStore = useChannelManagementStore();

        favoritesStore.reloadForAccount();
        watchHistoryStore.reloadForAccount();
        channelMgmtStore.reloadForAccount();
      }

      // Store credentials if remember me is enabled (legacy support)
      if (remember) {
        await saveCredentials('stalker', credentials);
        await saveSession('stalker');
      }

      toast.add({
        title: 'Success',
        description: 'Successfully connected to Stalker Portal',
        color: 'success',
      });

      return true;
    } catch (error: any) {
      toast.add({
        title: 'Login Failed',
        description: error.message || 'Please check your credentials and try again',
        color: 'error',
      });
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Login with Xtream credentials
   */
  const loginXtream = async (
    serverUrl: string,
    username: string,
    password: string,
    remember = false
  ): Promise<boolean> => {
    isLoading.value = true;

    try {
      const accountsStore = useAccountsStore();

      // Clear all cache and reset stores to prevent data contamination
      apiCache.clearAll();
      xtreamStore.logout();
      if (stalkerStore.token) {
        stalkerStore.$reset();
      }

      // Normalize server URL (same normalization as in store)
      const normalizedServerUrl = serverUrl.trim().replace(/\/+$/, '');

      // Authenticate (don't load data yet)
      const result = await xtreamStore.authenticate(serverUrl, username, password);

      if (!result?.success) {
        throw new Error('Authentication failed');
      }

      // Find or create account in multi-account system BEFORE loading data
      // Use normalized values to prevent duplicates
      const credentials = {
        serverUrl: normalizedServerUrl,
        username: username.trim(),
        password: password.trim()
      };
      let accountId: string | null = null;

      // Check if account already exists by comparing normalized credentials
      const xtreamAccounts = accountsStore.accounts.filter(acc => acc.providerType === 'xtream');
      for (const account of xtreamAccounts) {
        const existingCreds = await accountsStore.getAccountCredentials(account.id) as any;
        if (existingCreds?.serverUrl === normalizedServerUrl &&
            existingCreds?.username === username.trim() &&
            existingCreds?.password === password.trim()) {
          accountId = account.id;
          break;
        }
      }

      // Create new account if not found
      if (!accountId) {
        const hostname = new URL(normalizedServerUrl).hostname;
        const accountName = `Xtream - ${hostname}`;
        const result = await accountsStore.addAccount(accountName, 'xtream', credentials);
        if (result.success && result.accountId) {
          accountId = result.accountId;
        }
      }

      // Set as active account BEFORE loading data so cache uses correct prefix
      if (accountId) {
        accountsStore.setActiveAccount(accountId);

        // Update cache account ID to use the correct prefix
        apiCache.setAccountId(accountId);
      }

      // NOW load initial data with correct cache account ID
      await Promise.all([
        xtreamStore.getLiveCategories(),
        xtreamStore.getVodCategories(),
        xtreamStore.getSeriesCategories(),
      ]);

      // Reload per-account stores
      if (accountId) {
        const favoritesStore = useFavoritesStore();
        const watchHistoryStore = useWatchHistoryStore();
        const channelMgmtStore = useChannelManagementStore();

        favoritesStore.reloadForAccount();
        watchHistoryStore.reloadForAccount();
        channelMgmtStore.reloadForAccount();
      }

      // Store credentials if remember me is enabled (legacy support)
      if (remember) {
        await saveCredentials('xtream', credentials);
        await saveSession('xtream', {
          username: xtreamStore.userInfo?.username,
          status: xtreamStore.userInfo?.status,
          expDate: xtreamStore.userInfo?.exp_date,
        });
      }

      toast.add({
        title: 'Success',
        description: 'Successfully connected to Xtream service',
        color: 'success',
      });

      return true;
    } catch (error: any) {
      toast.add({
        title: 'Login Failed',
        description: error.message || 'Please check your credentials and try again',
        color: 'error',
      });
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Logout
   */
  const logout = async (clearRemembered = false) => {
    // Reset stores
    if (stalkerStore.token) {
      stalkerStore.$reset();
    }
    if (xtreamStore.isAuthenticated) {
      xtreamStore.logout();
    }

    // Clear session
    removeCredentials(SESSION_KEY);

    // Clear stored credentials if requested
    if (clearRemembered) {
      await clearStoredCredentials();
    }

    toast.add({
      title: 'Logged Out',
      description: 'You have been successfully logged out',
      color: 'success',
    });

    // Redirect to login
    router.push('/');
  };

  /**
   * Save credentials securely
   */
  const saveCredentials = async (
    providerType: ProviderType,
    credentials: StalkerCredentials | XtreamCredentials
  ) => {
    try {
      const stored: StoredCredentials = {
        providerType,
        data: JSON.stringify(credentials),
        timestamp: Date.now(),
      };

      await storeCredentials(CREDENTIALS_KEY, stored);
      localStorage.setItem(REMEMBER_KEY, 'true');
      rememberMe.value = true;
    } catch (error) {
      console.error('Failed to save credentials:', error);
    }
  };

  /**
   * Save session data
   */
  const saveSession = async (providerType: ProviderType, user?: any) => {
    try {
      const session: SessionData = {
        providerType,
        authenticated: true,
        expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
        user,
      };

      await storeCredentials(SESSION_KEY, session);
    } catch (error) {
      console.error('Failed to save session:', error);
    }
  };

  /**
   * Clear stored credentials
   */
  const clearStoredCredentials = async () => {
    removeCredentials(CREDENTIALS_KEY);
    removeCredentials(SESSION_KEY);
    localStorage.removeItem(REMEMBER_KEY);
    rememberMe.value = false;
  };

  /**
   * Check if credentials are stored
   */
  const hasStoredAuth = () => {
    return hasStoredCredentials(CREDENTIALS_KEY);
  };

  /**
   * Get current provider type
   */
  const getCurrentProvider = (): ProviderType | null => {
    if (stalkerStore.token) return 'stalker';
    if (xtreamStore.isAuthenticated) return 'xtream';
    return null;
  };

  /**
   * Check if user is authenticated
   */
  const isAuthenticated = computed(() => {
    return !!(stalkerStore.token || xtreamStore.isAuthenticated);
  });

  /**
   * Switch to a different account
   */
  const switchAccount = async (accountId: string): Promise<boolean> => {
    const accountsStore = useAccountsStore();

    try {
      // Get account metadata
      const account = accountsStore.accounts.find(acc => acc.id === accountId);
      if (!account) {
        toast.add({
          title: 'Error',
          description: 'Account not found',
          color: 'error',
        });
        return false;
      }

      // Load encrypted credentials
      const credentials = await accountsStore.getAccountCredentials(accountId);
      if (!credentials) {
        toast.add({
          title: 'Error',
          description: 'Failed to load account credentials',
          color: 'error',
        });
        return false;
      }

      isLoading.value = true;

      // Clear all cache and logout current session (but keep saved accounts)
      apiCache.clearAll();
      if (stalkerStore.token) {
        stalkerStore.$reset();
      }
      if (xtreamStore.isAuthenticated) {
        xtreamStore.logout();
      }

      // Login with new credentials
      let loginSuccess = false;

      if (account.providerType === 'stalker') {
        const stalkerCreds = credentials as StalkerCredentials;
        loginSuccess = await loginStalker(
          stalkerCreds.portalUrl,
          stalkerCreds.macAddress,
          false // Don't save to legacy storage
        );
      } else if (account.providerType === 'xtream') {
        const xtreamCreds = credentials as XtreamCredentials;
        loginSuccess = await loginXtream(
          xtreamCreds.serverUrl,
          xtreamCreds.username,
          xtreamCreds.password,
          false // Don't save to legacy storage
        );
      }

      if (loginSuccess) {
        // Note: loginStalker/loginXtream already set active account and reloaded stores
        toast.add({
          title: 'Account Switched',
          description: `Switched to ${account.name}`,
          color: 'success',
        });

        return true;
      }

      return false;
    } catch (error: any) {
      console.error('Failed to switch account:', error);
      toast.add({
        title: 'Switch Failed',
        description: error.message || 'Failed to switch account',
        color: 'error',
      });
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    isLoading: readonly(isLoading),
    rememberMe,
    isAuthenticated,
    init,
    loadStoredCredentials,
    loginStalker,
    loginXtream,
    logout,
    switchAccount,
    clearStoredCredentials,
    hasStoredAuth,
    getCurrentProvider,
  };
};
