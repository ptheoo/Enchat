from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates

from app.api.v1.chat import router as chat_router

# Initialize FastAPI app with title and version
app = FastAPI(title="Chatbot API", version="1.0")

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (update for production)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include chat API routes under /api/v1
app.include_router(chat_router, prefix="/api/v1", tags=["Chat"])

# Setup Jinja2 template directory
templates = Jinja2Templates(directory="templates")

@app.get("/", response_class=HTMLResponse)
def root(request: Request):
    """
    Serves the homepage with a basic chatbot interface (index.html).
    """
    return templates.TemplateResponse("index.html", {"request": request})
