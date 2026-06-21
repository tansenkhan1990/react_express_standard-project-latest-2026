const STORAGE_PREFIX = 'react_pro_';

/**
 * Type-safe localStorage wrapper with a namespace prefix.
 */
export const storage = {
  get<T = string>(key: string): T | null {
    try {
      const raw = localStorage.getItem(STORAGE_PREFIX + key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null;
    }
  },

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
    } catch {
      // storage full or unavailable — silently ignore
    }
  },

  remove(key: string): void {
    try {
      localStorage.removeItem(STORAGE_PREFIX + key);
    } catch {
      // ignore
    }
  },

  clear(): void {
    try {
      const keys = Object.keys(localStorage).filter((k) =>
        k.startsWith(STORAGE_PREFIX)
      );
      keys.forEach((k) => localStorage.removeItem(k));
    } catch {
      // ignore
    }
  },
};
