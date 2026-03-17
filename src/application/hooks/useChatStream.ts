import { useState, useCallback, useRef, useEffect } from 'react';
import { Message } from '../../domain/models/Message';
import { GeminiRepository } from '../../infrastructure/ai/GeminiRepository';
import { SentryLogger } from '../../infrastructure/logging/SentryLogger';

interface UseChatStreamOptions {
  /** The currently active session ID — when it changes, messages reset to the session's stored messages. */
  activeSessionId: string;
  /** Pre-existing messages for the active session (loaded from session manager). */
  initialMessages?: Message[];
  /** Callback invoked whenever the message list changes, so the parent can persist it. */
  onMessagesChange?: (sessionId: string, messages: Message[]) => void;
}

export function useChatStream(options?: UseChatStreamOptions) {
  const {
    activeSessionId = '',
    initialMessages = [],
    onMessagesChange,
  } = options ?? {};

  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const repositoryRef = useRef(new GeminiRepository());
  const loggerRef = useRef(new SentryLogger());

  const prevSessionIdRef = useRef(activeSessionId);

  useEffect(() => {
    if (prevSessionIdRef.current !== activeSessionId) {
      setMessages(initialMessages);
      setError(null);
      setIsTyping(false);
      prevSessionIdRef.current = activeSessionId;
    }
  }, [activeSessionId, initialMessages]);

  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  const notifyParent = useCallback(
    (updatedMessages: Message[]) => {
      if (onMessagesChange && activeSessionId) {
        onMessagesChange(activeSessionId, updatedMessages);
      }
    },
    [onMessagesChange, activeSessionId]
  );

  const sendMessage = useCallback(
    async (
      content: string,
      simulateError: boolean = false,
      simulateDelay: boolean = false
    ) => {
      if (simulateDelay) {
        setIsTyping(true);
        await new Promise((resolve) => setTimeout(resolve, 5000));
        setIsTyping(false);
      }

      if (!content.trim()) return;

      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content,
        createdAt: new Date(),
        status: 'success',
      };

      const modelMessageId = (Date.now() + 1).toString();
      const initialModelMessage: Message = {
        id: modelMessageId,
        role: 'model',
        content: '',
        createdAt: new Date(),
        status: 'sending',
      };

      const history = messagesRef.current.filter(
        (m) => m.status === 'success' && m.role !== 'system'
      );

      const afterUser = [...messagesRef.current, userMessage, initialModelMessage];
      setMessages(afterUser);
      setIsTyping(true);
      setError(null);

      try {
        const stream = repositoryRef.current.streamChat(
          history,
          content,
          simulateError
        );

        setMessages((prev) => {
          const updated = prev.map((msg) =>
            msg.id === modelMessageId ? { ...msg, status: 'streaming' as const } : msg
          );
          return updated;
        });

        for await (const chunk of stream) {
          setMessages((prev) => {
            const updated = prev.map((msg) =>
              msg.id === modelMessageId
                ? { ...msg, content: msg.content + chunk }
                : msg
            );
            return updated;
          });
        }

        setMessages((prev) => {
          const updated = prev.map((msg) =>
            msg.id === modelMessageId
              ? { ...msg, status: 'success' as const }
              : msg
          );
          notifyParent(updated);
          return updated;
        });
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error occurred';
        loggerRef.current.logError(errorMessage, { userMessage: content });
        setError(errorMessage);

        setMessages((prev) => {
          const updated = prev.map((msg) =>
            msg.id === modelMessageId
              ? { ...msg, status: 'error' as const, content: errorMessage }
              : msg
          );
          notifyParent(updated);
          return updated;
        });
      } finally {
        setIsTyping(false);
      }
    },
    [notifyParent]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
    notifyParent([]);
  }, [notifyParent]);

  return {
    messages,
    isTyping,
    error,
    sendMessage,
    clearMessages,
  };
}
