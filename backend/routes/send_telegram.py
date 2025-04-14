from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.telegram_service import send_telegram_message

router = APIRouter()

class TelegramRequest(BaseModel):
    message: str
    chat_id: str

@router.post("/send-telegram")
async def send_telegram(request: TelegramRequest):
    try:
        send_telegram_message(request.message, request.chat_id)
        return {"status": "Message sent"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
