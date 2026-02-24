/**
 * Multi-Account Management Store
 *
 * Manages multiple IPTV accounts with secure credential storage
 */

import { defineStore } from 'pinia';
import type { AccountMetadata, ProviderType } from '~/types/app';
import type { StalkerCredentials } from '~/types/stalker';
import type { XtreamCredentials } from '~/types/xtream';

const METADATA_KEY = 'iptv_accounts_metadata';
const ACTIVE_ACCOUNT_KEY = 'iptv_active_account_id';
const LEGACY_CREDENTIALS_KEY = 'iptv_credentials';
const MAX_ACCOUNTS = 10;

export const useAccountsStore = defineStore('accounts', {
  state: () => ({
    accounts: [] as AccountMetadata[],
    activeAccountId: null as string | null,
    isLoaded: false,
  }),

  getters: {
    /**
     * All accounts sorted by last used
     */
    all: (state) => {
      return [...state.accounts].sort((a, b) => b.lastUsedAt - a.lastUsedAt);
    },

    /**
     * Currently active account
     */
    activeAccount: (state) => {
      if (!state.activeAccountId) return null;
      return state.accounts.find(acc => acc.id === state.activeAccountId) || null;
    },

    /**
     * Recent accounts (last 5 used)
     */
    recentAccounts: (state) => {
      return [...state.accounts]
        .sort((a, b) => b.lastUsedAt - a.lastUsedAt)
        .slice(0, 5);
    },

    /**
     * Filter accounts by provider type
     */
    byProvider: (state) => {
      return (providerType: ProviderType) => {
        return state.accounts.filter(acc => acc.providerType === providerType);
      };
    },

    /**
     * Check if account name already exists
     */
    nameExists: (state) => {
      return (name: string, excludeId?: string) => {
        return state.accounts.some(
          acc => acc.name.toLowerCase() === name.toLowerCase() && acc.id !== excludeId
        );
      };
    },
  },

  actions: {
    /**
     * Initialize store - load from localStorage
     */
    async init() {
      if (!process.client || this.isLoaded) return;

      try {
        // Load metadata
        const metadataJson = localStorage.getItem(METADATA_KEY);
        if (metadataJson) {
          this.accounts = JSON.parse(metadataJson);
        }

        // Load active account ID
        const activeId = localStorage.getItem(ACTIVE_ACCOUNT_KEY);
        if (activeId) {
          this.activeAccountId = activeId;
        }

        // Migrate legacy credentials if they exist
        await this.migrateLegacyCredentials();

        this.isLoaded = true;
        console.log('[Accounts] Initialized with', this.accounts.length, 'accounts');
      } catch (error) {
        console.error('[Accounts] Failed to initialize:', error);
      }
    },

    /**
     * Add a new account
     */
    async addAccount(
      name: string,
      providerType: ProviderType,
      credentials: StalkerCredentials | XtreamCredentials
    ): Promise<{ success: boolean; error?: string; accountId?: string }> {
      try {
        // Validate account limit
        if (this.accounts.length >= MAX_ACCOUNTS) {
          return {
            success: false,
            error: `Maximum of ${MAX_ACCOUNTS} accounts allowed`,
          };
        }

        // Validate duplicate name
        if (this.nameExists(name)) {
          return {
            success: false,
            error: `Account with name "${name}" already exists`,
          };
        }

        // Generate unique ID
        const accountId = crypto.randomUUID();

        // Create metadata
        const metadata: AccountMetadata = {
          id: accountId,
          name: name.trim(),
          providerType,
          createdAt: Date.now(),
          lastUsedAt: Date.now(),
          isActive: false,
        };

        // Store encrypted credentials
        const credKey = `iptv_account_credentials_${accountId}`;
        await storeCredentials(credKey, credentials);

        // Add to accounts array
        this.accounts.push(metadata);

        // Save metadata
        this.saveMetadata();

        console.log('[Accounts] Added account:', name);
        return { success: true, accountId };
      } catch (error) {
        console.error('[Accounts] Failed to add account:', error);
        return {
          success: false,
          error: 'Failed to save account credentials',
        };
      }
    },

    /**
     * Remove an account
     */
    async removeAccount(accountId: string): Promise<boolean> {
      try {
        const index = this.accounts.findIndex(acc => acc.id === accountId);
        if (index === -1) return false;

        // Remove credentials from storage
        const credKey = `iptv_account_credentials_${accountId}`;
        removeCredentials(credKey);

        // Remove from accounts array
        this.accounts.splice(index, 1);

        // Clear active account if this was it
        if (this.activeAccountId === accountId) {
          this.activeAccountId = null;
          localStorage.removeItem(ACTIVE_ACCOUNT_KEY);
        }

        // Save metadata
        this.saveMetadata();

        console.log('[Accounts] Removed account:', accountId);
        return true;
      } catch (error) {
        console.error('[Accounts] Failed to remove account:', error);
        return false;
      }
    },

    /**
     * Update account name
     */
    async updateAccountName(accountId: string, newName: string): Promise<{ success: boolean; error?: string }> {
      try {
        const account = this.accounts.find(acc => acc.id === accountId);
        if (!account) {
          return { success: false, error: 'Account not found' };
        }

        // Validate duplicate name
        if (this.nameExists(newName.trim(), accountId)) {
          return {
            success: false,
            error: `Account with name "${newName}" already exists`,
          };
        }

        // Update name
        account.name = newName.trim();
        this.saveMetadata();

        console.log('[Accounts] Updated account name:', accountId);
        return { success: true };
      } catch (error) {
        console.error('[Accounts] Failed to update account name:', error);
        return { success: false, error: 'Failed to update account name' };
      }
    },

    /**
     * Set active account
     */
    setActiveAccount(accountId: string | null) {
      if (accountId === null) {
        this.activeAccountId = null;
        localStorage.removeItem(ACTIVE_ACCOUNT_KEY);

        // Mark all accounts as inactive
        this.accounts.forEach(acc => {
          acc.isActive = false;
        });
      } else {
        const account = this.accounts.find(acc => acc.id === accountId);
        if (!account) return;

        // Update active status
        this.accounts.forEach(acc => {
          acc.isActive = acc.id === accountId;
        });

        this.activeAccountId = accountId;
        account.lastUsedAt = Date.now();

        localStorage.setItem(ACTIVE_ACCOUNT_KEY, accountId);
      }

      this.saveMetadata();
    },

    /**
     * Get account credentials (decrypted)
     */
    async getAccountCredentials(
      accountId: string
    ): Promise<StalkerCredentials | XtreamCredentials | null> {
      try {
        const credKey = `iptv_account_credentials_${accountId}`;
        const credentials = await retrieveCredentials<StalkerCredentials | XtreamCredentials>(credKey);
        return credentials;
      } catch (error) {
        console.error('[Accounts] Failed to retrieve credentials:', error);
        throw new Error('Failed to decrypt account credentials');
      }
    },

    /**
     * Save metadata to localStorage
     */
    saveMetadata() {
      if (!process.client) return;

      try {
        localStorage.setItem(METADATA_KEY, JSON.stringify(this.accounts));
      } catch (error) {
        console.error('[Accounts] Failed to save metadata:', error);
      }
    },

    /**
     * Migrate legacy credentials to new format (one-time)
     */
    async migrateLegacyCredentials() {
      if (!process.client) return;

      try {
        const legacyData = await retrieveCredentials<any>(LEGACY_CREDENTIALS_KEY);
        if (!legacyData) return;

        console.log('[Accounts] Migrating legacy credentials...');

        // Create default account from legacy credentials
        const providerType = legacyData.providerType as ProviderType;
        const credentials = JSON.parse(legacyData.data);

        // Generate account name based on provider
        let accountName = 'Default Account';
        if (providerType === 'stalker' && credentials.portalUrl) {
          const url = new URL(credentials.portalUrl);
          accountName = `Stalker - ${url.hostname}`;
        } else if (providerType === 'xtream' && credentials.serverUrl) {
          const url = new URL(credentials.serverUrl);
          accountName = `Xtream - ${url.hostname}`;
        }

        // Add the migrated account
        const result = await this.addAccount(accountName, providerType, credentials);

        if (result.success && result.accountId) {
          // Set as active account
          this.setActiveAccount(result.accountId);

          // Remove legacy credentials
          removeCredentials(LEGACY_CREDENTIALS_KEY);
          localStorage.removeItem('iptv_remember');
          localStorage.removeItem('iptv_session');

          console.log('[Accounts] Legacy credentials migrated successfully');
        }
      } catch (error) {
        console.error('[Accounts] Failed to migrate legacy credentials:', error);
      }
    },

    /**
     * Clear all accounts
     */
    async clearAll() {
      if (!process.client) return;

      try {
        // Remove all account credentials
        for (const account of this.accounts) {
          const credKey = `iptv_account_credentials_${account.id}`;
          removeCredentials(credKey);
        }

        // Clear state
        this.accounts = [];
        this.activeAccountId = null;

        // Clear storage
        localStorage.removeItem(METADATA_KEY);
        localStorage.removeItem(ACTIVE_ACCOUNT_KEY);

        console.log('[Accounts] Cleared all accounts');
      } catch (error) {
        console.error('[Accounts] Failed to clear all accounts:', error);
      }
    },
  },
});
