import httpx
import logging
import jwt
from fastapi import HTTPException
from backend.config import CLERK_SECRET_KEY

CLERK_API_URL = "https://api.clerk.dev/v1/users/"

async def is_user_pro(token: str) -> bool:
    if not token:
        logging.warning("[FREEMIUM] No token provided.")
        raise HTTPException(status_code=401, detail="Authorization token missing")
    try:
        # Remove 'Bearer ' prefix if present
        if token.startswith("Bearer "):
            token = token[len("Bearer "):]
        decoded = jwt.decode(token, options={"verify_signature": False})
        user_id = decoded.get("sub")
        if not user_id:
            logging.warning("[FREEMIUM] No user_id in token.")
            raise HTTPException(status_code=401, detail="Invalid token (no user_id)")
        headers = {"Authorization": f"Bearer {CLERK_SECRET_KEY}"}
        async with httpx.AsyncClient() as client:
            resp = await client.get(CLERK_API_URL + user_id, headers=headers)
            if resp.status_code != 200:
                logging.warning(f"[FREEMIUM] Clerk API error: {resp.status_code}")
                raise HTTPException(status_code=401, detail="User not found")
            user = resp.json()
            role = user.get("public_metadata", {}).get("role")
            is_pro = role == "pro"
            logging.info(f"[FREEMIUM] Access granted: {is_pro} | User ID: {user_id}")
            return is_pro
    except jwt.DecodeError:
        logging.warning("[FREEMIUM] Invalid JWT token.")
        raise HTTPException(status_code=401, detail="Invalid token")
    except Exception as e:
        logging.error(f"[FREEMIUM] Unexpected error: {e}")
        raise HTTPException(status_code=500, detail="Internal error validating user role")
