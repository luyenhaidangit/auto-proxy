/**
 * Type definitions for the API exposed through contextBridge
 * This ensures type safety between main and renderer processes
 */

export interface AppInfo {
  name: string;
  version: string;
  platform: string;
  arch: string;
}

export interface FileInfo {
  name: string;
  path: string;
  size: number;
  lastModified: number;
}

export interface Settings {
  theme: 'light' | 'dark' | 'system';
  language: string;
  autoStart: boolean;
  recentFiles: string[];
  windowBounds: {
    width: number;
    height: number;
    x?: number;
    y?: number;
  };
}

export interface ProxyConfig {
  enabled: boolean;
  host: string;
  port: number;
  username?: string;
  password?: string;
  type: 'http' | 'https' | 'socks4' | 'socks5';
}

/**
 * Main API interface exposed to renderer
 */
export interface Api {
  // App information
  getAppInfo(): Promise<AppInfo>;
  
  // File operations
  readFileText(filePath: string): Promise<string>;
  writeFileText(filePath: string, content: string): Promise<void>;
  selectFile(options?: {
    title?: string;
    filters?: Array<{ name: string; extensions: string[] }>;
  }): Promise<string | null>;
  selectFolder(options?: {
    title?: string;
  }): Promise<string | null>;
  
  // Settings management
  getSettings(): Promise<Settings>;
  saveSettings(settings: Partial<Settings>): Promise<void>;
  resetSettings(): Promise<void>;
  
  // Proxy configuration
  getProxyConfig(): Promise<ProxyConfig>;
  saveProxyConfig(config: ProxyConfig): Promise<void>;
  testProxyConnection(config: ProxyConfig): Promise<boolean>;
  
  // System operations
  showMessageBox(options: {
    type?: 'info' | 'warning' | 'error' | 'question';
    title?: string;
    message: string;
    detail?: string;
    buttons?: string[];
  }): Promise<number>;
  
  showOpenDialog(options?: {
    title?: string;
    defaultPath?: string;
    filters?: Array<{ name: string; extensions: string[] }>;
    properties?: Array<'openFile' | 'openDirectory' | 'multiSelections'>;
  }): Promise<string[] | null>;
  
  showSaveDialog(options?: {
    title?: string;
    defaultPath?: string;
    filters?: Array<{ name: string; extensions: string[] }>;
  }): Promise<string | null>;
  
  // Window operations
  minimizeWindow(): void;
  maximizeWindow(): void;
  closeWindow(): void;
  isWindowMaximized(): Promise<boolean>;
  
  // Events
  onWindowMaximize(callback: () => void): void;
  onWindowUnmaximize(callback: () => void): void;
  onWindowMinimize(callback: () => void): void;
  onWindowRestore(callback: () => void): void;
  
  // Remove event listeners
  removeAllListeners(channel: string): void;
}

/**
 * Global window interface extension
 */
declare global {
  interface Window {
    api: Api;
  }
}
