// UI Manager - Handles UI interactions and animations
class UIManager {
    constructor() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Modal close buttons
        const closeButtons = document.querySelectorAll('.close-btn');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.closeModal(e.target.closest('.modal'));
            });
        });

        // Click outside modal to close
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                // Don't close add key modal when clicking outside
                if (e.target.id === 'addKeyModal') {
                    return;
                }
                this.closeModal(e.target);
            }
        });

        // Export modal option buttons
        const optionButtons = document.querySelectorAll('.option-btn');
        optionButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.toggleOptionButton(e.target);
            });
        });

        // Download button
        const downloadBtn = document.getElementById('downloadBtn');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => {
                this.handleDownload();
            });
        }
    }

    closeModal(modal) {
        if (modal) {
            modal.classList.remove('active');
        }
    }

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
        }
    }

    toggleOptionButton(button) {
        button.classList.toggle('active');
    }

    handleDownload() {
        const exportContent = document.getElementById('exportContent');
        if (exportContent && exportContent.value.trim()) {
            // Create download link
            const blob = new Blob([exportContent.value], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'proxy-keys.txt';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            window.app.showNotification('Đã tải xuống thành công', 'success');
            this.closeModal(document.getElementById('exportModal'));
        } else {
            window.app.showNotification('Không có nội dung để tải xuống', 'warning');
        }
    }

    // Animation utilities
    fadeIn(element, duration = 300) {
        element.style.opacity = '0';
        element.style.display = 'block';

        let start = null;
        const animate = (timestamp) => {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const opacity = Math.min(progress / duration, 1);

            element.style.opacity = opacity;

            if (progress < duration) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }

    fadeOut(element, duration = 300) {
        let start = null;
        const initialOpacity = parseFloat(getComputedStyle(element).opacity);

        const animate = (timestamp) => {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const opacity = Math.max(initialOpacity - (progress / duration), 0);

            element.style.opacity = opacity;

            if (progress < duration) {
                requestAnimationFrame(animate);
            } else {
                element.style.display = 'none';
            }
        };

        requestAnimationFrame(animate);
    }

    // Loading animations
    showLoadingSpinner(container) {
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        spinner.innerHTML = '<div class="spinner"></div>';
        container.appendChild(spinner);
    }

    hideLoadingSpinner(container) {
        const spinner = container.querySelector('.loading-spinner');
        if (spinner) {
            spinner.remove();
        }
    }

    // Table utilities
    highlightRow(row) {
        row.style.backgroundColor = '#4a9eff20';
        setTimeout(() => {
            row.style.backgroundColor = '';
        }, 1000);
    }

    // Notification system
    showToast(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;

        // Add styles
        toast.style.position = 'fixed';
        toast.style.top = '20px';
        toast.style.right = '20px';
        toast.style.padding = '12px 20px';
        toast.style.borderRadius = '6px';
        toast.style.color = '#ffffff';
        toast.style.fontSize = '14px';
        toast.style.zIndex = '10000';
        toast.style.transform = 'translateX(100%)';
        toast.style.transition = 'transform 0.3s ease';

        // Set background color based on type
        const colors = {
            'success': '#28a745',
            'error': '#dc3545',
            'warning': '#ffc107',
            'info': '#4a9eff'
        };
        toast.style.backgroundColor = colors[type] || colors.info;

        document.body.appendChild(toast);

        // Animate in
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 100);

        // Remove after duration
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, duration);
    }

    // Form validation
    validateForm(formData) {
        const errors = [];

        // Add validation logic here
        if (!formData.key) {
            errors.push('Key is required');
        }

        return errors;
    }

    // Data formatting
    formatDate(date) {
        return new Date(date).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Responsive utilities
    isMobile() {
        return window.innerWidth < 768;
    }

    isTablet() {
        return window.innerWidth >= 768 && window.innerWidth < 1024;
    }

    isDesktop() {
        return window.innerWidth >= 1024;
    }

    // Theme utilities
    setTheme(theme) {
        document.body.className = `${theme}-theme`;
        localStorage.setItem('theme', theme);
    }

    getTheme() {
        return localStorage.getItem('theme') || 'dark';
    }

    // Keyboard shortcuts
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + E: Export
            if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
                e.preventDefault();
                if (window.app && window.app.exportManager) {
                    window.app.exportManager.showExportModal();
                }
            }

            // Ctrl/Cmd + I: Import
            if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
                e.preventDefault();
                if (window.app && window.app.proxyManager) {
                    window.app.proxyManager.importKeys();
                }
            }

            // Escape: Close modals
            if (e.key === 'Escape') {
                const activeModal = document.querySelector('.modal.active');
                if (activeModal) {
                    this.closeModal(activeModal);
                }
            }
        });
    }

    // Initialize UI
    init() {
        this.setupKeyboardShortcuts();
        this.setTheme(this.getTheme());

        // Add CSS for additional styles
        this.addAdditionalStyles();
    }

    addAdditionalStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .loading-spinner {
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 20px;
            }
            
            .spinner {
                width: 40px;
                height: 40px;
                border: 4px solid #404040;
                border-top: 4px solid #4a9eff;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            .btn-icon {
                background: none;
                border: none;
                color: #cccccc;
                cursor: pointer;
                padding: 4px 8px;
                border-radius: 4px;
                transition: all 0.3s ease;
            }
            
            .btn-icon:hover {
                background: #404040;
                color: #ffffff;
            }
            
            .btn-sm {
                padding: 6px 12px;
                font-size: 12px;
            }
            
            .key-container {
                display: flex;
                flex-direction: column;
                gap: 4px;
            }
            
            .key-type {
                background: #404040;
                border: 1px solid #555555;
                color: #ffffff;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 12px;
            }
            
            .key-value {
                font-family: monospace;
                font-size: 12px;
                color: #4a9eff;
                cursor: pointer;
                padding: 4px;
                border-radius: 4px;
                transition: background 0.3s ease;
            }
            
            .key-value:hover {
                background: #404040;
            }
            
            .status-container {
                display: flex;
                flex-direction: column;
                gap: 2px;
            }
            
            .status-timer {
                font-size: 11px;
                color: #cccccc;
            }
            
            .status-location {
                font-size: 11px;
                color: #999999;
            }
            
            .url-cell {
                max-width: 200px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        `;
        document.head.appendChild(style);
    }
} 