'use client';

import { Sidebar } from '../presentation/components/Sidebar/Sidebar';
import { MessageList } from '../presentation/components/Chat/MessageList';
import { MessageInput } from '../presentation/components/Chat/MessageInput';
import { useChatStream } from '../application/hooks/useChatStream';
import { useSessionManager } from '../application/hooks/useSessionManager';

export default function Home() {
  const {
    sessions,
    activeSession,
    activeSessionId,
    createSession,
    switchSession,
    deleteSession,
    updateSessionMessages,
  } = useSessionManager();

  const { messages, isTyping, error, sendMessage } = useChatStream({
    activeSessionId,
    initialMessages: activeSession?.messages || [],
    onMessagesChange: updateSessionMessages,
  });

  return (
    <main className="flex h-screen overflow-hidden">
      <Sidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onCreateSession={createSession}
        onSwitchSession={switchSession}
        onDeleteSession={deleteSession}
      />
      <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900">
        <header className="p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-sm z-10">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 text-center">
            {activeSession?.title || 'Chat Session'}
          </h2>
        </header>
        <MessageList messages={messages} isTyping={isTyping} error={error} />
        <MessageInput onSendMessage={sendMessage} isTyping={isTyping} />
      </div>
    </main>
  );
}
