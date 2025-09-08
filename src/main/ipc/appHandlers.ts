import { ipcMain, app, dialog } from 'electron';
import { logger } from '../logger.js';
import type { AppInfo } from '../../preload/api-schema.js';

/**
 * Get application information
 */
ipcMain.handle('app:getInfo', async (): Promise<AppInfo> => {
  try {
    const appInfo: AppInfo = {
      name: app.getName(),
      version: app.getVersion(),
      platform: process.platform,
      arch: process.arch
    };
    
    logger.info('App info retrieved:', appInfo);
    return appInfo;
  } catch (error) {
    logger.error('Failed to get app info:', error);
    throw new Error(`Failed to get app info: ${(error as Error).message}`);
  }
});

/**
 * Show message box dialog
 */
ipcMain.handle('dialog:showMessageBox', async (_, options: {
  type?: 'info' | 'warning' | 'error' | 'question';
  title?: string;
  message: string;
  detail?: string;
  buttons?: string[];
}) => {
  try {
    const result = await dialog.showMessageBox({
      type: options.type || 'info',
      title: options.title || 'Auto Proxy',
      message: options.message,
      detail: options.detail,
      buttons: options.buttons || ['OK']
    });
    
    logger.info(`Message box shown: ${options.message}, response: ${result.response}`);
    return result.response;
  } catch (error) {
    logger.error('Failed to show message box:', error);
    throw new Error(`Failed to show message box: ${(error as Error).message}`);
  }
});
