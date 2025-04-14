from fastapi import FastAPI
from routes.generate_test import router as generate_test_router
from routes.generate_pitch import router as generate_pitch_router
from routes.send_telegram import router as send_telegram_router

app = FastAPI()

app.include_router(generate_test_router)
app.include_router(generate_pitch_router)
app.include_router(send_telegram_router)

@app.get("/")
async def root():
    return {"message": "Welcome to the FastAPI application!"}
