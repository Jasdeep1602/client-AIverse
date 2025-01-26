'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send } from 'lucide-react';
import Image from 'next/image';
function Chat() {
  const [messages, setMessages] = useState<
    { role: 'user' | 'assistant'; content: string }[]
  >([]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { role: 'user', content: input }]);
      // Here you would typically send the message to your AI backend
      // and then add the response to the messages
      setInput('');
    }
  };
  return (
    <div className='flex flex-col h-full'>
      <div className='p-4 border-t flex justify-between items-center'>
        <Image src='/AIverseLogo.png' alt='logo' width='150' height='100' />
        <Button>Logout</Button>
      </div>
      <div className='flex-1 overflow-auto p-4 space-y-4'>
        {messages.map((message, index) => (
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
          />
          <Button type='submit'>
            <Send className='h-4 w-4' />
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Chat;
