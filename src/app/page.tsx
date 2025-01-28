'use client';

import Chat from '@/customComponents/chat';
/* eslint-disable @typescript-eslint/no-explicit-any */

import { PrivateRoute } from '@/customComponents/PrivateRoute';
import Sidebar from '@/customComponents/sidebar';

function Home() {
  return (
    <div className='flex h-screen'>
      <div className='w-80 flex-shrink-0  border-r'>
        <Sidebar />
      </div>
      <main className='flex-1 overflow-hidden'>
        <Chat />
      </main>
    </div>
  );
}

export default PrivateRoute(Home);
