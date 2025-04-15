from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from backend.services.gpt_service import generate_test_content
from backend.utils.auth import is_user_pro
import logging

router = APIRouter()

class TestRequest(BaseModel):
    stack: str
    level: str

@router.post("/generate-test")
async def generate_test(request: TestRequest, http_request: Request):
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
        test_content = generate_test_content(request.stack, request.level)
        return {"test": test_content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
