/**
 * Enhanced Responsive Manager for VN Proxy Manager
 * Handles responsive behavior, touch interactions, and UX improvements
 */

class ResponsiveManager {
    constructor() {
        this.currentBreakpoint = this.getBreakpoint();
        this.isMobile = this.currentBreakpoint === 'mobile';
        this.isTablet = this.currentBreakpoint === 'tablet';
        this.isDesktop = this.currentBreakpoint === 'desktop';

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.applyResponsiveClasses();
        this.setupTouchInteractions();
        this.setupKeyboardNavigation();
        this.setupAccessibility();
        this.setupPerformanceOptimizations();
    }

    setupEventListeners() {
        // Window resize handling
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 250);
        });

        // Touch interactions
        this.setupTouchEvents();

        // Keyboard navigation
        this.setupKeyboardEvents();

        // Focus management
        this.setupFocusManagement();

        // Performance monitoring
        this.setupPerformanceMonitoring();
    }

    setupTouchEvents() {
        // Add touch-friendly interactions
        const touchElements = document.querySelectorAll('.btn, .nav-item, .option-btn');

        touchElements.forEach(element => {
            element.addEventListener('touchstart', (e) => {
                element.classList.add('touch-active');
            });

            element.addEventListener('touchend', (e) => {
                setTimeout(() => {
                    element.classList.remove('touch-active');
                }, 150);
            });
        });

        // Improve table scrolling on touch devices
        const tables = document.querySelectorAll('.table-responsive');
        tables.forEach(table => {
            let isScrolling = false;
            let startX, startY, scrollLeft, scrollTop;

            table.addEventListener('touchstart', (e) => {
                isScrolling = true;
                startX = e.touches[0].pageX - table.offsetLeft;
                startY = e.touches[0].pageY - table.offsetTop;
                scrollLeft = table.scrollLeft;
                scrollTop = table.scrollTop;
            });

            table.addEventListener('touchmove', (e) => {
                if (!isScrolling) return;
                e.preventDefault();
                const x = e.touches[0].pageX - table.offsetLeft;
                const y = e.touches[0].pageY - table.offsetTop;
                const walkX = (x - startX) * 2;
                const walkY = (y - startY) * 2;
                table.scrollLeft = scrollLeft - walkX;
                table.scrollTop = scrollTop - walkY;
            });

            table.addEventListener('touchend', () => {
                isScrolling = false;
            });
        });
    }

    setupKeyboardEvents() {
        // Keyboard navigation for navigation items
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach((item, index) => {
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    item.click();
                } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                    e.preventDefault();
                    const nextItem = navItems[index + 1] || navItems[0];
                    nextItem.focus();
                } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                    e.preventDefault();
                    const prevItem = navItems[index - 1] || navItems[navItems.length - 1];
                    prevItem.focus();
                }
            });
        });

        // Keyboard navigation for buttons
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(button => {
            button.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    button.click();
                }
            });
        });

        // Escape key for modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const activeModal = document.querySelector('.modal.active');
                if (activeModal) {
                    const closeBtn = activeModal.querySelector('.close-btn');
                    if (closeBtn) {
                        closeBtn.click();
                    }
                }
            }
        });
    }

    setupFocusManagement() {
        // Focus trap for modals
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            const focusableElements = modal.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            modal.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    if (e.shiftKey) {
                        if (document.activeElement === firstElement) {
                            e.preventDefault();
                            lastElement.focus();
                        }
                    } else {
                        if (document.activeElement === lastElement) {
                            e.preventDefault();
                            firstElement.focus();
                        }
                    }
                }
            });
        });

        // Skip link functionality
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'skip-link sr-only';
        document.body.insertBefore(skipLink, document.body.firstChild);
    }

    setupAccessibility() {
        // Add ARIA labels and roles
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach((item, index) => {
            item.setAttribute('role', 'tab');
            item.setAttribute('aria-selected', item.classList.contains('active'));
            item.setAttribute('tabindex', item.classList.contains('active') ? '0' : '-1');
        });

        // Add screen reader support for status badges
        const statusBadges = document.querySelectorAll('.status-badge');
        statusBadges.forEach(badge => {
            const status = badge.textContent.trim();
            badge.setAttribute('aria-label', `Status: ${status}`);
        });

        // Add loading states
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                if (!button.disabled) {
                    button.classList.add('loading');
                    setTimeout(() => {
                        button.classList.remove('loading');
                    }, 1000);
                }
            });
        });
    }

    setupPerformanceOptimizations() {
        // Debounce scroll events
        let scrollTimeout;
        const tables = document.querySelectorAll('.table-responsive');
        tables.forEach(table => {
            table.addEventListener('scroll', () => {
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    this.handleTableScroll(table);
                }, 16);
            });
        });

        // Intersection Observer for lazy loading
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            });

            const lazyElements = document.querySelectorAll('.lazy-load');
            lazyElements.forEach(el => observer.observe(el));
        }

        // Optimize animations for reduced motion preference
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.body.classList.add('reduced-motion');
        }
    }

    setupPerformanceMonitoring() {
        // Monitor frame rate
        let frameCount = 0;
        let lastTime = performance.now();

        const measurePerformance = (currentTime) => {
            frameCount++;

            if (currentTime - lastTime >= 1000) {
                const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));

                if (fps < 30) {
                    this.optimizePerformance();
                }

                frameCount = 0;
                lastTime = currentTime;
            }

            requestAnimationFrame(measurePerformance);
        };

        requestAnimationFrame(measurePerformance);
    }

    optimizePerformance() {
        // Reduce animations and effects when performance is poor
        document.body.classList.add('performance-mode');

        // Simplify table rendering
        const tables = document.querySelectorAll('.proxy-table, .request-table');
        tables.forEach(table => {
            table.style.willChange = 'auto';
        });
    }

    handleResize() {
        const newBreakpoint = this.getBreakpoint();

        if (newBreakpoint !== this.currentBreakpoint) {
            this.currentBreakpoint = newBreakpoint;
            this.isMobile = newBreakpoint === 'mobile';
            this.isTablet = newBreakpoint === 'tablet';
            this.isDesktop = newBreakpoint === 'desktop';

            this.applyResponsiveClasses();
            this.handleBreakpointChange();
        }
    }

    getBreakpoint() {
        const width = window.innerWidth;

        if (width < 768) {
            return 'mobile';
        } else if (width < 1200) {
            return 'tablet';
        } else {
            return 'desktop';
        }
    }

    applyResponsiveClasses() {
        const body = document.body;

        // Remove existing breakpoint classes
        body.classList.remove('breakpoint-mobile', 'breakpoint-tablet', 'breakpoint-desktop');

        // Add current breakpoint class
        body.classList.add(`breakpoint-${this.currentBreakpoint}`);

        // Add device-specific classes
        if (this.isMobile) {
            body.classList.add('mobile-view', 'touch-friendly');
        } else if (this.isTablet) {
            body.classList.add('tablet-view', 'touch-friendly');
        } else {
            body.classList.add('desktop-view', 'hover-friendly');
        }
    }

    handleBreakpointChange() {
        // Adjust table columns visibility
        this.adjustTableColumns();

        // Update navigation behavior
        this.updateNavigationBehavior();

        // Adjust modal positioning
        this.adjustModalPositioning();

        // Update touch interactions
        this.updateTouchInteractions();
    }

    adjustTableColumns() {
        const tables = document.querySelectorAll('.proxy-table, .request-table');

        tables.forEach(table => {
            const headers = table.querySelectorAll('th');
            const rows = table.querySelectorAll('tbody tr');

            if (this.isMobile) {
                // Hide less important columns on mobile
                headers.forEach((header, index) => {
                    if (index === 3 || index === 5) { // Local Proxy and IPv6
                        header.style.display = 'none';
                        rows.forEach(row => {
                            const cell = row.cells[index];
                            if (cell) cell.style.display = 'none';
                        });
                    }
                });
            } else {
                // Show all columns on larger screens
                headers.forEach((header, index) => {
                    header.style.display = '';
                    rows.forEach(row => {
                        const cell = row.cells[index];
                        if (cell) cell.style.display = '';
                    });
                });
            }
        });
    }

    updateNavigationBehavior() {
        const sidebar = document.querySelector('.sidebar');
        const navItems = document.querySelectorAll('.nav-item');

        if (this.isMobile) {
            // Mobile navigation behavior
            navItems.forEach(item => {
                item.addEventListener('click', () => {
                    // Add mobile-specific navigation logic here
                    this.handleMobileNavigation(item);
                });
            });
        } else {
            // Desktop navigation behavior
            navItems.forEach(item => {
                item.addEventListener('click', () => {
                    // Add desktop-specific navigation logic here
                    this.handleDesktopNavigation(item);
                });
            });
        }
    }

    handleMobileNavigation(item) {
        // Mobile-specific navigation handling
        const targetPage = item.getAttribute('data-page');
        if (targetPage) {
            this.switchPage(targetPage);

            // Mobile navigation without expansion effects
        }
    }

    handleDesktopNavigation(item) {
        // Desktop-specific navigation handling
        const targetPage = item.getAttribute('data-page');
        if (targetPage) {
            this.switchPage(targetPage);
        }
    }

    switchPage(pageId) {
        // Hide all pages
        const pages = document.querySelectorAll('.page');
        pages.forEach(page => {
            page.classList.remove('active');
        });

        // Show target page
        const targetPage = document.getElementById(`${pageId}-page`);
        if (targetPage) {
            targetPage.classList.add('active');
        }

        // Update navigation active state
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-page') === pageId) {
                item.classList.add('active');
            }
        });

        // Update page title
        this.updatePageTitle(pageId);
    }

    updatePageTitle(pageId) {
        const titleMap = {
            'proxy-list': 'Danh sách Proxy',
            'checker': 'Proxy Checker',
            'request': 'Proxy Request',
            'settings': 'Cài đặt'
        };

        const pageTitle = document.getElementById('page-title');
        if (pageTitle && titleMap[pageId]) {
            pageTitle.textContent = titleMap[pageId];
        }
    }

    adjustModalPositioning() {
        const modals = document.querySelectorAll('.modal');

        modals.forEach(modal => {
            if (this.isMobile) {
                modal.style.alignItems = 'flex-start';
                modal.style.padding = '10px';
            } else {
                modal.style.alignItems = 'center';
                modal.style.padding = '0';
            }
        });
    }

    updateTouchInteractions() {
        const touchElements = document.querySelectorAll('.btn, .nav-item, .option-btn');

        touchElements.forEach(element => {
            if (this.isMobile) {
                element.style.minHeight = '44px';
                element.style.minWidth = '44px';
            } else {
                element.style.minHeight = '';
                element.style.minWidth = '';
            }
        });
    }

    handleTableScroll(table) {
        // Add scroll indicators
        const scrollLeft = table.scrollLeft;
        const scrollWidth = table.scrollWidth;
        const clientWidth = table.clientWidth;

        if (scrollLeft > 0) {
            table.classList.add('scrolled-left');
        } else {
            table.classList.remove('scrolled-left');
        }

        if (scrollLeft + clientWidth < scrollWidth) {
            table.classList.add('scrolled-right');
        } else {
            table.classList.remove('scrolled-right');
        }
    }

    // Utility methods
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function () {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Public API methods
    getCurrentBreakpoint() {
        return this.currentBreakpoint;
    }

    isMobileDevice() {
        return this.isMobile;
    }

    isTabletDevice() {
        return this.isTablet;
    }

    isDesktopDevice() {
        return this.isDesktop;
    }

    // Method to handle long content
    handleLongContent() {
        const tables = document.querySelectorAll('.proxy-table, .request-table');

        tables.forEach(table => {
            const cells = table.querySelectorAll('td');

            cells.forEach(cell => {
                const text = cell.textContent;
                if (text.length > 50) {
                    // Add tooltip for long content
                    cell.setAttribute('title', text);
                    cell.classList.add('text-truncate');

                    // Keep mobile expansion simple without hover effects
                    if (this.isMobile) {
                        cell.addEventListener('click', () => {
                            this.toggleCellExpansion(cell);
                        });
                    }
                }
            });
        });
    }

    toggleCellExpansion(cell) {
        if (cell.classList.contains('expanded')) {
            cell.classList.remove('expanded');
            cell.classList.add('text-truncate');
        } else {
            cell.classList.remove('text-truncate');
            cell.classList.add('expanded');
        }
    }

    // Method to optimize table rendering for long content
    optimizeTableRendering() {
        const tables = document.querySelectorAll('.proxy-table, .request-table');

        tables.forEach(table => {
            const tbody = table.querySelector('tbody');
            if (tbody && tbody.children.length > 100) {
                // Implement virtual scrolling for large datasets
                this.implementVirtualScrolling(tbody);
            }
        });
    }

    implementVirtualScrolling(tbody) {
        const rowHeight = 50; // Approximate row height
        const visibleRows = Math.ceil(window.innerHeight / rowHeight);
        const totalRows = tbody.children.length;

        let startIndex = 0;
        let endIndex = Math.min(visibleRows, totalRows);

        const updateVisibleRows = () => {
            const scrollTop = tbody.parentElement.scrollTop;
            startIndex = Math.floor(scrollTop / rowHeight);
            endIndex = Math.min(startIndex + visibleRows, totalRows);

            // Update visible rows
            Array.from(tbody.children).forEach((row, index) => {
                if (index >= startIndex && index < endIndex) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        };

        tbody.parentElement.addEventListener('scroll', this.throttle(updateVisibleRows, 16));
    }
}

// Initialize responsive manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.responsiveManager = new ResponsiveManager();

    // Handle long content after initialization
    setTimeout(() => {
        window.responsiveManager.handleLongContent();
        window.responsiveManager.optimizeTableRendering();
    }, 1000);
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ResponsiveManager;
} 