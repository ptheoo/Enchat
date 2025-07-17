import os
from dotenv import load_dotenv

# Load environment variables from a .env file into the OS environment
load_dotenv()

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
