import { vi } from 'vitest';

// Mock Electron APIs for testing
global.window = {
  api: {
    getAppInfo: vi.fn().mockResolvedValue({
      name: 'Auto Proxy',
      version: '0.1.0',
      platform: 'win32',
      arch: 'x64'
    }),
    getSettings: vi.fn().mockResolvedValue({
      theme: 'system',
      language: 'en',
      autoStart: false,
      recentFiles: [],
      windowBounds: { width: 1200, height: 800 }
    }),
    saveSettings: vi.fn().mockResolvedValue(undefined),
    getProxyConfig: vi.fn().mockResolvedValue({
      enabled: false,
      host: '127.0.0.1',
      port: 8080,
      type: 'http'
    }),
    saveProxyConfig: vi.fn().mockResolvedValue(undefined),
    testProxyConnection: vi.fn().mockResolvedValue(true),
    readFileText: vi.fn().mockResolvedValue('test content'),
    writeFileText: vi.fn().mockResolvedValue(undefined),
    selectFile: vi.fn().mockResolvedValue('/path/to/file.txt'),
    selectFolder: vi.fn().mockResolvedValue('/path/to/folder'),
    showMessageBox: vi.fn().mockResolvedValue(0),
    showOpenDialog: vi.fn().mockResolvedValue(['/path/to/file.txt']),
    showSaveDialog: vi.fn().mockResolvedValue('/path/to/save.txt'),
    minimizeWindow: vi.fn(),
    maximizeWindow: vi.fn(),
    closeWindow: vi.fn(),
    isWindowMaximized: vi.fn().mockResolvedValue(false),
    onWindowMaximize: vi.fn(),
    onWindowUnmaximize: vi.fn(),
    onWindowMinimize: vi.fn(),
    onWindowRestore: vi.fn(),
    removeAllListeners: vi.fn()
  }
} as any;

// Mock matchMedia for theme detection
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});
