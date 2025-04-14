from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.gpt_service import generate_pitch_content

router = APIRouter()

class PitchRequest(BaseModel):
    profile: str

@router.post("/generate-pitch")
async def generate_pitch(request: PitchRequest):
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
