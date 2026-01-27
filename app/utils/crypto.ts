/**
 * Cryptography utilities for secure credential storage
 * 
 * Uses Web Crypto API for encrypting/decrypting sensitive data
 */

/**
 * Generate a cryptographic key from a password
 */
async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Get or create encryption password for the app
 * Uses a combination of browser fingerprint and stored key
 */
function getEncryptionPassword(): string {
  // In a production app, you might want to use a user-specific key
  // For this demo, we use a combination of factors
  const stored = localStorage.getItem('__app_key');
  
  if (stored) {
    return stored;
  }

  // Generate a random key
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  const key = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  localStorage.setItem('__app_key', key);
  
  return key;
}

/**
 * Encrypt data
 */
export async function encrypt(data: string): Promise<string> {
  try {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);

    // Generate random salt and IV
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));

    // Derive key
    const password = getEncryptionPassword();
    const key = await deriveKey(password, salt);

    // Encrypt data
    const encryptedData = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv,
      },
      key,
      dataBuffer
    );

    // Combine salt, iv, and encrypted data
    const encryptedArray = new Uint8Array(encryptedData);
    const combined = new Uint8Array(salt.length + iv.length + encryptedArray.length);
    combined.set(salt);
    combined.set(iv, salt.length);
    combined.set(encryptedArray, salt.length + iv.length);

    // Convert to base64
    return btoa(String.fromCharCode(...combined));
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
}

/**
 * Decrypt data
 */
export async function decrypt(encryptedData: string): Promise<string> {
  try {
    // Convert from base64
    const combined = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));

    // Extract salt, iv, and encrypted data
    const salt = combined.slice(0, 16);
    const iv = combined.slice(16, 28);
    const data = combined.slice(28);

    // Derive key
    const password = getEncryptionPassword();
    const key = await deriveKey(password, salt);

    // Decrypt data
    const decryptedData = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv,
      },
      key,
      data
    );

    // Convert to string
    const decoder = new TextDecoder();
    return decoder.decode(decryptedData);
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
}

/**
 * Hash a string (one-way)
 */
export async function hash(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Securely store credentials in localStorage
 */
export async function storeCredentials(key: string, data: any): Promise<void> {
  try {
    const jsonData = JSON.stringify(data);
    const encrypted = await encrypt(jsonData);
    localStorage.setItem(key, encrypted);
  } catch (error) {
    console.error('Failed to store credentials:', error);
    throw new Error('Failed to store credentials');
  }
}

/**
 * Retrieve and decrypt credentials from localStorage
 */
export async function retrieveCredentials<T>(key: string): Promise<T | null> {
  try {
    const encrypted = localStorage.getItem(key);
    if (!encrypted) {
      return null;
    }

    const decrypted = await decrypt(encrypted);
    return JSON.parse(decrypted) as T;
  } catch (error) {
    console.error('Failed to retrieve credentials:', error);
    // If decryption fails, remove the corrupted data
    localStorage.removeItem(key);
    return null;
  }
}

/**
 * Remove stored credentials
 */
export function removeCredentials(key: string): void {
  localStorage.removeItem(key);
}

/**
 * Check if credentials exist
 */
export function hasStoredCredentials(key: string): boolean {
  return localStorage.getItem(key) !== null;
}
