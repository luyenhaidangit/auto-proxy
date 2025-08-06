// Export Manager - Handles export functionality
class ExportManager {
    constructor() {
        this.exportOptions = {
            key: true,
            protocol: true,
            kpProxy: true,
            localProxy: false,
            rotationLink: true
        };
        this.proxyType = 'https';
        this.separator = '|';
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Export modal option buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('option-btn')) {
                const dataOption = e.target.dataset.option;
                const dataType = e.target.dataset.type;
                const dataSeparator = e.target.dataset.separator;

                if (dataOption) {
                    this.toggleExportOption(dataOption);
                } else if (dataType) {
                    this.setProxyType(dataType);
                } else if (dataSeparator) {
                    this.setSeparator(dataSeparator);
                }
            }
        });
    }

    showExportModal(proxies = null) {
        const modal = document.getElementById('exportModal');
        if (modal) {
            modal.classList.add('active');

            // Update export count
            const countElement = document.querySelector('.export-count');
            if (countElement) {
                const count = proxies ? proxies.length : 0;
                countElement.textContent = `(${count} Mục)`;
            }

            // Generate export content
            if (proxies && proxies.length > 0) {
                this.generateExportContent(proxies);
            }
        }
    }

    toggleExportOption(option) {
        this.exportOptions[option] = !this.exportOptions[option];

        // Update button state
        const button = document.querySelector(`[data-option="${option}"]`);
        if (button) {
            button.classList.toggle('active', this.exportOptions[option]);
        }

        // Regenerate content if we have proxies
        this.regenerateExportContent();
    }

    setProxyType(type) {
        this.proxyType = type;

        // Update button states
        document.querySelectorAll('[data-type]').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.type === type);
        });

        this.regenerateExportContent();
    }

    setSeparator(separator) {
        this.separator = separator;

        // Update button states
        document.querySelectorAll('[data-separator]').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.separator === separator);
        });

        this.regenerateExportContent();
    }

    generateExportContent(proxies) {
        const exportContent = document.getElementById('exportContent');
        if (!exportContent) return;

        const lines = proxies.map(proxy => {
            const parts = [];

            if (this.exportOptions.key) {
                parts.push(proxy.key);
            }

            if (this.exportOptions.protocol) {
                parts.push(this.proxyType.toUpperCase());
            }

            if (this.exportOptions.kpProxy) {
                parts.push(proxy.proxy);
            }

            if (this.exportOptions.localProxy) {
                parts.push(proxy.localProxy);
            }

            if (this.exportOptions.rotationLink) {
                parts.push(this.generateRotationLink(proxy));
            }

            return parts.join(this.separator);
        });

        exportContent.value = lines.join('\n');
    }

    regenerateExportContent() {
        // Get current proxies from the table
        const proxyRows = document.querySelectorAll('#proxyTableBody tr');
        const proxies = [];

        proxyRows.forEach(row => {
            const proxyId = parseInt(row.dataset.proxyId);
            const proxy = window.app.proxyManager.proxies.find(p => p.id === proxyId);
            if (proxy) {
                proxies.push(proxy);
            }
        });

        if (proxies.length > 0) {
            this.generateExportContent(proxies);
        }
    }

    generateRotationLink(proxy) {
        // Generate rotation link based on proxy data
        const baseUrl = 'https://rotation.example.com';
        const params = new URLSearchParams({
            key: proxy.key,
            type: this.proxyType,
            location: proxy.location || 'random'
        });

        return `${baseUrl}/rotate?${params.toString()}`;
    }

    async exportToFile(content, filename = 'proxy-keys.txt') {
        try {
            const result = await window.electronAPI.exportKeys({ content });
            if (result.success) {
                // The file dialog was shown and user selected a location
                window.app.showNotification('Đã xuất keys thành công', 'success');
                return true;
            } else {
                window.app.showNotification('Hủy xuất keys', 'info');
                return false;
            }
        } catch (error) {
            window.app.showNotification('Lỗi khi xuất keys', 'error');
            return false;
        }
    }

    // Export formats
    exportAsText(proxies) {
        return proxies.map(proxy => {
            const parts = [];

            if (this.exportOptions.key) {
                parts.push(proxy.key);
            }

            if (this.exportOptions.protocol) {
                parts.push(this.proxyType.toUpperCase());
            }

            if (this.exportOptions.kpProxy) {
                parts.push(proxy.proxy);
            }

            if (this.exportOptions.localProxy) {
                parts.push(proxy.localProxy);
            }

            if (this.exportOptions.rotationLink) {
                parts.push(this.generateRotationLink(proxy));
            }

            return parts.join(this.separator);
        }).join('\n');
    }

    exportAsJSON(proxies) {
        return JSON.stringify(proxies.map(proxy => ({
            key: proxy.key,
            proxy: proxy.proxy,
            localProxy: proxy.localProxy,
            ipv4: proxy.ipv4,
            ipv6: proxy.ipv6,
            status: proxy.status,
            location: proxy.location,
            timer: proxy.timer
        })), null, 2);
    }

    exportAsCSV(proxies) {
        const headers = [];
        if (this.exportOptions.key) headers.push('Key');
        if (this.exportOptions.protocol) headers.push('Protocol');
        if (this.exportOptions.kpProxy) headers.push('KP Proxy');
        if (this.exportOptions.localProxy) headers.push('Local Proxy');
        if (this.exportOptions.rotationLink) headers.push('Rotation Link');

        const csvContent = [
            headers.join(','),
            ...proxies.map(proxy => {
                const values = [];
                if (this.exportOptions.key) values.push(`"${proxy.key}"`);
                if (this.exportOptions.protocol) values.push(this.proxyType.toUpperCase());
                if (this.exportOptions.kpProxy) values.push(`"${proxy.proxy}"`);
                if (this.exportOptions.localProxy) values.push(`"${proxy.localProxy}"`);
                if (this.exportOptions.rotationLink) values.push(`"${this.generateRotationLink(proxy)}"`);
                return values.join(',');
            })
        ].join('\n');

        return csvContent;
    }

    // Validation
    validateExportOptions() {
        const errors = [];

        // Check if at least one option is selected
        const hasOptions = Object.values(this.exportOptions).some(option => option);
        if (!hasOptions) {
            errors.push('Vui lòng chọn ít nhất một thành phần để xuất');
        }

        return errors;
    }

    // Utility methods
    getExportFormat() {
        return {
            options: this.exportOptions,
            proxyType: this.proxyType,
            separator: this.separator
        };
    }

    setExportFormat(format) {
        if (format.options) {
            this.exportOptions = { ...this.exportOptions, ...format.options };
        }
        if (format.proxyType) {
            this.proxyType = format.proxyType;
        }
        if (format.separator) {
            this.separator = format.separator;
        }
    }

    // Preset formats
    getPresetFormats() {
        return {
            'basic': {
                options: { key: true, protocol: true, kpProxy: true },
                proxyType: 'https',
                separator: '|'
            },
            'detailed': {
                options: { key: true, protocol: true, kpProxy: true, localProxy: true, rotationLink: true },
                proxyType: 'https',
                separator: '|'
            },
            'csv': {
                options: { key: true, protocol: true, kpProxy: true },
                proxyType: 'https',
                separator: ','
            }
        };
    }

    applyPreset(presetName) {
        const presets = this.getPresetFormats();
        const preset = presets[presetName];

        if (preset) {
            this.setExportFormat(preset);
            this.updateUI();
        }
    }

    updateUI() {
        // Update option buttons
        Object.entries(this.exportOptions).forEach(([option, enabled]) => {
            const button = document.querySelector(`[data-option="${option}"]`);
            if (button) {
                button.classList.toggle('active', enabled);
            }
        });

        // Update proxy type buttons
        document.querySelectorAll('[data-type]').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.type === this.proxyType);
        });

        // Update separator buttons
        document.querySelectorAll('[data-separator]').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.separator === this.separator);
        });
    }
} 