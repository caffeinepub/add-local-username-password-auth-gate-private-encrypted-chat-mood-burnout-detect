export interface LocalAccount {
  username: string;
  salt: string;
  verifier: string;
  createdAt: number;
  lastPasswordChange: number;
}

export interface LocalSession {
  username: string;
  timestamp: number;
}

const DB_NAME = 'mindvault_auth';
const DB_VERSION = 1;
const ACCOUNTS_STORE = 'accounts';
const SESSION_STORE = 'session';

class LocalAuthStore {
  private dbPromise: Promise<IDBDatabase>;

  constructor() {
    this.dbPromise = this.initDB();
  }

  private initDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create accounts store
        if (!db.objectStoreNames.contains(ACCOUNTS_STORE)) {
          db.createObjectStore(ACCOUNTS_STORE, { keyPath: 'username' });
        }

        // Create session store
        if (!db.objectStoreNames.contains(SESSION_STORE)) {
          db.createObjectStore(SESSION_STORE);
        }
      };
    });
  }

  async saveAccount(account: LocalAccount): Promise<void> {
    const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([ACCOUNTS_STORE], 'readwrite');
      const store = transaction.objectStore(ACCOUNTS_STORE);
      const request = store.put(account);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getAccount(username: string): Promise<LocalAccount | null> {
    const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([ACCOUNTS_STORE], 'readonly');
      const store = transaction.objectStore(ACCOUNTS_STORE);
      const request = store.get(username);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async saveSession(session: LocalSession): Promise<void> {
    const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([SESSION_STORE], 'readwrite');
      const store = transaction.objectStore(SESSION_STORE);
      const request = store.put(session, 'current');

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getSession(): Promise<LocalSession | null> {
    const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([SESSION_STORE], 'readonly');
      const store = transaction.objectStore(SESSION_STORE);
      const request = store.get('current');

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async clearSession(): Promise<void> {
    const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([SESSION_STORE], 'readwrite');
      const store = transaction.objectStore(SESSION_STORE);
      const request = store.delete('current');

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}

export const localAuthStore = new LocalAuthStore();
