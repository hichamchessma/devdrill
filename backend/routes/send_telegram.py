from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.telegram_service import send_telegram_message
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

class TelegramRequest(BaseModel):
    message: str
    chat_id: str

@router.post("/send-telegram")
async def send_telegram(request: TelegramRequest):
    try:
        logger.info(f"Tentative d'envoi Telegram à {request.chat_id}")
        await send_telegram_message(request.message, request.chat_id)
        logger.info("Message Telegram envoyé avec succès")
        return {"status": "Message sent"}
    except Exception as e:
        logger.error(f"Erreur Telegram: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
