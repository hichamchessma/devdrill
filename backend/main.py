from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

from routes.generate_test import router as generate_test_router
from routes.generate_pitch import router as generate_pitch_router
from routes.send_telegram import router as send_telegram_router

app = FastAPI()
router = APIRouter()
# Configuration CORS essentielle
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # URL de votre frontend Next.js
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(generate_test_router)
app.include_router(generate_pitch_router)
app.include_router(send_telegram_router)

@app.get("/")
async def root():
    return {"message": "Welcome to the FastAPI application!"}

@router.post("/generate-pitch")
async def generate_pitch(data: dict):
    profile = data.get("profile", "")
    pitch = generate_pitch_content(profile)
    return {"pitch": pitch}
