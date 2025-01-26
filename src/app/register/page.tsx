'use client';

/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  EyeIcon,
  EyeSlashIcon,
  LockClosedIcon,
  EnvelopeIcon,
  EnvelopeOpenIcon,
  UserIcon,
  CalendarDateRangeIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  authRegister,
  authSendVerificationCode,
  authVerifyCode,
} from '@/redux/slices/auth';

function Register() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { isRegFetching } = useAppSelector((state) => state.auth);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const [step, setStep] = useState<'register' | 'verify'>('register');
  const [verificationCode, setVerificationCode] = useState('');
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
    dob: selectedDate,
  });

  const [togglevisible, setToggleVisible] = useState(false);

  const handleVisible = () => {
    setToggleVisible(!togglevisible);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    setUser({ ...user, dob: date });
  };

  const handleSendVerificationCode = async () => {
    try {
      await dispatch(
        authSendVerificationCode({ data: { email: user.email } })
      ).unwrap();
      setStep('verify');
      toast.success('OTP sent to your email');
    } catch (err) {
      toast.error('Failed to send OTP');
    }
  };

  const handleVerifyCode = async () => {
    try {
      await dispatch(
        authVerifyCode({
          data: {
            email: user.email,
            code: verificationCode,
          },
        })
      ).unwrap();
      handleRegister();
    } catch (err) {
      toast.error('Invalid OTP');
    }
  };

  const handleRegister = async () => {
    try {
      await dispatch(
        authRegister({
          data: {
            ...user,
            emailVerified: true,
          },
        })
      ).unwrap();

      toast.success('Registration Successful');
      router.push('/login');
    } catch (err) {
      toast.error('Registration Failed');
    }
  };

  return (
    <div className='min-h-screen grid place-items-center bg-gradient-to-b from-teal-600 to-teal-700'>
      <Card className='w-full max-w-sm bg-gradient-to-b from-slate-400 to-slate-700 border-0 shadow-xl pt-16'>
        <CardContent className='space-y-6'>
          <div className='flex justify-center mb-7 w-full'>
            <Image src='/AIverseLogo.png' alt='logo' width='300' height='250' />
          </div>

          {step === 'register' ? (
            <>
              <div className='space-y-4'>
                {/* Name Input */}
                <div className='space-y-2 relative'>
                  <div className='absolute top-2 left-2'>
                    <UserIcon className='text-gray-500 w-5 h-5 md:w-5 md:h-5' />
                  </div>
                  <Input
                    type='text'
                    name='name'
                    placeholder='Name'
                    value={user.name}
                    onChange={handleInput}
                    className='pl-9 bg-slate-300/50 border-0 placeholder:text-slate-500 text-slate-200'
                  />
                </div>

                {/* Email Input */}
                <div className='space-y-2 relative'>
                  <div className='absolute top-2 left-2'>
                    <EnvelopeIcon className='text-gray-500 w-5 h-5 md:w-5 md:h-5' />
                  </div>
                  <Input
                    type='email'
                    name='email'
                    placeholder='Email'
                    value={user.email}
                    onChange={handleInput}
                    className='pl-9 bg-slate-300/50 border-0 placeholder:text-slate-500 text-slate-200'
                  />
                </div>

                {/* DOB Input */}
                <div className='space-y-2 relative text-sm'>
                  <div className='absolute top-4 left-2 z-10'>
                    <CalendarDateRangeIcon className='text-gray-500 w-5 h-5 md:w-5 md:h-5' />
                  </div>
                  <DatePicker
                    selected={selectedDate}
                    onChange={handleDateChange}
                    placeholderText='Date of birth'
                    maxDate={new Date()}
                    showYearDropdown
                    scrollableYearDropdown
                    yearDropdownItemNumber={100}
                    dateFormat='dd/MM/yyyy'
                    className='w-full pl-9 bg-slate-300/50 border-0 placeholder:text-slate-500 text-slate-200 py-2 rounded-md focus:outline-none'
                    wrapperClassName='w-full'
                    popperClassName='bg-slate-700 text-slate-200'
                    calendarClassName='bg-slate-700'
                    dayClassName={(date) =>
                      date.getDate() === selectedDate?.getDate() &&
                      date.getMonth() === selectedDate?.getMonth() &&
                      date.getFullYear() === selectedDate?.getFullYear()
                        ? 'bg-cyan-400 text-slate-800'
                        : 'hover:bg-slate-600'
                    }
                    yearClassName={() => 'text-slate-200 hover:bg-slate-600'}
                    monthClassName={() => 'text-slate-200 hover:bg-slate-600'}
                  />
                </div>
                {/* Password Input */}
                <div className='space-y-2 relative'>
                  <div className='absolute top-2 left-2'>
                    <LockClosedIcon className='text-gray-500 w-5 h-5 md:w-5 md:h-5' />
                  </div>
                  <Input
                    type={togglevisible ? 'text' : 'password'}
                    name='password'
                    placeholder='Password'
                    value={user.password}
                    onChange={handleInput}
                    className='pl-9 bg-slate-300/50 border-0 placeholder:text-slate-500 text-slate-200'
                  />
                  <button
                    type='button'
                    aria-label='toggle password visibility'
                    className='absolute top-0.5 right-5'
                    onClick={handleVisible}>
                    {togglevisible ? (
                      <EyeIcon className='text-gray-500 w-5 h-5 md:w-4 md:h-4' />
                    ) : (
                      <EyeSlashIcon className='text-gray-500 w-5 h-5 md:w-4 md:h-4' />
                    )}
                  </button>
                </div>

                <p className='text-center text-blue-400'>
                  Already have an account?
                  <Link
                    href='/login'
                    className='whitespace-nowrap font-semibold text-cyan-400 hover:text-cyan-300'>
                    {' '}
                    Login
                  </Link>
                </p>
              </div>

              <Button
                onClick={handleSendVerificationCode}
                disabled={
                  !user.email || !user.name || !user.password || !user.dob
                }
                className='w-full bg-cyan-400 hover:bg-cyan-300 text-slate-800 font-medium text-lg py-6'>
                {!isRegFetching ? (
                  'SEND VERIFICATION CODE'
                ) : (
                  <>
                    <Loader2 className='animate-spin mr-2' />
                    Sending OTP
                  </>
                )}
              </Button>
            </>
          ) : (
            <>
              <div className='space-y-4 relative'>
                <div className='absolute top-2 left-2'>
                  <EnvelopeOpenIcon className='text-gray-500 w-5 h-5 md:w-5 md:h-5' />
                </div>
                <Input
                  type='text'
                  placeholder='Enter OTP'
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className=' pl-9 bg-slate-300/50 border-0 placeholder:text-slate-500 text-slate-200'
                />
              </div>

              <p className='text-center text-blue-400 text-sm'>
                {`6-digit OTP was sent to ${user.email}`}
              </p>

              <Button
                onClick={handleVerifyCode}
                className='w-full bg-cyan-400 hover:bg-cyan-300 text-slate-800 font-medium text-lg py-6'>
                {!isRegFetching ? (
                  'VERIFY CODE'
                ) : (
                  <>
                    <Loader2 className='animate-spin mr-2' />
                    Verifying
                  </>
                )}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default Register;
