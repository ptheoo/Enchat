/**
 * SoundManager - Quản lý âm thanh của ứng dụng
 */

export class SoundManager {
    constructor() {
        this.enabled = true;
        this.volume = 0.5;
        this.audioContext = null;
        this.sounds = {};
        this.audioFiles = {};
        this.isInitialized = false;
        
        // Load settings from localStorage
        this.loadSettings();
        
        // Sound types
        this.soundTypes = {
            notification: { frequency: 800, duration: 0.3, type: 'sine' },
            message: { frequency: 600, duration: 0.2, type: 'sine' },
            error: { frequency: 400, duration: 0.4, type: 'sawtooth' },
            success: { frequency: 1000, duration: 0.3, type: 'sine' },
            typing: { frequency: 1200, duration: 0.1, type: 'triangle' },
            click: { frequency: 1500, duration: 0.1, type: 'square' },
            hover: { frequency: 1800, duration: 0.05, type: 'sine' }
        };
    }

    // Khởi tạo sound manager
    async init() {
        try {
            // Initialize Web Audio API
            await this.initAudioContext();
            
            // Create default sounds
            this.createSounds();
            
            // Load audio files if available
            await this.loadAudioFiles();
            
            this.isInitialized = true;
            console.log('SoundManager initialized successfully');
            
        } catch (error) {
            console.error('Error initializing SoundManager:', error);
            // Continue without audio context
        }
    }

    // Khởi tạo Audio Context
    async initAudioContext() {
        try {
            if (window.AudioContext || window.webkitAudioContext) {
                const AudioContextClass = window.AudioContext || window.webkitAudioContext;
                this.audioContext = new AudioContextClass();
                
                // Resume audio context if suspended
                if (this.audioContext.state === 'suspended') {
                    await this.audioContext.resume();
                }
                
                console.log('Audio Context initialized:', this.audioContext.state);
            }
        } catch (error) {
            console.error('Error initializing Audio Context:', error);
            this.audioContext = null;
        }
    }

    // Tạo các âm thanh cơ bản
    createSounds() {
        if (!this.audioContext) return;
        
        Object.entries(this.soundTypes).forEach(([type, config]) => {
            this.sounds[type] = () => {
                this.playTone(config.frequency, config.duration, config.type);
            };
        });
    }

    // Tạo âm thanh thông báo
    createNotificationSound() {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(this.volume, this.audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.3);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.3);
    }

    // Tạo âm thanh tin nhắn
    createMessageSound() {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(this.volume * 0.7, this.audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.2);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.2);
    }

    // Tạo âm thanh lỗi
    createErrorSound() {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
        oscillator.type = 'sawtooth';
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(this.volume * 0.8, this.audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.4);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.4);
    }

    // Tạo âm thanh thành công
    createSuccessSound() {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(1000, this.audioContext.currentTime);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(this.volume * 0.6, this.audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.3);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.3);
    }

    // Tạo âm thanh typing
    createTypingSound() {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(1200, this.audioContext.currentTime);
        oscillator.type = 'triangle';
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(this.volume * 0.3, this.audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.1);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.1);
    }

    // Phát âm thanh
    playSound(soundType) {
        if (!this.enabled || !this.isInitialized) return;
        
        try {
            if (this.sounds[soundType]) {
                this.sounds[soundType]();
            } else if (this.audioFiles[soundType]) {
                this.playAudioFile(this.audioFiles[soundType]);
            } else {
                console.warn('Sound type not found:', soundType);
            }
        } catch (error) {
            console.error('Error playing sound:', error);
        }
    }

    // Phát âm thanh thông báo
    playNotificationSound() {
        this.playSound('notification');
    }

    // Phát âm thanh tin nhắn
    playMessageSound(role = 'user') {
        if (role === 'user') {
            this.playSound('click');
        } else {
            this.playSound('message');
        }
    }

    // Phát âm thanh lỗi
    playErrorSound() {
        this.playSound('error');
    }

    // Phát âm thanh thành công
    playSuccessSound() {
        this.playSound('success');
    }

    // Phát âm thanh typing
    playTypingSound() {
        this.playSound('typing');
    }

    // Bật/tắt âm thanh
    setEnabled(enabled) {
        this.enabled = enabled;
        this.saveSettings();
        
        // Emit event
        this.dispatchSoundChangeEvent();
    }

    // Đặt âm lượng
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        this.saveSettings();
        
        // Emit event
        this.dispatchSoundChangeEvent();
    }

    // Lấy âm lượng
    getVolume() {
        return this.volume;
    }

    // Kiểm tra âm thanh có bật không
    isEnabled() {
        return this.enabled;
    }

    // Chuyển đổi âm thanh
    toggle() {
        this.setEnabled(!this.enabled);
    }

    // Tắt âm thanh
    mute() {
        this.setEnabled(false);
    }

    // Bật âm thanh
    unmute() {
        this.setEnabled(true);
    }

    // Phát file âm thanh
    async playAudioFile(url) {
        try {
            const audio = new Audio(url);
            audio.volume = this.volume;
            await audio.play();
        } catch (error) {
            console.error('Error playing audio file:', error);
        }
    }

    // Phát âm thanh với tần số cụ thể
    playTone(frequency, duration = 0.2, type = 'sine') {
        if (!this.audioContext || !this.enabled) return;
        
        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
            oscillator.type = type;
            
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(this.volume, this.audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + duration);
            
        } catch (error) {
            console.error('Error playing tone:', error);
        }
    }

    // Phát giai điệu
    playMelody(notes, noteDuration = 0.2) {
        if (!this.audioContext || !this.enabled) return;
        
        notes.forEach((note, index) => {
            setTimeout(() => {
                this.playTone(note.frequency, noteDuration, note.type || 'sine');
            }, index * noteDuration * 1000);
        });
    }

    // Phát âm thanh click
    playClickSound() {
        this.playSound('click');
    }

    // Phát âm thanh hover
    playHoverSound() {
        this.playSound('hover');
    }

    // Phát giai điệu thành công
    playSuccessMelody() {
        const notes = [
            { frequency: 523.25, type: 'sine' }, // C5
            { frequency: 659.25, type: 'sine' }, // E5
            { frequency: 783.99, type: 'sine' }  // G5
        ];
        this.playMelody(notes, 0.15);
    }

    // Phát giai điệu lỗi
    playErrorMelody() {
        const notes = [
            { frequency: 523.25, type: 'sawtooth' }, // C5
            { frequency: 493.88, type: 'sawtooth' }  // B4
        ];
        this.playMelody(notes, 0.3);
    }

    // Test âm thanh
    testSound() {
        if (!this.enabled) {
            console.warn('Sound is disabled');
            return;
        }
        
        this.playTone(440, 0.5, 'sine'); // A4 note
    }

    // Lấy thông tin âm thanh
    getSoundInfo() {
        return {
            enabled: this.enabled,
            volume: this.volume,
            isInitialized: this.isInitialized,
            audioContextState: this.audioContext ? this.audioContext.state : 'not available',
            availableSounds: Object.keys(this.sounds),
            availableAudioFiles: Object.keys(this.audioFiles)
        };
    }

    // Export cài đặt âm thanh
    exportSoundSettings() {
        return {
            enabled: this.enabled,
            volume: this.volume,
            timestamp: new Date().toISOString()
        };
    }

    // Import cài đặt âm thanh
    importSoundSettings(settings) {
        try {
            if (typeof settings.enabled === 'boolean') {
                this.enabled = settings.enabled;
            }
            if (typeof settings.volume === 'number') {
                this.volume = Math.max(0, Math.min(1, settings.volume));
            }
            this.saveSettings();
            return true;
        } catch (error) {
            console.error('Error importing sound settings:', error);
            return false;
        }
    }

    // Load audio files
    async loadAudioFiles() {
        // Preload common audio files
        const audioUrls = {
            notification: '/static/sounds/notification.mp3',
            message: '/static/sounds/message.mp3',
            error: '/static/sounds/error.mp3',
            success: '/static/sounds/success.mp3'
        };
        
        for (const [type, url] of Object.entries(audioUrls)) {
            try {
                const audio = new Audio();
                audio.preload = 'auto';
                audio.src = url;
                this.audioFiles[type] = url;
            } catch (error) {
                console.warn('Could not load audio file:', url);
            }
        }
    }

    // Load settings từ localStorage
    loadSettings() {
        try {
            const settings = localStorage.getItem('enchat-sound-settings');
            if (settings) {
                const parsed = JSON.parse(settings);
                this.enabled = parsed.enabled !== undefined ? parsed.enabled : true;
                this.volume = parsed.volume !== undefined ? parsed.volume : 0.5;
            }
        } catch (error) {
            console.error('Error loading sound settings:', error);
        }
    }

    // Lưu settings vào localStorage
    saveSettings() {
        try {
            const settings = {
                enabled: this.enabled,
                volume: this.volume
            };
            localStorage.setItem('enchat-sound-settings', JSON.stringify(settings));
        } catch (error) {
            console.error('Error saving sound settings:', error);
        }
    }

    // Destroy sound manager
    destroy() {
        if (this.audioContext) {
            this.audioContext.close();
            this.audioContext = null;
        }
        
        this.sounds = {};
        this.audioFiles = {};
        this.isInitialized = false;
    }

    // Dispatch sound change event
    dispatchSoundChangeEvent() {
        const event = new CustomEvent('sound-change', {
            detail: {
                enabled: this.enabled,
                volume: this.volume,
                timestamp: new Date().toISOString()
            }
        });
        window.dispatchEvent(event);
    }
}
