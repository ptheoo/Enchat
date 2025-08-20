from fastapi import APIRouter, Depends, HTTPException
from app.utils.auth import get_current_user
from app.core.db import get_db

router = APIRouter()

@router.get("/history")
async def get_history(user = Depends(get_current_user), db = Depends(get_db)):
    cursor = db.chat_history.find({"user_id": user["_id"]})
    items = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        items.append({"role": doc["role"], "content": doc["content"]})
    return {"items": items}

@router.delete("/history")
async def clear_history(user = Depends(get_current_user), db = Depends(get_db)):
    await db.chat_history.delete_many({"user_id": user["_id"]})
    return {"ok": True}
