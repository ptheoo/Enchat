/**
 * AnimationManager - Quản lý animation và hiệu ứng của ứng dụng
 */

export class AnimationManager {
    constructor() {
        this.enabled = true;
        this.animations = new Map();
        this.intersectionObserver = null;
        this.resizeObserver = null;
        this.isInitialized = false;
        
        // Animation types
        this.animationTypes = {
            fadeIn: 'fade-in',
            fadeOut: 'fade-out',
            slideIn: 'slide-in',
            slideOut: 'slide-out',
            bounce: 'bounce',
            shake: 'shake',
            pulse: 'pulse',
            rotate: 'rotate',
            scale: 'scale',
            slideUp: 'slide-up',
            slideDown: 'slide-down',
            slideLeft: 'slide-left',
            slideRight: 'slide-right'
        };
        
        // Load settings
        this.loadSettings();
    }

    // Khởi tạo animation manager
    init() {
        try {
            // Setup observers
            this.initIntersectionObserver();
            this.initResizeObserver();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Initialize basic animations
            this.initBasicAnimations();
            
            this.isInitialized = true;
            console.log('AnimationManager initialized successfully');
            
        } catch (error) {
            console.error('Error initializing AnimationManager:', error);
        }
    }

    // Khởi tạo Intersection Observer
    initIntersectionObserver() {
        if (!window.IntersectionObserver) {
            console.warn('IntersectionObserver not supported');
            return;
        }

        this.intersectionObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateOnScroll(entry.target);
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            }
        );
    }

    // Khởi tạo Resize Observer
    initResizeObserver() {
        if (!window.ResizeObserver) {
            console.warn('ResizeObserver not supported');
            return;
        }

        this.resizeObserver = new ResizeObserver((entries) => {
            entries.forEach(entry => {
                this.handleResize(entry);
            });
        });
    }

    // Setup event listeners
    setupEventListeners() {
        // Mouse move events for parallax effects
        document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        
        // Touch events for mobile
        document.addEventListener('touchmove', (e) => this.handleTouchMove(e));
        
        // Scroll events
        window.addEventListener('scroll', () => this.handleScroll());
        
        // Resize events
        window.addEventListener('resize', () => this.handleResize());
    }

    // Khởi tạo animations cơ bản
    initBasicAnimations() {
        // Add animation classes to elements
        this.addAnimationClasses();
        
        // Initialize animation elements
        this.initAnimationElements();
    }

    // Thêm animation classes
    addAnimationClasses() {
        const animatedElements = document.querySelectorAll('[data-animate]');
        animatedElements.forEach(element => {
            const animationType = element.getAttribute('data-animate');
            if (this.animationTypes[animationType]) {
                element.classList.add('animate', this.animationTypes[animationType]);
            }
        });
    }

    // Khởi tạo animation elements
    initAnimationElements() {
        const animatedElements = document.querySelectorAll('[data-animate]');
        animatedElements.forEach(element => {
            this.intersectionObserver?.observe(element);
        });
    }

    // Thêm animation cho element
    addAnimation(element, type) {
        if (!element || !this.animationTypes[type]) return;
        
        element.setAttribute('data-animate', type);
        element.classList.add('animate', this.animationTypes[type]);
        
        this.intersectionObserver?.observe(element);
    }

    // Animation khi scroll
    animateOnScroll(element) {
        if (!element || !this.enabled) return;
        
        const animationType = element.getAttribute('data-animate');
        if (animationType && this.animationTypes[animationType]) {
            element.classList.add('animate-triggered');
            
            // Remove observer after animation
            setTimeout(() => {
                this.intersectionObserver?.unobserve(element);
            }, 1000);
        }
    }

    // Xử lý scroll
    handleScroll() {
        if (!this.enabled) return;
        
        this.updateScrollAnimations();
    }

    // Cập nhật scroll animations
    updateScrollAnimations() {
        const scrolledElements = document.querySelectorAll('.animate:not(.animate-triggered)');
        scrolledElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isVisible) {
                this.animateOnScroll(element);
            }
        });
    }

    // Xử lý resize
    handleResize(entry) {
        if (!this.enabled) return;
        
        // Recalculate animations for responsive elements
        this.updateResponsiveAnimations();
    }

    // Xử lý mouse move
    handleMouseMove(event) {
        if (!this.enabled) return;
        
        this.updateParallax(event);
        this.createMouseTrail(event);
    }

    // Xử lý touch move
    handleTouchMove(event) {
        if (!this.enabled) return;
        
        if (event.touches.length === 1) {
            const touch = event.touches[0];
            this.createTouchRipple(touch);
        }
    }

    // Cập nhật parallax effect
    updateParallax(event) {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        parallaxElements.forEach(element => {
            const speed = parseFloat(element.getAttribute('data-parallax')) || 0.5;
            const x = (window.innerWidth - event.pageX * speed) / 100;
            const y = (window.innerHeight - event.pageY * speed) / 100;
            
            element.style.transform = `translateX(${x}px) translateY(${y}px)`;
        });
    }

    // Tạo mouse trail
    createMouseTrail(event) {
        const trail = document.createElement('div');
        trail.className = 'mouse-trail';
        trail.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: var(--accent-color);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            left: ${event.clientX}px;
            top: ${event.clientY}px;
            opacity: 0.8;
            transition: all 0.3s ease;
        `;
        
        document.body.appendChild(trail);
        
        setTimeout(() => {
            trail.style.opacity = '0';
            trail.style.transform = 'scale(2)';
            setTimeout(() => {
                document.body.removeChild(trail);
            }, 300);
        }, 100);
    }

    // Tạo touch ripple
    createTouchRipple(touch) {
        const ripple = document.createElement('div');
        ripple.className = 'touch-ripple';
        ripple.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            background: var(--accent-color);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            left: ${touch.clientX - 10}px;
            top: ${touch.clientY - 10}px;
            opacity: 0.6;
            transform: scale(0);
            transition: all 0.4s ease;
        `;
        
        document.body.appendChild(ripple);
        
        setTimeout(() => {
            ripple.style.transform = 'scale(3)';
            ripple.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(ripple);
            }, 400);
        }, 10);
    }

    // Fade in animation
    fadeIn(element, duration = 600) {
        if (!element || !this.enabled) return;
        
        element.style.opacity = '0';
        element.style.transition = `opacity ${duration}ms ease-in-out`;
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
        });
        
        setTimeout(() => {
            element.style.transition = '';
        }, duration);
    }

    // Fade out animation
    fadeOut(element, duration = 600) {
        if (!element || !this.enabled) return;
        
        element.style.transition = `opacity ${duration}ms ease-in-out`;
        element.style.opacity = '0';
        
        setTimeout(() => {
            element.style.transition = '';
        }, duration);
    }

    // Slide in animation
    slideIn(element, direction = 'up', duration = 600) {
        if (!element || !this.enabled) return;
        
        const directions = {
            up: { transform: 'translateY(100%)', final: 'translateY(0)' },
            down: { transform: 'translateY(-100%)', final: 'translateY(0)' },
            left: { transform: 'translateX(100%)', final: 'translateX(0)' },
            right: { transform: 'translateX(-100%)', final: 'translateX(0)' }
        };
        
        const config = directions[direction] || directions.up;
        
        element.style.transform = config.transform;
        element.style.transition = `transform ${duration}ms ease-in-out`;
        
        requestAnimationFrame(() => {
            element.style.transform = config.final;
        });
        
        setTimeout(() => {
            element.style.transition = '';
        }, duration);
    }

    // Slide out animation
    slideOut(element, direction = 'up', duration = 600) {
        if (!element || !this.enabled) return;
        
        const directions = {
            up: { final: 'translateY(-100%)' },
            down: { final: 'translateY(100%)' },
            left: { final: 'translateX(-100%)' },
            right: { final: 'translateX(100%)' }
        };
        
        const config = directions[direction] || directions.up;
        
        element.style.transition = `transform ${duration}ms ease-in-out`;
        element.style.transform = config.final;
        
        setTimeout(() => {
            element.style.transition = '';
        }, duration);
    }

    // Bounce animation
    bounce(element, duration = 600) {
        if (!element || !this.enabled) return;
        
        element.style.transition = `transform ${duration}ms cubic-bezier(0.68, -0.55, 0.265, 1.55)`;
        element.style.transform = 'scale(1.2)';
        
        setTimeout(() => {
            element.style.transform = 'scale(1)';
        }, duration / 2);
        
        setTimeout(() => {
            element.style.transition = '';
        }, duration);
    }

    // Shake animation
    shake(element, duration = 600) {
        if (!element || !this.enabled) return;
        
        const keyframes = [
            { transform: 'translateX(0)' },
            { transform: 'translateX(-10px)' },
            { transform: 'translateX(10px)' },
            { transform: 'translateX(-10px)' },
            { transform: 'translateX(10px)' },
            { transform: 'translateX(0)' }
        ];
        
        element.animate(keyframes, {
            duration: duration,
            easing: 'ease-in-out'
        });
    }

    // Pulse animation
    pulse(element, duration = 600) {
        if (!element || !this.enabled) return;
        
        element.style.transition = `transform ${duration}ms ease-in-out`;
        element.style.transform = 'scale(1.1)';
        
        setTimeout(() => {
            element.style.transform = 'scale(1)';
        }, duration / 2);
        
        setTimeout(() => {
            element.style.transition = '';
        }, duration);
    }

    // Stagger animation
    staggerAnimation(elements, animationType, delay = 100) {
        if (!this.enabled) return;
        
        elements.forEach((element, index) => {
            setTimeout(() => {
                this.addAnimation(element, animationType);
            }, index * delay);
        });
    }

    // Bật/tắt animations
    setEnabled(enabled) {
        this.enabled = enabled;
        this.saveSettings();
        
        if (!enabled) {
            this.stopAllAnimations();
        }
    }

    // Kiểm tra animations có bật không
    isEnabled() {
        return this.enabled;
    }

    // Chuyển đổi animations
    toggle() {
        this.setEnabled(!this.enabled);
    }

    // Dừng tất cả animations
    stopAllAnimations() {
        const animatedElements = document.querySelectorAll('.animate');
        animatedElements.forEach(element => {
            element.style.transition = 'none';
            element.style.transform = '';
            element.classList.remove('animate', 'animate-triggered');
        });
    }

    // Destroy animation manager
    destroy() {
        // Stop observers
        if (this.intersectionObserver) {
            this.intersectionObserver.disconnect();
            this.intersectionObserver = null;
        }
        
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
            this.resizeObserver = null;
        }
        
        // Remove event listeners
        document.removeEventListener('mousemove', this.handleMouseMove);
        document.removeEventListener('touchmove', this.handleTouchMove);
        window.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener('resize', this.handleResize);
        
        // Stop all animations
        this.stopAllAnimations();
        
        this.isInitialized = false;
    }

    // Lấy thông tin animation
    getAnimationInfo() {
        return {
            enabled: this.enabled,
            isInitialized: this.isInitialized,
            hasIntersectionObserver: !!this.intersectionObserver,
            hasResizeObserver: !!this.resizeObserver,
            animationTypes: Object.keys(this.animationTypes),
            activeAnimations: document.querySelectorAll('.animate').length
        };
    }

    // Load settings từ localStorage
    loadSettings() {
        try {
            const settings = localStorage.getItem('enchat-animation-settings');
            if (settings) {
                const parsed = JSON.parse(settings);
                this.enabled = parsed.enabled !== undefined ? parsed.enabled : true;
            }
        } catch (error) {
            console.error('Error loading animation settings:', error);
        }
    }

    // Lưu settings vào localStorage
    saveSettings() {
        try {
            const settings = {
                enabled: this.enabled
            };
            localStorage.setItem('enchat-animation-settings', JSON.stringify(settings));
        } catch (error) {
            console.error('Error saving animation settings:', error);
        }
    }
}
