import { app, dialog } from 'electron';
import { logger } from './logger.js';

/**
 * Bootstrap application with security checks and single instance enforcement
 */
export async function bootstrapApp(): Promise<void> {
  // Ensure single instance
  const gotTheLock = app.requestSingleInstanceLock();
  
  if (!gotTheLock) {
    logger.info('Another instance is already running, quitting...');
    app.quit();
    return;
  }

  // Handle second instance
  app.on('second-instance', () => {
    logger.info('Second instance detected, focusing main window...');
    // Focus main window if exists
    const windows = require('electron').BrowserWindow.getAllWindows();
    if (windows.length > 0) {
      windows[0].focus();
    }
  });

  // Security: Disable node integration in renderer
  app.on('web-contents-created', (_, contents) => {
    contents.on('will-navigate', (event, navigationUrl) => {
      const parsedUrl = new URL(navigationUrl);
      
      if (parsedUrl.origin !== 'http://localhost:5173' && parsedUrl.origin !== 'file://') {
        event.preventDefault();
        logger.warn(`Blocked navigation to: ${navigationUrl}`);
      }
    });

    contents.on('will-attach-webview', (event) => {
      event.preventDefault();
      logger.warn('Blocked webview attachment attempt');
    });

    contents.on('new-window', (event) => {
      event.preventDefault();
      logger.warn('Blocked new window creation');
    });
  });

  // Handle uncaught exceptions
  process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', error);
    dialog.showErrorBox('Uncaught Exception', error.message);
  });

  process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled Rejection:', reason);
  });

  logger.info('Application bootstrap completed');
}
