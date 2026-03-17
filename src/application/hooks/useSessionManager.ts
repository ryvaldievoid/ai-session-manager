import { useState, useCallback } from 'react';
import { Session } from '../../domain/models/Session';
import { Message } from '../../domain/models/Message';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

function createNewSession(): Session {
  const now = new Date();
  return {
    id: generateId(),
    title: 'New Chat',
    messages: [],
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Derives a session title from the first user message.
 * Truncates to maxLength characters and appends "..." if needed.
 */
function deriveTitleFromMessages(messages: Message[], maxLength = 30): string {
  const firstUserMessage = messages.find((m) => m.role === 'user');
  if (!firstUserMessage || !firstUserMessage.content.trim()) {
    return 'New Chat';
  }
  const content = firstUserMessage.content.trim();
  return content.length > maxLength
    ? `${content.substring(0, maxLength)}…`
    : content;
}

export function useSessionManager() {
  const [sessions, setSessions] = useState<Session[]>(() => {
    const initial = createNewSession();
    return [initial];
  });
  const [activeSessionId, setActiveSessionId] = useState<string>(
    () => sessions[0]?.id ?? ''
  );

  const activeSession = sessions.find((s) => s.id === activeSessionId) ?? null;

  const createSession = useCallback(() => {
    const newSession = createNewSession();
    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    return newSession;
  }, []);

  const switchSession = useCallback(
    (sessionId: string) => {
      const exists = sessions.some((s) => s.id === sessionId);
      if (exists) {
        setActiveSessionId(sessionId);
      }
    },
    [sessions]
  );

  const deleteSession = useCallback(
    (sessionId: string) => {
      setSessions((prev) => {
        const updated = prev.filter((s) => s.id !== sessionId);
        if (sessionId === activeSessionId) {
          if (updated.length > 0) {
            setActiveSessionId(updated[0].id);
          } else {
            const fallback = createNewSession();
            updated.push(fallback);
            setActiveSessionId(fallback.id);
          }
        }
        return updated;
      });
    },
    [activeSessionId]
  );

  const updateSessionMessages = useCallback(
    (sessionId: string, messages: Message[]) => {
      setSessions((prev) =>
        prev.map((s) => {
          if (s.id !== sessionId) return s;
          const title =
            s.title === 'New Chat'
              ? deriveTitleFromMessages(messages)
              : s.title;
          return {
            ...s,
            messages,
            title,
            updatedAt: new Date(),
          };
        })
      );
    },
    []
  );

  const renameSession = useCallback(
    (sessionId: string, newTitle: string) => {
      setSessions((prev) =>
        prev.map((s) =>
          s.id === sessionId
            ? { ...s, title: newTitle, updatedAt: new Date() }
            : s
        )
      );
    },
    []
  );

  return {
    sessions,
    activeSession,
    activeSessionId,
    createSession,
    switchSession,
    deleteSession,
    updateSessionMessages,
    renameSession,
  };
}
