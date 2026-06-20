/**
 * Password hashing utility.
 *
 * ⚠️ NOTE: This uses a simple Base64 encoding for demonstration/learning purposes only.
 * In a production application, always use a proper hashing algorithm (bcrypt, argon2, scrypt)
 * on the server side. Passwords should NEVER be stored in plain text or reversible encoding.
 *
 * This implementation exists to demonstrate the principle of not storing plain-text passwords
 * while keeping the project backend-free.
 */

const SALT_PREFIX = 'react-pro-demo-salt:';

export const hashPassword = (password: string): string => {
  // This is NOT cryptographically secure — it's for demonstration only
  const encoded = btoa(`${SALT_PREFIX}${password}`);
  return `demo_hash_${encoded}`;
};

export const verifyPassword = (
  plainPassword: string,
  hashedPassword: string
): boolean => {
  const expectedHash = hashPassword(plainPassword);
  return expectedHash === hashedPassword;
};
