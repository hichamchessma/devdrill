from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import JSONResponse
import stripe
import httpx
import os
from backend.config import STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, CLERK_SECRET_KEY, STRIPE_PRICE_ID

router = APIRouter()

stripe.api_key = STRIPE_SECRET_KEY

# 1. Route pour créer une session Stripe Checkout
@router.post("/api/create-checkout-session")
async def create_checkout_session(request: Request):
    data = await request.json()
    user_id = data.get("user_id")
    if not user_id:
        raise HTTPException(status_code=400, detail="Missing user_id")

    try:
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            mode="subscription",
            line_items=[{
    "price": STRIPE_PRICE_ID,  
    "quantity": 1,
}],
            metadata={"user_id": user_id},
            success_url="http://localhost:3000/payment-success",
            cancel_url="http://localhost:3000/upgrade",
        )
        return {"url": session.url}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

# 2. Webhook Stripe pour upgrade Clerk
@router.post("/webhooks/stripe")
async def stripe_webhook(request: Request):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")
    event = None
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, STRIPE_WEBHOOK_SECRET
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Webhook signature verification failed: {e}")

    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        user_id = session.get("metadata", {}).get("user_id")
        if user_id:
            # Appel Clerk pour upgrade le rôle
            async with httpx.AsyncClient() as client:
                res = await client.patch(
                    f"https://api.clerk.com/v1/users/{user_id}",
                    headers={
                        "Authorization": f"Bearer {CLERK_SECRET_KEY}",
                        "Content-Type": "application/json"
                    },
                    json={"public_metadata": {"role": "pro"}}
                )
                if res.status_code == 200:
                    print(f"[CLERK UPGRADE] User upgraded to Pro | ID: {user_id}")
                else:
                    print(f"[CLERK UPGRADE ERROR] Clerk API error: {res.text}")
    return {"status": "success"}
