'use client';

import { useTheme } from 'next-themes';
import { Sun, Moon, PlusCircle, MessageSquare, Trash2 } from 'lucide-react';
import { Session } from '../../../domain/models/Session';

interface SidebarProps {
  sessions: Session[];
  activeSessionId: string;
  onCreateSession: () => void;
  onSwitchSession: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
  onToggleSidebar?: () => void;
}

export function Sidebar({
  sessions,
  activeSessionId,
  onCreateSession,
  onSwitchSession,
  onDeleteSession,
  onToggleSidebar,
}: SidebarProps) {
  const { theme, setTheme } = useTheme();

  return (
    <aside className="w-64 border-r border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
        <h1 className="font-semibold text-lg text-gray-900 dark:text-gray-100">AI Sessions</h1>
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="text-xs px-2 py-1 rounded bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700"
          >
            Hide
          </button>
        )}
      </div>

      <div className="p-4 flex-1 overflow-y-auto">
        <button
          onClick={onCreateSession}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
        >
          <PlusCircle size={18} />
          <span>New Session</span>
        </button>

        <div className="mt-6 space-y-2">
          {sessions.map((session) => {
            const isActive = session.id === activeSessionId;
            return (
              <div
                key={session.id}
                className={`group flex items-center gap-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-gray-200 dark:bg-gray-800'
                    : 'hover:bg-gray-200 dark:hover:bg-gray-800'
                }`}
              >
                <button
                  onClick={() => onSwitchSession(session.id)}
                  className="flex-1 text-left px-3 py-2 text-gray-700 dark:text-gray-300 flex items-center gap-3 min-w-0"
                >
                  <MessageSquare size={16} className="shrink-0" />
                  <span className="truncate text-sm">{session.title}</span>
                </button>

                {sessions.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSession(session.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1.5 mr-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-500 transition-all"
                    title="Delete session"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
      </div>
    </aside>
  );
}
