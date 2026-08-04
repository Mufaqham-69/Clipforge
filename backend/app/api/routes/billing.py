"""
Lemon Squeezy billing - same verified integration pattern as the Casefile
project. See that project's README for the full dashboard setup walkthrough;
the only per-product change is the $40/mo variant this points at.
"""
import hashlib
import hmac

import httpx
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.config import get_settings
from app.db.database import get_db
from app.db.models import Organization, SubscriptionStatus, User

router = APIRouter(prefix="/api/billing", tags=["billing"])
settings = get_settings()

LEMONSQUEEZY_CHECKOUTS_URL = "https://api.lemonsqueezy.com/v1/checkouts"

STATUS_MAP = {
    "on_trial": SubscriptionStatus.trialing,
    "active": SubscriptionStatus.active,
    "paused": SubscriptionStatus.past_due,
    "past_due": SubscriptionStatus.past_due,
    "unpaid": SubscriptionStatus.past_due,
    "cancelled": SubscriptionStatus.canceled,
    "expired": SubscriptionStatus.canceled,
}
SUBSCRIPTION_EVENTS = {
    "subscription_created", "subscription_updated", "subscription_resumed",
    "subscription_cancelled", "subscription_expired", "subscription_paused",
    "subscription_unpaused",
}


@router.post("/create-checkout-session")
async def create_checkout_session(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    if not settings.LEMONSQUEEZY_API_KEY:
        raise HTTPException(status_code=500, detail="Lemon Squeezy is not configured")

    org = db.query(Organization).filter(Organization.id == user.organization_id).first()

    headers = {
        "Accept": "application/vnd.api+json",
        "Content-Type": "application/vnd.api+json",
        "Authorization": f"Bearer {settings.LEMONSQUEEZY_API_KEY}",
    }
    payload = {
        "data": {
            "type": "checkouts",
            "attributes": {
                "checkout_data": {"email": user.email, "custom": {"org_id": org.id}},
                "product_options": {"redirect_url": f"{settings.FRONTEND_URL}/dashboard?checkout=success"},
            },
            "relationships": {
                "store": {"data": {"type": "stores", "id": settings.LEMONSQUEEZY_STORE_ID}},
                "variant": {"data": {"type": "variants", "id": settings.LEMONSQUEEZY_VARIANT_ID}},
            },
        }
    }

    async with httpx.AsyncClient(timeout=30) as client:
        resp = await client.post(LEMONSQUEEZY_CHECKOUTS_URL, headers=headers, json=payload)
        resp.raise_for_status()
        data = resp.json()

    return {"checkout_url": data["data"]["attributes"]["url"]}


@router.post("/webhook")
async def lemonsqueezy_webhook(request: Request, db: Session = Depends(get_db)):
    if not settings.LEMONSQUEEZY_WEBHOOK_SECRET:
        raise HTTPException(status_code=500, detail="Webhook secret not configured")

    raw_body = await request.body()
    signature = request.headers.get("x-signature", "")
    expected = hmac.new(settings.LEMONSQUEEZY_WEBHOOK_SECRET.encode("utf-8"), raw_body, hashlib.sha256).hexdigest()
    if not signature or not hmac.compare_digest(expected, signature):
        raise HTTPException(status_code=400, detail="Invalid webhook signature")

    event = await request.json()
    event_name = event.get("meta", {}).get("event_name")
    custom_data = event.get("meta", {}).get("custom_data") or {}
    data = event.get("data", {})
    attributes = data.get("attributes", {})
    subscription_id = data.get("id")

    org = None
    org_id = custom_data.get("org_id")
    if org_id:
        org = db.query(Organization).filter(Organization.id == org_id).first()
    if not org and subscription_id:
        org = db.query(Organization).filter(Organization.lemonsqueezy_subscription_id == str(subscription_id)).first()
    if not org:
        return {"received": True, "note": "no matching organization"}

    if event_name in SUBSCRIPTION_EVENTS:
        org.lemonsqueezy_subscription_id = str(subscription_id)
        customer_id = attributes.get("customer_id")
        if customer_id is not None:
            org.lemonsqueezy_customer_id = str(customer_id)
        ls_status = attributes.get("status")
        org.subscription_status = STATUS_MAP.get(ls_status, org.subscription_status)
        db.commit()

    return {"received": True}
