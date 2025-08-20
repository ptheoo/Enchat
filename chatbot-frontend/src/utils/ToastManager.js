/**
 * ToastManager - Quản lý thông báo toast của ứng dụng
 */

export class ToastManager {
    constructor() {
        this.container = null;
        this.toasts = new Map();
        this.nextId = 1;
        this.maxToasts = 5;
        this.defaultDuration = 5000;
        this.isInitialized = false;
        
        // Toast types
        this.toastTypes = {
            info: { icon: 'fas fa-info-circle', color: 'var(--info-color)', title: 'Thông tin' },
            success: { icon: 'fas fa-check-circle', color: 'var(--success-color)', title: 'Thành công' },
            warning: { icon: 'fas fa-exclamation-triangle', color: 'var(--warning-color)', title: 'Cảnh báo' },
            error: { icon: 'fas fa-times-circle', color: 'var(--error-color)', title: 'Lỗi' }
        };
        
        // Initialize
        this.init();
    }

    // Khởi tạo toast manager
    init() {
        try {
            this.createContainer();
            this.setupEventListeners();
            this.isInitialized = true;
            console.log('ToastManager initialized successfully');
        } catch (error) {
            console.error('Error initializing ToastManager:', error);
        }
    }

    // Tạo container cho toasts
    createContainer() {
        this.container = document.createElement('div');
        this.container.id = 'toast-container';
        this.container.className = 'toast-container';
        this.container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            gap: 10px;
            max-width: 400px;
            pointer-events: none;
        `;
        
        document.body.appendChild(this.container);
    }

    // Setup event listeners
    setupEventListeners() {
        // Listen for toast events
        window.addEventListener('toast-show', (event) => {
            const { message, type, duration } = event.detail;
            this.show(message, type, duration);
        });
        
        // Listen for toast hide
        window.addEventListener('toast-hide', (event) => {
            const { toastId } = event.detail;
            this.hide(toastId);
        });
    }

    // Hiển thị toast
    show(message, type = 'info', duration = null) {
        try {
            const toastId = this.generateToastId();
            const toastElement = this.createToastElement(message, type, toastId);
            
            // Add to container
            this.container.appendChild(toastElement);
            this.toasts.set(toastId, {
                element: toastElement,
                type: type,
                message: message,
                timestamp: Date.now()
            });
            
            // Show with animation
            this.showWithAnimation(toastElement);
            
            // Auto hide if duration is set
            if (duration !== 0) {
                const hideDuration = duration || this.defaultDuration;
                setTimeout(() => {
                    this.hide(toastId);
                }, hideDuration);
            }
            
            // Remove oldest toast if limit exceeded
            if (this.toasts.size > this.maxToasts) {
                this.removeOldestToast();
            }
            
            return toastId;
            
        } catch (error) {
            console.error('Error showing toast:', error);
            return null;
        }
    }

    // Tạo toast element
    createToastElement(message, type, toastId) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.id = `toast-${toastId}`;
        toast.setAttribute('data-toast-id', toastId);
        
        const toastConfig = this.toastTypes[type] || this.toastTypes.info;
        
        toast.innerHTML = `
            <div class="toast-header">
                <i class="${toastConfig.icon}" style="color: ${toastConfig.color}"></i>
                <span class="toast-title">${toastConfig.title}</span>
                <button class="toast-close" onclick="window.toastManager.hide('${toastId}')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="toast-body">
                <p class="toast-message">${message}</p>
            </div>
            <div class="toast-progress"></div>
        `;
        
        // Add styles
        toast.style.cssText = `
            background: var(--bg-primary);
            border: 1px solid var(--border-color);
            border-left: 4px solid ${toastConfig.color};
            border-radius: 8px;
            box-shadow: var(--shadow-lg);
            padding: 16px;
            margin-bottom: 8px;
            min-width: 300px;
            max-width: 400px;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease-in-out;
            pointer-events: auto;
            position: relative;
            overflow: hidden;
        `;
        
        // Add header styles
        const header = toast.querySelector('.toast-header');
        header.style.cssText = `
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 8px;
            font-weight: 600;
            color: var(--text-primary);
        `;
        
        // Add close button styles
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.style.cssText = `
            margin-left: auto;
            background: none;
            border: none;
            cursor: pointer;
            padding: 4px;
            border-radius: 4px;
            color: var(--text-secondary);
            transition: all 0.2s ease;
        `;
        
        closeBtn.addEventListener('mouseenter', () => {
            closeBtn.style.backgroundColor = 'var(--bg-tertiary)';
            closeBtn.style.color = 'var(--text-primary)';
        });
        
        closeBtn.addEventListener('mouseleave', () => {
            closeBtn.style.backgroundColor = 'transparent';
            closeBtn.style.color = 'var(--text-secondary)';
        });
        
        // Add body styles
        const body = toast.querySelector('.toast-body');
        body.style.cssText = `
            color: var(--text-secondary);
            line-height: 1.5;
        `;
        
        // Add progress bar styles
        const progress = toast.querySelector('.toast-progress');
        progress.style.cssText = `
            position: absolute;
            bottom: 0;
            left: 0;
            height: 3px;
            background: ${toastConfig.color};
            width: 100%;
            transform: scaleX(1);
            transform-origin: left;
            transition: transform linear;
        `;
        
        return toast;
    }

    // Lấy icon cho toast type
    getToastIcon(type) {
        const config = this.toastTypes[type] || this.toastTypes.info;
        return config.icon;
    }

    // Lấy title cho toast type
    getToastTitle(type) {
        const config = this.toastTypes[type] || this.toastTypes.info;
        return config.title;
    }

    // Hiển thị toast với animation
    showWithAnimation(element) {
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateX(0)';
        });
        
        // Animate progress bar
        const progress = element.querySelector('.toast-progress');
        if (progress) {
            setTimeout(() => {
                progress.style.transform = 'scaleX(0)';
            }, 100);
        }
    }

    // Ẩn toast
    hide(toastId) {
        const toast = this.toasts.get(toastId);
        if (!toast) return;
        
        const element = toast.element;
        element.style.opacity = '0';
        element.style.transform = 'translateX(100%)';
        
        setTimeout(() => {
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
            this.toasts.delete(toastId);
        }, 300);
    }

    // Xóa toast cũ nhất
    removeOldestToast() {
        if (this.toasts.size === 0) return;
        
        let oldestToastId = null;
        let oldestTimestamp = Date.now();
        
        this.toasts.forEach((toast, id) => {
            if (toast.timestamp < oldestTimestamp) {
                oldestTimestamp = toast.timestamp;
                oldestToastId = id;
            }
        });
        
        if (oldestToastId) {
            this.hide(oldestToastId);
        }
    }

    // Toast thành công
    success(message, duration = null) {
        return this.show(message, 'success', duration);
    }

    // Toast lỗi
    error(message, duration = null) {
        return this.show(message, 'error', duration);
    }

    // Toast cảnh báo
    warning(message, duration = null) {
        return this.show(message, 'warning', duration);
    }

    // Toast thông tin
    info(message, duration = null) {
        return this.show(message, 'info', duration);
    }

    // Toast với actions
    showWithActions(message, type = 'info', actions = [], duration = 0) {
        const toastId = this.show(message, type, duration);
        if (toastId && actions.length > 0) {
            this.addActionsToToast(toastId, actions);
        }
        return toastId;
    }

    // Thêm actions vào toast
    addActionsToToast(toastId, actions) {
        const toast = this.toasts.get(toastId);
        if (!toast) return;
        
        const element = toast.element;
        const body = element.querySelector('.toast-body');
        
        const actionsContainer = document.createElement('div');
        actionsContainer.className = 'toast-actions';
        actionsContainer.style.cssText = `
            display: flex;
            gap: 8px;
            margin-top: 12px;
            justify-content: flex-end;
        `;
        
        actions.forEach(action => {
            const button = document.createElement('button');
            button.textContent = action.text;
            button.className = `toast-action-btn toast-action-${action.type || 'secondary'}`;
            button.style.cssText = `
                padding: 6px 12px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
                transition: all 0.2s ease;
                background: ${action.type === 'primary' ? 'var(--accent-color)' : 'var(--bg-tertiary)'};
                color: ${action.type === 'primary' ? 'white' : 'var(--text-primary)'};
            `;
            
            button.addEventListener('click', () => {
                if (action.handler) {
                    action.handler(toastId);
                }
                this.hide(toastId);
            });
            
            button.addEventListener('mouseenter', () => {
                button.style.opacity = '0.8';
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.opacity = '1';
            });
            
            actionsContainer.appendChild(button);
        });
        
        body.appendChild(actionsContainer);
    }

    // Toast với progress bar
    showWithProgress(message, type = 'info', progress = 0) {
        const toastId = this.show(message, type, 0);
        if (toastId) {
            this.updateProgress(toastId, progress);
        }
        return toastId;
    }

    // Cập nhật progress
    updateProgress(toastId, progress) {
        const toast = this.toasts.get(toastId);
        if (!toast) return;
        
        const progressBar = toast.element.querySelector('.toast-progress');
        if (progressBar) {
            progressBar.style.transform = `scaleX(${Math.max(0, Math.min(1, progress))}`;
        }
    }

    // Toast tùy chỉnh
    showCustom(content, type = 'info', duration = null) {
        const toastId = this.generateToastId();
        const toastElement = document.createElement('div');
        toastElement.className = `toast toast-${type}`;
        toastElement.id = `toast-${toastId}`;
        toastElement.innerHTML = content;
        
        this.container.appendChild(toastElement);
        this.toasts.set(toastId, {
            element: toastElement,
            type: type,
            message: 'Custom content',
            timestamp: Date.now()
        });
        
        this.showWithAnimation(toastElement);
        
        if (duration !== 0) {
            setTimeout(() => this.hide(toastId), duration || this.defaultDuration);
        }
        
        return toastId;
    }

    // Toast tự động ẩn
    showAutoDismiss(message, type = 'info', duration = 3000) {
        return this.show(message, type, duration);
    }

    // Toast không tự ẩn
    showPersistent(message, type = 'info') {
        return this.show(message, type, 0);
    }

    // Toast với âm thanh
    showWithSound(message, type = 'info', duration = null, soundType = null) {
        const toastId = this.show(message, type, duration);
        
        if (soundType && window.enChatApp && window.enChatApp.utils && window.enChatApp.utils.sound) {
            window.enChatApp.utils.sound.playSound(soundType);
        }
        
        return toastId;
    }

    // Toast với vibration
    showWithVibration(message, type = 'info', duration = null, pattern = [100, 50, 100]) {
        const toastId = this.show(message, type, duration);
        
        if ('vibrate' in navigator) {
            navigator.vibrate(pattern);
        }
        
        return toastId;
    }

    // Toast với hình ảnh
    showWithImage(message, type = 'info', imageUrl, imageAlt = '', duration = null) {
        const toastId = this.show(message, type, duration);
        
        if (toastId && imageUrl) {
            this.addImageToToast(toastId, imageUrl, imageAlt);
        }
        
        return toastId;
    }

    // Thêm hình ảnh vào toast
    addImageToToast(toastId, imageUrl, imageAlt) {
        const toast = this.toasts.get(toastId);
        if (!toast) return;
        
        const element = toast.element;
        const body = element.querySelector('.toast-body');
        
        const image = document.createElement('img');
        image.src = imageUrl;
        image.alt = imageAlt;
        image.style.cssText = `
            width: 100%;
            max-height: 120px;
            object-fit: cover;
            border-radius: 4px;
            margin-top: 8px;
        `;
        
        body.appendChild(image);
    }

    // Xóa tất cả toasts
    clearAll() {
        this.toasts.forEach((toast, id) => {
            this.hide(id);
        });
    }

    // Lấy thông tin toast
    getToastInfo(toastId) {
        return this.toasts.get(toastId);
    }

    // Lấy tất cả toasts
    getAllToasts() {
        return Array.from(this.toasts.values());
    }

    // Cập nhật message
    updateMessage(toastId, newMessage) {
        const toast = this.toasts.get(toastId);
        if (!toast) return;
        
        const messageElement = toast.element.querySelector('.toast-message');
        if (messageElement) {
            messageElement.textContent = newMessage;
        }
        
        toast.message = newMessage;
    }

    // Cập nhật type
    updateType(toastId, newType) {
        const toast = this.toasts.get(toastId);
        if (!toast) return;
        
        const element = toast.element;
        element.className = `toast toast-${newType}`;
        
        const icon = element.querySelector('.toast-header i');
        const title = element.querySelector('.toast-title');
        const progress = element.querySelector('.toast-progress');
        
        const newConfig = this.toastTypes[newType] || this.toastTypes.info;
        
        if (icon) icon.className = newConfig.icon;
        if (title) title.textContent = newConfig.title;
        if (progress) progress.style.background = newConfig.color;
        
        toast.type = newType;
    }

    // Tạm dừng auto dismiss
    pauseAutoDismiss(toastId) {
        const toast = this.toasts.get(toastId);
        if (!toast) return;
        
        toast.paused = true;
    }

    // Tiếp tục auto dismiss
    resumeAutoDismiss(toastId) {
        const toast = this.toasts.get(toastId);
        if (!toast) return;
        
        toast.paused = false;
    }

    // Export settings
    exportSettings() {
        return {
            maxToasts: this.maxToasts,
            defaultDuration: this.defaultDuration,
            toastTypes: this.toastTypes,
            timestamp: new Date().toISOString()
        };
    }

    // Import settings
    importSettings(settings) {
        try {
            if (settings.maxToasts) {
                this.maxToasts = Math.max(1, Math.min(10, settings.maxToasts));
            }
            if (settings.defaultDuration) {
                this.defaultDuration = Math.max(1000, Math.min(30000, settings.defaultDuration));
            }
            return true;
        } catch (error) {
            console.error('Error importing toast settings:', error);
            return false;
        }
    }

    // Generate toast ID
    generateToastId() {
        return `toast_${this.nextId++}_${Date.now()}`;
    }

    // Destroy toast manager
    destroy() {
        this.clearAll();
        
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
        
        this.container = null;
        this.toasts.clear();
        this.isInitialized = false;
    }
}

// Tạo global instance
window.toastManager = new ToastManager();
