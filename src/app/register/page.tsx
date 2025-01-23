'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Loader2, User } from 'lucide-react';
import {
  EyeIcon,
  EyeSlashIcon,
  LockClosedIcon,
  EnvelopeIcon,
  UserIcon,
  CalendarDateRangeIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { authRegister } from '@/redux/slices/auth';

export default function LoginForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { isRegFetching } = useAppSelector((state) => state.auth);

  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
    dob: '',
  });

  //   const handleHomeRoute = () => {
  //     router.push('/');
  //   };

  const [togglevisible, setToggleVisible] = useState(false);

  const handleVisible = () => {
    setToggleVisible(!togglevisible);
  };

  const handleInput = (e: any) => {
    const { name, value } = e.target;

    setUser({ ...user, [name]: value });
  };

  const handleRegister = async () => {
    await dispatch(
      authRegister({
        data: {
          name: user.name,
          email: user.email,
          password: user.password,
          dob: user.dob,
        },
      })
    )
      .unwrap()
      .then(() => {
        toast.success('Register Success');
        router.push('/login');
      })
      .catch((err: any) => {
        if (err) {
          toast.error('Registration Failed');
        }
      });
  };

  return (
    <div className='min-h-screen grid place-items-center bg-gradient-to-b from-teal-600 to-teal-700'>
      <Card className='w-full max-w-sm bg-gradient-to-b from-slate-400 to-slate-700 border-0 shadow-xl pt-16'>
        <CardContent className='space-y-6'>
          <div className='flex justify-center mb-6'>
            <Avatar className='h-16 w-16 bg-slate-700/50'>
              <AvatarFallback>
                <User className='h-8 w-8 text-slate-400' />
              </AvatarFallback>
            </Avatar>
          </div>
          <div className='space-y-4'>
            <div className='space-y-2 relative'>
              <div className='absolute top-2 left-2 '>
                <UserIcon className=' text-gray-500  w-5 h-5 md:w-5 md:h-5' />
              </div>
              <Input
                type='text'
                name='name'
                id='name'
                placeholder='name'
                value={user.name}
                onChange={handleInput}
                className=' pl-9 bg-slate-300/50 border-0 placeholder:text-slate-500 text-slate-200'
              />
            </div>
            <div className='space-y-2 relative'>
              <div className='absolute top-2 left-2 '>
                <EnvelopeIcon className=' text-gray-500  w-5 h-5 md:w-5 md:h-5' />
              </div>
              <Input
                type='text'
                name='email'
                id='email'
                placeholder='email'
                value={user.email}
                onChange={handleInput}
                className=' pl-9 bg-slate-300/50 border-0 placeholder:text-slate-500 text-slate-200'
              />
            </div>
            <div className='space-y-2 relative'>
              <div className='absolute top-2 left-2 '>
                <CalendarDateRangeIcon className=' text-gray-500  w-5 h-5 md:w-5 md:h-5' />
              </div>
              <Input
                type='text'
                name='dob'
                id='dob'
                placeholder='dd/mm/yyyy'
                value={user.dob}
                onChange={handleInput}
                className=' pl-9 bg-slate-300/50 border-0 placeholder:text-slate-500 text-slate-200'
              />
            </div>
            <div className='space-y-2  relative'>
              <div className='absolute top-2 left-2 '>
                <LockClosedIcon className=' text-gray-500  w-5 h-5 md:w-5 md:h-5' />
              </div>
              <Input
                type={togglevisible ? 'text' : 'password'}
                name='password'
                id='password'
                placeholder='password'
                value={user.password}
                onChange={handleInput}
                className=' pl-9 bg-slate-300/50 border-0 placeholder:text-slate-500 text-slate-200'
              />
              <button
                type='button'
                aria-label='password'
                className='absolute top-0.5 right-5 '
                onClick={handleVisible}>
                {togglevisible ? (
                  <EyeIcon className=' text-gray-500  w-5 h-5 md:w-4 md:h-4' />
                ) : (
                  <EyeSlashIcon className=' text-gray-500  w-5 h-5 md:w-4 md:h-4' />
                )}
              </button>
            </div>
            <p className='text-center text-blue-400 p-0 hover:no-underline'>
              Already have an account?
              <Link
                href='/login'
                className='whitespace-nowrap font-semibold text-cyan-400 hover:text-cyan-300 p-0 hover:no-underline '>
                {' '}
                Login
              </Link>
            </p>
          </div>

          <Button
            onClick={handleRegister}
            className='w-full bg-cyan-400 hover:bg-cyan-300 text-slate-800 font-medium text-lg py-6'>
            {!isRegFetching ? (
              'REGISTER'
            ) : (
              <>
                <Loader2 className='animate-spin' />
                Please wait
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
