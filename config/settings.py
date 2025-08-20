import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env robustly regardless of CWD
_CANDIDATES = [
    Path(__file__).resolve().parent.parent / ".env",   # project root (base_copy/.env)
    Path(__file__).resolve().parent / ".env",           # config/.env (fallback)
    Path.cwd() / ".env",                                # current working directory
]
for _p in _CANDIDATES:
    try:
        if _p.exists():
            load_dotenv(dotenv_path=_p, override=False)
    except Exception:
        pass

# === Vector Store Configuration ===
# Directory where ChromaDB stores vector data
CHROMA_DB_DIR = os.getenv("CHROMA_DB_DIR", "./chroma_db")

# Name of the sentence-transformer model used for embedding
EMBEDDING_MODEL_NAME = os.getenv("EMBEDDING_MODEL_NAME", "all-MiniLM-L6-v2")

# === OpenAI Configuration ===
# OpenAI API key and base URL
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_API_BASE = os.getenv("OPENAI_API_BASE", "https://api.openai.com/v1")

# Chat model to use (e.g., "gpt-3.5-turbo" or "gpt-4")
MODEL_NAME = os.getenv("MODEL_NAME", "gpt-3.5-turbo")

# === Gemini (Google AI) Configuration ===
# Flag to use Gemini instead of OpenAI (default: false)
USE_GEMINI = os.getenv("USE_GEMINI", "false").lower() == "true"

# Gemini API key and model name
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL")  # e.g., "models/gemini-1.5-pro"

# MongoDB
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
MONGO_DB = os.getenv("MONGO_DB", "grammar_db")

# JWT
JWT_SECRET = os.getenv("JWT_SECRET", "change_me_please")
JWT_EXPIRE_MIN = int(os.getenv("JWT_EXPIRE_MIN", "1440"))
JWT_ALGO = "HS256"

# OCR (tùy chọn – nếu cần chỉ định path tesseract.exe trên Windows)
TESSERACT_CMD = os.getenv("TESSERACT_CMD")  # ví dụ: C:\\Program Files\\Tesseract-OCR\\tesseract.exe

# SMTP/Email (phục vụ tính năng quên mật khẩu)
# Ví dụ Gmail: SMTP_HOST=smtp.gmail.com, SMTP_PORT=465, SMTP_TLS=true, SMTP_USER=your@gmail.com, SMTP_PASSWORD=app_password
SMTP_HOST = os.getenv("SMTP_HOST")
SMTP_PORT = int(os.getenv("SMTP_PORT", "465"))
SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
SMTP_FROM = os.getenv("SMTP_FROM", SMTP_USER or "")
SMTP_TLS = os.getenv("SMTP_TLS", "true").lower() == "true"  # dùng SSL (465)
SMTP_STARTTLS = os.getenv("SMTP_STARTTLS", "false").lower() == "true"  # dùng STARTTLS (587)

# Cho phép reset mật khẩu không cần email trong môi trường dev (KHÔNG dùng cho production)
DEV_ALLOW_INSECURE_RESET = os.getenv("DEV_ALLOW_INSECURE_RESET", "false").lower() == "true"