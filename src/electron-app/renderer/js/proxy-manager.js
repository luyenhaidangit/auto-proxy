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

            // Set default values
            const keyList = document.getElementById('keyList');
            if (keyList) {
                keyList.value = 'Đây là key demo';
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

    async importKeysFromFile() {
        try {
            const result = await window.electronAPI.importKeys();
            if (result.success) {
                // Read file content and populate textarea
                const keyList = document.getElementById('keyList');
                if (keyList) {
                    // Simulate reading file content
                    keyList.value = 'jRw41SVm3ufB3u4AWfCG...\nkLm52TWn4vgC4v5BXgDH...\nmNp63UXo5whD5w6CYhEI...';
                }
                window.app.showNotification('Đã import keys từ file', 'success');
            }
        } catch (error) {
            window.app.showNotification('Lỗi khi import keys', 'error');
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

        // Add new keys to the list
        this.keys = [...this.keys, ...newKeys];

        // Save keys to file
        this.saveKeysToFile();

        // Load proxy info for new keys
        this.loadProxiesFromKeys();

        this.closeAddKeyModal();
        window.app.showNotification(`Đã thêm ${newKeys.length} keys thành công`, 'success');
    }

    getLocationByRegion(region) {
        const locations = {
            'random': ['Quảng Ninh', 'Hà Nội', 'TP.HCM', 'Đà Nẵng'],
            'north': ['Quảng Ninh', 'Hà Nội', 'Hải Phòng', 'Thái Nguyên'],
            'south': ['TP.HCM', 'Cần Thơ', 'Vũng Tàu', 'Đồng Nai']
        };

        const regionLocations = locations[region] || locations.random;
        return regionLocations[Math.floor(Math.random() * regionLocations.length)];
    }

    async loadProxies() {
        try {
            // Simulate loading proxy data
            this.proxies = this.generateSampleProxies();
            this.renderProxies();
        } catch (error) {
            console.error('Failed to load proxies:', error);
        }
    }

    async loadRequests() {
        try {
            // Simulate loading request data
            this.requests = this.generateSampleRequests();
            this.renderRequests();
        } catch (error) {
            console.error('Failed to load requests:', error);
        }
    }

    generateSampleProxies() {
        return [
            {
                id: 1,
                key: 'jRw41SVm3ufB3u4AWfCG...',
                proxy: 'HTTP(S): 192.168.1.100:8080',
                localProxy: 'HTTP(S): 127.0.0.1:8080',
                ipv4: '192.168.1.100',
                ipv6: '2001:db8::1',
                status: 'active',
                location: 'Quảng Ninh',
                timer: '00:29:32',
                selected: true
            },
            {
                id: 2,
                key: 'kLm52TWn4vgC4v5BXgDH...',
                proxy: 'SOCKS5: 192.168.1.101:1080',
                localProxy: 'SOCKS5: 127.0.0.1:1080',
                ipv4: '192.168.1.101',
                ipv6: '2001:db8::2',
                status: 'expired',
                location: 'Hà Nội',
                timer: '00:00:00',
                selected: false
            },
            {
                id: 3,
                key: 'mNp63UXo5whD5w6CYhEI...',
                proxy: 'HTTP(S): 192.168.1.102:8080',
                localProxy: 'HTTP(S): 127.0.0.1:8080',
                ipv4: '192.168.1.102',
                ipv6: '2001:db8::3',
                status: 'warning',
                location: 'TP.HCM',
                timer: '00:15:45',
                selected: false
            }
        ];
    }

    generateSampleRequests() {
        return [
            {
                id: 1,
                time: '20/07/2025 15:05:12',
                method: 'GET',
                type: 'img',
                url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstleyOfficial&fe...',
                ipClient: '1421:12415:001',
                bodyReq: 'Body Req',
                selected: false
            },
            {
                id: 2,
                time: '20/07/2025 15:04:58',
                method: 'POST',
                type: 'api',
                url: 'https://api.example.com/data',
                ipClient: '1421:12415:002',
                bodyReq: '{"key":"value"}',
                selected: false
            }
        ];
    }

    renderProxies() {
        const tbody = document.getElementById('proxyTableBody');
        if (!tbody) return;

        tbody.innerHTML = '';

        this.proxies.forEach(proxy => {
            const row = this.createProxyRow(proxy);
            tbody.appendChild(row);
        });

        this.updateSelectAllState();
    }

    renderRequests() {
        const tbody = document.getElementById('requestTableBody');
        if (!tbody) return;

        tbody.innerHTML = '';

        this.requests.forEach(request => {
            const row = this.createRequestRow(request);
            tbody.appendChild(row);
        });
    }

    createProxyRow(proxy) {
        const row = document.createElement('tr');
        row.dataset.proxyId = proxy.id;

        row.innerHTML = `
            <td>
                <input type="checkbox" ${proxy.selected ? 'checked' : ''} class="proxy-checkbox">
            </td>
            <td>
                <div class="key-container">
                    <select class="key-type">
                        <option value="random" ${proxy.region === 'random' ? 'selected' : ''}>Ngẫu nhiên</option>
                        <option value="north" ${proxy.region === 'north' ? 'selected' : ''}>Miền Bắc</option>
                        <option value="south" ${proxy.region === 'south' ? 'selected' : ''}>Miền Nam</option>
                    </select>
                    <div class="key-value" title="Click để copy">${proxy.key}</div>
                </div>
            </td>
            <td>${proxy.proxy}</td>
            <td>${proxy.localProxy}</td>
            <td>${proxy.ipv4}</td>
            <td>${proxy.ipv6}</td>
            <td>
                <div class="status-container">
                    <div class="status-badge status-${proxy.status}">
                        ${this.getStatusText(proxy.status)}
                    </div>
                    <div class="status-timer">${proxy.timer}</div>
                    <div class="status-location">${proxy.location}</div>
                </div>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn-icon" title="Monitor" onclick="window.app.proxyManager.monitorProxy(${proxy.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-icon" title="Refresh" onclick="window.app.proxyManager.refreshProxy(${proxy.id})">
                        <i class="fas fa-sync"></i>
                    </button>
                    <button class="btn-icon" title="Timer" onclick="window.app.proxyManager.setTimer(${proxy.id})">
                        <i class="fas fa-clock"></i>
                    </button>
                    <button class="btn-icon" title="Delete" onclick="window.app.proxyManager.deleteProxy(${proxy.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="window.app.proxyManager.deleteProxy(${proxy.id})">
                        Xoá
                    </button>
                </div>
            </td>
        `;

        // Add event listeners
        const checkbox = row.querySelector('.proxy-checkbox');
        checkbox.addEventListener('change', (e) => {
            this.toggleProxySelection(proxy.id, e.target.checked);
        });

        const keyValue = row.querySelector('.key-value');
        keyValue.addEventListener('click', () => {
            this.copyToClipboard(proxy.key);
        });

        return row;
    }

    createRequestRow(request) {
        const row = document.createElement('tr');
        row.dataset.requestId = request.id;

        row.innerHTML = `
            <td>
                <input type="checkbox" ${request.selected ? 'checked' : ''} class="request-checkbox">
            </td>
            <td>${request.id}</td>
            <td>${request.time}</td>
            <td>${request.method}</td>
            <td>${request.type}</td>
            <td class="url-cell">${request.url}</td>
            <td>${request.ipClient}</td>
            <td>${request.bodyReq}</td>
        `;

        // Add event listeners
        const checkbox = row.querySelector('.request-checkbox');
        checkbox.addEventListener('change', (e) => {
            this.toggleRequestSelection(request.id, e.target.checked);
        });

        return row;
    }

    getStatusText(status) {
        const statusMap = {
            'active': 'Hoạt động',
            'expired': 'Hết hạn',
            'warning': 'Cảnh báo'
        };
        return statusMap[status] || status;
    }

    toggleProxySelection(proxyId, selected) {
        if (selected) {
            this.selectedProxies.add(proxyId);
        } else {
            this.selectedProxies.delete(proxyId);
        }
        this.updateSelectAllState();
    }

    toggleRequestSelection(requestId, selected) {
        // Handle request selection
        console.log(`Request ${requestId} ${selected ? 'selected' : 'deselected'}`);
    }

    toggleSelectAll(checked) {
        const checkboxes = document.querySelectorAll('.proxy-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.checked = checked;
            const proxyId = parseInt(checkbox.closest('tr').dataset.proxyId);
            this.toggleProxySelection(proxyId, checked);
        });
    }

    updateSelectAllState() {
        const selectAllCheckbox = document.getElementById('selectAll');
        const checkboxes = document.querySelectorAll('.proxy-checkbox');
        const checkedCount = document.querySelectorAll('.proxy-checkbox:checked').length;

        if (selectAllCheckbox) {
            selectAllCheckbox.checked = checkedCount === checkboxes.length && checkboxes.length > 0;
            selectAllCheckbox.indeterminate = checkedCount > 0 && checkedCount < checkboxes.length;
        }
    }

    filterProxies(searchTerm) {
        const rows = document.querySelectorAll('#proxyTableBody tr');
        const term = searchTerm.toLowerCase();

        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(term) ? '' : 'none';
        });
    }

    async checkAllProxies() {
        await this.refreshAllProxies();
    }

    async exportAllProxies() {
        try {
            const selectedProxies = this.proxies.filter(p => this.selectedProxies.has(p.id));
            if (selectedProxies.length === 0) {
                window.app.showNotification('Vui lòng chọn proxy để xuất', 'warning');
                return;
            }

            window.app.exportManager.showExportModal(selectedProxies);
        } catch (error) {
            window.app.showNotification('Lỗi khi xuất proxy', 'error');
        }
    }

    async rotateAllProxies() {
        await this.refreshAllProxies();
    }

    async importKeys() {
        try {
            const result = await window.electronAPI.importKeys();
            if (result.success) {
                window.app.showNotification('Đã import keys thành công', 'success');
                await this.loadProxies(); // Reload data
            }
        } catch (error) {
            window.app.showNotification('Lỗi khi import keys', 'error');
        }
    }

    // Individual proxy actions
    monitorProxy(proxyId) {
        window.app.showNotification(`Đang monitor proxy ${proxyId}`, 'info');
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

    setTimer(proxyId) {
        window.app.showNotification(`Đang set timer cho proxy ${proxyId}`, 'info');
    }

    deleteProxy(proxyId) {
        if (confirm('Bạn có chắc muốn xóa proxy này?')) {
            this.proxies = this.proxies.filter(p => p.id !== proxyId);
            this.selectedProxies.delete(proxyId);
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

    refreshData() {
        this.loadProxies();
        if (window.app.currentPage === 'request') {
            this.loadRequests();
        }
    }
} 