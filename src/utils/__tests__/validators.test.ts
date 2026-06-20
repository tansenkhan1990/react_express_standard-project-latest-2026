import { describe, it, expect } from 'vitest';
import {
  validateEmail,
  validatePassword,
  validateName,
  validateRegisterForm,
  validateLoginForm,
} from '../validators';

describe('validateEmail', () => {
  it('returns null for valid email', () => {
    expect(validateEmail('test@example.com')).toBeNull();
    expect(validateEmail('user.name+tag@domain.co')).toBeNull();
  });

  it('returns error for empty email', () => {
    expect(validateEmail('')).toBe('Email is required');
    expect(validateEmail('   ')).toBe('Email is required');
  });

  it('returns error for invalid format', () => {
    expect(validateEmail('notanemail')).toBe('Invalid email format');
    expect(validateEmail('@domain.com')).toBe('Invalid email format');
    expect(validateEmail('user@')).toBe('Invalid email format');
  });
});

describe('validatePassword', () => {
  it('returns null for valid password', () => {
    expect(validatePassword('password123')).toBeNull();
    expect(validatePassword('abcdef')).toBeNull(); // min 6 chars
  });

  it('returns error for empty password', () => {
    expect(validatePassword('')).toBe('Password is required');
  });

  it('returns error for too short password', () => {
    expect(validatePassword('abcde')).toBe(
      'Password must be at least 6 characters'
    );
  });

  it('returns error for too long password', () => {
    expect(validatePassword('a'.repeat(129))).toBe(
      'Password must be less than 128 characters'
    );
  });
});

describe('validateName', () => {
  it('returns null for valid name', () => {
    expect(validateName('John Doe')).toBeNull();
    expect(validateName('Jo')).toBeNull(); // minimum 2 chars after trim
    expect(validateName('John')).toBeNull();
  });

  it('returns error for empty name', () => {
    expect(validateName('')).toBe('Name is required');
    expect(validateName('   ')).toBe('Name is required');
  });

  it('returns error for too short name', () => {
    expect(validateName('A')).toBe('Name must be at least 2 characters');
  });

  it('returns error for too long name', () => {
    expect(validateName('A'.repeat(51))).toBe(
      'Name must be less than 50 characters'
    );
  });
});

describe('validateRegisterForm', () => {
  it('returns valid for correct data', () => {
    const result = validateRegisterForm({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      confirmPassword: 'password123',
    });
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it('returns errors for empty fields', () => {
    const result = validateRegisterForm({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
    expect(result.valid).toBe(false);
    expect(result.errors.name).toBeDefined();
    expect(result.errors.email).toBeDefined();
    expect(result.errors.password).toBeDefined();
    expect(result.errors.confirmPassword).toBeDefined();
  });

  it('returns error when passwords do not match', () => {
    const result = validateRegisterForm({
      name: 'John',
      email: 'john@example.com',
      password: 'password123',
      confirmPassword: 'different',
    });
    expect(result.valid).toBe(false);
    expect(result.errors.confirmPassword).toBe('Passwords do not match');
  });
});

describe('validateLoginForm', () => {
  it('returns valid for correct data', () => {
    const result = validateLoginForm({
      email: 'john@example.com',
      password: 'password123',
    });
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it('returns errors for empty fields', () => {
    const result = validateLoginForm({
      email: '',
      password: '',
    });
    expect(result.valid).toBe(false);
    expect(result.errors.email).toBeDefined();
    expect(result.errors.password).toBeDefined();
  });
});
