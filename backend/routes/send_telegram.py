from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from pydantic import BaseModel
from backend.services.telegram_service import send_telegram_message
import logging
import requests
import os
from typing import Optional

router = APIRouter()
logger = logging.getLogger(__name__)

class TelegramRequest(BaseModel):
    message: str
    chat_id: str

@router.post("/send-pdf-to-telegram")
async def send_pdf_to_telegram(
    file: UploadFile = File(...),
    chat_id: str = Form(...)
):
    try:
        # Log pour le debug
        logger.info(f"Envoi du fichier {file.filename} vers le chat {chat_id}")
        
        # Préparer les données pour l'API Telegram
        files = {
            'document': (file.filename, file.file, 'application/pdf')
        }
        data = {
            'chat_id': chat_id
        }
        
        # Obtenir le token du bot depuis les variables d'environnement
        bot_token = os.getenv('TELEGRAM_BOT_TOKEN')
        if not bot_token:
            raise ValueError("TELEGRAM_BOT_TOKEN non défini dans les variables d'environnement")
        
        # Construire l'URL de l'API Telegram
        url = f"https://api.telegram.org/bot{bot_token}/sendDocument"
        
        # Envoyer le fichier
        response = requests.post(url, files=files, data=data)
        response.raise_for_status()
        
        logger.info(f"Fichier {file.filename} envoyé avec succès")
        return {"success": True}
        
    except Exception as e:
        logger.error(f"Erreur lors de l'envoi du PDF: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

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
