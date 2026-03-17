'use client';

import { useEffect, useRef } from 'react';
import { Message } from '../../../domain/models/Message';
import { TypingIndicator } from './TypingIndicator';
import { AlertCircle } from 'lucide-react';

interface MessageListProps {
  messages: Message[];
  isTyping: boolean;
  error: string | null;
}

export function MessageList({ messages, isTyping, error }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, error]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-20">
            <h2 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-gray-200">How can I help you today?</h2>
            <p>Send a message to start the session.</p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl p-4 ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : message.status === 'error'
                  ? 'bg-red-50 dark:bg-red-900/20 text-red-900 dark:text-red-200 border border-red-200 dark:border-red-800 rounded-bl-none'
                  : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm border border-gray-200 dark:border-gray-700 rounded-bl-none'
              }`}
            >
              {message.status === 'error' && (
                <div className="flex items-center gap-2 mb-2 text-red-600 dark:text-red-400 font-medium">
                  <AlertCircle size={16} />
                  <span>Error</span>
                </div>
              )}
              
              <div className="whitespace-pre-wrap leading-relaxed">
                {message.content}
                {message.status === 'streaming' && (
                  <TypingIndicator />
                )}
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && !messages[messages.length - 1]?.status.includes('stream') && (
           <div className="flex justify-start">
             <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 rounded-2xl rounded-bl-none">
               <TypingIndicator />
             </div>
           </div>
        )}

        {error && messages[messages.length -1]?.status !== 'error' && (
           <div className="flex justify-center my-4">
             <div className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-4 py-2 rounded-lg flex items-center gap-2 text-sm border border-red-200 dark:border-red-800">
               <AlertCircle size={16} />
               <span>{error}</span>
             </div>
           </div>
        )}
        <div ref={bottomRef} className="h-4" />
      </div>
    </div>
  );
}
