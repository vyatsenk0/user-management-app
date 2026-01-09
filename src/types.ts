export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  skills: string[];
  registeredAt: string;
}

export type UserFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  skills: { value: string }[];
};