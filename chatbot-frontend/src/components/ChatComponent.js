/**
 * ChatComponent - Component chính xử lý giao diện chat
 */

export class ChatComponent {
    constructor(chatService) {
        this.chatService = chatService;
        this.messages = [];
        this.currentTopic = 'basic-grammar';
        this.isTyping = false;
        
        this.init();
    }

    init() {
        this.createChatInterface();
        this.setupEventListeners();
        this.loadChatHistory();
    }

    createChatInterface() {
        // Tạo container chính
        const chatContainer = document.createElement('div');
        chatContainer.id = 'chat-container';
        chatContainer.className = 'chat-container';

        // Tạo header
        const chatHeader = this.createChatHeader();
        
        // Tạo khu vực tin nhắn
        const messagesArea = this.createMessagesArea();
        
        // Tạo khu vực nhập liệu
        const inputArea = this.createInputArea();
        
        // Ghép các phần lại
        chatContainer.appendChild(chatHeader);
        chatContainer.appendChild(messagesArea);
        chatContainer.appendChild(inputArea);
        
        // Thêm vào body
        document.body.appendChild(chatContainer);
    }

    createChatHeader() {
        const header = document.createElement('div');
        header.className = 'chat-header';
        
        header.innerHTML = `
            <div class="header-left">
                <div class="current-topic">
                    <h2>Ngữ pháp cơ bản</h2>
                    <p>Hỏi đáp về các quy tắc ngữ pháp tiếng Anh cơ bản</p>
                </div>
            </div>
            <div class="header-right">
                <div class="header-actions">
                    <button class="btn-icon" id="clearChatBtn" title="Xóa lịch sử chat (Ctrl+K)">
                        <i class="fas fa-trash"></i>
                    </button>
                    <button class="btn-icon" id="exportChatBtn" title="Xuất chat">
                        <i class="fas fa-download"></i>
                    </button>
                    <button class="btn-icon" id="fullscreenBtn" title="Toàn màn hình">
                        <i class="fas fa-expand"></i>
                    </button>
                </div>
            </div>
        `;
        
        return header;
    }

    createMessagesArea() {
        const messagesArea = document.createElement('div');
        messagesArea.id = 'messages-area';
        messagesArea.className = 'messages-area';
        
        // Tạo scroll container
        const scrollContainer = document.createElement('div');
        scrollContainer.className = 'messages-scroll-container';
        scrollContainer.id = 'messagesScrollContainer';
        
        messagesArea.appendChild(scrollContainer);
        
        return messagesArea;
    }

    createInputArea() {
        const inputArea = document.createElement('div');
        inputArea.className = 'input-area';
        
        inputArea.innerHTML = `
            <div class="input-container">
                <div class="input-wrapper">
                    <div class="input-field">
                        <textarea 
                            id="messageInput" 
                            placeholder="Nhập câu hỏi của bạn về ngữ pháp tiếng Anh..."
                            rows="1"
                            maxlength="1000"
                        ></textarea>
                        <div class="input-actions">
                            <button class="btn-icon" id="emojiBtn" title="Chọn emoji">
                                <i class="fas fa-smile"></i>
                            </button>
                            <button class="btn-icon" id="attachBtn" title="Đính kèm file">
                                <i class="fas fa-paperclip"></i>
                            </button>
                        </div>
                    </div>
                    <button class="btn-primary send-btn" id="sendBtn" disabled>
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
                <div class="input-suggestions" id="inputSuggestions">
                    <span class="suggestion-label">Gợi ý:</span>
                    <div class="suggestion-buttons">
                        <button class="suggestion-btn" data-suggestion="Thì hiện tại đơn là gì?">
                            Thì hiện tại đơn là gì?
                        </button>
                        <button class="suggestion-btn" data-suggestion="Cách sử dụng a/an/the?">
                            Cách sử dụng a/an/the?
                        </button>
                        <button class="suggestion-btn" data-suggestion="Sự khác biệt giữa much và many?">
                            Sự khác biệt giữa much và many?
                        </button>
                    </div>
                </div>
                <div class="input-footer">
                    <span class="char-count">0/1000</span>
                    <span class="input-tips">
                        <i class="fas fa-lightbulb"></i>
                        Nhấn Enter để gửi, Shift+Enter để xuống dòng
                    </span>
                </div>
            </div>
        `;
        
        return inputArea;
    }

    setupEventListeners() {
        const messageInput = document.getElementById('messageInput');
        const sendBtn = document.getElementById('sendBtn');
        const clearChatBtn = document.getElementById('clearChatBtn');
        const exportChatBtn = document.getElementById('exportChatBtn');
        const fullscreenBtn = document.getElementById('fullscreenBtn');
        const emojiBtn = document.getElementById('emojiBtn');
        const attachBtn = document.getElementById('attachBtn');

        // Xử lý input
        messageInput.addEventListener('input', (e) => {
            this.handleInputChange(e);
        });

        messageInput.addEventListener('keydown', (e) => {
            this.handleKeyDown(e);
        });

        // Xử lý nút gửi
        sendBtn.addEventListener('click', () => {
            this.sendMessage();
        });

        // Xử lý các nút khác
        clearChatBtn.addEventListener('click', () => {
            this.clearChat();
        });

        exportChatBtn.addEventListener('click', () => {
            this.exportChat();
        });

        fullscreenBtn.addEventListener('click', () => {
            this.toggleFullscreen();
        });

        emojiBtn.addEventListener('click', () => {
            this.showEmojiPicker();
        });

        attachBtn.addEventListener('click', () => {
            this.showFileAttachment();
        });

        // Xử lý gợi ý
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('suggestion-btn')) {
                const suggestion = e.target.dataset.suggestion;
                this.useSuggestion(suggestion);
            }
        });

        // Auto-resize textarea
        messageInput.addEventListener('input', () => {
            this.autoResizeTextarea(messageInput);
        });
    }

    handleInputChange(e) {
        const input = e.target;
        const sendBtn = document.getElementById('sendBtn');
        const charCount = document.querySelector('.char-count');
        
        const text = input.value.trim();
        const charCountText = `${text.length}/1000`;
        
        // Cập nhật số ký tự
        charCount.textContent = charCountText;
        
        // Kích hoạt/vô hiệu hóa nút gửi
        sendBtn.disabled = text.length === 0;
        
        // Thay đổi màu sắc dựa trên độ dài
        if (text.length > 800) {
            charCount.style.color = '#ef4444';
        } else if (text.length > 600) {
            charCount.style.color = '#f59e0b';
        } else {
            charCount.style.color = 'var(--text-muted)';
        }
    }

    handleKeyDown(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            this.sendMessage();
        }
    }

    autoResizeTextarea(textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }

    async sendMessage() {
        const messageInput = document.getElementById('messageInput');
        const text = messageInput.value.trim();
        
        if (!text || this.isTyping) return;
        
        // Tạo tin nhắn người dùng
        const userMessage = {
            id: this.generateMessageId(),
            type: 'user',
            content: { text },
            timestamp: new Date()
        };
        
        // Thêm tin nhắn vào giao diện
        this.addMessage(userMessage);
        
        // Xóa input
        messageInput.value = '';
        messageInput.style.height = 'auto';
        this.autoResizeTextarea(messageInput);
        
        // Cập nhật UI
        this.updateSendButton();
        this.updateCharCount();
        
        // Hiển thị typing indicator
        this.showTypingIndicator();
        
        try {
            // Gửi tin nhắn đến service
            const response = await this.chatService.sendMessage(text, this.currentTopic);
            
            // Ẩn typing indicator
            this.hideTypingIndicator();
            
            // Thêm phản hồi của bot
            const botMessage = {
                id: this.generateMessageId(),
                type: 'bot',
                content: response,
                timestamp: new Date()
            };
            
            this.addMessage(botMessage);
            
            // Lưu vào lịch sử
            this.saveToHistory(userMessage, botMessage);
            
        } catch (error) {
            this.hideTypingIndicator();
            this.showErrorMessage('Không thể gửi tin nhắn. Vui lòng thử lại.');
        }
    }

    addMessage(messageData) {
        const messageElement = this.createMessageElement(messageData);
        const scrollContainer = document.getElementById('messagesScrollContainer');
        
        scrollContainer.appendChild(messageElement);
        
        // Scroll xuống cuối
        this.scrollToBottom();
        
        // Thêm animation
        messageElement.classList.add('message-enter');
        
        // Lưu vào mảng
        this.messages.push(messageData);
    }

    createMessageElement(messageData) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${messageData.type}-message`;
        messageDiv.dataset.messageId = messageData.id;
        
        const { type, content, timestamp } = messageData;
        
        if (type === 'user') {
            messageDiv.innerHTML = `
                <div class="message-content">
                    <div class="message-text">${this.escapeHtml(content.text)}</div>
                    <div class="message-time">${this.formatTime(timestamp)}</div>
                </div>
                <div class="message-avatar">
                    <i class="fas fa-user"></i>
                </div>
            `;
        } else if (type === 'bot') {
            messageDiv.innerHTML = `
                <div class="message-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="message-content">
                    <div class="message-text">${this.formatBotMessage(content)}</div>
                    <div class="message-time">${this.formatTime(timestamp)}</div>
                    ${this.createMessageActions()}
                </div>
            `;
        } else if (type === 'error') {
            messageDiv.innerHTML = `
                <div class="message-avatar error">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <div class="message-content error">
                    <div class="message-text">${content.text}</div>
                    <div class="message-time">${this.formatTime(timestamp)}</div>
                    ${content.showRetry ? '<button class="retry-btn">Thử lại</button>' : ''}
                </div>
            `;
        }
        
        return messageDiv;
    }

    formatBotMessage(content) {
        let html = '';
        
        if (content.text) {
            html += `<div class="text-content">${content.text}</div>`;
        }
        
        if (content.examples && content.examples.length > 0) {
            html += '<div class="examples-section">';
            html += '<h4>Ví dụ:</h4>';
            html += '<ul>';
            content.examples.forEach(example => {
                html += `<li>${example}</li>`;
            });
            html += '</ul>';
            html += '</div>';
        }
        
        if (content.rules && content.rules.length > 0) {
            html += '<div class="rules-section">';
            html += '<h4>Quy tắc:</h4>';
            html += '<ul>';
            content.rules.forEach(rule => {
                html += `<li>${rule}</li>`;
            });
            html += '</ul>';
            html += '</div>';
        }
        
        return html;
    }

    createMessageActions() {
        return `
            <div class="message-actions">
                <button class="action-btn" title="Sao chép">
                    <i class="fas fa-copy"></i>
                </button>
                <button class="action-btn" title="Thích">
                    <i class="fas fa-thumbs-up"></i>
                </button>
                <button class="action-btn" title="Không thích">
                    <i class="fas fa-thumbs-down"></i>
                </button>
            </div>
        `;
    }

    showTypingIndicator() {
        this.isTyping = true;
        
        const typingIndicator = document.createElement('div');
        typingIndicator.id = 'typing-indicator';
        typingIndicator.className = 'typing-indicator';
        
        typingIndicator.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content typing">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <div class="typing-text">EnChat đang soạn tin nhắn...</div>
            </div>
        `;
        
        const scrollContainer = document.getElementById('messagesScrollContainer');
        scrollContainer.appendChild(typingIndicator);
        
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        this.isTyping = false;
        
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    scrollToBottom() {
        const scrollContainer = document.getElementById('messagesScrollContainer');
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }

    // Utility methods
    generateMessageId() {
        return 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    formatTime(timestamp) {
        const now = new Date();
        const diff = now - timestamp;
        
        if (diff < 60000) { // < 1 phút
            return 'Vừa xong';
        } else if (diff < 3600000) { // < 1 giờ
            const minutes = Math.floor(diff / 60000);
            return `${minutes} phút trước`;
        } else if (diff < 86400000) { // < 1 ngày
            const hours = Math.floor(diff / 3600000);
            return `${hours} giờ trước`;
        } else {
            return timestamp.toLocaleDateString('vi-VN');
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    updateSendButton() {
        const sendBtn = document.getElementById('sendBtn');
        sendBtn.disabled = true;
    }

    updateCharCount() {
        const charCount = document.querySelector('.char-count');
        charCount.textContent = '0/1000';
        charCount.style.color = 'var(--text-muted)';
    }

    // Public methods
    clearChat() {
        if (confirm('Bạn có chắc muốn xóa toàn bộ lịch sử chat?')) {
            this.messages = [];
            const scrollContainer = document.getElementById('messagesScrollContainer');
            scrollContainer.innerHTML = '';
            localStorage.removeItem('enchat-chat-history');
        }
    }

    exportChat() {
        const chatData = {
            topic: this.currentTopic,
            exportDate: new Date().toISOString(),
            messages: this.messages
        };
        
        const blob = new Blob([JSON.stringify(chatData, null, 2)], {
            type: 'application/json'
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `enchat-export-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }

    showEmojiPicker() {
        // TODO: Implement emoji picker
        console.log('Emoji picker coming soon!');
    }

    showFileAttachment() {
        // TODO: Implement file attachment
        console.log('File attachment coming soon!');
    }

    useSuggestion(suggestion) {
        const messageInput = document.getElementById('messageInput');
        messageInput.value = suggestion;
        messageInput.focus();
        this.handleInputChange({ target: messageInput });
    }

    showErrorMessage(message) {
        const errorMessage = {
            id: this.generateMessageId(),
            type: 'error',
            content: { text: message, showRetry: true },
            timestamp: new Date()
        };
        
        this.addMessage(errorMessage);
    }

    changeTopic(topicId) {
        this.currentTopic = topicId;
        
        // Cập nhật header
        const topicTitle = document.querySelector('.current-topic h2');
        const topicDesc = document.querySelector('.current-topic p');
        
        const topics = {
            'basic-grammar': { title: 'Ngữ pháp cơ bản', desc: 'Hỏi đáp về các quy tắc ngữ pháp tiếng Anh cơ bản' },
            'tenses': { title: 'Thì trong tiếng Anh', desc: 'Học và hiểu các thì trong tiếng Anh' },
            'parts-of-speech': { title: 'Từ loại', desc: 'Tìm hiểu về danh từ, động từ, tính từ và các từ loại khác' },
            'sentence-structure': { title: 'Cấu trúc câu', desc: 'Học cách xây dựng câu đúng ngữ pháp' },
            'common-mistakes': { title: 'Lỗi thường gặp', desc: 'Tránh những lỗi ngữ pháp phổ biến' }
        };
        
        if (topics[topicId]) {
            topicTitle.textContent = topics[topicId].title;
            topicDesc.textContent = topics[topicId].desc;
        }
    }

    // History management
    loadChatHistory() {
        const saved = localStorage.getItem('enchat-chat-history');
        if (saved) {
            try {
                const history = JSON.parse(saved);
                this.messages = history.messages || [];
                this.currentTopic = history.topic || 'basic-grammar';
                
                // Hiển thị lại các tin nhắn
                this.messages.forEach(msg => {
                    this.addMessage(msg);
                });
                
                this.changeTopic(this.currentTopic);
            } catch (error) {
                console.error('Lỗi khi tải lịch sử chat:', error);
            }
        }
    }

    saveToHistory(userMessage, botMessage) {
        const history = {
            topic: this.currentTopic,
            messages: this.messages
        };
        
        localStorage.setItem('enchat-chat-history', JSON.stringify(history));
    }

    getHistory() {
        return this.messages;
    }
}
