/**
 * EnChat - Chatbot Ngữ Pháp Tiếng Anh
 * Ứng dụng JavaScript thuần túy với giao diện đẹp tuyệt trần
 */

import { ChatService } from './services/ChatService.js';
import { AuthService } from './services/AuthService.js';
import { ThemeManager } from './utils/ThemeManager.js';
import { SoundManager } from './utils/SoundManager.js';
import { AnimationManager } from './utils/AnimationManager.js';
import { ToastManager } from './utils/ToastManager.js';

class EnChatApp {
    constructor() {
        this.components = {};
        this.services = {};
        this.utils = {};
        this.isInitialized = false;
        this.currentUser = null;
        
        // Khởi tạo ứng dụng
        this.init();
    }

    async init() {
        try {
            console.log('🚀 Khởi tạo EnChat...');
            
            // Khởi tạo các utility managers
            this.utils.theme = new ThemeManager();
            this.utils.sound = new SoundManager();
            this.utils.animation = new AnimationManager();
            this.utils.toast = new ToastManager();
            
            // Khởi tạo các services
            this.services.auth = new AuthService();
            this.services.chat = new ChatService();
            
            // Thiết lập event listeners
            this.setupEventListeners();
            
            // Khởi tạo theme
            await this.utils.theme.init();
            
            // Kiểm tra xác thực
            await this.checkAuth();
            
            // Cập nhật giao diện người dùng
            this.updateUserInterface();
            
            // Ẩn loading screen
            this.hideLoadingScreen();
            
            // Kích hoạt animations
            this.utils.animation.init();
            
            this.isInitialized = true;
            console.log('✅ EnChat đã sẵn sàng!');
            
        } catch (error) {
            console.error('❌ Lỗi khởi tạo EnChat:', error);
            this.showErrorMessage('Không thể khởi tạo ứng dụng. Vui lòng tải lại trang.');
        }
    }

    async checkAuth() {
        try {
            const isLoggedIn = await this.services.auth.isLoggedIn();
            if (!isLoggedIn) {
                // Redirect to login page if not authenticated
                window.location.href = '/login';
                return;
            }
            
            // Get current user
            this.currentUser = this.services.auth.getUser();
            
            // Start auto refresh token
            this.services.auth.startAutoRefresh();
            
        } catch (error) {
            console.error('[EnChatApp] Auth check failed:', error);
            // Continue without auth for now
        }
    }

    updateUserInterface() {
        try {
            // Cập nhật tên người dùng trong header
            const userNameElement = document.getElementById('user-name');
            if (userNameElement && this.currentUser) {
                userNameElement.textContent = this.currentUser.name || this.currentUser.email || 'Người dùng';
            }
            
            // Cập nhật avatar nếu có
            const userAvatar = document.getElementById('user-avatar');
            if (userAvatar && this.currentUser) {
                const initials = this.getInitials(this.currentUser.name || this.currentUser.email);
                userAvatar.textContent = initials;
            }
            
        } catch (error) {
            console.error('[EnChatApp] Error updating UI:', error);
        }
    }

    getInitials(name) {
        if (!name) return '?';
        return name.split(' ')
            .map(word => word.charAt(0))
            .join('')
            .toUpperCase()
            .substring(0, 2);
    }

    hideLoadingScreen() {
        try {
            const loadingScreen = document.getElementById('loading-screen');
            const app = document.getElementById('app');
            
            if (loadingScreen && app) {
                loadingScreen.classList.add('fade-out');
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                    app.style.display = 'flex';
                    app.classList.add('fade-in');
                }, 500);
            }
        } catch (error) {
            console.error('[EnChatApp] Error hiding loading screen:', error);
        }
    }

    setupEventListeners() {
        // Global keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + K: Clear chat
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.services.chat.clearHistory();
            }
            
            // Ctrl/Cmd + /: Toggle sidebar
            if ((e.ctrlKey || e.metaKey) && e.key === '/') {
                e.preventDefault();
                this.toggleSidebar();
            }
            
            // Escape: Close modals
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });

        // Window events
        window.addEventListener('resize', () => {
            if (this.utils.animation) {
            this.utils.animation.handleResize();
            }
        });

        window.addEventListener('beforeunload', () => {
            this.saveUserPreferences();
        });

        // Sidebar toggle
        const sidebarToggle = document.getElementById('sidebar-toggle');
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => this.toggleSidebar());
        }

        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.utils.theme.toggle());
        }

        // Settings button
        const settingsBtn = document.getElementById('settings-btn');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => this.openSettingsModal());
        }

        // User menu
        const userMenuBtn = document.getElementById('user-menu-btn');
        if (userMenuBtn) {
            userMenuBtn.addEventListener('click', () => this.toggleUserMenu());
        }

        // Quick topics
        const topicButtons = document.querySelectorAll('.topic-btn');
        topicButtons.forEach(button => {
            button.addEventListener('click', () => {
                const topic = button.getAttribute('data-topic');
                this.handleGrammarTopic(topic);
            });
        });

        // Sidebar links
        const clearChatBtn = document.getElementById('clear-chat-btn');
        if (clearChatBtn) {
            clearChatBtn.addEventListener('click', () => this.services.chat.clearHistory());
        }

        const exportChatBtn = document.getElementById('export-chat-btn');
        if (exportChatBtn) {
            exportChatBtn.addEventListener('click', () => this.exportChat());
        }

        // Upload button
        const uploadBtn = document.getElementById('upload-btn');
        if (uploadBtn) {
            uploadBtn.addEventListener('click', () => this.openUploadModal());
        }

        // Chat input
        const chatInput = document.getElementById('chat-input');
        if (chatInput) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
        }

        // Send button
        const sendBtn = document.getElementById('send-btn');
        if (sendBtn) {
            sendBtn.addEventListener('click', () => this.sendMessage());
        }

        // Modals
        this.setupModalEventListeners();

        // Service worker registration for PWA
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/service-worker.js')
                .then(registration => {
                    console.log('ServiceWorker registered:', registration);
                })
                .catch(error => {
                    console.log('ServiceWorker registration failed:', error);
                });
        }

        // Listen for auth changes
        this.services.auth.onAuthChange((event) => {
            if (event.detail.type === 'logout') {
                window.location.href = '/login';
            } else if (event.detail.type === 'login') {
                this.currentUser = event.detail.user;
                this.updateUserInterface();
                this.services.chat.loadHistory();
            }
        });

        // Listen for chat messages
        this.services.chat.onMessageEvent((event) => {
            if (event.detail.type === 'user-message' || event.detail.type === 'bot-message') {
                this.displayMessage(event.detail.data);
            } else if (event.detail.type === 'typing-start') {
                this.showTypingIndicator();
            } else if (event.detail.type === 'typing-stop') {
                this.hideTypingIndicator();
            }
        });
    }

    setupModalEventListeners() {
        // Settings modal
        const settingsModal = document.getElementById('settings-modal');
        const settingsCancel = document.getElementById('settings-cancel');
        const settingsSave = document.getElementById('settings-save');

        if (settingsCancel) {
            settingsCancel.addEventListener('click', () => this.closeAllModals());
        }

        if (settingsSave) {
            settingsSave.addEventListener('click', () => this.saveSettings());
        }

        // Upload modal
        const uploadModal = document.getElementById('upload-modal');
        const uploadCancel = document.getElementById('upload-cancel');
        const uploadConfirm = document.getElementById('upload-confirm');

        if (uploadCancel) {
            uploadCancel.addEventListener('click', () => this.cancelImageUpload());
        }

        if (uploadConfirm) {
            uploadConfirm.addEventListener('click', () => this.confirmImageUpload());
        }

        // Modal overlay
        const modalOverlay = document.getElementById('modal-overlay');
        if (modalOverlay) {
            modalOverlay.addEventListener('click', () => this.closeAllModals());
        }

        // Close buttons
        const closeButtons = document.querySelectorAll('.modal-close');
        closeButtons.forEach(button => {
            button.addEventListener('click', () => this.closeAllModals());
        });
    }

    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
            sidebar.classList.toggle('collapsed');
        }
    }

    toggleUserMenu() {
        const userDropdown = document.getElementById('user-dropdown');
        if (userDropdown) {
            userDropdown.classList.toggle('show');
        }
    }

    openSettingsModal() {
        const settingsModal = document.getElementById('settings-modal');
        const modalOverlay = document.getElementById('modal-overlay');
        
        if (settingsModal && modalOverlay) {
            this.setupSettingsForm();
            settingsModal.classList.add('show');
            modalOverlay.classList.add('show');
        }
    }

    openUploadModal() {
        const uploadModal = document.getElementById('upload-modal');
        const modalOverlay = document.getElementById('modal-overlay');
        
        if (uploadModal && modalOverlay) {
            this.setupUploadModal();
            uploadModal.classList.add('show');
            modalOverlay.classList.add('show');
        }
    }

    closeAllModals() {
        const modals = document.querySelectorAll('.modal');
        const modalOverlay = document.getElementById('modal-overlay');
        
        modals.forEach(modal => modal.classList.remove('show'));
        if (modalOverlay) modalOverlay.classList.remove('show');
    }

    setupSettingsForm() {
        const darkModeToggle = document.getElementById('dark-mode-toggle');
        const soundToggle = document.getElementById('sound-toggle');
        const animationToggle = document.getElementById('animation-toggle');
        const historyToggle = document.getElementById('history-toggle');
        const timeToggle = document.getElementById('time-toggle');

        if (darkModeToggle) {
            darkModeToggle.checked = this.utils.theme.isDarkMode();
            darkModeToggle.addEventListener('change', () => {
                this.utils.theme.toggle();
            });
        }

        if (soundToggle) {
            soundToggle.checked = this.utils.sound.isEnabled();
            soundToggle.addEventListener('change', () => {
                this.utils.sound.setEnabled(soundToggle.checked);
            });
        }

        if (animationToggle) {
            animationToggle.checked = this.utils.animation.isEnabled();
            animationToggle.addEventListener('change', () => {
                this.utils.animation.setEnabled(animationToggle.checked);
            });
        }

        if (historyToggle) {
            historyToggle.checked = localStorage.getItem('enchat-save-history') !== 'false';
            historyToggle.addEventListener('change', () => {
                localStorage.setItem('enchat-save-history', historyToggle.checked);
            });
        }

        if (timeToggle) {
            timeToggle.checked = localStorage.getItem('enchat-show-time') !== 'false';
            timeToggle.addEventListener('change', () => {
                localStorage.setItem('enchat-show-time', timeToggle.checked);
            });
        }
    }

    setupUploadModal() {
        const uploadArea = document.getElementById('upload-area');
        const fileInput = document.getElementById('file-input');

        if (uploadArea) {
            uploadArea.addEventListener('click', () => fileInput.click());
            uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadArea.classList.add('dragover');
            });
            uploadArea.addEventListener('dragleave', () => {
                uploadArea.classList.remove('dragover');
            });
            uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadArea.classList.remove('dragover');
                const files = e.dataTransfer.files;
                if (files.length > 0) {
                    this.handleFileSelect(files[0]);
                }
            });
        }

        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                if (e.target.files.length > 0) {
                    this.handleFileSelect(e.target.files[0]);
                }
            });
        }
    }

    handleFileSelect(file) {
        if (!file.type.startsWith('image/')) {
            this.utils.toast.error('Vui lòng chọn file hình ảnh!');
            return;
        }

        const previewImg = document.getElementById('preview-img');
        const previewName = document.getElementById('preview-name');
        const previewSize = document.getElementById('preview-size');
        const imagePreview = document.getElementById('image-preview');
        const uploadConfirm = document.getElementById('upload-confirm');

        if (previewImg && previewName && previewSize && imagePreview && uploadConfirm) {
            const reader = new FileReader();
            reader.onload = (e) => {
                previewImg.src = e.target.result;
                previewName.textContent = file.name;
                previewSize.textContent = this.formatFileSize(file.size);
                imagePreview.style.display = 'block';
                uploadConfirm.disabled = false;
            };
            reader.readAsDataURL(file);
        }
    }

    async confirmImageUpload() {
        const fileInput = document.getElementById('file-input');
        if (fileInput.files.length > 0) {
            try {
                await this.services.chat.uploadImage(fileInput.files[0]);
                this.utils.toast.success('Hình ảnh đã được tải lên thành công!');
                this.closeAllModals();
            } catch (error) {
                this.utils.toast.error('Không thể tải lên hình ảnh. Vui lòng thử lại!');
            }
        }
    }

    cancelImageUpload() {
        const fileInput = document.getElementById('file-input');
        const imagePreview = document.getElementById('image-preview');
        const uploadConfirm = document.getElementById('upload-confirm');

        if (fileInput) fileInput.value = '';
        if (imagePreview) imagePreview.style.display = 'none';
        if (uploadConfirm) uploadConfirm.disabled = true;
    }

    handleGrammarTopic(topic) {
        const topicMessages = {
            'present-simple': 'Hãy giải thích về thì hiện tại đơn trong tiếng Anh',
            'present-continuous': 'Thì hiện tại tiếp diễn được sử dụng như thế nào?',
            'past-simple': 'Khi nào sử dụng thì quá khứ đơn?',
            'future-simple': 'Cách sử dụng thì tương lai đơn',
            'nouns': 'Danh từ trong tiếng Anh có những loại nào?',
            'verbs': 'Động từ tiếng Anh được chia như thế nào?',
            'adjectives': 'Tính từ trong tiếng Anh có vị trí như thế nào?',
            'adverbs': 'Trạng từ tiếng Anh có chức năng gì?'
        };

        const message = topicMessages[topic] || 'Hãy giải thích về ngữ pháp tiếng Anh';
        this.sendMessage(message);
    }

    async sendMessage(message = null) {
        try {
            const input = document.getElementById('chat-input');
            const messageText = message || input.value.trim();
            
            if (!messageText) return;
            
            // Clear input if not from topic
            if (!message) {
                input.value = '';
            }
            
            // Send message
            await this.services.chat.sendMessage(messageText);
            
        } catch (error) {
            console.error('Error sending message:', error);
            this.utils.toast.error('Không thể gửi tin nhắn. Vui lòng thử lại!');
        }
    }

    displayMessage(message) {
        const chatMessages = document.getElementById('chat-messages');
        if (!chatMessages) return;
        
        const messageElement = document.createElement('div');
        messageElement.className = `message message-${message.role}`;
        messageElement.id = `message-${message.id}`;
        
        const timestamp = new Date(message.timestamp).toLocaleString('vi-VN');
        const showTime = localStorage.getItem('enchat-show-time') !== 'false';
        
        let content = '';
        if (message.type === 'image') {
            content = `
                <div class="message-image">
                    <img src="${message.imageUrl}" alt="Uploaded image" />
                    <div class="message-ocr">${message.ocrText || ''}</div>
                </div>
            `;
        } else {
            content = `<div class="message-text">${message.content}</div>`;
        }
        
        messageElement.innerHTML = `
            <div class="message-header">
                <span class="message-role">${message.role === 'user' ? 'Bạn' : 'Bot'}</span>
                ${showTime ? `<span class="message-time">${timestamp}</span>` : ''}
            </div>
            ${content}
            <div class="message-actions">
                ${message.role === 'assistant' ? `
                    <button class="action-btn" onclick="this.copyMessage('${message.id}')" title="Sao chép">
                        <i class="fas fa-copy"></i>
                    </button>
                    <button class="action-btn" onclick="this.regenerateMessage('${message.id}')" title="Tạo lại">
                        <i class="fas fa-redo"></i>
                    </button>
                ` : ''}
            </div>
        `;
        
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Add animation
        if (this.utils.animation) {
            this.utils.animation.fadeIn(messageElement, 300);
        }
    }

    showTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) {
            indicator.style.display = 'flex';
            if (this.utils.animation) {
                this.utils.animation.fadeIn(indicator, 200);
            }
        }
    }

    hideTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) {
            if (this.utils.animation) {
                this.utils.animation.fadeOut(indicator, 200);
            } else {
                indicator.style.display = 'none';
            }
        }
    }

    async exportChat() {
        try {
            const format = await this.showExportFormatDialog();
            if (!format) return;
            
            const exportData = this.services.chat.exportChat(format);
            this.services.chat.downloadExport(exportData);
            
            this.utils.toast.success('Chat đã được xuất thành công!');
            
        } catch (error) {
            console.error('Error exporting chat:', error);
            this.utils.toast.error('Không thể xuất chat. Vui lòng thử lại!');
        }
    }

    async showExportFormatDialog() {
        return new Promise((resolve) => {
            const formats = [
                { key: 'json', label: 'JSON', icon: 'fas fa-code' },
                { key: 'txt', label: 'Text', icon: 'fas fa-file-alt' },
                { key: 'html', label: 'HTML', icon: 'fas fa-file-code' },
                { key: 'csv', label: 'CSV', icon: 'fas fa-table' }
            ];
            
            const actions = formats.map(format => ({
                text: format.label,
                icon: format.icon,
                handler: () => resolve(format.key)
            }));
            
            this.utils.toast.showWithActions(
                'Chọn định dạng xuất chat:',
                'info',
                actions,
                0
            );
            
            // Auto resolve after 10 seconds
            setTimeout(() => resolve('json'), 10000);
        });
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    saveSettings() {
        this.utils.toast.success('Cài đặt đã được lưu!');
        this.closeAllModals();
    }

    showErrorMessage(message) {
        this.utils.toast.error(message);
    }

    saveUserPreferences() {
        const preferences = {
            theme: this.utils.theme.getCurrentTheme(),
            soundEnabled: this.utils.sound.isEnabled(),
            animationEnabled: this.utils.animation.isEnabled()
        };

        localStorage.setItem('enchat-preferences', JSON.stringify(preferences));
    }

    // Public API methods
    getChatHistory() {
        return this.services.chat.getHistory();
    }

    // Utility methods
    showNotification(title, options = {}) {
        if (this.utils.sound.isEnabled()) {
            new Notification(title, {
                icon: '/static/favicon.ico',
                badge: '/static/favicon.ico',
                ...options
            });
        }
    }

    playSound(soundType) {
        if (this.utils.sound.isEnabled()) {
            this.utils.sound.playSound(soundType);
        }
    }

    // Copy message to clipboard
    copyMessage(messageId) {
        const messageElement = document.getElementById(`message-${messageId}`);
        if (!messageElement) return;
        
        const textElement = messageElement.querySelector('.message-text');
        if (!textElement) return;
        
        navigator.clipboard.writeText(textElement.textContent).then(() => {
            this.utils.toast.success('Đã sao chép tin nhắn!');
        }).catch(() => {
            this.utils.toast.error('Không thể sao chép tin nhắn');
        });
    }

    // Regenerate message
    async regenerateMessage(messageId) {
        try {
            const messageElement = document.getElementById(`message-${messageId}`);
            if (!messageElement) return;
            
            const textElement = messageElement.querySelector('.message-text');
            if (!textElement) return;
            
            // Remove old message
            messageElement.remove();
            
            // Send the same message again
            await this.sendMessage(textElement.textContent);
            
        } catch (error) {
            console.error('Error regenerating message:', error);
            this.utils.toast.error('Không thể tạo lại tin nhắn');
        }
    }
}

// Khởi tạo ứng dụng khi DOM đã sẵn sàng
document.addEventListener('DOMContentLoaded', () => {
    // Khởi tạo ứng dụng
    window.enChatApp = new EnChatApp();
});

// Export để sử dụng trong các module khác
export { EnChatApp };
