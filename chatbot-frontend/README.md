# EnChat Frontend - Chatbot Ngữ Pháp Tiếng Anh

Giao diện JavaScript thuần túy cho chatbot hỏi-đáp ngữ pháp tiếng Anh với thiết kế hiện đại và trải nghiệm người dùng tuyệt vời.

## ✨ Tính năng

### 🎨 Giao diện
- **Responsive Design**: Tương thích mọi thiết bị
- **Dark/Light Theme**: Chuyển đổi giao diện sáng/tối
- **Smooth Animations**: Hiệu ứng chuyển động mượt mà
- **Modern UI/UX**: Thiết kế hiện đại, dễ sử dụng

### 💬 Chat
- **Real-time Chat**: Trò chuyện thời gian thực
- **Message Actions**: Chỉnh sửa, xóa, sao chép, tạo lại tin nhắn
- **Typing Indicators**: Hiển thị trạng thái đang nhập
- **Chat History**: Lưu trữ và tải lại lịch sử trò chuyện
- **Quick Topics**: Chủ đề nhanh cho ngữ pháp cơ bản

### 🔧 Tính năng nâng cao
- **Image Upload**: Tải lên hình ảnh để OCR
- **Sound Effects**: Âm thanh cho các tương tác
- **Keyboard Shortcuts**: Phím tắt nhanh
- **Toast Notifications**: Thông báo tạm thời
- **Settings Modal**: Cài đặt tùy chỉnh
- **User Authentication**: Đăng nhập, đăng ký, quản lý tài khoản

### 📱 PWA (Progressive Web App)
- **Offline Support**: Hoạt động khi không có internet
- **Installable**: Cài đặt như ứng dụng native
- **Push Notifications**: Thông báo đẩy
- **Background Sync**: Đồng bộ nền

## 🚀 Cài đặt

### Yêu cầu hệ thống
- Node.js >= 16.0.0
- npm >= 8.0.0

### Cài đặt dependencies
```bash
npm install
```

## 🛠️ Phát triển

### Chạy development server
```bash
# Sử dụng live-server (đơn giản)
npm run dev

# Sử dụng webpack dev server (nâng cao)
npm run dev:webpack
```

### Build production
```bash
npm run build
```

### Build development
```bash
npm run build:dev
```

### Phân tích bundle
```bash
npm run analyze
```

## 📁 Cấu trúc dự án

```
chatbot-frontend/
├── src/                    # Source code chính
│   ├── app.js             # Ứng dụng chính
│   ├── services/          # Các service
│   │   ├── ChatService.js # Quản lý chat
│   │   └── AuthService.js # Quản lý xác thực
│   └── utils/             # Các utility
│       ├── ThemeManager.js    # Quản lý theme
│       ├── SoundManager.js    # Quản lý âm thanh
│       ├── AnimationManager.js # Quản lý animation
│       └── ToastManager.js    # Quản lý thông báo
├── styles/                 # CSS styles
│   ├── main.css           # CSS chính
│   ├── chat.css           # CSS cho chat
│   └── loading.css        # CSS cho loading screen
├── static/                 # Tài nguyên tĩnh
├── index.html             # HTML template
├── manifest.json          # PWA manifest
├── service-worker.js      # Service worker
├── webpack.config.js      # Cấu hình webpack
├── postcss.config.js      # Cấu hình PostCSS
├── .browserslistrc        # Danh sách trình duyệt hỗ trợ
└── package.json           # Dependencies và scripts
```

## 🔌 API Integration

Frontend được thiết kế để tích hợp với backend FastAPI:

- **Chat API**: `/api/v1/chat` - Gửi và nhận tin nhắn
- **Auth API**: `/api/v1/auth/*` - Xác thực người dùng
- **History API**: `/api/v1/history` - Quản lý lịch sử chat
- **Upload API**: `/api/v1/upload` - Tải lên hình ảnh

## 🎯 Tính năng chính

### 1. ChatService
- Quản lý tin nhắn và lịch sử
- Giao tiếp với backend API
- Xử lý tin nhắn real-time
- Quản lý trạng thái typing

### 2. AuthService
- Xác thực người dùng
- Quản lý JWT tokens
- Đăng nhập/đăng ký
- Quản lý profile

### 3. ThemeManager
- Chuyển đổi theme sáng/tối
- Lưu trữ preferences
- Phát hiện theme hệ thống
- CSS variables management

### 4. SoundManager
- Âm thanh cho tương tác
- Web Audio API
- Volume control
- Sound effects

### 5. AnimationManager
- Scroll animations
- Intersection Observer
- Mouse/touch effects
- Performance optimization

### 6. ToastManager
- Thông báo tạm thời
- Multiple types (success, error, warning, info)
- Action buttons
- Auto-dismiss

## 🎨 Customization

### Theme Colors
Thay đổi màu sắc trong `styles/main.css`:

```css
:root {
  --primary-color: #6366f1;
  --secondary-color: #8b5cf6;
  --accent-color: #06b6d4;
  /* ... */
}
```

### Animations
Tùy chỉnh animation trong `src/utils/AnimationManager.js`:

```javascript
// Thêm animation mới
this.addAnimation(element, 'custom-animation');
```

### Sounds
Tùy chỉnh âm thanh trong `src/utils/SoundManager.js`:

```javascript
// Tạo âm thanh mới
this.createCustomSound(frequency, duration);
```

## 📱 PWA Features

### Service Worker
- Caching strategies
- Offline support
- Background sync
- Push notifications

### Manifest
- App metadata
- Icons và screenshots
- Shortcuts
- Display modes

## 🔧 Development Tools

### Webpack
- Module bundling
- Code splitting
- Asset optimization
- Development server

### Babel
- ES6+ support
- Browser compatibility
- Modern JavaScript features

### PostCSS
- CSS processing
- Autoprefixer
- Future CSS features

## 🚀 Deployment

### Build cho production
```bash
npm run build
```

### Serve static files
```bash
# Sử dụng nginx, Apache, hoặc CDN
# Copy thư mục dist/ lên server
```

### Environment Variables
```bash
# Tạo file .env
REACT_APP_API_URL=https://your-api-domain.com
REACT_APP_ENV=production
```

## 📊 Performance

### Optimization
- Code splitting
- Lazy loading
- Image optimization
- CSS minification
- JavaScript minification

### Monitoring
- Bundle analyzer
- Performance metrics
- Lighthouse scores
- Core Web Vitals

## 🤝 Contributing

1. Fork dự án
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## 📄 License

Dự án này được cấp phép theo MIT License - xem file [LICENSE](LICENSE) để biết thêm chi tiết.

## 📞 Support

Nếu bạn gặp vấn đề hoặc có câu hỏi:

- Tạo issue trên GitHub
- Liên hệ team phát triển
- Xem documentation chi tiết

---

**EnChat** - Chatbot Ngữ Pháp Tiếng Anh với giao diện hiện đại và trải nghiệm tuyệt vời! 🚀✨
