import type { User, SafeUser } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { hashPassword, verifyPassword } from '../utils/hash';

const USERS_STORAGE_KEY = 'app_users';
const SEED_FLAG_KEY = 'app_users_seeded';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const getUsers = (): User[] => {
  const data = localStorage.getItem(USERS_STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

const saveUsers = (users: User[]): void => {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

let seedingInProgress = false;

export const seedUsers = async (): Promise<void> => {
  if (seedingInProgress) return;
  
  const alreadySeeded = localStorage.getItem(SEED_FLAG_KEY);
  if (alreadySeeded) return;
  
  seedingInProgress = true;

  try {
    const response = await fetch('/users.json');
    const seedUsers: User[] = await response.json();
    const existingUsers = getUsers();

    const mergedUsers = [...existingUsers];
    for (const seedUser of seedUsers) {
      if (!mergedUsers.find((u) => u.email === seedUser.email)) {
        mergedUsers.push(seedUser);
      }
    }

    saveUsers(mergedUsers);
    localStorage.setItem(SEED_FLAG_KEY, 'true');
  } catch (error) {
    // If users.json doesn't exist yet, just initialize empty
    if (!localStorage.getItem(USERS_STORAGE_KEY)) {
      saveUsers([]);
    }
    localStorage.setItem(SEED_FLAG_KEY, 'true');
  } finally {
    seedingInProgress = false;
  }
};

export const registerUser = async (
  name: string,
  email: string,
  password: string
): Promise<SafeUser> => {
  await delay(800); // Simulate network delay

  const users = getUsers();

  const existingUser = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );
  if (existingUser) {
    throw new Error('An account with this email already exists');
  }

  const newUser: User = {
    id: uuidv4(),
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password: hashPassword(password),
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveUsers(users);

  const { password: _, ...safeUser } = newUser;
  return safeUser;
};

export const loginUser = async (
  email: string,
  password: string
): Promise<SafeUser> => {
  await delay(800); // Simulate network delay

  const users = getUsers();

  const user = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );

  if (!user || !verifyPassword(password, user.password)) {
    throw new Error('Invalid email or password');
  }

  const { password: _, ...safeUser } = user;
  return safeUser;
};

export const getUserById = async (id: string): Promise<SafeUser | null> => {
  await delay(300);
  const users = getUsers();
  const user = users.find((u) => u.id === id);
  if (!user) return null;
  const { password: _, ...safeUser } = user;
  return safeUser;
};
