import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  registerUser,
  loginUser,
  getUserById,
  seedUsers,
} from '../userService';

// Mock uuid to return predictable IDs
vi.mock('uuid', () => ({
  v4: () => 'mocked-uuid-123',
}));

// Mock global fetch for seedUsers
const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

describe('userService', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('registerUser', () => {
    it('creates a new user and returns safe user data without password', async () => {
      // Mock the delay to resolve immediately
      const user = await registerUser('John Doe', 'john@example.com', 'password123');

      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('name', 'John Doe');
      expect(user).toHaveProperty('email', 'john@example.com');
      expect(user).toHaveProperty('createdAt');
      expect(user).not.toHaveProperty('password');
    });

    it('throws error if email already exists', async () => {
      await registerUser('John', 'john@example.com', 'password123');

      await expect(
        registerUser('Jane', 'john@example.com', 'otherpass')
      ).rejects.toThrow('An account with this email already exists');
    });

    it('is case-insensitive for email duplicates', async () => {
      await registerUser('John', 'John@Example.com', 'password123');

      await expect(
        registerUser('Jane', 'john@example.com', 'otherpass')
      ).rejects.toThrow('An account with this email already exists');
    });
  });

  describe('loginUser', () => {
    it('logs in with correct credentials', async () => {
      await registerUser('John Doe', 'john@example.com', 'password123');

      const user = await loginUser('john@example.com', 'password123');

      expect(user).toHaveProperty('name', 'John Doe');
      expect(user).toHaveProperty('email', 'john@example.com');
      expect(user).not.toHaveProperty('password');
    });

    it('throws error for wrong password', async () => {
      await registerUser('John Doe', 'john@example.com', 'password123');

      await expect(
        loginUser('john@example.com', 'wrongpassword')
      ).rejects.toThrow('Invalid email or password');
    });

    it('throws error for non-existent user', async () => {
      await expect(
        loginUser('nonexistent@example.com', 'password123')
      ).rejects.toThrow('Invalid email or password');
    });
  });

  describe('getUserById', () => {
    it('returns user without password', async () => {
      const registered = await registerUser('John', 'john@example.com', 'pass123');
      const user = await getUserById(registered.id);

      expect(user).not.toBeNull();
      expect(user).toHaveProperty('name', 'John');
      expect(user).not.toHaveProperty('password');
    });

    it('returns null for non-existent id', async () => {
      const user = await getUserById('non-existent-id');
      expect(user).toBeNull();
    });
  });

  describe('seedUsers', () => {
    it('fetches and seeds users from JSON', async () => {
      mockFetch.mockResolvedValueOnce({
        json: async () => [
          {
            id: 'seed-1',
            name: 'Seed User',
            email: 'seed@example.com',
            password: 'hashed-password',
            createdAt: '2026-01-01T00:00:00.000Z',
          },
        ],
      });

      await seedUsers();

      // Should not throw, should have set the seeded flag
      expect(localStorage.getItem('app_users_seeded')).toBe('true');
    });

    it('does not re-seed if already seeded', async () => {
      localStorage.setItem('app_users_seeded', 'true');
      await seedUsers();

      expect(mockFetch).not.toHaveBeenCalled();
    });
  });
});
