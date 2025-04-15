from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from backend.services.gpt_service import generate_pitch_content
from backend.utils.auth import is_user_pro
import logging

router = APIRouter()

class PitchRequest(BaseModel):
    profile: str

@router.post("/generate-pitch")
async def generate_pitch(request: PitchRequest, http_request: Request):
    # Vérification du rôle utilisateur via Clerk (Freemium)
    token = http_request.headers.get("authorization")
    is_pro = False
    try:
        is_pro = await is_user_pro(token)
    except Exception:
        pass  # Si erreur, on laisse la gestion frontend faire le blocage
    # Logging explicite
    user_id = None
    if token and token.startswith("Bearer "):
        import jwt
        try:
            decoded = jwt.decode(token[len("Bearer "):], options={"verify_signature": False})
            user_id = decoded.get("sub")
        except Exception:
            pass
    logging.info(f"[FREEMIUM] Access granted: {is_pro} | User ID: {user_id}")
    try:
        if not request.profile:
            raise HTTPException(status_code=400, detail="Profile cannot be empty")
            
        pitch_content = generate_pitch_content(request.profile)
        return {"pitch": pitch_content}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Failed to generate pitch: {str(e)}"
        )
