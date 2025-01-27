'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Loader2, Send } from 'lucide-react';
import Image from 'next/image';
import {
  createChatSession,
  sendChatMessage,
  fetchChatHistory,
} from '@/redux/slices/chat';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/hooks/redux';
import { authLogout } from '@/redux/slices/auth';
import { toast } from 'sonner';

function Chat() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  // Select state from Redux store
  const currentChatId = useAppSelector((state) => state.chat.currentChatId);
  const currentChatMessages = useAppSelector(
    (state) => state.chat.currentChatMessages
  );
  const isSendingMessage = useAppSelector(
    (state) => state.chat.isSendingMessage
  );

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

  const [input, setInput] = useState('');

  // Create chat session on mount
  useEffect(() => {
    //     if (!isLogged) {
    //       router.push('/login');
    //       return;
    //     }

    // Get user ID from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // Dispatch create chat session if no current chat
    if (!currentChatId) {
      dispatch(
        createChatSession({
          data: { userId: user.id },
        })
      );
    } else {
      // Fetch chat history for existing chat
      dispatch(
        fetchChatHistory({
          chatId: currentChatId,
        })
      );
    }
  }, [currentChatId, dispatch]);

  const handleSend = () => {
    if (!input.trim() || !currentChatId) return;

    // Dispatch send message action
    dispatch(
      sendChatMessage({
        data: {
          chatId: currentChatId,
          message: input,
        },
      })
    );

    // Clear input
    setInput('');
  };

  return (
    <div className='flex flex-col h-full'>
      <div className='p-4 border-t flex justify-between items-center'>
        <Image src='/AIverseLogo.png' alt='logo' width='150' height='100' />
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
      <div className='flex-1 overflow-auto p-4 space-y-4'>
        {currentChatMessages.map((message: any, index: number) => (
          <div
            key={index}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}>
            <div
              className={`flex items-start ${
                message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}>
              <Avatar className='w-8 h-8'>
                <AvatarFallback>
                  {message.role === 'user' ? 'U' : 'AI'}
                </AvatarFallback>
              </Avatar>
              <div
                className={`mx-2 p-2 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200'
                }`}>
                {message.content}
              </div>
            </div>
          </div>
        ))}
        {isSendingMessage && (
          <div className='flex justify-start'>
            <div className='bg-gray-200 p-2 rounded-lg'>Typing...</div>
          </div>
        )}
      </div>
      <div className='p-4 border-t'>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className='flex space-x-2'>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Type your message here...'
            className='flex-1'
            disabled={isSendingMessage}
          />
          <Button type='submit' disabled={isSendingMessage || !input.trim()}>
            <Send className='h-4 w-4' />
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Chat;
