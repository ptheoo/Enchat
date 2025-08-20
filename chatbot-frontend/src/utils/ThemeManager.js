/**
 * ThemeManager - Quản lý theme (light/dark) của ứng dụng
 */

export class ThemeManager {
    constructor() {
        this.currentTheme = 'light';
        this.availableThemes = ['light', 'dark', 'auto'];
        this.systemTheme = this.getSystemTheme();
        this.isAutoTheme = false;
        this.transitionDuration = 300;
        
        // CSS variables for themes
        this.themeVariables = {
            light: {
                '--bg-primary': '#ffffff',
                '--bg-secondary': '#f8fafc',
                '--bg-tertiary': '#f1f5f9',
                '--text-primary': '#1e293b',
                '--text-secondary': '#64748b',
                '--text-muted': '#94a3b8',
                '--border-color': '#e2e8f0',
                '--accent-color': '#6366f1',
                '--accent-hover': '#4f46e5',
                '--success-color': '#10b981',
                '--error-color': '#ef4444',
                '--warning-color': '#f59e0b',
                '--info-color': '#3b82f6',
                '--shadow-sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
                '--shadow-md': '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                '--shadow-lg': '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                '--shadow-xl': '0 20px 25px -5px rgb(0 0 0 / 0.1)'
            },
            dark: {
                '--bg-primary': '#0f172a',
                '--bg-secondary': '#1e293b',
                '--bg-tertiary': '#334155',
                '--text-primary': '#f8fafc',
                '--text-secondary': '#cbd5e1',
                '--text-muted': '#94a3b8',
                '--border-color': '#475569',
                '--accent-color': '#818cf8',
                '--accent-hover': '#6366f1',
                '--success-color': '#34d399',
                '--error-color': '#f87171',
                '--warning-color': '#fbbf24',
                '--info-color': '#60a5fa',
                '--shadow-sm': '0 1px 2px 0 rgb(0 0 0 / 0.3)',
                '--shadow-md': '0 4px 6px -1px rgb(0 0 0 / 0.4)',
                '--shadow-lg': '0 10px 15px -3px rgb(0 0 0 / 0.4)',
                '--shadow-xl': '0 20px 25px -5px rgb(0 0 0 / 0.4)'
            }
        };
    }

    // Khởi tạo theme manager
    async init() {
        try {
            // Load theme từ localStorage
            this.currentTheme = this.getStoredTheme();
            
            // Áp dụng theme
            await this.applyTheme(this.currentTheme);
            
            // Cập nhật icon theme
            this.updateThemeIcon();
            
            // Bật auto theme nếu cần
            if (this.currentTheme === 'auto') {
                this.enableAutoTheme();
            }
            
            console.log('ThemeManager initialized with theme:', this.currentTheme);
            
        } catch (error) {
            console.error('Error initializing ThemeManager:', error);
            // Fallback to light theme
            this.currentTheme = 'light';
            await this.applyTheme('light');
        }
    }

    // Lấy theme đã lưu
    getStoredTheme() {
        const stored = localStorage.getItem('enchat-theme');
        if (stored && this.availableThemes.includes(stored)) {
            return stored;
        }
        return 'light';
    }

    // Lấy theme của hệ thống
    getSystemTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }

    // Áp dụng theme
    async applyTheme(theme) {
        try {
            let targetTheme = theme;
            
            // Xử lý auto theme
            if (theme === 'auto') {
                targetTheme = this.getSystemTheme();
                this.isAutoTheme = true;
            } else {
                this.isAutoTheme = false;
            }
            
            // Cập nhật current theme
            this.currentTheme = theme;
            
            // Cập nhật CSS variables
            this.updateCSSVariables(targetTheme);
            
            // Thêm class vào body
            document.body.className = document.body.className.replace(/theme-\w+/g, '');
            document.body.classList.add(`theme-${targetTheme}`);
            
            // Lưu theme vào localStorage
            this.saveTheme();
            
            // Emit theme change event
            this.dispatchThemeChangeEvent(targetTheme);
            
            console.log('Theme applied:', targetTheme);
            
        } catch (error) {
            console.error('Error applying theme:', error);
            throw error;
        }
    }

    // Cập nhật CSS variables
    updateCSSVariables(theme) {
        const root = document.documentElement;
        const variables = this.themeVariables[theme] || this.themeVariables.light;
        
        Object.entries(variables).forEach(([property, value]) => {
            root.style.setProperty(property, value);
        });
    }

    // Chuyển đổi theme
    toggle() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }

    // Đặt theme cụ thể
    setTheme(theme) {
        if (!this.availableThemes.includes(theme)) {
            console.warn('Invalid theme:', theme);
            return;
        }
        
        this.applyTheme(theme);
    }

    // Cập nhật icon theme
    updateThemeIcon() {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            if (icon) {
                if (this.currentTheme === 'dark') {
                    icon.className = 'fas fa-sun';
                    icon.title = 'Chuyển sang chế độ sáng';
                } else {
                    icon.className = 'fas fa-moon';
                    icon.title = 'Chuyển sang chế độ tối';
                }
            }
        }
    }

    // Thêm hiệu ứng transition
    addTransitionEffect() {
        const root = document.documentElement;
        root.style.transition = `all ${this.transitionDuration}ms ease-in-out`;
    }

    // Lưu theme
    saveTheme() {
        localStorage.setItem('enchat-theme', this.currentTheme);
    }

    // Lấy theme hiện tại
    getCurrentTheme() {
        return this.currentTheme;
    }

    // Kiểm tra dark mode
    isDarkMode() {
        if (this.currentTheme === 'auto') {
            return this.getSystemTheme() === 'dark';
        }
        return this.currentTheme === 'dark';
    }

    // Kiểm tra light mode
    isLightMode() {
        if (this.currentTheme === 'auto') {
            return this.getSystemTheme() === 'light';
        }
        return this.currentTheme === 'light';
    }

    // Emit theme change event
    dispatchThemeChangeEvent(theme) {
        const event = new CustomEvent('theme-change', {
            detail: {
                theme: theme,
                isDark: theme === 'dark',
                isLight: theme === 'light',
                timestamp: new Date().toISOString()
            }
        });
        window.dispatchEvent(event);
    }

    // Bật auto theme
    enableAutoTheme() {
        this.isAutoTheme = true;
        this.enableSystemThemeListener();
    }

    // Lắng nghe thay đổi theme hệ thống
    enableSystemThemeListener() {
        if (window.matchMedia) {
            this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            this.mediaQuery.addEventListener('change', (e) => {
                if (this.isAutoTheme) {
                    const newTheme = e.matches ? 'dark' : 'light';
                    this.updateCSSVariables(newTheme);
                    document.body.className = document.body.className.replace(/theme-\w+/g, '');
                    document.body.classList.add(`theme-${newTheme}`);
                    this.dispatchThemeChangeEvent(newTheme);
                }
            });
        }
    }

    // Tắt listener theme hệ thống
    disableSystemThemeListener() {
        if (this.mediaQuery) {
            this.mediaQuery.removeEventListener('change', this.mediaQuery);
            this.mediaQuery = null;
        }
    }

    // Lấy thống kê theme
    getThemeStats() {
        const stats = {
            currentTheme: this.currentTheme,
            isAutoTheme: this.isAutoTheme,
            systemTheme: this.systemTheme,
            availableThemes: this.availableThemes,
            isDark: this.isDarkMode(),
            isLight: this.isLightMode()
        };
        
        return stats;
    }

    // Cập nhật thống kê theme
    updateThemeStats() {
        this.systemTheme = this.getSystemTheme();
        return this.getThemeStats();
    }

    // Reset theme về mặc định
    resetTheme() {
        this.setTheme('light');
    }

    // Lấy danh sách theme có sẵn
    getAvailableThemes() {
        return this.availableThemes;
    }

    // Áp dụng theme với transition
    applyThemeWithTransition(theme) {
        this.addTransitionEffect();
        this.applyTheme(theme);
        
        setTimeout(() => {
            const root = document.documentElement;
            root.style.transition = '';
        }, this.transitionDuration);
    }

    // Lấy màu sắc của theme
    getThemeColors(theme = this.currentTheme) {
        if (theme === 'auto') {
            theme = this.getSystemTheme();
        }
        return this.themeVariables[theme] || this.themeVariables.light;
    }

    // Export cấu hình theme
    exportThemeConfig() {
        return {
            currentTheme: this.currentTheme,
            availableThemes: this.availableThemes,
            themeVariables: this.themeVariables,
            timestamp: new Date().toISOString()
        };
    }

    // Import cấu hình theme
    importThemeConfig(config) {
        try {
            if (config.themeVariables) {
                this.themeVariables = config.themeVariables;
            }
            if (config.currentTheme && this.availableThemes.includes(config.currentTheme)) {
                this.setTheme(config.currentTheme);
            }
            return true;
        } catch (error) {
            console.error('Error importing theme config:', error);
            return false;
        }
    }

    // Destroy theme manager
    destroy() {
        this.disableSystemThemeListener();
        window.removeEventListener('theme-change', this.dispatchThemeChangeEvent);
    }
}
