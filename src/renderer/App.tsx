import React, { useState, useEffect } from 'react';
import { AppInfo, Settings, ProxyConfig } from '../preload/api-schema';
import Header from './components/Header';
import ProxySettings from './components/ProxySettings';
import FileManager from './components/FileManager';
import SettingsPanel from './components/SettingsPanel';
import { useTheme } from './hooks/useTheme';

const App: React.FC = () => {
  const [appInfo, setAppInfo] = useState<AppInfo | null>(null);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [proxyConfig, setProxyConfig] = useState<ProxyConfig | null>(null);
  const [activeTab, setActiveTab] = useState<'proxy' | 'files' | 'settings'>('proxy');
  const [loading, setLoading] = useState(true);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      setLoading(true);
      
      // Load app info, settings, and proxy config in parallel
      const [appInfoData, settingsData, proxyConfigData] = await Promise.all([
        window.api.getAppInfo(),
        window.api.getSettings(),
        window.api.getProxyConfig()
      ]);

      setAppInfo(appInfoData);
      setSettings(settingsData);
      setProxyConfig(proxyConfigData);
      
      // Apply theme from settings
      if (settingsData.theme && settingsData.theme !== 'system') {
        document.documentElement.setAttribute('data-theme', settingsData.theme);
      }
      
    } catch (error) {
      console.error('Failed to initialize app:', error);
      await window.api.showMessageBox({
        type: 'error',
        title: 'Initialization Error',
        message: 'Failed to initialize the application',
        detail: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSettingsChange = async (newSettings: Partial<Settings>) => {
    try {
      await window.api.saveSettings(newSettings);
      setSettings(prev => prev ? { ...prev, ...newSettings } : null);
      
      // Apply theme change immediately
      if (newSettings.theme) {
        document.documentElement.setAttribute('data-theme', newSettings.theme);
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
      await window.api.showMessageBox({
        type: 'error',
        title: 'Settings Error',
        message: 'Failed to save settings',
        detail: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  const handleProxyConfigChange = async (newConfig: ProxyConfig) => {
    try {
      await window.api.saveProxyConfig(newConfig);
      setProxyConfig(newConfig);
    } catch (error) {
      console.error('Failed to save proxy config:', error);
      await window.api.showMessageBox({
        type: 'error',
        title: 'Proxy Error',
        message: 'Failed to save proxy configuration',
        detail: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="text-center">
          <div className="spinner" style={{ margin: '0 auto 16px' }}></div>
          <div>Loading Auto Proxy...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header 
        appInfo={appInfo}
        theme={theme}
        onThemeToggle={toggleTheme}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      
      <main style={{ flex: 1, overflow: 'hidden' }}>
        <div className="container" style={{ height: '100%', padding: '16px' }}>
          {activeTab === 'proxy' && (
            <ProxySettings
              config={proxyConfig}
              onConfigChange={handleProxyConfigChange}
            />
          )}
          
          {activeTab === 'files' && (
            <FileManager />
          )}
          
          {activeTab === 'settings' && (
            <SettingsPanel
              settings={settings}
              onSettingsChange={handleSettingsChange}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
