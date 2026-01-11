//import axios from 'axios';
import { User } from './types';

const STORAGE_KEY = 'users';

const loadUsers = (): User[] => {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
};

const saveUsers = (users: User[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
};

// GET
export const getUsers = async (): Promise<User[]> => {
  return loadUsers();
};

// POST/PUT/DELETE
export const addUser = async (user: Omit<User, 'id'>) => {
  const users = loadUsers();
  const newUser: User = {
    ...user,
    id: Date.now(),
  };
  const updated = [...users, newUser];
  saveUsers(updated);
  return newUser;
};

export const updateUser = async (id: number, user: Omit<User, 'id'>) => {
  const users = loadUsers();
  const updated = users.map(u =>
    u.id === id ? { ...u, ...user } : u
  );
  saveUsers(updated);
  return updated.find(u => u.id === id);
};

export const deleteUser = async (id: number) => {
  const users = loadUsers().filter(u => u.id !== id);
  saveUsers(users);
};
