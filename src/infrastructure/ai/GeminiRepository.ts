import { GoogleGenerativeAI } from '@google/generative-ai';
import { IAIService } from '../../domain/services/IAIService';
import { Message } from '../../domain/models/Message';

export class GeminiRepository implements IAIService {
  private genAI: GoogleGenerativeAI;
  private modelName = 'gemini-2.5-flash';

  constructor() {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async *streamChat(history: Message[], newMessage: string, simulateError?: boolean): AsyncGenerator<string, void, unknown> {
    if (simulateError) {
      throw new Error('Simulated 500 Error: Gemini API is unavailable.');
    }

    const model = this.genAI.getGenerativeModel({ model: this.modelName });

    const formattedHistory = history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    const chat = model.startChat({
      history: formattedHistory,
    });

    try {
      const result = await chat.sendMessageStream(newMessage);
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        yield chunkText;
      }
    } catch (error) {
      throw new Error(`Gemini API Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
