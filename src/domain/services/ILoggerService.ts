export interface ILoggerService {
  logError(error: Error | string, context?: Record<string, unknown>): void;
  logInfo(message: string, context?: Record<string, unknown>): void;
}
