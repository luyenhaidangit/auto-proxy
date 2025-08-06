// Main App Controller
class App {
    constructor() {
        this.currentPage = 'proxy-list';
        this.settings = {};
        this.proxyManager = null;
        this.uiManager = null;
        this.exportManager = null;

        this.init();
    }

    async init() {
        try {
            // Load settings
            await this.loadSettings();

            // Initialize managers
            this.proxyManager = new ProxyManager();
            this.uiManager = new UIManager();
            this.exportManager = new ExportManager();

            // Setup event listeners
            this.setupEventListeners();

            // Load initial data
            await this.loadInitialData();

            console.log('VN Proxy Manager initialized successfully');
        } catch (error) {
            console.error('Failed to initialize app:', error);
        }
    }

    async loadSettings() {
        try {
            this.settings = await window.electronAPI.getAppSettings();
            this.applySettings();
        } catch (error) {
            console.error('Failed to load settings:', error);
            this.settings = {
                localAddress: '127.0.0.1',
                theme: 'dark',
                language: 'vi'
            };
        }
    }

    applySettings() {
        // Apply theme
        document.body.className = `${this.settings.theme}-theme`;

        // Apply local address
        const localAddressSelect = document.getElementById('localAddress');
        if (localAddressSelect) {
            localAddressSelect.value = this.settings.localAddress;
        }

        // Apply language
        this.applyLanguage(this.settings.language);
    }

    applyLanguage(language) {
        // Language translations would go here
        // For now, we'll keep Vietnamese as default
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const page = e.currentTarget.dataset.page;
                this.navigateToPage(page);
            });
        });

        // Settings changes
        const localAddressSelect = document.getElementById('localAddress');
        if (localAddressSelect) {
            localAddressSelect.addEventListener('change', (e) => {
                this.settings.localAddress = e.target.value;
                this.saveSettings();
            });
        }

        const themeSelect = document.getElementById('themeSelect');
        if (themeSelect) {
            themeSelect.addEventListener('change', (e) => {
                this.settings.theme = e.target.value;
                this.applySettings();
                this.saveSettings();
            });
        }

        const languageSelect = document.getElementById('languageSelect');
        if (languageSelect) {
            languageSelect.addEventListener('change', (e) => {
                this.settings.language = e.target.value;
                this.applyLanguage(e.target.value);
                this.saveSettings();
            });
        }

        // Menu events
        window.electronAPI.onMenuExportKeys(() => {
            this.exportManager.showExportModal();
        });

        window.electronAPI.onMenuImportKeys(() => {
            this.proxyManager.importKeys();
        });

        // Chat support
        const chatSupport = document.querySelector('.chat-support');
        if (chatSupport) {
            chatSupport.addEventListener('click', () => {
                this.showChatSupport();
            });
        }
    }

    navigateToPage(page) {
        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-page="${page}"]`).classList.add('active');

        // Update page content
        document.querySelectorAll('.page').forEach(pageEl => {
            pageEl.classList.remove('active');
        });
        document.getElementById(`${page}-page`).classList.add('active');

        // Update page title
        const pageTitle = document.getElementById('page-title');
        if (pageTitle) {
            const titles = {
                'proxy-list': 'Danh sách Proxy',
                'checker': 'Proxy Checker',
                'request': 'Proxy Request',
                'settings': 'Cài đặt'
            };
            pageTitle.textContent = titles[page] || 'VN Proxy Manager';
        }

        this.currentPage = page;
    }

    async loadInitialData() {
        // Không load dữ liệu mặc định - chỉ load từ keys thực tế
        console.log('App initialized - waiting for user to add keys');
    }

    async saveSettings() {
        try {
            await window.electronAPI.saveAppSettings(this.settings);
        } catch (error) {
            console.error('Failed to save settings:', error);
        }
    }

    showChatSupport() {
        // This would integrate with a chat system
        alert('Chat support feature coming soon!');
    }

    // Utility methods
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;

        // Add to page
        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    showLoading() {
        // Show loading indicator
        const loading = document.createElement('div');
        loading.className = 'loading-overlay';
        loading.innerHTML = '<div class="spinner"></div>';
        document.body.appendChild(loading);
    }

    hideLoading() {
        // Hide loading indicator
        const loading = document.querySelector('.loading-overlay');
        if (loading) {
            loading.remove();
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});

// Handle window focus/blur for better UX
window.addEventListener('focus', () => {
    // Không tự động refresh data
    console.log('Window focused');
}); 