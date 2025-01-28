'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import Chat from '@/customComponents/chat';

import { PrivateRoute } from '@/customComponents/PrivateRoute';
import Sidebar from '@/customComponents/sidebar';

function Home() {
  return (
    <div className='flex h-screen '>
      <div className='w-80 flex-shrink-0  border-r side-css'>
        <Sidebar />
      </div>
      <main className='flex-1 overflow-hidden chat-css'>
        <Chat />
      </main>
    </div>
  );
}

export default PrivateRoute(Home);
