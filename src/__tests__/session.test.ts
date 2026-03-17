import { describe, it, expect } from 'vitest';
import { Session } from '../domain/models/Session';
import { Message } from '../domain/models/Message';

describe('Session Model', () => {
  const createSession = (overrides: Partial<Session> = {}): Session => ({
    id: '1',
    title: 'Test Session',
    messages: [],
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
    ...overrides,
  });

  const createMessage = (overrides: Partial<Message> = {}): Message => ({
    id: '1',
    role: 'user',
    content: 'Hello',
    createdAt: new Date(),
    status: 'success',
    ...overrides,
  });

  it('should create a session with default values', () => {
    const session = createSession();
    expect(session.id).toBe('1');
    expect(session.title).toBe('Test Session');
    expect(session.messages).toEqual([]);
  });

  it('should have correct date properties', () => {
    const session = createSession();
    expect(session.createdAt).toBeInstanceOf(Date);
    expect(session.updatedAt).toBeInstanceOf(Date);
  });

  it('should allow adding messages to a session', () => {
    const msg1 = createMessage({ id: '1', role: 'user', content: 'Hello' });
    const msg2 = createMessage({ id: '2', role: 'model', content: 'Hi there!' });
    const session = createSession({ messages: [msg1, msg2] });
    expect(session.messages).toHaveLength(2);
    expect(session.messages[0].role).toBe('user');
    expect(session.messages[1].role).toBe('model');
  });

  it('should correctly track message statuses', () => {
    const sendingMsg = createMessage({ id: '1', status: 'sending' });
    const streamingMsg = createMessage({ id: '2', status: 'streaming' });
    const successMsg = createMessage({ id: '3', status: 'success' });
    const errorMsg = createMessage({ id: '4', status: 'error' });

    const session = createSession({
      messages: [sendingMsg, streamingMsg, successMsg, errorMsg],
    });

    expect(session.messages[0].status).toBe('sending');
    expect(session.messages[1].status).toBe('streaming');
    expect(session.messages[2].status).toBe('success');
    expect(session.messages[3].status).toBe('error');
  });

  it('should preserve message content and order', () => {
    const messages = [
      createMessage({ id: '1', role: 'user', content: 'What is AI?' }),
      createMessage({ id: '2', role: 'model', content: 'AI stands for Artificial Intelligence.' }),
      createMessage({ id: '3', role: 'user', content: 'Tell me more.' }),
    ];
    const session = createSession({ messages });

    expect(session.messages[0].content).toBe('What is AI?');
    expect(session.messages[1].content).toBe('AI stands for Artificial Intelligence.');
    expect(session.messages[2].content).toBe('Tell me more.');
  });

  it('should simulate accumulating streamed chunks', () => {
    const modelMsg = createMessage({
      id: '2',
      role: 'model',
      content: '',
      status: 'streaming',
    });

    const chunks = ['Hello', ', how', ' can', ' I', ' help you?'];
    let accumulated = modelMsg.content;
    for (const chunk of chunks) {
      accumulated += chunk;
    }

    const finalMessage: Message = {
      ...modelMsg,
      content: accumulated,
      status: 'success',
    };

    expect(finalMessage.content).toBe('Hello, how can I help you?');
    expect(finalMessage.status).toBe('success');
  });

  it('should handle error simulation in message', () => {
    const errorMsg = createMessage({
      id: '2',
      role: 'model',
      content: 'Simulated 500 Error: Gemini API is unavailable.',
      status: 'error',
    });

    expect(errorMsg.status).toBe('error');
    expect(errorMsg.content).toContain('500 Error');
  });

  it('should filter messages for chat history correctly', () => {
    const messages: Message[] = [
      createMessage({ id: '1', role: 'user', content: 'Hello', status: 'success' }),
      createMessage({ id: '2', role: 'model', content: 'Hi!', status: 'success' }),
      createMessage({ id: '3', role: 'system', content: 'System message', status: 'success' }),
      createMessage({ id: '4', role: 'model', content: 'Error', status: 'error' }),
    ];

    const history = messages.filter(
      (m) => m.status === 'success' && m.role !== 'system'
    );

    expect(history).toHaveLength(2);
    expect(history[0].role).toBe('user');
    expect(history[1].role).toBe('model');
  });
});
