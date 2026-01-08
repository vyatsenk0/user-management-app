import axios from 'axios';
import { User } from './types';

const API_URL = 'https://jsonplaceholder.typicode.com/users';

export const getUsers = async (): Promise<User[]> => {
  const res = await axios.get(API_URL);
  return res.data.map((u: any) => ({
    id: u.id,
    firstName: u.name.split(' ')[0],
    lastName: u.name.split(' ')[1] || '',
    email: u.email,
    skills: ['React'], // заглушка
    registeredAt: new Date().toISOString(),
  }));
};

// POST/PUT/DELETE
export const addUser = async (user: Omit<User, 'id'>) => {
  const res = await axios.post(API_URL, user);
  return res.data;
};

export const updateUser = async (id: number, user: Omit<User, 'id'>) => {
  const res = await axios.put(`${API_URL}/${id}`, user);
  return res.data;
};

export const deleteUser = async (id: number) => {
  const res = await axios.delete(`${API_URL}/${id}`);
  return res.data;
};
