// Proxy Manager - Handles proxy data and operations
class ProxyManager {
    constructor() {
        this.keys = [];
        this.proxies = [];
        this.requests = [];
        this.selectedProxies = new Set();
        this.setupEventListeners();
        this.loadKeysFromFile();
    }

    setupEventListeners() {
        // Action buttons
        const checkAllBtn = document.getElementById('checkAllBtn');
        const exportAllBtn = document.getElementById('exportAllBtn');
        const rotateAllBtn = document.getElementById('rotateAllBtn');
        const addProxyBtn = document.getElementById('addProxyBtn');

        if (checkAllBtn) {
            checkAllBtn.addEventListener('click', () => this.checkAllProxies());
        }
        if (exportAllBtn) {
            exportAllBtn.addEventListener('click', () => this.exportAllProxies());
        }
        if (rotateAllBtn) {
            rotateAllBtn.addEventListener('click', () => this.rotateAllProxies());
        }
        if (addProxyBtn) {
            addProxyBtn.addEventListener('click', () => this.showAddKeyModal());
        }

        // Select all checkbox
        const selectAllCheckbox = document.getElementById('selectAll');
        if (selectAllCheckbox) {
            selectAllCheckbox.addEventListener('change', (e) => {
                this.toggleSelectAll(e.target.checked);
            });
        }

        // Search functionality
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterProxies(e.target.value);
            });
        }

        // Add Key Modal Event Listeners
        this.setupAddKeyModalListeners();
    }

    setupAddKeyModalListeners() {
        // Close modal button
        const closeAddKeyModal = document.getElementById('closeAddKeyModal');
        if (closeAddKeyModal) {
            closeAddKeyModal.addEventListener('click', () => {
                this.closeAddKeyModal();
            });
        }

        // Import button - now acts as the main action button
        const importKeysBtn = document.getElementById('importKeysBtn');
        if (importKeysBtn) {
            importKeysBtn.addEventListener('click', () => {
                this.addKeysFromModal();
            });
        }
    }

    showAddKeyModal() {
        const modal = document.getElementById('addKeyModal');
        if (modal) {
            modal.classList.add('active');

            // Clear form instead of setting default values
            const keyList = document.getElementById('keyList');
            if (keyList) {
                keyList.value = '';
            }
        }
    }

    closeAddKeyModal() {
        const modal = document.getElementById('addKeyModal');
        if (modal) {
            modal.classList.remove('active');

            // Clear form
            const keyList = document.getElementById('keyList');
            if (keyList) {
                keyList.value = '';
            }
        }
    }

    async saveKeysToFile() {
        if (window.electronAPI && window.electronAPI.invoke) {
            await window.electronAPI.invoke('save-keys', this.keys);
        }
    }

    async loadKeysFromFile() {
        if (window.electronAPI && window.electronAPI.invoke) {
            const result = await window.electronAPI.invoke('load-keys');
            if (result.success) {
                this.keys = result.keys;
                await this.loadProxiesFromKeys();
            }
        }
    }

    async loadProxiesFromKeys() {
        this.proxies = [];

        if (this.keys.length === 0) {
            this.renderProxies();
            return;
        }

        // Show loading state
        window.app.showLoading();

        try {
            for (const key of this.keys) {
                try {
                    const proxyData = await this.fetchProxyInfo(key);
                    if (proxyData) {
                        this.proxies.push(proxyData);
                    }
                } catch (error) {
                    console.error(`Error fetching proxy info for key: ${key}`, error);
                    // Add proxy with error status
                    this.proxies.push({
                        id: Date.now() + Math.random(),
                        key: key,
                        proxy: 'Error fetching data',
                        localProxy: 'Error fetching data',
                        ipv4: 'Error',
                        ipv6: 'Error',
                        status: 'error',
                        location: 'Error',
                        timer: '00:00:00',
                        selected: false,
                        region: 'error',
                        proxyType: 'error'
                    });
                }
            }
        } finally {
            window.app.hideLoading();
        }

        this.renderProxies();
    }

    async fetchProxyInfo(key) {
        try {
            const response = await fetch(`https://api.vnproxy.com/webservice/statusIP?key=${key}`);
            const data = await response.json();

            if (data.code === 200 && data.data) {
                const proxyInfo = data.data;
                return {
                    id: Date.now() + Math.random(),
                    key: key,
                    proxy: `${proxyInfo.proxyType.toUpperCase()}: ${proxyInfo.ipv4}`,
                    localProxy: `${proxyInfo.proxyType.toUpperCase()}: 127.0.0.1:8080`,
                    ipv4: proxyInfo.public_ipv4,
                    ipv6: proxyInfo.public_ipv6,
                    status: this.getProxyStatus(proxyInfo),
                    location: proxyInfo.location,
                    timer: this.calculateTimeRemaining(proxyInfo.proxyTimeout),
                    selected: false,
                    region: proxyInfo.location,
                    proxyType: proxyInfo.proxyType,
                    credential: proxyInfo.credential,
                    expired: proxyInfo.expired,
                    nextChangeIP: proxyInfo.nextChangeIP
                };
            } else {
                throw new Error(data.message || 'Failed to fetch proxy info');
            }
        } catch (error) {
            console.error('Error fetching proxy info:', error);
            throw error;
        }
    }

    getProxyStatus(proxyInfo) {
        const now = new Date();
        const expired = new Date(proxyInfo.expired);

        if (expired < now) {
            return 'expired';
        }

        const timeDiff = expired - now;
        const hoursDiff = timeDiff / (1000 * 60 * 60);

        if (hoursDiff < 1) {
            return 'warning';
        }

        return 'active';
    }

    calculateTimeRemaining(timeoutStr) {
        try {
            const timeout = new Date(timeoutStr);
            const now = new Date();
            const diff = timeout - now;

            if (diff <= 0) {
                return '00:00:00';
            }

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        } catch (error) {
            return '00:00:00';
        }
    }

    addKeysFromModal() {
        const keyList = document.getElementById('keyList');

        if (!keyList || !keyList.value.trim()) {
            window.app.showNotification('Vui lòng nhập danh sách keys', 'warning');
            return;
        }

        const newKeys = keyList.value.trim().split('\n').filter(key => key.trim());

        if (newKeys.length === 0) {
            window.app.showNotification('Vui lòng nhập ít nhất một key hợp lệ', 'warning');
            return;
        }

        // Add new keys to the list
        this.keys = [...this.keys, ...newKeys];

        // Save keys to file
        this.saveKeysToFile();

        // Load proxy info for new keys
        this.loadProxiesFromKeys();

        this.closeAddKeyModal();
        window.app.showNotification(`Đã thêm ${newKeys.length} keys thành công`, 'success');
    }

    renderProxies() {
        const tbody = document.getElementById('proxyTableBody');
        if (!tbody) return;

        if (this.proxies.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" class="no-data">
                        <div class="no-data-content">
                            <i class="fas fa-info-circle"></i>
                            <p>Chưa có proxy nào. Hãy thêm key để bắt đầu!</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = this.proxies.map(proxy => `
            <tr data-id="${proxy.id}">
                <td>
                    <input type="checkbox" class="proxy-checkbox" ${proxy.selected ? 'checked' : ''}>
                </td>
                <td>
                    <div class="key-info">
                        <div class="key-text">${proxy.key}</div>
                        <div class="key-dropdown">
                            <select class="region-select">
                                <option value="random" ${proxy.region === 'random' ? 'selected' : ''}>Ngẫu nhiên</option>
                                <option value="mienbac" ${proxy.region === 'mienbac' ? 'selected' : ''}>Miền Bắc</option>
                                <option value="mientrung" ${proxy.region === 'mientrung' ? 'selected' : ''}>Miền Trung</option>
                                <option value="miennam" ${proxy.region === 'miennam' ? 'selected' : ''}>Miền Nam</option>
                            </select>
                        </div>
                    </div>
                </td>
                <td>
                    <div class="proxy-info">
                        <div class="proxy-address">${proxy.proxy}</div>
                        <div class="proxy-type">${proxy.proxyType}</div>
                    </div>
                </td>
                <td>
                    <div class="local-proxy-info">
                        <div class="local-proxy-address">${proxy.localProxy}</div>
                        <div class="local-proxy-status">Local</div>
                    </div>
                </td>
                <td>
                    <div class="ip-info">
                        <div class="ipv4">${proxy.ipv4}</div>
                        <div class="ip-label">IPv4</div>
                    </div>
                </td>
                <td>
                    <div class="ip-info">
                        <div class="ipv6">${proxy.ipv6}</div>
                        <div class="ip-label">IPv6</div>
                    </div>
                </td>
                <td>
                    <div class="status-info">
                        <div class="status-badge ${proxy.status}">${this.getStatusText(proxy.status)}</div>
                        <div class="status-details">
                            <div class="timer">${proxy.timer}</div>
                            <div class="location">${proxy.location}</div>
                        </div>
                    </div>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn view-btn" title="Xem chi tiết">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn refresh-btn" title="Làm mới">
                            <i class="fas fa-sync-alt"></i>
                        </button>
                        <button class="action-btn delete-btn" title="Xóa">
                            <i class="fas fa-trash"></i>
                        </button>
                        <button class="btn btn-danger delete-proxy-btn" onclick="proxyManager.deleteProxy('${proxy.id}')">
                            Xóa
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

        // Add event listeners for checkboxes
        this.proxies.forEach(proxy => {
            const checkbox = tbody.querySelector(`tr[data-id="${proxy.id}"] .proxy-checkbox`);
            if (checkbox) {
                checkbox.addEventListener('change', (e) => {
                    this.toggleProxySelection(proxy.id, e.target.checked);
                });
            }
        });

        // Add event listeners for action buttons
        this.proxies.forEach(proxy => {
            const row = tbody.querySelector(`tr[data-id="${proxy.id}"]`);
            if (row) {
                const viewBtn = row.querySelector('.view-btn');
                const refreshBtn = row.querySelector('.refresh-btn');
                const deleteBtn = row.querySelector('.delete-btn');

                if (viewBtn) {
                    viewBtn.addEventListener('click', () => this.viewProxy(proxy.id));
                }
                if (refreshBtn) {
                    refreshBtn.addEventListener('click', () => this.refreshProxy(proxy.id));
                }
                if (deleteBtn) {
                    deleteBtn.addEventListener('click', () => this.deleteProxy(proxy.id));
                }
            }
        });
    }

    renderRequests() {
        const tbody = document.getElementById('requestTableBody');
        if (!tbody) return;

        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="no-data">
                    <div class="no-data-content">
                        <i class="fas fa-info-circle"></i>
                        <p>Chưa có request nào.</p>
                    </div>
                </td>
            </tr>
        `;
    }

    getStatusText(status) {
        switch (status) {
            case 'active':
                return 'Hoạt động';
            case 'expired':
                return 'Hết hạn';
            case 'warning':
                return 'Cảnh báo';
            case 'error':
                return 'Lỗi';
            default:
                return 'Không xác định';
        }
    }

    toggleProxySelection(proxyId, selected) {
        const proxy = this.proxies.find(p => p.id === proxyId);
        if (proxy) {
            proxy.selected = selected;
            if (selected) {
                this.selectedProxies.add(proxyId);
            } else {
                this.selectedProxies.delete(proxyId);
            }
            this.updateSelectAllState();
        }
    }

    toggleRequestSelection(requestId, selected) {
        // Handle request selection
        console.log(`Request ${requestId} ${selected ? 'selected' : 'deselected'}`);
    }

    toggleSelectAll(checked) {
        this.proxies.forEach(proxy => {
            proxy.selected = checked;
            if (checked) {
                this.selectedProxies.add(proxy.id);
            } else {
                this.selectedProxies.delete(proxy.id);
            }
        });
        this.renderProxies();
    }

    updateSelectAllState() {
        const selectAllCheckbox = document.getElementById('selectAll');
        if (selectAllCheckbox && this.proxies.length > 0) {
            const allSelected = this.proxies.every(proxy => proxy.selected);
            const someSelected = this.proxies.some(proxy => proxy.selected);

            selectAllCheckbox.checked = allSelected;
            selectAllCheckbox.indeterminate = someSelected && !allSelected;
        }
    }

    filterProxies(searchTerm) {
        const tbody = document.getElementById('proxyTableBody');
        if (!tbody) return;

        const rows = tbody.querySelectorAll('tr');
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            const matches = text.includes(searchTerm.toLowerCase());
            row.style.display = matches ? '' : 'none';
        });
    }

    async checkAllProxies() {
        await this.refreshAllProxies();
    }

    exportAllProxies() {
        if (this.proxies.length === 0) {
            window.app.showNotification('Không có proxy nào để xuất', 'warning');
            return;
        }

        const exportData = this.proxies.map(proxy => ({
            key: proxy.key,
            proxy: proxy.proxy,
            ipv4: proxy.ipv4,
            ipv6: proxy.ipv6,
            location: proxy.location,
            status: proxy.status,
            timer: proxy.timer
        }));

        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });

        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = 'proxies.json';
        link.click();

        window.app.showNotification('Đã xuất danh sách proxy', 'success');
    }

    async rotateAllProxies() {
        await this.refreshAllProxies();
    }

    async refreshAllProxies() {
        window.app.showNotification('Đang cập nhật thông tin proxy...', 'info');
        await this.loadProxiesFromKeys();
        window.app.showNotification('Đã cập nhật thông tin proxy', 'success');
    }

    async refreshProxy(proxyId) {
        const proxy = this.proxies.find(p => p.id === proxyId);
        if (proxy) {
            try {
                const newProxyData = await this.fetchProxyInfo(proxy.key);
                if (newProxyData) {
                    // Update existing proxy with new data
                    Object.assign(proxy, newProxyData);
                    this.renderProxies();
                    window.app.showNotification('Đã cập nhật proxy', 'success');
                }
            } catch (error) {
                window.app.showNotification('Lỗi khi cập nhật proxy', 'error');
            }
        }
    }

    deleteProxy(proxyId) {
        const proxy = this.proxies.find(p => p.id === proxyId);
        if (proxy) {
            // Remove from keys array
            this.keys = this.keys.filter(key => key !== proxy.key);

            // Remove from proxies array
            this.proxies = this.proxies.filter(p => p.id !== proxyId);

            // Save updated keys
            this.saveKeysToFile();

            // Re-render
            this.renderProxies();

            window.app.showNotification('Đã xóa proxy', 'success');
        }
    }

    copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            window.app.showNotification('Đã copy vào clipboard', 'success');
        }).catch(() => {
            window.app.showNotification('Lỗi khi copy', 'error');
        });
    }

    viewProxy(proxyId) {
        const proxy = this.proxies.find(p => p.id === proxyId);
        if (proxy) {
            // Show proxy details in a modal or notification
            const details = `
                Key: ${proxy.key}
                Proxy: ${proxy.proxy}
                IPv4: ${proxy.ipv4}
                IPv6: ${proxy.ipv6}
                Location: ${proxy.location}
                Status: ${this.getStatusText(proxy.status)}
                Timer: ${proxy.timer}
            `;
            window.app.showNotification('Thông tin proxy', 'info');
            console.log('Proxy details:', details);
        }
    }
} 