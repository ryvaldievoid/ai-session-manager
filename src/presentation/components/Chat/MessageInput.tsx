'use client';

import { useState, KeyboardEvent } from 'react';
import { Send, Bug } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (message: string, simulateError: boolean, simulateDelay: boolean) => void;
  isTyping: boolean;
}

export function MessageInput({ onSendMessage, isTyping }: MessageInputProps) {
  const [input, setInput] = useState('');
  const [simulateError, setSimulateError] = useState(false);
  const [simulateDelay, setSimulateDelay] = useState(false);

  const handleSend = () => {
    if (!input.trim() || isTyping) return;
    onSendMessage(input, simulateError, simulateDelay);
    setInput('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-3xl mx-auto relative flex items-end gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message"
          className="w-full resize-none rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-3 pr-24 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 min-h-[52px] max-h-32 overflow-y-hidden"
          rows={1}
          disabled={isTyping}
        />
        <div className="absolute right-2 bottom-2 flex items-center gap-1">
          <button
            onClick={() => setSimulateError(!simulateError)}
            className={`p-2 rounded-lg transition-colors ${
              simulateError
                ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                : 'text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
            title="Simulate 500 Error"
          >
            <Bug size={18} />
          </button>
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
      {simulateError && (
        <div className="max-w-3xl mx-auto mt-2 text-xs text-red-500 flex justify-end">
          Error simulation active! Next message will fail.
        </div>
      )}
    </div>
  );
}
