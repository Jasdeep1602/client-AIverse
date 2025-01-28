/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, MessageCircle, Trash2, Loader2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  createChatSession,
  deleteChatSession,
  fetchChatSessions,
  setCurrentChatId,
} from '@/redux/slices/chat';
// import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { toast } from 'sonner';

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
      toast.error('Failed to fetch sessions');
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
      console.error(error);
      toast.error('Failed to create new chat');
    }
  };

  const handleSelectChat = (chatId: string) => {
    // Set current chat ID in Redux
    dispatch(setCurrentChatId(chatId));

    // Optional: Navigate to chat page if you have a separate chat page
    // router.push(`/chat/${chatId}`);
  };

  const handleDeleteChat = async (chatId: string) => {
    try {
      await dispatch(deleteChatSession({ chatId })).unwrap();
      toast.success('Chat deleted successfully');

      // If it was the current chat, fetch sessions to update the list
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.id) {
        fetchSessions(user.id);
      }
    } catch (error) {
      toast.error('Failed to delete chat');
    }
  };

  return (
    <div className='w-80 bg-gray-700 text-white p-4 flex flex-col h-full  border-r'>
      <Button
        variant='login'
        className='mb-4'
        onClick={handleNewChat}
        disabled={isChatSessionFetching}>
        <PlusCircle className='mr-2 h-4 w-4' />
        New Chat
      </Button>
      <div className='flex-1 overflow-auto mt-4'>
        <div className='space-y-2 mr-2'>
          {chatSessions.map((session: any) => (
            <div key={session._id} className='flex items-center group'>
              <Button
                variant={currentChatId === session._id ? 'secondary' : 'ghost'}
                className='w-full justify-start mr-2'
                onClick={() => handleSelectChat(session._id)}>
                <MessageCircle className='mr-2 h-4 w-4' />
                <span className='truncate'>{session.title}</span>
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='opacity-0 group-hover:opacity-100 transition-opacity'>
                    <Trash2 className='h-4 w-4 text-muted-foreground' />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Chat</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this chat? This action
                      cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDeleteChat(session._id)}
                      className='delete-dialog'>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ))}
        </div>
        {isChatSessionFetching && (
          <div className='text-center mt-4 text-gray-400 flex items-center justify-center'>
            <Loader2 className='animate-spin' />
          </div>
        )}
        {!isChatSessionFetching && chatSessions.length === 0 && (
          <div className='text-center mt-4 text-gray-400'>No chat sessions</div>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
