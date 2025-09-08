import { contextBridge, ipcRenderer } from 'electron';
import type { Api } from './api-schema.js';

/**
 * Secure API bridge between main and renderer processes
 * Only exposes necessary functionality through contextBridge
 */
const api: Api = {
  // App information
  getAppInfo: () => ipcRenderer.invoke('app:getInfo'),
  
  // File operations
  readFileText: (filePath: string) => ipcRenderer.invoke('fs:readFileText', filePath),
  writeFileText: (filePath: string, content: string) => 
    ipcRenderer.invoke('fs:writeFileText', filePath, content),
  selectFile: (options) => ipcRenderer.invoke('dialog:selectFile', options),
  selectFolder: (options) => ipcRenderer.invoke('dialog:selectFolder', options),
  
  // Settings management
  getSettings: () => ipcRenderer.invoke('settings:get'),
  saveSettings: (settings) => ipcRenderer.invoke('settings:save', settings),
  resetSettings: () => ipcRenderer.invoke('settings:reset'),
  
  // Proxy configuration
  getProxyConfig: () => ipcRenderer.invoke('proxy:getConfig'),
  saveProxyConfig: (config) => ipcRenderer.invoke('proxy:saveConfig', config),
  testProxyConnection: (config) => ipcRenderer.invoke('proxy:testConnection', config),
  
  // System operations
  showMessageBox: (options) => ipcRenderer.invoke('dialog:showMessageBox', options),
  showOpenDialog: (options) => ipcRenderer.invoke('dialog:showOpenDialog', options),
  showSaveDialog: (options) => ipcRenderer.invoke('dialog:showSaveDialog', options),
  
  // Window operations
  minimizeWindow: () => ipcRenderer.invoke('window:minimize'),
  maximizeWindow: () => ipcRenderer.invoke('window:maximize'),
  closeWindow: () => ipcRenderer.invoke('window:close'),
  isWindowMaximized: () => ipcRenderer.invoke('window:isMaximized'),
  
  // Events
  onWindowMaximize: (callback) => {
    ipcRenderer.on('window:maximized', callback);
  },
  onWindowUnmaximize: (callback) => {
    ipcRenderer.on('window:unmaximized', callback);
  },
  onWindowMinimize: (callback) => {
    ipcRenderer.on('window:minimized', callback);
  },
  onWindowRestore: (callback) => {
    ipcRenderer.on('window:restored', callback);
  },
  
  // Remove event listeners
  removeAllListeners: (channel: string) => {
    ipcRenderer.removeAllListeners(channel);
  }
};

// Expose API to renderer process
contextBridge.exposeInMainWorld('api', api);

// Log successful preload
console.log('Preload script loaded successfully');
