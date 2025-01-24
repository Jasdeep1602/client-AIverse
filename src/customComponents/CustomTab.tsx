'use client';

import { Button } from '@/components/ui/button';
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { users } from '@/lib/utils';
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar';
import { Table, Settings, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

import React from 'react';

export default function CustomTab() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className='w-12'>#</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Date Created</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className='text-right'>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell className='font-medium'>{user.id}</TableCell>
            <TableCell>
              <div className='flex items-center gap-3'>
                <Avatar className='w-8 h-8'>
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
                <span className='text-sm text-gray-600'>{user.name}</span>
              </div>
            </TableCell>
            <TableCell className='text-sm text-gray-600'>
              {user.dateCreated}
            </TableCell>
            <TableCell className='text-sm text-gray-600'>{user.role}</TableCell>
            <TableCell>
              <Badge
                variant={
                  user.status === 'active'
                    ? 'success'
                    : user.status === 'suspended'
                    ? 'destructive'
                    : 'warning'
                }>
                {user.status}
              </Badge>
            </TableCell>
            <TableCell className='text-right'>
              <div className='flex items-center justify-end gap-2'>
                <Button
                  variant='ghost'
                  size='icon'
                  className='text-blue-500 hover:text-blue-600'>
                  <Settings className='w-4 h-4' />
                </Button>
                <Button
                  variant='ghost'
                  size='icon'
                  className='text-red-500 hover:text-red-600'>
                  <X className='w-4 h-4' />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
