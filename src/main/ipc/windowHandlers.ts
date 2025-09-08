import { ipcMain, BrowserWindow } from 'electron';
import { logger } from '../logger.js';

/**
 * Get the main window instance
 */
function getMainWindow(): BrowserWindow | null {
  const windows = BrowserWindow.getAllWindows();
  return windows.length > 0 ? windows[0] : null;
}

/**
 * Minimize window
 */
ipcMain.handle('window:minimize', () => {
  const mainWindow = getMainWindow();
  if (mainWindow) {
    mainWindow.minimize();
    logger.info('Window minimized');
  }
});

/**
 * Maximize/restore window
 */
ipcMain.handle('window:maximize', () => {
  const mainWindow = getMainWindow();
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
      logger.info('Window unmaximized');
    } else {
      mainWindow.maximize();
      logger.info('Window maximized');
    }
  }
});

/**
 * Close window
 */
ipcMain.handle('window:close', () => {
  const mainWindow = getMainWindow();
  if (mainWindow) {
    mainWindow.close();
    logger.info('Window closed');
  }
});

/**
 * Check if window is maximized
 */
ipcMain.handle('window:isMaximized', () => {
  const mainWindow = getMainWindow();
  if (mainWindow) {
    return mainWindow.isMaximized();
  }
  return false;
});

/**
 * Setup window event listeners
 */
export function setupWindowEventListeners(): void {
  const mainWindow = getMainWindow();
  if (!mainWindow) return;

  mainWindow.on('maximize', () => {
    mainWindow.webContents.send('window:maximized');
    logger.info('Window maximized event sent');
  });

  mainWindow.on('unmaximize', () => {
    mainWindow.webContents.send('window:unmaximized');
    logger.info('Window unmaximized event sent');
  });

  mainWindow.on('minimize', () => {
    mainWindow.webContents.send('window:minimized');
    logger.info('Window minimized event sent');
  });

  mainWindow.on('restore', () => {
    mainWindow.webContents.send('window:restored');
    logger.info('Window restored event sent');
  });
}
