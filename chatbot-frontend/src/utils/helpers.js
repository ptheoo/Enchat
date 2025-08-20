/**
 * Helpers - Các utility functions cho ứng dụng EnChat
 */

import { CONFIG } from './config.js';

/**
 * Debounce function để tránh gọi quá nhiều lần
 */
export const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

/**
 * Throttle function để giới hạn tần suất gọi
 */
export const throttle = (func, limit) => {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

/**
 * Format thời gian cho tin nhắn
 */
export const formatTime = (date) => {
    if (!date) return '';
    
    const now = new Date();
    const messageDate = new Date(date);
    const diffInHours = (now - messageDate) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
        return messageDate.toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit'
        });
    } else if (diffInHours < 48) {
        return 'Hôm qua';
    } else {
        return messageDate.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }
};

/**
 * Format kích thước file
 */
export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Validate email
 */
export const isValidEmail = (email) => {
    return CONFIG.VALIDATION.EMAIL.test(email);
};

/**
 * Validate password
 */
export const isValidPassword = (password) => {
    return password && password.length >= CONFIG.VALIDATION.PASSWORD_MIN_LENGTH;
};

/**
 * Validate name
 */
export const isValidName = (name) => {
    return name && name.trim().length >= CONFIG.VALIDATION.NAME_MIN_LENGTH;
};

/**
 * Validate message
 */
export const isValidMessage = (message) => {
    return message && message.trim().length >= CONFIG.VALIDATION.MESSAGE_MIN_LENGTH;
};

/**
 * Sanitize HTML để tránh XSS
 */
export const sanitizeHTML = (str) => {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
};

/**
 * Escape HTML entities
 */
export const escapeHTML = (str) => {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
};

/**
 * Generate unique ID
 */
export const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Deep clone object
 */
export const deepClone = (obj) => {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof Array) return obj.map(item => deepClone(item));
    if (typeof obj === 'object') {
        const clonedObj = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                clonedObj[key] = deepClone(obj[key]);
            }
        }
        return clonedObj;
    }
};

/**
 * Merge objects
 */
export const mergeObjects = (target, ...sources) => {
    if (!sources.length) return target;
    const source = sources.shift();
    
    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]) Object.assign(target, { [key]: {} });
                mergeObjects(target[key], source[key]);
            } else {
                Object.assign(target, { [key]: source[key] });
            }
        }
    }
    
    return mergeObjects(target, ...sources);
};

/**
 * Check if value is object
 */
export const isObject = (item) => {
    return item && typeof item === 'object' && !Array.isArray(item);
};

/**
 * Check if value is empty
 */
export const isEmpty = (value) => {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string') return value.trim().length === 0;
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === 'object') return Object.keys(value).length === 0;
    return false;
};

/**
 * Capitalize first letter
 */
export const capitalize = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Truncate text
 */
export const truncate = (str, length = 100, suffix = '...') => {
    if (!str || str.length <= length) return str;
    return str.substring(0, length) + suffix;
};

/**
 * Generate random color
 */
export const generateRandomColor = () => {
    const colors = [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
        '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
};

/**
 * Check if element is in viewport
 */
export const isInViewport = (element) => {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
};

/**
 * Smooth scroll to element
 */
export const smoothScrollTo = (element, offset = 0) => {
    if (!element) return;
    
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;
    
    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
    });
};

/**
 * Add loading state to element
 */
export const addLoadingState = (element, text = 'Đang tải...') => {
    if (!element) return;
    
    element.disabled = true;
    element.dataset.originalText = element.textContent;
    element.textContent = text;
    element.classList.add('loading');
};

/**
 * Remove loading state from element
 */
export const removeLoadingState = (element) => {
    if (!element) return;
    
    element.disabled = false;
    element.textContent = element.dataset.originalText || '';
    element.classList.remove('loading');
    delete element.dataset.originalText;
};

/**
 * Show notification
 */
export const showNotification = (message, type = 'info', duration = 3000) => {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Show with animation
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Auto remove
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, duration);
};

/**
 * Copy text to clipboard
 */
export const copyToClipboard = async (text) => {
    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
            return true;
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            try {
                document.execCommand('copy');
                textArea.remove();
                return true;
            } catch (err) {
                textArea.remove();
                return false;
            }
        }
    } catch (err) {
        return false;
    }
};

/**
 * Download file
 */
export const downloadFile = (content, filename, contentType = 'text/plain') => {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
};

/**
 * Parse URL parameters
 */
export const getUrlParams = () => {
    const params = new URLSearchParams(window.location.search);
    const result = {};
    
    for (const [key, value] of params) {
        result[key] = value;
    }
    
    return result;
};

/**
 * Set URL parameter
 */
export const setUrlParam = (key, value) => {
    const url = new URL(window.location);
    url.searchParams.set(key, value);
    window.history.pushState({}, '', url);
};

/**
 * Remove URL parameter
 */
export const removeUrlParam = (key) => {
    const url = new URL(window.location);
    url.searchParams.delete(key);
    window.history.pushState({}, '', url);
};

/**
 * Check if device is mobile
 */
export const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

/**
 * Check if device is touch
 */
export const isTouch = () => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

/**
 * Get device pixel ratio
 */
export const getDevicePixelRatio = () => {
    return window.devicePixelRatio || 1;
};

/**
 * Throttle scroll events
 */
export const throttleScroll = (callback, delay = 100) => {
    let ticking = false;
    
    return function() {
        if (!ticking) {
            requestAnimationFrame(() => {
                callback();
                ticking = false;
            });
            ticking = true;
        }
    };
};

/**
 * Resize observer wrapper
 */
export const createResizeObserver = (callback) => {
    if (window.ResizeObserver) {
        return new ResizeObserver(callback);
    } else {
        // Fallback for older browsers
        let frameId;
        return {
            observe: (element) => {
                const checkSize = () => {
                    callback([{ target: element }]);
                    frameId = requestAnimationFrame(checkSize);
                };
                checkSize();
            },
            unobserve: () => {
                if (frameId) {
                    cancelAnimationFrame(frameId);
                }
            }
        };
    }
};

/**
 * Intersection observer wrapper
 */
export const createIntersectionObserver = (callback, options = {}) => {
    if (window.IntersectionObserver) {
        return new IntersectionObserver(callback, options);
    } else {
        // Fallback for older browsers
        return {
            observe: (element) => {
                // Simple fallback - always trigger
                callback([{ target: element, isIntersecting: true }]);
            },
            unobserve: () => {}
        };
    }
};

/**
 * Local storage wrapper with error handling
 */
export const storage = {
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Lỗi khi lưu vào localStorage:', error);
            return false;
        }
    },
    
    get: (key, defaultValue = null) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Lỗi khi đọc từ localStorage:', error);
            return defaultValue;
        }
    },
    
    remove: (key) => {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Lỗi khi xóa từ localStorage:', error);
            return false;
        }
    },
    
    clear: () => {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('Lỗi khi xóa localStorage:', error);
            return false;
        }
    }
};

/**
 * Session storage wrapper
 */
export const sessionStorage = {
    set: (key, value) => {
        try {
            sessionStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Lỗi khi lưu vào sessionStorage:', error);
            return false;
        }
    },
    
    get: (key, defaultValue = null) => {
        try {
            const item = sessionStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Lỗi khi đọc từ sessionStorage:', error);
            return defaultValue;
        }
    },
    
    remove: (key) => {
        try {
            sessionStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Lỗi khi xóa từ sessionStorage:', error);
            return false;
        }
    }
};

/**
 * Error handler
 */
export const handleError = (error, context = '') => {
    console.error(`Lỗi ${context}:`, error);
    
    let message = 'Đã xảy ra lỗi không mong muốn.';
    
    if (error.message) {
        message = error.message;
    } else if (error.detail) {
        message = error.detail;
    } else if (typeof error === 'string') {
        message = error;
    }
    
    showNotification(message, 'error');
    
    return {
        error: true,
        message: message,
        originalError: error
    };
};

/**
 * Success handler
 */
export const handleSuccess = (message, data = null) => {
    showNotification(message, 'success');
    
    return {
        success: true,
        message: message,
        data: data
    };
};
