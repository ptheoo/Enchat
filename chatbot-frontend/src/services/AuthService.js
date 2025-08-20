/**
 * AuthService - Service xử lý authentication với backend FastAPI
 */

export class AuthService {
    constructor() {
        this.baseURL = 'http://127.0.0.1:8000/api/v1';
        this.token = localStorage.getItem('enchat-token');
        this.user = JSON.parse(localStorage.getItem('enchat-user') || 'null');
        this.isAuthenticated = !!this.token;
        
        // Kiểm tra token khi khởi tạo
        if (this.token) {
            this.validateToken();
        }
    }

    // Kiểm tra token có hợp lệ không
    async validateToken() {
        try {
            const response = await fetch(`${this.baseURL}/auth/me`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const userData = await response.json();
                this.user = userData;
                this.isAuthenticated = true;
                return true;
            } else {
                // Token không hợp lệ
                this.logout();
                return false;
            }
        } catch (error) {
            console.error('Lỗi khi kiểm tra token:', error);
            this.logout();
            return false;
        }
    }

    // Đăng nhập
    async login(email, password) {
        try {
            const response = await fetch(`${this.baseURL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                throw new Error(error.detail || 'Đăng nhập thất bại');
            }

            const data = await response.json();
            
            // Lưu token và thông tin người dùng
            this.token = data.access_token;
            this.user = {
                email: email,
                name: data.name || email
            };
            this.isAuthenticated = true;
            
            localStorage.setItem('enchat-token', data.access_token);
            localStorage.setItem('enchat-user', JSON.stringify(this.user));
            
            // Emit event đăng nhập thành công
            this.emitAuthEvent('login', this.user);
            
            return {
                success: true,
                user: this.user,
                token: this.token
            };

        } catch (error) {
            console.error('Lỗi đăng nhập:', error);
            throw error;
        }
    }

    // Đăng ký
    async register(name, email, password) {
        try {
            const response = await fetch(`${this.baseURL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password })
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                throw new Error(error.detail || 'Đăng ký thất bại');
            }

            const data = await response.json();
            
            // Emit event đăng ký thành công
            this.emitAuthEvent('register', { name, email });
            
            return {
                success: true,
                message: 'Đăng ký thành công! Vui lòng đăng nhập.'
            };

        } catch (error) {
            console.error('Lỗi đăng ký:', error);
            throw error;
        }
    }

    // Quên mật khẩu
    async forgotPassword(email) {
        try {
            const response = await fetch(`${this.baseURL}/auth/forgot`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                throw new Error(error.detail || 'Không thể gửi email reset password');
            }

            const data = await response.json();
            
            return {
                success: true,
                message: data.msg || 'Email reset password đã được gửi!'
            };

        } catch (error) {
            console.error('Lỗi quên mật khẩu:', error);
            throw error;
        }
    }

    // Đăng xuất
    logout() {
        this.token = null;
        this.user = null;
        this.isAuthenticated = false;
        
        localStorage.removeItem('enchat-token');
        localStorage.removeItem('enchat-user');
        
        // Emit event đăng xuất
        this.emitAuthEvent('logout', null);
        
        // Redirect về trang login
        window.location.href = '/login';
    }

    // Kiểm tra trạng thái đăng nhập
    isLoggedIn() {
        return this.isAuthenticated && !!this.token;
    }

    // Lấy thông tin người dùng hiện tại
    getUser() {
        return this.user;
    }

    // Lấy token hiện tại
    getToken() {
        return this.token;
    }

    // Kiểm tra quyền truy cập
    hasPermission(permission) {
        if (!this.user) return false;
        // TODO: Implement permission checking
        return true;
    }

    // Cập nhật thông tin người dùng
    async updateProfile(updates) {
        try {
            const response = await fetch(`${this.baseURL}/auth/profile`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updates)
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                throw new Error(error.detail || 'Không thể cập nhật profile');
            }

            const data = await response.json();
            this.user = { ...this.user, ...data };
            localStorage.setItem('enchat-user', JSON.stringify(this.user));
            
            return {
                success: true,
                user: this.user
            };

        } catch (error) {
            console.error('Lỗi cập nhật profile:', error);
            throw error;
        }
    }

    // Đổi mật khẩu
    async changePassword(currentPassword, newPassword) {
        try {
            const response = await fetch(`${this.baseURL}/auth/change-password`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    current_password: currentPassword,
                    new_password: newPassword
                })
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                throw new Error(error.detail || 'Không thể đổi mật khẩu');
            }

            return {
                success: true,
                message: 'Mật khẩu đã được thay đổi thành công!'
            };

        } catch (error) {
            console.error('Lỗi đổi mật khẩu:', error);
            throw error;
        }
    }

    // Emit auth events
    emitAuthEvent(type, data) {
        const event = new CustomEvent('auth-change', {
            detail: { type, data, user: this.user, isAuthenticated: this.isAuthenticated }
        });
        window.dispatchEvent(event);
    }

    // Lắng nghe auth events
    onAuthChange(callback) {
        window.addEventListener('auth-change', callback);
        return () => window.removeEventListener('auth-change', callback);
    }

    // Kiểm tra token expiration
    isTokenExpired() {
        if (!this.token) return true;
        
        try {
            const payload = JSON.parse(atob(this.token.split('.')[1]));
            const exp = payload.exp * 1000; // Convert to milliseconds
            return Date.now() >= exp;
        } catch (error) {
            console.error('Lỗi kiểm tra token expiration:', error);
            return true;
        }
    }

    // Refresh token
    async refreshToken() {
        try {
            const response = await fetch(`${this.baseURL}/auth/refresh`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.token = data.access_token;
                localStorage.setItem('enchat-token', data.access_token);
                return true;
            } else {
                this.logout();
                return false;
            }
        } catch (error) {
            console.error('Lỗi refresh token:', error);
            this.logout();
            return false;
        }
    }

    // Auto refresh token before expiration
    startAutoRefresh() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }

        this.refreshInterval = setInterval(async () => {
            if (this.isTokenExpired()) {
                await this.refreshToken();
            }
        }, 60000); // Check every minute
    }

    // Stop auto refresh
    stopAutoRefresh() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
            this.refreshInterval = null;
        }
    }

    // Destroy service
    destroy() {
        this.stopAutoRefresh();
        window.removeEventListener('auth-change', this.onAuthChange);
    }
}
