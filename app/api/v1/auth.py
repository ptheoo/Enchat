from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from app.core.db import get_db
from app.utils.security import hash_password, verify_password, create_access_token
from app.utils.auth import get_current_user
from app.utils.mailer import send_email
from config.settings import DEV_ALLOW_INSECURE_RESET
import secrets

router = APIRouter()

class RegisterReq(BaseModel):
    email: EmailStr
    password: str
    name: str

class LoginReq(BaseModel):
    email: EmailStr
    password: str

class ForgotReq(BaseModel):
    email: EmailStr


@router.post("/auth/register")
async def register(req: RegisterReq, db = Depends(get_db)):
    existed = await db.users.find_one({"email": req.email})
    if existed:
        raise HTTPException(status_code=409, detail="Email already registered")

    doc = {
        "_id": req.email,  # dùng email làm _id 
        "email": req.email,
        "name": req.name,
        "password_hash": hash_password(req.password),
    }
    await db.users.insert_one(doc)
    return {"ok": True}


@router.post("/auth/login")
async def login(req: LoginReq, db = Depends(get_db)):
    user = await db.users.find_one({"email": req.email})
    if not user or not verify_password(req.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token(sub=user["_id"])
    return {"access_token": token, "token_type": "bearer", "name": user.get("name")}


@router.post("/auth/forgot")
async def forgot(req: ForgotReq, db = Depends(get_db)):
    user = await db.users.find_one({"email": req.email})
    if not user:
        raise HTTPException(status_code=404, detail="Email not found")

    # Tạo mật khẩu tạm thời dài 10 ký tự
    temp_password = secrets.token_urlsafe(8)
    password_hash = hash_password(temp_password)

    # Gửi email cho người dùng trước, nếu thành công mới cập nhật DB
    subject = "EnChat - Mật khẩu tạm thời"
    html = f"""
    <div style='font-family:system-ui,Segoe UI,Arial'>
      <h2>Đặt lại mật khẩu</h2>
      <p>Xin chào {user.get('name') or req.email},</p>
      <p>Mật khẩu tạm thời của bạn là: <b>{temp_password}</b></p>
      <p>Hãy đăng nhập và đổi mật khẩu ngay trong phần hồ sơ.</p>
      <p>Nếu bạn không yêu cầu thao tác này, vui lòng bỏ qua email.</p>
    </div>
    """
    try:
        send_email(req.email, subject, html, text_body=f"Mat khau tam thoi: {temp_password}")
    except Exception as e:
        if DEV_ALLOW_INSECURE_RESET:
            # Cho môi trường dev: cho phép hiển thị mật khẩu tạm (không an toàn)
            await db.users.update_one({"_id": user["_id"]}, {"$set": {"password_hash": password_hash}})
            return {"ok": True, "msg": f"[DEV] Không gửi được email: {e}. Mật khẩu tạm thời: {temp_password}"}
        raise HTTPException(status_code=500, detail=f"Không thể gửi email: {e}")

    # Email gửi thành công -> cập nhật DB và gắn cờ buộc đổi mật khẩu
    await db.users.update_one({"_id": user["_id"]}, {"$set": {"password_hash": password_hash}})
    return {"ok": True, "msg": f"Mật khẩu tạm thời đã được gửi tới {req.email}."}


class ResetReq(BaseModel):
    email: EmailStr
    new_password: str


class ResetPasswordReq(BaseModel):
    email: EmailStr
    temp_password: str
    new_password: str
    confirm_password: str


@router.post("/auth/reset-password")
async def reset_password(req: ResetPasswordReq, db = Depends(get_db)):
    """Reset password với mật khẩu tạm thời và mật khẩu mới"""
    if req.new_password != req.confirm_password:
        raise HTTPException(status_code=400, detail="Mật khẩu xác nhận không khớp")
    
    if len(req.new_password) < 6:
        raise HTTPException(status_code=400, detail="Mật khẩu phải có ít nhất 6 ký tự")
    
    user = await db.users.find_one({"email": req.email})
    if not user:
        raise HTTPException(status_code=404, detail="Email không tồn tại")
    
    # Xác thực mật khẩu tạm thời
    if not verify_password(req.temp_password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Mật khẩu tạm thời không đúng")
    
    # Cập nhật mật khẩu mới
    new_password_hash = hash_password(req.new_password)
    await db.users.update_one(
        {"_id": user["_id"]},
        {"$set": {"password_hash": new_password_hash}},
    )
    return {"ok": True, "msg": "Mật khẩu đã được đặt lại thành công"}


@router.post("/auth/dev-reset")
async def dev_reset(req: ResetReq, db = Depends(get_db)):
    if not DEV_ALLOW_INSECURE_RESET:
        raise HTTPException(status_code=403, detail="Disabled")
    user = await db.users.find_one({"email": req.email})
    if not user:
        raise HTTPException(status_code=404, detail="Email not found")
    await db.users.update_one(
        {"_id": user["_id"]},
        {"$set": {"password_hash": hash_password(req.new_password), "must_change_password": True}},
    )
    return {"ok": True}


class ChangePasswordReq(BaseModel):
    old_password: str
    new_password: str
    confirm_password: str


@router.post("/auth/change-password")
async def change_password(req: ChangePasswordReq, user=Depends(get_current_user), db = Depends(get_db)):
    if req.new_password != req.confirm_password:
        raise HTTPException(status_code=400, detail="Password confirmation does not match")
    if len(req.new_password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters")
    if not verify_password(req.old_password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Old password is incorrect")

    await db.users.update_one({"_id": user["_id"]}, {"$set": {"password_hash": hash_password(req.new_password)}})
    return {"ok": True}


@router.get("/auth/me")
async def me(user = Depends(get_current_user)):
    return {"_id": user.get("_id"), "email": user.get("email"), "name": user.get("name", "")}
