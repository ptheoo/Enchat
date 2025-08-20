/**
 * ChatService - Service xử lý chat với backend FastAPI
 */

export class ChatService {
    constructor() {
        this.baseURL = 'http://127.0.0.1:8000/api/v1';
        this.conversation = [];
        this.isTyping = false;
        this.messageQueue = [];
        this.retryAttempts = 3;
        this.retryDelay = 1000;
        
        // Load conversation history from localStorage
        this.loadConversation();
        
        // Setup event listeners
        this.setupEventListeners();
    }

    // Khởi tạo service
    async init() {
        try {
            // Load chat history from backend
            await this.loadHistory();
            console.log('ChatService initialized successfully');
        } catch (error) {
            console.error('Error initializing ChatService:', error);
            // Continue with local conversation if backend fails
        }
    }

    // Gửi tin nhắn
    async sendMessage(message, options = {}) {
        try {
            // Add user message to conversation
            const userMessage = {
                id: this.generateMessageId(),
                role: 'user',
                content: message,
                timestamp: new Date().toISOString(),
                type: 'text'
            };

            this.conversation.push(userMessage);
            this.saveConversation();
            this.emitMessageEvent('user-message', userMessage);

            // Show typing indicator
            this.showTypingIndicator();

            // Send to backend
            const response = await this.sendToBackend(message, options);

            // Hide typing indicator
            this.hideTypingIndicator();

            // Add bot response to conversation
            const botMessage = {
                id: this.generateMessageId(),
                role: 'assistant',
                content: response.reply,
                timestamp: new Date().toISOString(),
                type: 'text'
            };

            this.conversation.push(botMessage);
            this.saveConversation();
            this.emitMessageEvent('bot-message', botMessage);

            // Play sound
            this.playMessageSound('bot');
            
            return {
                success: true,
                userMessage,
                botMessage,
                conversation: this.conversation
            };

        } catch (error) {
            console.error('Error sending message:', error);
            this.hideTypingIndicator();
            
            // Add error message
            const errorMessage = {
                id: this.generateMessageId(),
                role: 'system',
                content: 'Xin lỗi, có lỗi xảy ra. Vui lòng thử lại.',
                timestamp: new Date().toISOString(),
                type: 'error'
            };

            this.conversation.push(errorMessage);
            this.saveConversation();
            this.emitMessageEvent('error-message', errorMessage);

            throw error;
        }
    }

    // Gửi tin nhắn đến backend
    async sendToBackend(message, options = {}) {
        const token = localStorage.getItem('enchat-token');
        if (!token) {
            throw new Error('Bạn cần đăng nhập để chat');
        }

        const response = await fetch(`${this.baseURL}/chat`, {
                method: 'POST',
                headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
                },
            body: JSON.stringify({ message })
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
            throw new Error(error.detail || 'Không thể gửi tin nhắn');
        }

        return await response.json();
    }

    // Upload hình ảnh
    async uploadImage(file) {
        try {
            const token = localStorage.getItem('enchat-token');
            if (!token) {
                throw new Error('Bạn cần đăng nhập để upload hình ảnh');
            }

            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch(`${this.baseURL}/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                throw new Error(error.detail || 'Không thể upload hình ảnh');
            }

            const data = await response.json();

            // Add image message to conversation
            const imageMessage = {
                id: this.generateMessageId(),
                role: 'user',
                content: `[Hình ảnh: ${file.name}]`,
                timestamp: new Date().toISOString(),
                type: 'image',
                imageUrl: URL.createObjectURL(file),
                ocrText: data.ocr_text
            };

            this.conversation.push(imageMessage);
            this.saveConversation();
            this.emitMessageEvent('image-message', imageMessage);

            // Add bot response
            const botMessage = {
                id: this.generateMessageId(),
                role: 'assistant',
                content: data.reply,
                timestamp: new Date().toISOString(),
                type: 'text'
            };

            this.conversation.push(botMessage);
            this.saveConversation();
            this.emitMessageEvent('bot-message', botMessage);

            return {
                success: true,
                imageMessage,
                botMessage,
                ocrText: data.ocr_text
            };

        } catch (error) {
            console.error('Error uploading image:', error);
            throw error;
        }
    }

    // Load chat history từ backend
    async loadHistory() {
        try {
            const token = localStorage.getItem('enchat-token');
            if (!token) return;

            const response = await fetch(`${this.baseURL}/history`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.conversation = data.items.map(item => ({
                    id: this.generateMessageId(),
                    role: item.role,
                    content: item.content,
                    timestamp: new Date().toISOString(),
                    type: 'text'
                }));
                this.saveConversation();
                this.emitMessageEvent('history-loaded', this.conversation);
            }
        } catch (error) {
            console.error('Error loading history:', error);
        }
    }

    // Clear chat history
    async clearHistory() {
        try {
            const token = localStorage.getItem('enchat-token');
            if (!token) {
                throw new Error('Bạn cần đăng nhập để xóa lịch sử');
            }

            const response = await fetch(`${this.baseURL}/history`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                this.conversation = [];
                this.saveConversation();
                this.emitMessageEvent('history-cleared', null);
                return { success: true };
            } else {
                throw new Error('Không thể xóa lịch sử');
            }
        } catch (error) {
            console.error('Error clearing history:', error);
            throw error;
        }
    }

    // Lấy lịch sử chat
    getHistory() {
        return this.conversation;
    }

    // Lấy tin nhắn cuối cùng
    getLastMessage() {
        return this.conversation[this.conversation.length - 1];
    }

    // Lấy tin nhắn theo role
    getMessagesByRole(role) {
        return this.conversation.filter(msg => msg.role === role);
    }

    // Tìm kiếm tin nhắn
    searchMessages(query) {
        const lowerQuery = query.toLowerCase();
        return this.conversation.filter(msg => 
            msg.content.toLowerCase().includes(lowerQuery)
        );
    }

    // Export chat
    exportChat(format = 'json') {
        try {
            switch (format) {
                case 'json':
                    return this.exportAsJSON();
                case 'txt':
                    return this.exportAsTXT();
                case 'html':
                    return this.exportAsHTML();
                case 'csv':
                    return this.exportAsCSV();
                default:
                    throw new Error('Format không được hỗ trợ');
            }
        } catch (error) {
            console.error('Error exporting chat:', error);
            throw error;
        }
    }

    // Export as JSON
    exportAsJSON() {
        const data = {
            exportDate: new Date().toISOString(),
            conversation: this.conversation,
            totalMessages: this.conversation.length,
            userMessages: this.getMessagesByRole('user').length,
            botMessages: this.getMessagesByRole('assistant').length
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], {
            type: 'application/json'
        });

        return {
            blob,
            filename: `enchat-export-${new Date().toISOString().split('T')[0]}.json`
        };
    }

    // Export as TXT
    exportAsTXT() {
        let content = `EnChat Export - ${new Date().toLocaleString('vi-VN')}\n`;
        content += '='.repeat(50) + '\n\n';

        this.conversation.forEach(msg => {
            const time = new Date(msg.timestamp).toLocaleString('vi-VN');
            const role = msg.role === 'user' ? 'Bạn' : 'Bot';
            content += `[${time}] ${role}: ${msg.content}\n\n`;
        });

        const blob = new Blob([content], { type: 'text/plain' });
        return {
            blob,
            filename: `enchat-export-${new Date().toISOString().split('T')[0]}.txt`
        };
    }

    // Export as HTML
    exportAsHTML() {
        let content = `
        <!DOCTYPE html>
        <html lang="vi">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>EnChat Export</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .message { margin: 10px 0; padding: 10px; border-radius: 5px; }
                .user { background: #e3f2fd; }
                .assistant { background: #f3e5f5; }
                .system { background: #fff3e0; }
                .timestamp { color: #666; font-size: 0.8em; }
            </style>
        </head>
        <body>
            <h1>EnChat Export - ${new Date().toLocaleString('vi-VN')}</h1>
        `;

        this.conversation.forEach(msg => {
            const time = new Date(msg.timestamp).toLocaleString('vi-VN');
            const role = msg.role === 'user' ? 'Bạn' : msg.role === 'assistant' ? 'Bot' : 'Hệ thống';
            content += `
                <div class="message ${msg.role}">
                    <div class="timestamp">${time}</div>
                    <strong>${role}:</strong> ${msg.content}
                </div>
            `;
        });

        content += '</body></html>';

        const blob = new Blob([content], { type: 'text/html' });
        return {
            blob,
            filename: `enchat-export-${new Date().toISOString().split('T')[0]}.html`
        };
    }

    // Export as CSV
    exportAsCSV() {
        let content = 'Timestamp,Role,Content\n';
        
        this.conversation.forEach(msg => {
            const time = new Date(msg.timestamp).toLocaleString('vi-VN');
            const role = msg.role;
            const content = msg.content.replace(/"/g, '""'); // Escape quotes
            content += `"${time}","${role}","${content}"\n`;
        });

        const blob = new Blob([content], { type: 'text/csv' });
        return {
            blob,
            filename: `enchat-export-${new Date().toISOString().split('T')[0]}.csv`
        };
    }

    // Download export
    downloadExport(exportData) {
        const url = URL.createObjectURL(exportData.blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = exportData.filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Show typing indicator
    showTypingIndicator() {
        this.isTyping = true;
        this.emitMessageEvent('typing-start', null);
    }

    // Hide typing indicator
    hideTypingIndicator() {
        this.isTyping = false;
        this.emitMessageEvent('typing-stop', null);
    }

    // Check if typing
    isTypingNow() {
        return this.isTyping;
    }

    // Generate message ID
    generateMessageId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Save conversation to localStorage
    saveConversation() {
        localStorage.setItem('enchat-conversation', JSON.stringify(this.conversation));
    }

    // Load conversation from localStorage
    loadConversation() {
        try {
            const saved = localStorage.getItem('enchat-conversation');
            if (saved) {
                this.conversation = JSON.parse(saved);
            }
        } catch (error) {
            console.error('Error loading conversation from localStorage:', error);
            this.conversation = [];
        }
    }

    // Clear local conversation
    clearLocalConversation() {
        this.conversation = [];
        this.saveConversation();
        this.emitMessageEvent('conversation-cleared', null);
    }

    // Setup event listeners
    setupEventListeners() {
        // Listen for auth changes
        window.addEventListener('auth-change', (event) => {
            if (event.detail.type === 'logout') {
                this.clearLocalConversation();
            } else if (event.detail.type === 'login') {
                this.loadHistory();
            }
        });
    }

    // Emit message events
    emitMessageEvent(type, data) {
        const event = new CustomEvent('chat-message', {
            detail: { type, data, conversation: this.conversation }
        });
        window.dispatchEvent(event);
    }

    // Listen for message events
    onMessageEvent(callback) {
        window.addEventListener('chat-message', callback);
        return () => window.removeEventListener('chat-message', callback);
    }

    // Play message sound
    playMessageSound(role) {
        try {
            if (window.enChatApp && window.enChatApp.utils && window.enChatApp.utils.sound) {
                window.enChatApp.utils.sound.playMessageSound(role);
            }
        } catch (error) {
            console.error('Error playing message sound:', error);
        }
    }

    // Get conversation stats
    getConversationStats() {
        const userMessages = this.getMessagesByRole('user').length;
        const botMessages = this.getMessagesByRole('assistant').length;
        const systemMessages = this.getMessagesByRole('system').length;
        const totalMessages = this.conversation.length;

        return {
            totalMessages,
            userMessages,
            botMessages,
            systemMessages,
            averageResponseTime: this.calculateAverageResponseTime(),
            mostActiveHour: this.getMostActiveHour(),
            conversationDuration: this.getConversationDuration()
        };
    }

    // Calculate average response time
    calculateAverageResponseTime() {
        let totalTime = 0;
        let responseCount = 0;

        for (let i = 0; i < this.conversation.length - 1; i++) {
            const current = this.conversation[i];
            const next = this.conversation[i + 1];

            if (current.role === 'user' && next.role === 'assistant') {
                const responseTime = new Date(next.timestamp) - new Date(current.timestamp);
                totalTime += responseTime;
                responseCount++;
            }
        }

        return responseCount > 0 ? totalTime / responseCount : 0;
    }

    // Get most active hour
    getMostActiveHour() {
        const hourCounts = new Array(24).fill(0);
        
        this.conversation.forEach(msg => {
            const hour = new Date(msg.timestamp).getHours();
            hourCounts[hour]++;
        });

        return hourCounts.indexOf(Math.max(...hourCounts));
    }

    // Get conversation duration
    getConversationDuration() {
        if (this.conversation.length < 2) return 0;
        
        const first = new Date(this.conversation[0].timestamp);
        const last = new Date(this.conversation[this.conversation.length - 1].timestamp);
        
        return last - first;
    }

    // Destroy service
    destroy() {
        this.clearLocalConversation();
        window.removeEventListener('chat-message', this.onMessageEvent);
    }
}
