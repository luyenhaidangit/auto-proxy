import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../../src/renderer/App';

// Mock the API
const mockApi = {
  getAppInfo: vi.fn(),
  getSettings: vi.fn(),
  getProxyConfig: vi.fn(),
  saveSettings: vi.fn(),
  saveProxyConfig: vi.fn(),
  showMessageBox: vi.fn(),
  minimizeWindow: vi.fn(),
  maximizeWindow: vi.fn(),
  closeWindow: vi.fn(),
  isWindowMaximized: vi.fn(),
  onWindowMaximize: vi.fn(),
  onWindowUnmaximize: vi.fn(),
  onWindowMinimize: vi.fn(),
  onWindowRestore: vi.fn(),
  removeAllListeners: vi.fn(),
  readFileText: vi.fn(),
  writeFileText: vi.fn(),
  selectFile: vi.fn(),
  selectFolder: vi.fn(),
  showOpenDialog: vi.fn(),
  showSaveDialog: vi.fn(),
  testProxyConnection: vi.fn()
};

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup default mock responses
    mockApi.getAppInfo.mockResolvedValue({
      name: 'Auto Proxy',
      version: '0.1.0',
      platform: 'win32',
      arch: 'x64'
    });
    
    mockApi.getSettings.mockResolvedValue({
      theme: 'system',
      language: 'en',
      autoStart: false,
      recentFiles: [],
      windowBounds: { width: 1200, height: 800 }
    });
    
    mockApi.getProxyConfig.mockResolvedValue({
      enabled: false,
      host: '127.0.0.1',
      port: 8080,
      type: 'http'
    });
    
    // Mock window.api
    (window as any).api = mockApi;
  });

  it('renders loading state initially', () => {
    render(<App />);
    expect(screen.getByText('Loading Auto Proxy...')).toBeInTheDocument();
  });

  it('renders app title in header', async () => {
    render(<App />);
    
    // Wait for loading to complete
    await screen.findByText('Auto Proxy');
    
    expect(screen.getByText('Auto Proxy')).toBeInTheDocument();
  });

  it('displays app version and platform info', async () => {
    render(<App />);
    
    await screen.findByText('Auto Proxy');
    
    expect(screen.getByText(/v0\.1\.0/)).toBeInTheDocument();
    expect(screen.getByText(/win32/)).toBeInTheDocument();
    expect(screen.getByText(/x64/)).toBeInTheDocument();
  });

  it('shows navigation tabs', async () => {
    render(<App />);
    
    await screen.findByText('Auto Proxy');
    
    expect(screen.getByText('Proxy Settings')).toBeInTheDocument();
    expect(screen.getByText('File Manager')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('handles initialization errors gracefully', async () => {
    mockApi.getAppInfo.mockRejectedValue(new Error('API Error'));
    mockApi.showMessageBox.mockResolvedValue(0);
    
    render(<App />);
    
    // Should show error dialog
    expect(mockApi.showMessageBox).toHaveBeenCalledWith({
      type: 'error',
      title: 'Initialization Error',
      message: 'Failed to initialize the application',
      detail: 'API Error'
    });
  });
});
