'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function PrivateRoute(Component: React.ComponentType) {
  return function ProtectedRoute(props: any) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const accessToken = localStorage.getItem('accesstoken');
      if (!accessToken) {
        router.replace('/login');
      } else {
        setIsLoading(false);
      }
    }, [router]);

    if (isLoading) {
      return (
        <div className='flex gap-2 items-center justify-center min-h-full min-w-full fixed top-0'>
          <div className='w-5 h-5 rounded-full animate-pulse-fast bg-blue-600' />
          <div className='w-5 h-5 rounded-full animate-pulse-fast bg-blue-600' />
          <div className='w-5 h-5 rounded-full animate-pulse-fast bg-blue-600' />
        </div>
      );
    }

    return <Component {...props} />;
  };
}
