import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface User {
  id: number;
  name: string;
  avatar: string;
  dateCreated: string;
  role: string;
  status: 'active' | 'suspended' | 'inactive';
}

export const users: User[] = [
  {
    id: 1,
    name: 'Michael Holz',
    avatar: '/man.png',
    dateCreated: '04/10/2013',
    role: 'Admin',
    status: 'active',
  },
  {
    id: 2,
    name: 'Paula Wilson',
    avatar: '/girl.png',
    dateCreated: '05/08/2014',
    role: 'Publisher',
    status: 'active',
  },
  {
    id: 3,
    name: 'Antonio Moreno',
    avatar: '/gamer.png',
    dateCreated: '11/05/2015',
    role: 'Publisher',
    status: 'suspended',
  },
  {
    id: 4,
    name: 'Mary Saveley',
    avatar: '/woman.png',
    dateCreated: '06/09/2016',
    role: 'Reviewer',
    status: 'active',
  },
  {
    id: 5,
    name: 'Martin Sommer',
    avatar: '/bear.png',
    dateCreated: '12/08/2017',
    role: 'Moderator',
    status: 'inactive',
  },
];
