'use client';

import Chat from '@/customComponents/chat';
/* eslint-disable @typescript-eslint/no-explicit-any */

import { PrivateRoute } from '@/customComponents/PrivateRoute';
import Sidebar from '@/customComponents/sidebar';

function Home() {
  return (
    <div className='flex h-screen'>
      <Sidebar />
      <main className='flex-1 overflow-hidden'>
        <Chat />
      </main>
    </div>
  );
}

export default PrivateRoute(Home);
