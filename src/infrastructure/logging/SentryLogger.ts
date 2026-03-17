import * as Sentry from '@sentry/nextjs';
import { ILoggerService } from '../../domain/services/ILoggerService';

export class SentryLogger implements ILoggerService {
  logError(error: Error | string, context?: Record<string, unknown>): void {
    Sentry.captureException(error, {
      extra: context,
    });
    console.error('[SentryLogger] Error:', error, context);
  }

  logInfo(message: string, context?: Record<string, unknown>): void {
    Sentry.captureMessage(message, 'info');
    console.log('[SentryLogger] Info:', message, context);
  }
}
