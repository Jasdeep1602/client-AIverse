'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */

import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { authLogout } from '@/redux/slices/auth';
import { Loader2, Settings, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { users } from '@/lib/utils';

import { PrivateRoute } from '@/customComponents/PrivateRoute';

function Home() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isLogoutFetching } = useAppSelector(
    (state: { auth: any }) => state.auth
  );
  const handleLogout = async () => {
    const token = localStorage.getItem('accesstoken');
    if (!token) {
      router.push('/login');
    } else {
      await dispatch(authLogout({}))
        .unwrap()
        .then(() => {
          toast.success('Logged out Successfully');
          router.push('/login');
        })
        .catch((err) => {
          if (err) {
            toast.error('Logout Failed');
          }
        });
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('accesstoken');
    if (!token) {
      router.push('/login');
    }
  }, [router]);
  return (
    <div className='flex pt-11 px-6'>
      {/* Table Comp */}
      <div className='w-full max-w-4xl mx-auto'>
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
                <TableCell className='text-sm text-gray-600'>
                  {user.role}
                </TableCell>
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
      </div>
      <div>
        <Button
          onClick={handleLogout}
          className=' bg-cyan-400 hover:bg-cyan-300 text-slate-800 font-medium text-lg py-6'>
          {!isLogoutFetching ? (
            'LOGOUT'
          ) : (
            <>
              <Loader2 className='animate-spin' />
              Please wait
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

export default PrivateRoute(Home);
