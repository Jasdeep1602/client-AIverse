'use client';

import React from 'react';

function loading() {
  return (
    <div className='flex gap-4 items-center justify-center min-h-full min-w-full fixed top-0'>
      <style jsx>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.3;
          }
        }
        .pulse {
          animation: pulse 1s ease-in-out infinite;
        }
      `}</style>
      <div
        className='w-5 h-5 rounded-full bg-blue-600 pulse'
        style={{ animationDelay: '0s' }}
      />
      <div
        className='w-5 h-5 rounded-full bg-blue-600 pulse'
        style={{ animationDelay: '0.2s' }}
      />
      <div
        className='w-5 h-5 rounded-full bg-blue-600 pulse'
        style={{ animationDelay: '0.4s' }}
      />
    </div>
  );
}

export default loading;
