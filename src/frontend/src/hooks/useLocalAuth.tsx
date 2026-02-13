import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { localAuthStore, type LocalAccount } from '../auth/localAuthStore';
import { validatePasswordComplexity, isPasswordRotationRequired } from '../lib/security/passwordPolicy';
import { derivePasswordVerifier, verifyPassword } from '../auth/localAuthCrypto';

interface LocalAuthContextValue {
  isAuthenticated: boolean;
  currentAccount: LocalAccount | null;
  signUp: (username: string, password: string) => Promise<void>;
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
  encryptionKey: CryptoKey | null;
}

const LocalAuthContext = createContext<LocalAuthContextValue | null>(null);

export function LocalAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentAccount, setCurrentAccount] = useState<LocalAccount | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [encryptionKey, setEncryptionKey] = useState<CryptoKey | null>(null);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const queryClient = useQueryClient();

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await localAuthStore.getSession();
        if (session) {
          const account = await localAuthStore.getAccount(session.username);
          if (account) {
            setCurrentAccount(account);
            setIsAuthenticated(true);
            // Derive encryption key from session
            const key = await derivePasswordVerifier(session.username, session.username);
            setEncryptionKey(key.key);
          } else {
            await localAuthStore.clearSession();
          }
        }
      } catch (err) {
        console.error('Session check failed:', err);
        await localAuthStore.clearSession();
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const signUp = async (username: string, password: string) => {
    setError(null);
    setIsLoading(true);

    try {
      // Validate username
      if (!username.trim() || username.length < 3) {
        throw new Error('Username must be at least 3 characters long');
      }

      // Check if account exists
      const existingAccount = await localAuthStore.getAccount(username);
      if (existingAccount) {
        throw new Error('Username already exists');
      }

      // Validate password complexity
      const complexityResult = validatePasswordComplexity(password);
      if (!complexityResult.isValid) {
        throw new Error(complexityResult.errors.join('. '));
      }

      // Create password verifier
      const { salt, verifier, key } = await derivePasswordVerifier(username, password);

      // Create account
      const account: LocalAccount = {
        username,
        salt,
        verifier,
        createdAt: Date.now(),
        lastPasswordChange: Date.now(),
      };

      await localAuthStore.saveAccount(account);
      await localAuthStore.saveSession({ username, timestamp: Date.now() });

      setCurrentAccount(account);
      setIsAuthenticated(true);
      setEncryptionKey(key);
      setFailedAttempts(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign up failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (username: string, password: string) => {
    setError(null);
    setIsLoading(true);

    try {
      // Get account
      const account = await localAuthStore.getAccount(username);
      if (!account) {
        setFailedAttempts(prev => prev + 1);
        throw new Error('Invalid username or password');
      }

      // Verify password
      const isValid = await verifyPassword(password, account.salt, account.verifier);
      if (!isValid) {
        setFailedAttempts(prev => prev + 1);
        throw new Error('Invalid username or password');
      }

      // Check password rotation
      if (isPasswordRotationRequired(account.lastPasswordChange)) {
        throw new Error('Password rotation required. Please update your password.');
      }

      // Derive encryption key
      const { key } = await derivePasswordVerifier(username, password);

      // Create session
      await localAuthStore.saveSession({ username, timestamp: Date.now() });

      setCurrentAccount(account);
      setIsAuthenticated(true);
      setEncryptionKey(key);
      setFailedAttempts(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      await localAuthStore.clearSession();
      setCurrentAccount(null);
      setIsAuthenticated(false);
      setEncryptionKey(null);
      setFailedAttempts(0);
      queryClient.clear();
    } catch (err) {
      console.error('Sign out failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  return (
    <LocalAuthContext.Provider
      value={{
        isAuthenticated,
        currentAccount,
        signUp,
        signIn,
        signOut,
        isLoading,
        error,
        clearError,
        encryptionKey,
      }}
    >
      {children}
    </LocalAuthContext.Provider>
  );
}

export function useLocalAuth() {
  const context = useContext(LocalAuthContext);
  if (!context) {
    throw new Error('useLocalAuth must be used within LocalAuthProvider');
  }
  return context;
}

export function useEncryptionKey() {
  const { encryptionKey } = useLocalAuth();
  return encryptionKey;
}

export function useFailedAttempts() {
  const context = useContext(LocalAuthContext);
  if (!context) return 0;
  return 0; // Tracked internally
}
