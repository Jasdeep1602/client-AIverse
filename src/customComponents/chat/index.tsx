'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, MessageCircle, Send } from 'lucide-react';
import Image from 'next/image';
import {
  createChatSession,
  sendChatMessage,
  fetchChatHistory,
  setCurrentChatId,
  fetchChatSessions,
  clearCurrentChatMessages,
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
  const isChatSessionFetching = useAppSelector(
    (state) => state.chat.isChatSessionFetching
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

  // First useEffect - Handle initial setup
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // First check if there are any existing chat sessions
    dispatch(
      fetchChatSessions({
        data: { userId: user.id },
      })
    )
      .unwrap()
      .then((sessions) => {
        if (sessions.length > 0) {
          // If there are existing sessions but no current chat ID,
          // set the most recent one as current
          if (!currentChatId) {
            dispatch(setCurrentChatId(sessions[0]._id));
            dispatch(
              fetchChatHistory({
                chatId: sessions[0]._id,
              })
            ).unwrap();
          }
        } else {
          // Only create a new chat if there are no existing sessions
          dispatch(
            createChatSession({
              data: { userId: user.id },
            })
          ).unwrap();
        }
      });
  }, []); // Only run on mount

  // Second useEffect - Handle chat switching
  useEffect(() => {
    if (currentChatId) {
      // Clear current messages before fetching new ones
      dispatch(clearCurrentChatMessages());

      // Fetch chat history for the selected chat
      dispatch(
        fetchChatHistory({
          chatId: currentChatId,
        })
      ).unwrap();
    }
  }, [currentChatId, dispatch]); // Run when currentChatId changes

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
    ).unwrap();

    // Clear input
    setInput('');
  };

  return (
    <div className='flex flex-col h-full bg-background'>
      <div className='p-4 border-t flex justify-between items-center'>
        <Image src='/AIverseLogo.png' alt='logo' width='150' height='100' />
        <Button
          onClick={handleLogout}
          className=' bg-muted hover:bg-cyan-300 font-medium text-sm text-muted-forground py-5'>
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
      <div className='flex-1 overflow-auto p-4 space-y-6'>
        {isChatSessionFetching ? (
          <div className='flex flex-col items-center justify-center h-full space-y-4'>
            <Loader2 className='w-8 h-8 animate-spin text-blue-500' />
            <p className='text-sm text-muted-foreground'>
              Loading chat history...
            </p>
          </div>
        ) : currentChatMessages.length === 0 ? (
          <div className='flex flex-col items-center justify-center h-full space-y-4'>
            <MessageCircle className='w-8 h-8 text-muted-foreground' />
            <p className='text-sm text-muted-foreground'>
              No messages yet. Start a conversation!
            </p>
          </div>
        ) : (
          currentChatMessages.map((message: any, index: number) => (
            <div
              key={index}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}>
              <div
                className={`flex items-start gap-2 ${
                  message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}>
                <Avatar className='w-8 h-8'>
                  <AvatarImage
                    src={message.role === 'user' ? '/bear.png' : '/aimg.png'}
                    alt='image'
                  />

                  <AvatarFallback>
                    {message.role === 'user' ? 'U' : 'AI'}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`mx-2 p-3 rounded-lg max-w-[80%] ${
                    message.role === 'user'
                      ? 'user-message'
                      : 'bg-muted text-muted-foreground rounded-md'
                  }`}>
                  {message.role === 'model' ? (
                    // Format AI messages with proper spacing and structure
                    <div className='space-y-4 leading-relaxed'>
                      {message.content
                        .split('\n\n')
                        .map(
                          (
                            paragraph: string,
                            i: React.Key | null | undefined
                          ) => {
                            // Handle code blocks
                            if (paragraph.includes('```')) {
                              const [before, code, after] =
                                paragraph.split('```');
                              return (
                                <div key={i}>
                                  {before && <p className='mb-2'>{before}</p>}
                                  {code && (
                                    <pre className='bg-background p-3 rounded-md my-2 overflow-x-auto'>
                                      <code>{code}</code>
                                    </pre>
                                  )}
                                  {after && <p className='mt-2'>{after}</p>}
                                </div>
                              );
                            }
                            // Handle bullet points
                            else if (paragraph.includes('*')) {
                              return (
                                <ul
                                  key={i}
                                  className='list-disc pl-4 space-y-2'>
                                  {paragraph
                                    .split('*')
                                    .map(
                                      (
                                        item: string,
                                        j: React.Key | null | undefined
                                      ) =>
                                        item.trim() && (
                                          <li key={j}>{item.trim()}</li>
                                        )
                                    )}
                                </ul>
                              );
                            }
                            // Regular paragraphs
                            else {
                              return (
                                paragraph.trim() && (
                                  <p key={i} className='text-sm'>
                                    {paragraph.trim()}
                                  </p>
                                )
                              );
                            }
                          }
                        )}
                    </div>
                  ) : (
                    // User messages remain simple
                    <div className='text-sm'>{message.content}</div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        {isSendingMessage && (
          <div className='flex justify-start items-center gap-1 '>
            <Loader2 className='animate-spin' />
            <div className=' text-sm text-blue-700'>AIverse is thinking...</div>
          </div>
        )}
      </div>
      <div className='p-4 flex justify-center w-full'>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className='chat'>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Message AIverse'
            className='chat-input'
            disabled={isSendingMessage}
          />
          <Button
            className=' plane-button hover:bg-transparent'
            type='submit'
            disabled={isSendingMessage || !input.trim()}>
            <Send className=' plane ' />
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Chat;
