import { app } from 'electron';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { logger } from '../logger.js';
import type { Settings } from '../../preload/api-schema.js';

const SETTINGS_FILE = 'settings.json';

/**
 * Default application settings
 */
const DEFAULT_SETTINGS: Settings = {
  theme: 'system',
  language: 'en',
  autoStart: false,
  recentFiles: [],
  windowBounds: {
    width: 1200,
    height: 800
  }
};

/**
 * Get the settings file path
 */
function getSettingsPath(): string {
  return path.join(app.getPath('userData'), SETTINGS_FILE);
}

/**
 * Load settings from file
 */
export async function loadSettings(): Promise<Settings> {
  try {
    const settingsPath = getSettingsPath();
    const data = await readFile(settingsPath, 'utf8');
    const settings = JSON.parse(data) as Settings;
    
    // Merge with defaults to handle new settings
    const mergedSettings = { ...DEFAULT_SETTINGS, ...settings };
    
    logger.info('Settings loaded successfully');
    return mergedSettings;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      logger.info('Settings file not found, using defaults');
      return DEFAULT_SETTINGS;
    }
    
    logger.error('Failed to load settings:', error);
    return DEFAULT_SETTINGS;
  }
}

/**
 * Save settings to file
 */
export async function saveSettings(settings: Partial<Settings>): Promise<void> {
  try {
    const settingsPath = getSettingsPath();
    const currentSettings = await loadSettings();
    const updatedSettings = { ...currentSettings, ...settings };
    
    // Ensure userData directory exists
    await mkdir(app.getPath('userData'), { recursive: true });
    
    await writeFile(settingsPath, JSON.stringify(updatedSettings, null, 2), 'utf8');
    
    logger.info('Settings saved successfully');
  } catch (error) {
    logger.error('Failed to save settings:', error);
    throw new Error('Failed to save settings');
  }
}

/**
 * Reset settings to defaults
 */
export async function resetSettings(): Promise<void> {
  try {
    const settingsPath = getSettingsPath();
    await writeFile(settingsPath, JSON.stringify(DEFAULT_SETTINGS, null, 2), 'utf8');
    
    logger.info('Settings reset to defaults');
  } catch (error) {
    logger.error('Failed to reset settings:', error);
    throw new Error('Failed to reset settings');
  }
}

/**
 * Add file to recent files list
 */
export async function addRecentFile(filePath: string): Promise<void> {
  try {
    const settings = await loadSettings();
    const recentFiles = settings.recentFiles.filter(path => path !== filePath);
    recentFiles.unshift(filePath);
    
    // Keep only last 10 files
    const updatedRecentFiles = recentFiles.slice(0, 10);
    
    await saveSettings({ recentFiles: updatedRecentFiles });
    
    logger.info(`Added to recent files: ${filePath}`);
  } catch (error) {
    logger.error('Failed to add recent file:', error);
  }
}
