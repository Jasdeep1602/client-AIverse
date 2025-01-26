'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, MessageCircle } from 'lucide-react';

function Sidebar() {
  return (
    <div className='w-64 bg-gray-900 text-white p-4 flex flex-col h-full'>
      <Button variant='outline' className='mb-4'>
        <PlusCircle className='mr-2 h-4 w-4' /> New Chat
      </Button>
      <div className='flex-1 overflow-auto'>
        <div className='space-y-2'>
          {/* Sample conversation history */}
          <Button variant='ghost' className='w-full justify-start'>
            <MessageCircle className='mr-2 h-4 w-4' />
            Conversation 1
          </Button>
          <Button variant='ghost' className='w-full justify-start'>
            <MessageCircle className='mr-2 h-4 w-4' />
            Conversation 2
          </Button>
          {/* Add more conversation buttons as needed */}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
