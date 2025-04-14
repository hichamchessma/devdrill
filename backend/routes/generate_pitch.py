from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.gpt_service import generate_pitch_content

router = APIRouter()

class PitchRequest(BaseModel):
    profile: str

@router.post("/generate-pitch")
async def generate_pitch(request: PitchRequest):
    try:
        pitch_content = generate_pitch_content(request.profile)
        return {"pitch": pitch_content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
