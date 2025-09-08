import { ipcMain } from 'electron';
import { z } from 'zod';
import { logger } from '../logger.js';
import { 
  getProxyConfig, 
  saveProxyConfig, 
  testProxyConnection 
} from '../services/proxyService.js';
import type { ProxyConfig } from '../../preload/api-schema.js';

/**
 * Validation schema for proxy configuration
 */
const proxyConfigSchema = z.object({
  enabled: z.boolean(),
  host: z.string().min(1, 'Host is required'),
  port: z.number().min(1).max(65535, 'Port must be between 1 and 65535'),
  username: z.string().optional(),
  password: z.string().optional(),
  type: z.enum(['http', 'https', 'socks4', 'socks5'])
});

/**
 * Get proxy configuration
 */
ipcMain.handle('proxy:getConfig', async () => {
  try {
    const config = getProxyConfig();
    logger.info('Proxy configuration retrieved');
    return config;
  } catch (error) {
    logger.error('Failed to get proxy config:', error);
    throw new Error(`Failed to get proxy config: ${(error as Error).message}`);
  }
});

/**
 * Save proxy configuration
 */
ipcMain.handle('proxy:saveConfig', async (_, config: ProxyConfig) => {
  try {
    // Validate configuration
    const validatedConfig = proxyConfigSchema.parse(config);
    
    saveProxyConfig(validatedConfig);
    logger.info('Proxy configuration saved');
  } catch (error) {
    logger.error('Failed to save proxy config:', error);
    throw new Error(`Failed to save proxy config: ${(error as Error).message}`);
  }
});

/**
 * Test proxy connection
 */
ipcMain.handle('proxy:testConnection', async (_, config: ProxyConfig) => {
  try {
    // Validate configuration
    const validatedConfig = proxyConfigSchema.parse(config);
    
    const isConnected = await testProxyConnection(validatedConfig);
    logger.info(`Proxy connection test result: ${isConnected}`);
    return isConnected;
  } catch (error) {
    logger.error('Failed to test proxy connection:', error);
    throw new Error(`Failed to test proxy connection: ${(error as Error).message}`);
  }
});
