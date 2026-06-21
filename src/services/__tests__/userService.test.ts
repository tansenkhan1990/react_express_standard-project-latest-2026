import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  getUserById,
} from '../userService';
import type { SafeUser } from '../../types';

// Mock the global fetch function
const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

// Helper to create a mock response
function mockResponse(data: unknown, status = 200) {
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(data),
  });
}

describe('userService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('registerUser', () => {
    const mockUser: SafeUser = {
      id: 'new-user-1',
      name: 'John Doe',
      email: 'john@example.com',
      createdAt: '2026-06-21T00:00:00.000Z',
    };

    it('sends a POST request with credentials and returns safe user data', async () => {
      mockFetch.mockResolvedValueOnce(mockResponse(mockUser, 201));

      const user = await registerUser('John Doe', 'john@example.com', 'password123');

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith('/api/auth/register', {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
        }),
      });

      expect(user).toEqual(mockUser);
      expect(user).not.toHaveProperty('password');
    });

    it('throws an error when the email already exists', async () => {
      mockFetch.mockResolvedValueOnce(
        mockResponse({ error: 'An account with this email already exists' }, 409)
      );

      await expect(
        registerUser('Jane', 'john@example.com', 'password123')
      ).rejects.toThrow('An account with this email already exists');
    });
  });

  describe('loginUser', () => {
    const mockUser: SafeUser = {
      id: 'existing-user-1',
      name: 'John Doe',
      email: 'john@example.com',
      createdAt: '2026-06-21T00:00:00.000Z',
    };

    it('sends a POST request with credentials and returns the user', async () => {
      mockFetch.mockResolvedValueOnce(mockResponse(mockUser));

      const user = await loginUser('john@example.com', 'password123');

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith('/api/auth/login', {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify({
          email: 'john@example.com',
          password: 'password123',
        }),
      });

      expect(user).toEqual(mockUser);
      expect(user).not.toHaveProperty('password');
    });

    it('throws an error for invalid credentials', async () => {
      mockFetch.mockResolvedValueOnce(
        mockResponse({ error: 'Invalid email or password' }, 401)
      );

      await expect(
        loginUser('john@example.com', 'wrongpassword')
      ).rejects.toThrow('Invalid email or password');
    });
  });

  describe('logoutUser', () => {
    it('sends a POST request to /api/auth/logout', async () => {
      mockFetch.mockResolvedValueOnce(mockResponse({ message: 'Logged out successfully' }));

      await logoutUser();

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith('/api/auth/logout', {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      });
    });
  });

  describe('getCurrentUser', () => {
    const mockUser: SafeUser = {
      id: 'user-1',
      name: 'John Doe',
      email: 'john@example.com',
      createdAt: '2026-06-21T00:00:00.000Z',
    };

    it('returns the current user when authenticated', async () => {
      mockFetch.mockResolvedValueOnce(mockResponse(mockUser));

      const user = await getCurrentUser();

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith('/api/auth/me', {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        method: 'GET',
      });

      expect(user).toEqual(mockUser);
    });

    it('returns null when not authenticated (401)', async () => {
      mockFetch.mockResolvedValueOnce(
        mockResponse({ error: 'Authentication required' }, 401)
      );

      const user = await getCurrentUser();
      expect(user).toBeNull();
    });
  });

  describe('getUserById', () => {
    const mockUser: SafeUser = {
      id: 'user-1',
      name: 'John Doe',
      email: 'john@example.com',
      createdAt: '2026-06-21T00:00:00.000Z',
    };

    it('sends a GET request to /api/users/:id with credentials', async () => {
      mockFetch.mockResolvedValueOnce(mockResponse(mockUser));

      const user = await getUserById('user-1');

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith('/api/users/user-1', {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        method: 'GET',
      });

      expect(user).toEqual(mockUser);
    });

    it('returns null when the user is not found (404)', async () => {
      mockFetch.mockResolvedValueOnce(
        mockResponse({ error: 'User not found' }, 404)
      );

      const user = await getUserById('non-existent-id');
      expect(user).toBeNull();
    });
  });
});
