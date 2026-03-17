import { Message } from '../models/Message';

export interface IAIService {
  /**
   * Start a chat session and return a stream of response chunks.
   * @param history The previous messages in the session.
   * @param newMessage The new message from the user.
   * @param simulateError If true, the implementation should simulate an error (e.g. 500) for testing resilience.
   * @returns An async generator yielding chunks of the response.
   */
  streamChat(history: Message[], newMessage: string, simulateError?: boolean): AsyncGenerator<string, void, unknown>;
}
