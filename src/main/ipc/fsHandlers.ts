import { ipcMain, dialog } from 'electron';
import { readFile, writeFile, access } from 'node:fs/promises';
import { constants } from 'node:fs';
import { z } from 'zod';
import { logger } from '../logger.js';
import { addRecentFile } from '../services/settingsService.js';

/**
 * Validation schemas for file operations
 */
const filePathSchema = z.string().min(1, 'File path is required');
const fileContentSchema = z.string();

/**
 * Read text file content
 */
ipcMain.handle('fs:readFileText', async (_, filePath: string) => {
  try {
    // Validate input
    const validatedPath = filePathSchema.parse(filePath);
    
    // Check if file exists and is readable
    await access(validatedPath, constants.R_OK);
    
    const content = await readFile(validatedPath, 'utf8');
    
    // Add to recent files
    await addRecentFile(validatedPath);
    
    logger.info(`File read successfully: ${validatedPath}`);
    return content;
  } catch (error) {
    logger.error('Failed to read file:', error);
    throw new Error(`Failed to read file: ${(error as Error).message}`);
  }
});

/**
 * Write text content to file
 */
ipcMain.handle('fs:writeFileText', async (_, filePath: string, content: string) => {
  try {
    // Validate inputs
    const validatedPath = filePathSchema.parse(filePath);
    const validatedContent = fileContentSchema.parse(content);
    
    await writeFile(validatedPath, validatedContent, 'utf8');
    
    // Add to recent files
    await addRecentFile(validatedPath);
    
    logger.info(`File written successfully: ${validatedPath}`);
  } catch (error) {
    logger.error('Failed to write file:', error);
    throw new Error(`Failed to write file: ${(error as Error).message}`);
  }
});

/**
 * Show file selection dialog
 */
ipcMain.handle('dialog:selectFile', async (_, options?: {
  title?: string;
  filters?: Array<{ name: string; extensions: string[] }>;
}) => {
  try {
    const result = await dialog.showOpenDialog({
      title: options?.title || 'Select File',
      filters: options?.filters || [
        { name: 'All Files', extensions: ['*'] },
        { name: 'Text Files', extensions: ['txt', 'md', 'json', 'js', 'ts', 'html', 'css'] }
      ],
      properties: ['openFile']
    });
    
    if (result.canceled) {
      return null;
    }
    
    const filePath = result.filePaths[0];
    logger.info(`File selected: ${filePath}`);
    return filePath;
  } catch (error) {
    logger.error('Failed to show file dialog:', error);
    throw new Error(`Failed to show file dialog: ${(error as Error).message}`);
  }
});

/**
 * Show folder selection dialog
 */
ipcMain.handle('dialog:selectFolder', async (_, options?: {
  title?: string;
}) => {
  try {
    const result = await dialog.showOpenDialog({
      title: options?.title || 'Select Folder',
      properties: ['openDirectory']
    });
    
    if (result.canceled) {
      return null;
    }
    
    const folderPath = result.filePaths[0];
    logger.info(`Folder selected: ${folderPath}`);
    return folderPath;
  } catch (error) {
    logger.error('Failed to show folder dialog:', error);
    throw new Error(`Failed to show folder dialog: ${(error as Error).message}`);
  }
});

/**
 * Show open dialog (multiple files)
 */
ipcMain.handle('dialog:showOpenDialog', async (_, options?: {
  title?: string;
  defaultPath?: string;
  filters?: Array<{ name: string; extensions: string[] }>;
  properties?: Array<'openFile' | 'openDirectory' | 'multiSelections'>;
}) => {
  try {
    const result = await dialog.showOpenDialog({
      title: options?.title || 'Open',
      defaultPath: options?.defaultPath,
      filters: options?.filters || [
        { name: 'All Files', extensions: ['*'] }
      ],
      properties: options?.properties || ['openFile']
    });
    
    if (result.canceled) {
      return null;
    }
    
    logger.info(`Files selected: ${result.filePaths.length} files`);
    return result.filePaths;
  } catch (error) {
    logger.error('Failed to show open dialog:', error);
    throw new Error(`Failed to show open dialog: ${(error as Error).message}`);
  }
});

/**
 * Show save dialog
 */
ipcMain.handle('dialog:showSaveDialog', async (_, options?: {
  title?: string;
  defaultPath?: string;
  filters?: Array<{ name: string; extensions: string[] }>;
}) => {
  try {
    const result = await dialog.showSaveDialog({
      title: options?.title || 'Save',
      defaultPath: options?.defaultPath,
      filters: options?.filters || [
        { name: 'All Files', extensions: ['*'] }
      ]
    });
    
    if (result.canceled) {
      return null;
    }
    
    const filePath = result.filePath;
    logger.info(`Save path selected: ${filePath}`);
    return filePath;
  } catch (error) {
    logger.error('Failed to show save dialog:', error);
    throw new Error(`Failed to show save dialog: ${(error as Error).message}`);
  }
});
