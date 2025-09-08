import { ipcMain } from 'electron';
import { z } from 'zod';
import { logger } from '../logger.js';
import { loadSettings, saveSettings, resetSettings } from '../services/settingsService.js';
import type { Settings } from '../../preload/api-schema.js';

/**
 * Validation schema for settings
 */
const settingsSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']).optional(),
  language: z.string().optional(),
  autoStart: z.boolean().optional(),
  recentFiles: z.array(z.string()).optional(),
  windowBounds: z.object({
    width: z.number().min(400).max(4000).optional(),
    height: z.number().min(300).max(3000).optional(),
    x: z.number().optional(),
    y: z.number().optional()
  }).optional()
});

/**
 * Get application settings
 */
ipcMain.handle('settings:get', async () => {
  try {
    const settings = await loadSettings();
    logger.info('Settings retrieved successfully');
    return settings;
  } catch (error) {
    logger.error('Failed to get settings:', error);
    throw new Error(`Failed to get settings: ${(error as Error).message}`);
  }
});

/**
 * Save application settings
 */
ipcMain.handle('settings:save', async (_, settings: Partial<Settings>) => {
  try {
    // Validate settings
    const validatedSettings = settingsSchema.parse(settings);
    
    await saveSettings(validatedSettings);
    logger.info('Settings saved successfully');
  } catch (error) {
    logger.error('Failed to save settings:', error);
    throw new Error(`Failed to save settings: ${(error as Error).message}`);
  }
});

/**
 * Reset settings to defaults
 */
ipcMain.handle('settings:reset', async () => {
  try {
    await resetSettings();
    logger.info('Settings reset successfully');
  } catch (error) {
    logger.error('Failed to reset settings:', error);
    throw new Error(`Failed to reset settings: ${(error as Error).message}`);
  }
});
