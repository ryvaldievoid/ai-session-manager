export type MessageRole = 'user' | 'model' | 'system';
export type MessageStatus = 'sending' | 'streaming' | 'success' | 'error';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: Date;
  status: MessageStatus;
}
