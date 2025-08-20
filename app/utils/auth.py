from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.core.db import get_db
from app.utils.security import decode_token

security = HTTPBearer()

async def get_current_user(
    creds: HTTPAuthorizationCredentials = Depends(security),
    db = Depends(get_db)
):
    token = creds.credentials
    try:
        payload = decode_token(token)
        user_id = payload.get("sub")
        if not user_id:
            raise ValueError("No subject")
        user = await db.users.find_one({"_id": user_id})
        if not user:
            raise ValueError("User not found")
        return user
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
