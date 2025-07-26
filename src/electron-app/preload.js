const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
    // App settings
    getAppSettings: () => ipcRenderer.invoke('get-app-settings'),
    saveAppSettings: (settings) => ipcRenderer.invoke('save-app-settings', settings),

    // File operations
    exportKeys: (data) => ipcRenderer.invoke('export-keys', data),
    importKeys: () => ipcRenderer.invoke('import-keys'),

    // Menu events
    onMenuExportKeys: (callback) => ipcRenderer.on('menu-export-keys', callback),
    onMenuImportKeys: (callback) => ipcRenderer.on('menu-import-keys', callback),

    // Remove listeners
    removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel)
}); 