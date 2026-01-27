/**
 * Authentication composable
 * 
 * Provides unified authentication management with secure credential storage
 */

// Type imports only (types are always imported)
import type { ProviderType, StoredCredentials, SessionData } from '~/types/app';
import type { StalkerCredentials } from '~/types/stalker';
import type { XtreamCredentials } from '~/types/xtream';

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
      // Authenticate
      const result = await stalkerStore.makeHandshake(portalUrl, macAddress);

      if (!result?.success) {
        throw new Error('Authentication failed');
      }

      // Load initial data
      await stalkerStore.getAllInfo();

      // Store credentials if remember me is enabled
      if (remember) {
        await saveCredentials('stalker', { portalUrl, macAddress });
        await saveSession('stalker');
      }

      toast.add({
        title: 'Success',
        description: 'Successfully connected to Stalker Portal',
        color: 'green',
      });

      return true;
    } catch (error: any) {
      toast.add({
        title: 'Login Failed',
        description: error.message || 'Please check your credentials and try again',
        color: 'red',
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
      // Authenticate
      const result = await xtreamStore.authenticate(serverUrl, username, password);

      if (!result?.success) {
        throw new Error('Authentication failed');
      }

      // Load initial data
      await Promise.all([
        xtreamStore.getLiveCategories(),
        xtreamStore.getVodCategories(),
        xtreamStore.getSeriesCategories(),
      ]);

      // Store credentials if remember me is enabled
      if (remember) {
        await saveCredentials('xtream', { serverUrl, username, password });
        await saveSession('xtream', {
          username: xtreamStore.userInfo?.username,
          status: xtreamStore.userInfo?.status,
          expDate: xtreamStore.userInfo?.exp_date,
        });
      }

      toast.add({
        title: 'Success',
        description: 'Successfully connected to Xtream service',
        color: 'green',
      });

      return true;
    } catch (error: any) {
      toast.add({
        title: 'Login Failed',
        description: error.message || 'Please check your credentials and try again',
        color: 'red',
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
      color: 'green',
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

  return {
    isLoading: readonly(isLoading),
    rememberMe,
    isAuthenticated,
    init,
    loadStoredCredentials,
    loginStalker,
    loginXtream,
    logout,
    clearStoredCredentials,
    hasStoredAuth,
    getCurrentProvider,
  };
};
