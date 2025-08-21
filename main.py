from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles

from app.api.v1.chat import router as chat_router
from app.api.v1.auth import router as auth_router
from app.api.v1.history import router as history_router
from app.api.v1.upload import router as upload_router

# Initialize FastAPI app with title and version
app = FastAPI(title="Chatbot API", version="1.0")

# Mount static folder ngoài app
app.mount("/static", StaticFiles(directory="static"), name="static")

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # đổi về domain thật khi deploy
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include chat API routes under /api/v1
app.include_router(auth_router, prefix="/api/v1")
app.include_router(chat_router, prefix="/api/v1")
app.include_router(history_router, prefix="/api/v1")
app.include_router(upload_router, prefix="/api/v1")
# Setup Jinja2 template directory
templates = Jinja2Templates(directory="templates")

@app.get("/", response_class=HTMLResponse)
def root(request: Request):
    """
    Serves the new beautiful homepage (home.html).
    """
    return templates.TemplateResponse("home.html", {"request": request})

@app.get("/chat", response_class=HTMLResponse)
def chat(request: Request):
    """
    Serves the chat interface (index.html).
    """
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/login", response_class=HTMLResponse)
def login(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})

@app.get("/register", response_class=HTMLResponse)
def register(request: Request):
    return templates.TemplateResponse("register.html", {"request": request})

@app.get("/forgot", response_class=HTMLResponse)
def forgot(request: Request):
    return templates.TemplateResponse("forgot.html", {"request": request})

@app.get("/reset", response_class=HTMLResponse)
def reset(request: Request):
    """
    Serves the reset password page.
    """
    return templates.TemplateResponse("reset.html", {"request": request})

@app.get("/demo", response_class=HTMLResponse)
def demo(request: Request):
    """
    Serves the demo page for testing the new interface.
    """
    return templates.TemplateResponse("demo.html", {"request": request})

@app.get("/test", response_class=HTMLResponse)
def test(request: Request):
    """
    Serves the test page for quick navigation.
    """
    return templates.TemplateResponse("test.html", {"request": request})
