from fastapi import APIRouter, File, UploadFile, Depends, HTTPException
from app.utils.auth import get_current_user
from app.core.db import get_db
from app.services.chat_service import process_user_message
from config.settings import TESSERACT_CMD
import pytesseract
from PIL import Image
import io, os

router = APIRouter()

if TESSERACT_CMD:
    pytesseract.pytesseract.tesseract_cmd = TESSERACT_CMD

@router.post("/upload")
async def upload_image(file: UploadFile = File(...), user = Depends(get_current_user), db = Depends(get_db)):
    try:
        raw = await file.read()
        image = Image.open(io.BytesIO(raw))
        text = pytesseract.image_to_string(image, lang="eng")  # thêm 'vie' nếu cần tiếng Việt: lang="vie"
        reply, conv = await process_user_message(user["_id"], text, db)
        return {"ocr_text": text, "reply": reply}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"OCR failed: {e}")
