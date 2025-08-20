from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from app.services.chat_service import process_user_message
from app.utils.auth import get_current_user
from app.core.db import get_db

router = APIRouter()

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    reply: str
    conversation: list[dict]

@router.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest, user = Depends(get_current_user), db = Depends(get_db)):
    try:
        reply, conversation = await process_user_message(user["_id"], req.message, db)
        return {"reply": reply, "conversation": conversation}
    except Exception as e:
        print("Error in /chat:", str(e))
        raise HTTPException(status_code=500, detail="Internal server error")
