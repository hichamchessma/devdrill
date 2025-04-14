from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.gpt_service import generate_test_content

router = APIRouter()

class TestRequest(BaseModel):
    stack: str
    level: str

@router.post("/generate-test")
async def generate_test(request: TestRequest):
    try:
        test_content = generate_test_content(request.stack, request.level)
        return {"test": test_content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
