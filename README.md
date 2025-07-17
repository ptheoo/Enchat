## Chatbot API

A chatbot powered by FastAPI with smart contextual retrieval using large language models (LLMs) such as **OpenAI GPT** or **Google Gemini**, combined with a **vector store** (`ChromaDB`) to store and retrieve chat history semantically.

---

### Features

- API communication with FastAPI
- Support for OpenAI GPT or Google Gemini
- Semantic memory via vector-based retrieval
- Vector storage using ChromaDB
- CORS enabled for frontend integration
- Simple HTML UI at `/`

---

### Installation

#### 1. Clone the repository and create a virtual environment

```bash
git clone https://github.com/yourname/chatbot-api.git
cd chatbot-api
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
```

#### 2. Install dependencies

```bash
pip install -r requirements.txt
```

---

### `.env` Configuration

Create a `.env` file in the project root with the following content:

```env
# === Vector Store ===
CHROMA_DB_DIR=./chroma_db
EMBEDDING_MODEL_NAME=all-MiniLM-L6-v2

# === OpenAI ===
OPENAI_API_KEY=your_openai_key
OPENAI_API_BASE=https://api.openai.com/v1
MODEL_NAME=model_openai

# === Gemini ===
USE_GEMINI=false
GEMINI_API_KEY=your_gemini_key
GEMINI_MODEL=model_gemini
```

> Note:
> - Set `USE_GEMINI=true` to enable Gemini, otherwise OpenAI will be used.
> - Ensure the model name matches the provider you choose.

---

### Run the Application

#### Build and Start

```bash
uvicorn main:app --reload
```

Visit: [http://localhost:8000](http://localhost:8000)

---

### 📡 API Endpoint

#### `POST /api/v1/chat`

Send a message to the chatbot and receive a response.

##### Request

```json
{
  "message": "Hello"
}
```

##### Response

```json
{
  "reply": "Hi there! How can I help you?",
  "conversation": [
    {"role": "user", "content": "Hello"},
    {"role": "assistant", "content": "Hi there! How can I help you?"}
  ]
}
```

---

### System Requirements

- Python 3.9+
- ChromaDB
- Internet access for calling LLM APIs (OpenAI/Gemini)

---
# base
