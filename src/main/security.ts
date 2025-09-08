import { BrowserWindow, session } from 'electron';
import { logger } from './logger.js';

/**
 * Apply security policies to the application
 */
export function applySecurity(win: BrowserWindow): void {
  // Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Allow unsafe-inline for Vite dev
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self' ws: wss:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; ');

  // Set CSP for all sessions
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [csp]
      }
    });
  });

  // Disable dangerous features
  win.webContents.on('will-navigate', (event, url) => {
    const parsedUrl = new URL(url);
    
    // Only allow localhost in development or file:// in production
    if (process.env.NODE_ENV === 'development') {
      if (parsedUrl.origin !== 'http://localhost:5173') {
        event.preventDefault();
        logger.warn(`Blocked navigation to: ${url}`);
      }
    } else {
      if (!url.startsWith('file://')) {
        event.preventDefault();
        logger.warn(`Blocked navigation to: ${url}`);
      }
    }
  });

  // Disable context menu in production
  if (process.env.NODE_ENV === 'production') {
    win.webContents.on('context-menu', (event) => {
      event.preventDefault();
    });
  }

  // Disable drag and drop
  win.webContents.on('will-navigate', (event) => {
    event.preventDefault();
  });

  logger.info('Security policies applied');
}
