// Responsive Manager - Handles responsive behavior and mobile interactions
class ResponsiveManager {
    constructor() {
        this.currentBreakpoint = this.getCurrentBreakpoint();
        this.isMobile = this.currentBreakpoint === 'mobile' || this.currentBreakpoint === 'tablet';
        this.setupEventListeners();
        this.init();
    }

    getCurrentBreakpoint() {
        const width = window.innerWidth;
        if (width >= 1400) return 'large-desktop';
        if (width >= 1200) return 'desktop';
        if (width >= 768) return 'tablet';
        return 'mobile';
    }

    setupEventListeners() {
        // Handle window resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });

        // Handle orientation change
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.handleResize();
            }, 100);
        });

        // Handle mobile-specific interactions
        if (this.isMobile) {
            this.setupMobileInteractions();
        }
    }

    handleResize() {
        const newBreakpoint = this.getCurrentBreakpoint();
        if (newBreakpoint !== this.currentBreakpoint) {
            this.currentBreakpoint = newBreakpoint;
            this.isMobile = this.currentBreakpoint === 'mobile' || this.currentBreakpoint === 'tablet';
            this.onBreakpointChange();
        }
    }

    onBreakpointChange() {
        // Update mobile interactions
        if (this.isMobile) {
            this.setupMobileInteractions();
        } else {
            this.removeMobileInteractions();
        }

        // Adjust table scrolling
        this.adjustTableScrolling();

        // Adjust modal positioning
        this.adjustModalPositioning();

        // Notify other components
        this.notifyBreakpointChange();
    }

    setupMobileInteractions() {
        // Add touch-friendly interactions
        this.addTouchSupport();

        // Add swipe gestures for navigation
        this.addSwipeGestures();

        // Optimize table interactions
        this.optimizeTableForMobile();
    }

    removeMobileInteractions() {
        // Remove touch-specific event listeners
        this.removeTouchSupport();
        this.removeSwipeGestures();
    }

    addTouchSupport() {
        // Make buttons more touch-friendly
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(btn => {
            btn.style.minHeight = '44px';
            btn.style.minWidth = '44px';
        });

        // Add touch feedback
        buttons.forEach(btn => {
            btn.addEventListener('touchstart', () => {
                btn.style.opacity = '0.7';
            });
            btn.addEventListener('touchend', () => {
                btn.style.opacity = '1';
            });
        });
    }

    removeTouchSupport() {
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(btn => {
            btn.style.minHeight = '';
            btn.style.minWidth = '';
            btn.style.opacity = '';
        });
    }

    addSwipeGestures() {
        let startX = 0;
        let startY = 0;
        let isSwiping = false;

        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isSwiping = false;
        });

        document.addEventListener('touchmove', (e) => {
            if (!startX || !startY) return;

            const deltaX = e.touches[0].clientX - startX;
            const deltaY = e.touches[0].clientY - startY;

            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
                isSwiping = true;
                e.preventDefault();
            }
        });

        document.addEventListener('touchend', (e) => {
            if (!isSwiping) return;

            const deltaX = e.changedTouches[0].clientX - startX;
            const deltaY = e.changedTouches[0].clientY - startY;

            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 100) {
                this.handleSwipe(deltaX > 0 ? 'right' : 'left');
            }

            startX = 0;
            startY = 0;
            isSwiping = false;
        });
    }

    removeSwipeGestures() {
        // Remove swipe event listeners if needed
    }

    handleSwipe(direction) {
        // Handle swipe navigation
        if (direction === 'left' && this.currentBreakpoint === 'mobile') {
            // Could implement navigation to next page
        } else if (direction === 'right' && this.currentBreakpoint === 'mobile') {
            // Could implement navigation to previous page
        }
    }

    optimizeTableForMobile() {
        const tables = document.querySelectorAll('.proxy-table, .request-table');
        tables.forEach(table => {
            // Add horizontal scroll indicator
            this.addScrollIndicator(table);

            // Add column visibility toggle
            this.addColumnToggle(table);
        });
    }

    addScrollIndicator(table) {
        const container = table.closest('.proxy-table-container, .request-table-container');
        if (!container) return;

        // Add scroll indicator
        const indicator = document.createElement('div');
        indicator.className = 'scroll-indicator';
        indicator.innerHTML = '<i class="fas fa-arrows-alt-h"></i> Scroll to see more';
        indicator.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            background: rgba(74, 158, 255, 0.9);
            color: white;
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 12px;
            z-index: 10;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.3s;
        `;

        container.appendChild(indicator);

        // Show indicator when table is scrollable
        const checkScroll = () => {
            const isScrollable = container.scrollWidth > container.clientWidth;
            indicator.style.opacity = isScrollable ? '1' : '0';
        };

        container.addEventListener('scroll', checkScroll);
        window.addEventListener('resize', checkScroll);
        checkScroll();
    }

    addColumnToggle(table) {
        if (this.currentBreakpoint !== 'mobile') return;

        const container = table.closest('.proxy-table-container, .request-table-container');
        if (!container) return;

        // Add column toggle button
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'column-toggle-btn';
        toggleBtn.innerHTML = '<i class="fas fa-columns"></i>';
        toggleBtn.style.cssText = `
            position: absolute;
            top: 10px;
            left: 10px;
            background: rgba(74, 158, 255, 0.9);
            color: white;
            border: none;
            padding: 8px;
            border-radius: 4px;
            cursor: pointer;
            z-index: 10;
        `;

        container.appendChild(toggleBtn);

        toggleBtn.addEventListener('click', () => {
            this.toggleColumnVisibility(table);
        });
    }

    toggleColumnVisibility(table) {
        const hiddenColumns = table.querySelectorAll('th:nth-child(4), td:nth-child(4), th:nth-child(6), td:nth-child(6)');
        hiddenColumns.forEach(cell => {
            cell.style.display = cell.style.display === 'none' ? 'table-cell' : 'none';
        });
    }

    adjustTableScrolling() {
        const containers = document.querySelectorAll('.proxy-table-container, .request-table-container');
        containers.forEach(container => {
            if (this.isMobile) {
                container.style.overflowX = 'auto';
                container.style.webkitOverflowScrolling = 'touch';
            } else {
                container.style.overflowX = 'hidden';
            }
        });
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

    notifyBreakpointChange() {
        // Dispatch custom event for other components
        const event = new CustomEvent('breakpointChange', {
            detail: {
                breakpoint: this.currentBreakpoint,
                isMobile: this.isMobile
            }
        });
        document.dispatchEvent(event);
    }

    // Utility methods
    isTablet() {
        return this.currentBreakpoint === 'tablet';
    }

    isMobile() {
        return this.currentBreakpoint === 'mobile';
    }

    isDesktop() {
        return this.currentBreakpoint === 'desktop' || this.currentBreakpoint === 'large-desktop';
    }

    getScreenSize() {
        return {
            width: window.innerWidth,
            height: window.innerHeight,
            breakpoint: this.currentBreakpoint
        };
    }

    // Initialize responsive manager
    init() {
        this.adjustTableScrolling();
        this.adjustModalPositioning();

        // Add responsive classes to body
        document.body.classList.add(`breakpoint-${this.currentBreakpoint}`);
        if (this.isMobile) {
            document.body.classList.add('mobile-view');
        }
    }
}

// Initialize responsive manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.responsiveManager = new ResponsiveManager();
}); 