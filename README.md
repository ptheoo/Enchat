# 🤖 Enchat - AI Grammar Assistant

**Enchat** là một chatbot AI thông minh được thiết kế để hỗ trợ học tập ngữ pháp tiếng Anh. Ứng dụng sử dụng công nghệ AI tiên tiến để cung cấp trải nghiệm học tập tương tác, cá nhân hóa và hiệu quả.

## ✨ Tính năng chính

- 🧠 **AI Thông Minh**: Sử dụng OpenAI GPT và Google Gemini để hiểu và giải thích ngữ pháp
- 📸 **Phân Tích Ảnh**: OCR để đọc và phân tích văn bản tiếng Anh từ hình ảnh
- 💬 **Chat Tương Tác**: Giao diện chat thân thiện với người dùng
- 📚 **Lịch Sử Học Tập**: Lưu trữ và theo dõi tiến độ học tập
- 🔐 **Xác Thực Người Dùng**: Hệ thống đăng nhập/đăng ký an toàn
- 📱 **Responsive Design**: Tương thích với mọi thiết bị
- 🌙 **Giao Diện Đẹp**: Thiết kế hiện đại với animations và gradients

## 🏗️ Kiến trúc hệ thống

### Backend (FastAPI + Python)
- **FastAPI**: Framework web hiệu suất cao
- **MongoDB**: Cơ sở dữ liệu chính cho người dùng và lịch sử chat
- **ChromaDB**: Vector database cho semantic search
- **JWT**: Xác thực và bảo mật
- **Pydantic**: Validation dữ liệu

### Frontend (HTML + CSS + JavaScript)
- **HTML5**: Cấu trúc semantic
- **CSS3**: Styling hiện đại với CSS variables và animations
- **Vanilla JavaScript**: Logic tương tác và API calls
- **Font Awesome**: Icons đẹp mắt
- **Responsive Design**: Tương thích mobile và desktop

## 📁 Cấu trúc thư mục

```
base_copy/
├── 📁 app/                          # Core application
│   ├── 📁 api/                      # API endpoints
│   │   └── 📁 v1/                  # API version 1
│   │       ├── 📄 auth.py          # Authentication endpoints
│   │       ├── 📄 chat.py          # Chat endpoints
│   │       ├── 📄 history.py       # Chat history endpoints
│   │       └── 📄 upload.py        # File upload endpoints
│   ├── 📁 core/                     # Core functionality
│   │   ├── 📄 chat_engine.py       # AI chat engine
│   │   ├── 📄 db.py                # Database connections
│   │   └── 📄 vector_store.py      # Vector database operations
│   ├── 📁 services/                 # Business logic
│   │   └── 📄 chat_service.py      # Chat service layer
│   └── 📁 utils/                    # Utility functions
│       ├── 📄 auth.py               # Authentication utilities
│       ├── 📄 logger.py             # Logging configuration
│       └── 📄 security.py           # Security utilities
├── 📁 static/                       # Static assets
│   ├── 📄 favicon.ico              # Website favicon
│   └── 📄 style.css                # Common CSS styles
├── 📁 templates/                    # HTML templates
│   ├── 📄 home.html                # Landing page
│   ├── 📄 login.html               # Login page
│   ├── 📄 register.html            # Registration page
│   ├── 📄 forgot.html              # Forgot password page
│   └── 📄 index.html               # Main chat interface
├── 📁 config/                       # Configuration files
│   └── 📄 settings.py              # Application settings
├── 📁 scripts/                      # Utility scripts
│   ├── 📄 clean_grammar.py         # Grammar cleaning script
│   ├── 📄 crawl_grammar.py         # Grammar crawling script
│   └── 📄 detect_noise.py          # Noise detection script
├── 📁 chroma_db/                    # Vector database storage
├── 📄 main.py                       # FastAPI application entry point
├── 📄 requirements.txt              # Python dependencies
├── 📄 Dockerfile                    # Docker configuration
├── 📄 docker-compose.yml            # Docker Compose setup
└── 📄 README.md                     # This file
```

## 🚀 Cài đặt và chạy

### Yêu cầu hệ thống
- Python 3.8+
- MongoDB
- ChromaDB
- Node.js (cho development)

### Bước 1: Clone repository
```bash
git clone <repository-url>
cd base_copy
```

### Bước 2: Tạo virtual environment
```bash
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

### Bước 3: Cài đặt dependencies
```bash
pip install -r requirements.txt
```

### Bước 4: Cấu hình môi trường
Tạo file `.env` trong thư mục gốc:
```env
# Database
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=enchat

# JWT
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# OpenAI
OPENAI_API_KEY=your-openai-api-key

# Google Gemini
GOOGLE_API_KEY=your-google-api-key

# Email (cho forgot password)
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

### Bước 5: Khởi động MongoDB
```bash
# Windows
mongod

# macOS (với Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### Bước 6: Chạy ứng dụng
```bash
# Development mode
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Production mode
uvicorn main:app --host 0.0.0.0 --port 8000
```

### Bước 7: Truy cập ứng dụng
Mở trình duyệt và truy cập: `http://localhost:8000`

## 🐳 Sử dụng Docker

### Chạy với Docker Compose
```bash
docker-compose up -d
```

### Build Docker image
```bash
docker build -t enchat .
docker run -p 8000:8000 enchat
```

## 📱 Sử dụng ứng dụng

### 1. Trang chủ (`/`)
- Giới thiệu về Enchat
- Các tính năng chính
- Nút đăng ký và đăng nhập
- Quotes tiếng Anh động

### 2. Đăng ký (`/register`)
- Tạo tài khoản mới
- Xác thực email
- Tự động đăng nhập sau khi đăng ký

### 3. Đăng nhập (`/login`)
- Đăng nhập với email và mật khẩu
- Lưu token xác thực
- Chuyển hướng đến trang chat

### 4. Quên mật khẩu (`/forgot`)
- Gửi email reset mật khẩu
- Xác thực email tồn tại

### 5. Chat chính (`/chat`)
- Giao diện chat tương tác
- Gửi tin nhắn văn bản
- Upload và phân tích ảnh
- Xem lịch sử chat
- Giao diện responsive

## 🔌 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Đăng ký người dùng
- `POST /api/v1/auth/login` - Đăng nhập
- `POST /api/v1/auth/forgot` - Quên mật khẩu
- `GET /api/v1/auth/me` - Lấy thông tin người dùng hiện tại

### Chat
- `POST /api/v1/chat` - Gửi tin nhắn chat
- `POST /api/v1/upload` - Upload ảnh để phân tích
- `GET /api/v1/history` - Lấy lịch sử chat

## 🎨 Giao diện người dùng

### Thiết kế
- **Modern UI/UX**: Giao diện hiện đại với gradients và animations
- **Responsive**: Tương thích với mọi kích thước màn hình
- **Dark/Light Theme**: Hỗ trợ chủ đề sáng/tối
- **Animations**: Hiệu ứng mượt mà và hấp dẫn

### Components
- **Header**: Navigation và branding
- **Hero Section**: Giới thiệu chính
- **Features Grid**: Hiển thị tính năng
- **Chat Interface**: Giao diện chat chính
- **Sidebar**: Lịch sử và controls
- **Forms**: Đăng nhập, đăng ký, quên mật khẩu

## 🔧 Development

### Cấu trúc code
- **Modular Architecture**: Tách biệt rõ ràng giữa các layer
- **Service Pattern**: Business logic trong service layer
- **Repository Pattern**: Data access abstraction
- **Dependency Injection**: Sử dụng FastAPI Depends

### Testing
```bash
# Chạy tests
pytest

# Chạy với coverage
pytest --cov=app

# Chạy specific test
pytest tests/test_auth.py
```

### Code formatting
```bash
# Format code với black
black .

# Sort imports
isort .

# Lint với flake8
flake8 .
```

## 📊 Database Schema

### Users Collection
```json
{
  "_id": "ObjectId",
  "email": "string",
  "password_hash": "string",
  "name": "string",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

### Chat History Collection
```json
{
  "_id": "ObjectId",
  "user_id": "ObjectId",
  "message": "string",
  "response": "string",
  "timestamp": "datetime",
  "type": "string"
}
```

## 🔒 Bảo mật

- **JWT Authentication**: Token-based authentication
- **Password Hashing**: Bcrypt encryption
- **Input Validation**: Pydantic validation
- **CORS Protection**: Cross-origin resource sharing
- **Rate Limiting**: API rate limiting
- **HTTPS**: Secure communication

## 📈 Performance

- **Async/Await**: Non-blocking I/O operations
- **Connection Pooling**: Database connection optimization
- **Caching**: Redis caching (optional)
- **CDN**: Static asset delivery
- **Compression**: Gzip compression

## 🚀 Deployment

### Production Checklist
- [ ] Set production environment variables
- [ ] Configure reverse proxy (Nginx)
- [ ] Set up SSL certificates
- [ ] Configure logging and monitoring
- [ ] Set up backup strategies
- [ ] Performance testing
- [ ] Security audit

### Environment Variables
```bash
# Production
ENVIRONMENT=production
DEBUG=false
LOG_LEVEL=info

# Database
MONGODB_URL=mongodb://production-db:27017
DATABASE_NAME=enchat_prod

# Security
SECRET_KEY=production-secret-key
```

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Tạo Pull Request

## 📝 License

Dự án này được phân phối dưới MIT License. Xem file `LICENSE` để biết thêm chi tiết.

## 📞 Hỗ trợ

- **Email**: support@enchat.com
- **Documentation**: [docs.enchat.com](https://docs.enchat.com)
- **Issues**: [GitHub Issues](https://github.com/username/enchat/issues)

## 🙏 Acknowledgments

- OpenAI cho GPT API
- Google cho Gemini API
- FastAPI team cho framework tuyệt vời
- MongoDB team cho database
- ChromaDB team cho vector database

---

**Enchat** - Học tiếng Anh thông minh với AI! 🚀✨

*Made with ❤️ for language learners worldwide*
