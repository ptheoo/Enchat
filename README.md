# Enchat - AI Grammar Assistant

**Enchat** là một chatbot AI thông minh được thiết kế để hỗ trợ học tập ngữ pháp tiếng Anh. Ứng dụng sử dụng công nghệ AI tiên tiến để cung cấp trải nghiệm học tập tương tác, cá nhân hóa và hiệu quả.

## A. Tính năng chính

- **AI Thông Minh**: Sử dụng OpenAI GPT và Google Gemini để hiểu và giải thích ngữ pháp
- **Phân Tích Ảnh**: OCR để đọc và phân tích văn bản tiếng Anh từ hình ảnh
- **Chat Tương Tác**: Giao diện chat thân thiện với người dùng
- **Lịch Sử Học Tập**: Lưu trữ và theo dõi tiến độ học tập
- **Xác Thực Người Dùng**: Hệ thống đăng nhập/đăng ký an toàn
- **Responsive Design**: Tương thích với mọi thiết bị
- **Giao Diện Đẹp**: Thiết kế hiện đại với animations và gradients

## B. Kiến trúc hệ thống

### B.1 Backend (FastAPI + Python)
- **FastAPI**: Framework web hiệu suất cao
- **MongoDB**: Cơ sở dữ liệu chính cho người dùng và lịch sử chat
- **ChromaDB**: Vector database cho semantic search
- **JWT**: Xác thực và bảo mật
- **Pydantic**: Validation dữ liệu

### B.2 Frontend (HTML + CSS + JavaScript)
- **HTML5**: Cấu trúc semantic
- **CSS3**: Styling hiện đại với CSS variables và animations
- **Vanilla JavaScript**: Logic tương tác và API calls
- **Font Awesome**: Icons đẹp mắt
- **Responsive Design**: Tương thích mobile và desktop

## C. Cấu trúc thư mục

```
enchat/
├── app/                          # Core application
│   ├── api/                      # API endpoints
│   │   └── v1/                  # API version 1
│   │       ├── auth.py          # Authentication endpoints
│   │       ├── chat.py          # Chat endpoints
│   │       ├── history.py       # Chat history endpoints
│   │       └── upload.py        # File upload endpoints
│   ├── core/                     # Core functionality
│   │   ├── chat_engine.py       # AI chat engine
│   │   ├── db.py                # Database connections
│   │   └── vector_store.py      # Vector database operations
│   ├── services/                 # Business logic
│   │   └── chat_service.py      # Chat service layer
│   └── utils/                    # Utility functions
│       ├── auth.py               # Authentication utilities
│       ├── logger.py             # Logging configuration
│       └── security.py           # Security utilities
├── static/                       # Static assets
│   ├── favicon.ico              # Website favicon
│   └── style.css                # Common CSS styles
├── templates/                    # HTML templates
│   ├── home.html                # Landing page
│   ├── login.html               # Login page
│   ├── register.html            # Registration page
│   ├── forgot.html              # Forgot password page
│   └── index.html               # Main chat interface
├── config/                       # Configuration files
│   └── settings.py              # Application settings
├── scripts/                      # Utility scripts
│   ├── clean_grammar.py         # Grammar cleaning script
│   ├── crawl_grammar.py         # Grammar crawling script
│   └── detect_noise.py          # Noise detection script
├── chroma_db/                    # Vector database storage
├── main.py                       # FastAPI application entry point
├── requirements.txt              # Python dependencies
├── Dockerfile                    # Docker configuration
├── docker-compose.yml            # Docker Compose setup
└── README.md                     # This file
```

## D. Cài đặt và chạy

### D.1 Yêu cầu hệ thống
- Python 3.8+
- MongoDB
- ChromaDB
- Node.js (cho development)

### D.2 Bước 1: Clone repository
```bash
git clone <repository-url>
cd enchat
```

### D.3 Bước 2: Tạo virtual environment
```bash
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

### D.4 Bước 3: Cài đặt dependencies
```bash
pip install -r requirements.txt
```

### D.5 Bước 4: Cấu hình môi trường
Tạo file `.env` trong thư mục gốc:
```env
# Database
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=grammar_db

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

### D.6 Bước 5: Khởi động MongoDB
```bash
# Windows
mongod

# macOS (với Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### D.7 Bước 6: Chạy ứng dụng
```bash
# Development mode
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Production mode
uvicorn main:app --host 0.0.0.0 --port 8000
```

### D.8 Bước 7: Truy cập ứng dụng
Mở trình duyệt và truy cập: `http://localhost:8000`

## E. Sử dụng Docker

### E.1 Chạy với Docker Compose
```bash
docker-compose up -d
```

### E.2 Build Docker image
```bash
docker build -t enchat .
docker run -p 8000:8000 enchat
```

## F. Sử dụng ứng dụng

### F.1 Trang chủ (`/`)
- Giới thiệu về Enchat
- Các tính năng chính
- Nút đăng ký và đăng nhập
- Quotes tiếng Anh động

### F.2 Đăng ký (`/register`)
- Tạo tài khoản mới
- Xác thực email
- Tự động đăng nhập sau khi đăng ký

### F.3 Đăng nhập (`/login`)
- Đăng nhập với email và mật khẩu
- Lưu token xác thực
- Chuyển hướng đến trang chat

### F.4 Quên mật khẩu (`/forgot`)
- Gửi email reset mật khẩu
- Xác thực email tồn tại

### F.5 Chat chính (`/chat`)
- Giao diện chat tương tác
- Gửi tin nhắn văn bản
- Upload và phân tích ảnh
- Xem lịch sử chat
- Giao diện responsive

## G. API Endpoints

### G.1 Authentication
- `POST /api/v1/auth/register` - Đăng ký người dùng
- `POST /api/v1/auth/login` - Đăng nhập
- `POST /api/v1/auth/forgot` - Quên mật khẩu
- `GET /api/v1/auth/me` - Lấy thông tin người dùng hiện tại

### G.2 Chat
- `POST /api/v1/chat` - Gửi tin nhắn chat
- `POST /api/v1/upload` - Upload ảnh để phân tích
- `GET /api/v1/history` - Lấy lịch sử chat

## H. Giao diện người dùng

### H.1 Thiết kế
- **Modern UI/UX**: Giao diện hiện đại với gradients và animations
- **Responsive**: Tương thích với mọi kích thước màn hình
- **Dark/Light Theme**: Hỗ trợ chủ đề sáng/tối
- **Animations**: Hiệu ứng mượt mà và hấp dẫn

### H.2 Components
- **Header**: Navigation và branding
- **Hero Section**: Giới thiệu chính
- **Features Grid**: Hiển thị tính năng
- **Chat Interface**: Giao diện chat chính
- **Sidebar**: Lịch sử và controls
- **Forms**: Đăng nhập, đăng ký, quên mật khẩu

## I. Development

### I.1 Cấu trúc code
- **Modular Architecture**: Tách biệt rõ ràng giữa các layer
- **Service Pattern**: Business logic trong service layer
- **Repository Pattern**: Data access abstraction
- **Dependency Injection**: Sử dụng FastAPI Depends

### I.2 Testing
```bash
# Chạy tests
pytest

# Chạy với coverage
pytest --cov=app

# Chạy specific test
pytest tests/test_auth.py
```

### I.3 Code formatting
```bash
# Format code với black
black .

# Sort imports
isort .

# Lint với flake8
flake8 .
```

## J. Database Schema

### J.1 Users Collection
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

### J.2 Chat History Collection
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

## K. Bảo mật

- **JWT Authentication**: Token-based authentication
- **Password Hashing**: Bcrypt encryption
- **Input Validation**: Pydantic validation
- **CORS Protection**: Cross-origin resource sharing
- **Rate Limiting**: API rate limiting
- **HTTPS**: Secure communication

## L. Performance

- **Async/Await**: Non-blocking I/O operations
- **Connection Pooling**: Database connection optimization
- **Caching**: Redis caching (optional)
- **CDN**: Static asset delivery
- **Compression**: Gzip compression

## M. Deployment

### M.1 Production Checklist
- [ ] Set production environment variables
- [ ] Configure reverse proxy (Nginx)
- [ ] Set up SSL certificates
- [ ] Configure logging and monitoring
- [ ] Set up backup strategies
- [ ] Performance testing
- [ ] Security audit

### M.2 Environment Variables
```bash
# Production
ENVIRONMENT=production
DEBUG=false
LOG_LEVEL=info

# Database
MONGODB_URL=mongodb://production-db:27017
DATABASE_NAME=grammar_db_prod

# Security
SECRET_KEY=production-secret-key
```

## N. Contributing

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Tạo Pull Request

## O. License

Dự án này được phân phối dưới MIT License. Xem file `LICENSE` để biết thêm chi tiết.

## P. Hỗ trợ

- **Email**: support@enchat.com
- **Documentation**: [docs.enchat.com](https://docs.enchat.com)
- **Issues**: [GitHub Issues](https://github.com/username/enchat/issues)

## Q. Acknowledgments

- OpenAI cho GPT API
- Google cho Gemini API
- FastAPI team cho framework tuyệt vời
- MongoDB team cho database
- ChromaDB team cho vector database

---

**Enchat** - Học tiếng Anh thông minh với AI!

*Made with ❤️ for language learners worldwide*
