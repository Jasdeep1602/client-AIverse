/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, MessageCircle } from 'lucide-react';
import {
  createChatSession,
  fetchChatSessions,
  setCurrentChatId,
} from '@/redux/slices/chat';
// import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';

function Sidebar() {
  const dispatch = useAppDispatch();
  // const router = useRouter();

  // Select state from Redux store
  const chatSessions = useAppSelector((state) => state.chat.chatSessions);
  const isChatSessionFetching = useAppSelector(
    (state) => state.chat.isChatSessionFetching
  );
  const currentChatId = useAppSelector((state) => state.chat.currentChatId);

  // Function to fetch chat sessions
  const fetchSessions = async (userId: string) => {
    try {
      await dispatch(
        fetchChatSessions({
          data: { userId },
        })
      ).unwrap();
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
    }
  };

  // Fetch chat sessions on mount
  useEffect(() => {
    // Get user ID from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (user.id) {
      fetchSessions(user.id);
    }
  }, [dispatch]);

  const handleNewChat = async () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    try {
      // Create new chat session
      const result = await dispatch(
        createChatSession({
          data: { userId: user.id },
        })
      ).unwrap();

      // Refetch sessions to update the list
      await fetchSessions(user.id);

      // Set the new chat as current
      if (result._id) {
        dispatch(setCurrentChatId(result._id));
      }
    } catch (error) {
      console.error('Failed to create new chat:', error);
    }
  };

  const handleSelectChat = (chatId: string) => {
    // Set current chat ID in Redux
    dispatch(setCurrentChatId(chatId));

    // Optional: Navigate to chat page if you have a separate chat page
    // router.push(`/chat/${chatId}`);
  };

  return (
    <div className='w-80 bg-gray-900 text-white p-4 flex flex-col h-full'>
      <Button
        variant='outline'
        className='mb-4'
        onClick={handleNewChat}
        disabled={isChatSessionFetching}>
        <PlusCircle className='mr-2 h-4 w-4' />
        New Chat
      </Button>
      <div className='flex-1 overflow-auto mt-4'>
        <div className='space-y-2 mr-2'>
          {chatSessions.map((session: any) => (
            <Button
              key={session._id}
              variant={currentChatId === session._id ? 'secondary' : 'ghost'}
              className='w-full justify-start'
              onClick={() => handleSelectChat(session._id)}>
              <MessageCircle className='mr-2 h-4 w-4' />
              Chat {session._id.slice(-4)}
            </Button>
          ))}
        </div>
        {isChatSessionFetching && (
          <div className='text-center mt-4 text-gray-400'>Loading chats...</div>
        )}
        {!isChatSessionFetching && chatSessions.length === 0 && (
          <div className='text-center mt-4 text-gray-400'>No chat sessions</div>
        )}
      </div>
    </div>
  );
}

export default Sidebar;

// 'use client';

// import React from 'react';
// import { Button } from '@/components/ui/button';
// import { PlusCircle, MessageCircle } from 'lucide-react';

// function Sidebar() {
//   return (
//     <div className='w-64 bg-gray-900 text-white p-4 flex flex-col h-full'>
//       <Button variant='outline' className='mb-4'>
//         <PlusCircle className='mr-2 h-4 w-4' /> New Chat
//       </Button>
//       <div className='flex-1 overflow-auto'>
//         <div className='space-y-2'>
//           {/* Sample conversation history */}
//           <Button variant='ghost' className='w-full justify-start'>
//             <MessageCircle className='mr-2 h-4 w-4' />
//             Conversation 1
//           </Button>
//           <Button variant='ghost' className='w-full justify-start'>
//             <MessageCircle className='mr-2 h-4 w-4' />
//             Conversation 2
//           </Button>
//           {/* Add more conversation buttons as needed */}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Sidebar;
