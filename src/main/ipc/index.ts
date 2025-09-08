import { logger } from '../logger.js';
import { setupWindowEventListeners } from './windowHandlers.js';

/**
 * Register all IPC handlers
 */
export function registerIpcHandlers(): void {
  try {
    // Import all handler modules to register their IPC handlers
    import('./appHandlers.js');
    import('./fsHandlers.js');
    import('./settingsHandlers.js');
    import('./proxyHandlers.js');
    import('./windowHandlers.js');
    
    // Setup window event listeners
    setupWindowEventListeners();
    
    logger.info('All IPC handlers registered successfully');
  } catch (error) {
    logger.error('Failed to register IPC handlers:', error);
    throw error;
  }
}
