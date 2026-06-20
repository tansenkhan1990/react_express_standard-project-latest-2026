import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPassword } from '../hash';

describe('hashPassword', () => {
  it('returns a string prefixed with demo_hash_', () => {
    const hash = hashPassword('password123');
    expect(hash).toMatch(/^demo_hash_/);
  });

  it('produces deterministic output for the same input', () => {
    const hash1 = hashPassword('test123');
    const hash2 = hashPassword('test123');
    expect(hash1).toBe(hash2);
  });

  it('produces different output for different inputs', () => {
    const hash1 = hashPassword('password1');
    const hash2 = hashPassword('password2');
    expect(hash1).not.toBe(hash2);
  });
});

describe('verifyPassword', () => {
  it('returns true for matching password', () => {
    const hash = hashPassword('mypassword');
    expect(verifyPassword('mypassword', hash)).toBe(true);
  });

  it('returns false for wrong password', () => {
    const hash = hashPassword('correctpassword');
    expect(verifyPassword('wrongpassword', hash)).toBe(false);
  });
});
