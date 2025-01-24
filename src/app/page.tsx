'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */

import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { authLogout } from '@/redux/slices/auth';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';
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
      </Button>{' '}
    </div>
  );
}

export default PrivateRoute(Home);
