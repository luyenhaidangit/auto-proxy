// Proxy Manager - Handles proxy data and operations
class ProxyManager {
    constructor() {
        this.proxies = [];
        this.requests = [];
        this.selectedProxies = new Set();
        this.setupEventListeners();
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

        // Import button
        const importKeysBtn = document.getElementById('importKeysBtn');
        if (importKeysBtn) {
            importKeysBtn.addEventListener('click', () => {
                this.importKeysFromFile();
            });
        }

        // Add keys button
        const addKeysBtn = document.getElementById('addKeysBtn');
        if (addKeysBtn) {
            addKeysBtn.addEventListener('click', () => {
                this.addKeysFromModal();
            });
        }

        // Cancel button
        const cancelAddKeysBtn = document.getElementById('cancelAddKeysBtn');
        if (cancelAddKeysBtn) {
            cancelAddKeysBtn.addEventListener('click', () => {
                this.closeAddKeyModal();
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

            const regionSelect = document.getElementById('regionSelect');
            if (regionSelect) {
                regionSelect.value = 'random';
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

    addKeysFromModal() {
        const keyList = document.getElementById('keyList');
        const regionSelect = document.getElementById('regionSelect');

        if (!keyList || !keyList.value.trim()) {
            window.app.showNotification('Vui lòng nhập danh sách keys', 'warning');
            return;
        }

        const keys = keyList.value.trim().split('\n').filter(key => key.trim());
        const region = regionSelect ? regionSelect.value : 'random';

        // Add new proxies
        keys.forEach((key, index) => {
            const newProxy = {
                id: Date.now() + index,
                key: key.trim(),
                proxy: `HTTP(S): 192.168.1.${100 + index}:8080`,
                localProxy: `HTTP(S): 127.0.0.1:8080`,
                ipv4: `192.168.1.${100 + index}`,
                ipv6: `2001:db8::${index + 1}`,
                status: 'active',
                location: this.getLocationByRegion(region),
                timer: '00:30:00',
                selected: false,
                region: region,
                proxyType: 'https'
            };

            this.proxies.push(newProxy);
        });

        this.renderProxies();
        this.closeAddKeyModal();
        window.app.showNotification(`Đã thêm ${keys.length} keys thành công`, 'success');
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
        try {
            window.app.showLoading();
            // Simulate checking all proxies
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Update status
            this.proxies.forEach(proxy => {
                proxy.status = Math.random() > 0.3 ? 'active' : 'expired';
            });

            this.renderProxies();
            window.app.showNotification('Đã kiểm tra tất cả proxy', 'success');
        } catch (error) {
            window.app.showNotification('Lỗi khi kiểm tra proxy', 'error');
        } finally {
            window.app.hideLoading();
        }
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
        try {
            window.app.showLoading();
            // Simulate rotating all proxies
            await new Promise(resolve => setTimeout(resolve, 1500));

            window.app.showNotification('Đã xoay tất cả proxy', 'success');
        } catch (error) {
            window.app.showNotification('Lỗi khi xoay proxy', 'error');
        } finally {
            window.app.hideLoading();
        }
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

    refreshProxy(proxyId) {
        window.app.showNotification(`Đang refresh proxy ${proxyId}`, 'info');
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