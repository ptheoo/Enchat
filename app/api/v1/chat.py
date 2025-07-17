from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.chat_service import process_user_message

router = APIRouter()

class ChatRequest(BaseModel):
    """
    Request schema for chat endpoint.

    Attributes:
        message (str): The input message from the user.
    """
    message: str

class ChatResponse(BaseModel):
    """
    Response schema for chat endpoint.

    Attributes:
        reply (str): The AI-generated reply message.
        conversation (list[dict]): Full conversation history with roles and contents.
    """
    reply: str
    conversation: list[dict]

@router.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    """
    Handle user message and return AI-generated reply.

    Args:
        req (ChatRequest): The request body containing the user message.

    Returns:
        ChatResponse: Contains the reply from AI and the updated conversation.

    Raises:
        HTTPException: If any error occurs during processing.
    """
    try:
        # Process the user's message and get reply and conversation history
        reply, conversation = process_user_message(req.message)

        return {"reply": reply, "conversation": conversation}
    except Exception as e:
        print("Error in /chat:", str(e))
        raise HTTPException(status_code=500, detail="Internal server error")
