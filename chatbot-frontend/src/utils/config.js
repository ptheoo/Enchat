/**
 * Config - Cấu hình chung của ứng dụng EnChat
 */

export const CONFIG = {
    // API Configuration
    API: {
        BASE_URL: 'http://127.0.0.1:8000/api/v1',
        TIMEOUT: 30000, // 30 seconds
        RETRY_ATTEMPTS: 3,
        RETRY_DELAY: 1000, // 1 second
    },

    // Chat Configuration
    CHAT: {
        MAX_MESSAGE_LENGTH: 1000,
        MAX_HISTORY_MESSAGES: 100,
        TYPING_INDICATOR_DELAY: 1000, // 1 second
        AUTO_SCROLL_THRESHOLD: 100, // pixels from bottom
        MESSAGE_DEBOUNCE: 300, // milliseconds
    },

    // UI Configuration
    UI: {
        THEME: {
            DEFAULT: 'light',
            AVAILABLE: ['light', 'dark', 'auto'],
        },
        ANIMATION: {
            DURATION: 300, // milliseconds
            EASING: 'ease-in-out',
        },
        SIDEBAR: {
            WIDTH: 280, // pixels
            COLLAPSED_WIDTH: 60,
        },
        MODAL: {
            BACKDROP_BLUR: 'blur(8px)',
            Z_INDEX: 1000,
        },
    },

    // Storage Keys
    STORAGE: {
        THEME: 'enchat-theme',
        SIDEBAR_STATE: 'enchat-sidebar-state',
        CHAT_HISTORY: 'enchat-chat-history',
        USER_PREFERENCES: 'enchat-user-preferences',
        AUTH_TOKEN: 'token',
        USER_DATA: 'user',
    },

    // Keyboard Shortcuts
    SHORTCUTS: {
        NEW_CHAT: 'Ctrl+N',
        FOCUS_INPUT: 'Ctrl+L',
        TOGGLE_SIDEBAR: 'Ctrl+B',
        TOGGLE_THEME: 'Ctrl+T',
        CLEAR_CHAT: 'Ctrl+Shift+C',
        EXPORT_CHAT: 'Ctrl+Shift+E',
        HELP: 'F1',
    },

    // File Upload
    UPLOAD: {
        MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
        ALLOWED_TYPES: [
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/webp',
            'text/plain',
            'application/pdf',
        ],
        IMAGE_QUALITY: 0.8,
        COMPRESSION_ENABLED: true,
    },

    // Grammar Topics
    GRAMMAR: {
        TOPICS_PER_PAGE: 12,
        EXERCISES_PER_TOPIC: 10,
        PROGRESS_SAVE_INTERVAL: 5000, // 5 seconds
    },

    // Performance
    PERFORMANCE: {
        DEBOUNCE_DELAY: 300,
        THROTTLE_DELAY: 100,
        LAZY_LOAD_THRESHOLD: 0.1, // 10% from viewport
        CACHE_TTL: 5 * 60 * 1000, // 5 minutes
    },

    // Accessibility
    ACCESSIBILITY: {
        REDUCED_MOTION: 'prefers-reduced-motion',
        HIGH_CONTRAST: 'prefers-contrast',
        FOCUS_VISIBLE: true,
        SCREEN_READER_SUPPORT: true,
    },

    // Error Messages
    ERRORS: {
        NETWORK_ERROR: 'Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet.',
        API_ERROR: 'Lỗi từ máy chủ. Vui lòng thử lại sau.',
        AUTH_ERROR: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
        VALIDATION_ERROR: 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.',
        FILE_TOO_LARGE: 'File quá lớn. Kích thước tối đa là 10MB.',
        UNSUPPORTED_FILE_TYPE: 'Loại file không được hỗ trợ.',
        UPLOAD_FAILED: 'Tải file lên thất bại. Vui lòng thử lại.',
    },

    // Success Messages
    SUCCESS: {
        MESSAGE_SENT: 'Tin nhắn đã được gửi.',
        FILE_UPLOADED: 'File đã được tải lên thành công.',
        CHAT_CLEARED: 'Lịch sử chat đã được xóa.',
        CHAT_EXPORTED: 'Lịch sử chat đã được xuất.',
        SETTINGS_SAVED: 'Cài đặt đã được lưu.',
        PROFILE_UPDATED: 'Thông tin cá nhân đã được cập nhật.',
    },

    // Validation Rules
    VALIDATION: {
        EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        PASSWORD_MIN_LENGTH: 8,
        NAME_MIN_LENGTH: 2,
        MESSAGE_MIN_LENGTH: 1,
    },

    // Localization
    LOCALE: {
        DEFAULT: 'vi',
        AVAILABLE: ['vi', 'en'],
        FALLBACK: 'en',
    },

    // Feature Flags
    FEATURES: {
        VOICE_INPUT: false,
        VOICE_OUTPUT: false,
        OFFLINE_MODE: false,
        PUSH_NOTIFICATIONS: false,
        FILE_SHARING: true,
        CHAT_EXPORT: true,
        THEME_CUSTOMIZATION: true,
        KEYBOARD_SHORTCUTS: true,
    },

    // Development
    DEV: {
        DEBUG_MODE: false,
        LOG_LEVEL: 'info', // 'debug', 'info', 'warn', 'error'
        MOCK_API: false,
        PERFORMANCE_MONITORING: false,
    },
};

// Environment-specific configuration
export const getConfig = () => {
    const env = process.env.NODE_ENV || 'development';
    
    if (env === 'production') {
        return {
            ...CONFIG,
            API: {
                ...CONFIG.API,
                BASE_URL: 'https://your-production-domain.com/api/v1',
            },
            DEV: {
                ...CONFIG.DEV,
                DEBUG_MODE: false,
                MOCK_API: false,
            },
        };
    }
    
    if (env === 'development') {
        return {
            ...CONFIG,
            DEV: {
                ...CONFIG.DEV,
                DEBUG_MODE: true,
                LOG_LEVEL: 'debug',
            },
        };
    }
    
    return CONFIG;
};

// Runtime configuration
export const runtimeConfig = {
    // Có thể thay đổi trong runtime
    currentTheme: localStorage.getItem(CONFIG.STORAGE.THEME) || CONFIG.UI.THEME.DEFAULT,
    sidebarCollapsed: localStorage.getItem(CONFIG.STORAGE.SIDEBAR_STATE) === 'collapsed',
    isOnline: navigator.onLine,
    userPreferences: JSON.parse(localStorage.getItem(CONFIG.STORAGE.USER_PREFERENCES) || '{}'),
};

// Utility functions for config
export const updateConfig = (key, value) => {
    const keys = key.split('.');
    let current = CONFIG;
    
    for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
    }
    
    current[keys[keys.length - 1]] = value;
};

export const getConfigValue = (key, defaultValue = null) => {
    const keys = key.split('.');
    let current = CONFIG;
    
    for (const k of keys) {
        if (current && typeof current === 'object' && k in current) {
            current = current[k];
        } else {
            return defaultValue;
        }
    }
    
    return current;
};

export const isFeatureEnabled = (featureName) => {
    return CONFIG.FEATURES[featureName] === true;
};

export const getApiUrl = (endpoint) => {
    const baseUrl = getConfig().API.BASE_URL;
    return `${baseUrl}${endpoint}`;
};

export const getAuthHeaders = (token = null) => {
    const headers = {
        'Content-Type': 'application/json',
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
};

// Export default config
export default getConfig();
