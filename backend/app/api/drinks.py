from fastapi import APIRouter, Depends, HTTPException
from ..core.auth import get_current_user
from ..core.firebase import get_db
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime, timezone

router = APIRouter(prefix="/api/drinks", tags=["drinks"])

class DrinkCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    caffeine_mg: int = Field(..., ge=0, le=1000)
    category: str = Field(..., min_length=1, max_length=50)
    timestamp: Optional[str] = None

@router.get("")
async def get_drinks(user=Depends(get_current_user)):
    """
    Get all logged drinks for the authenticated user, ordered by timestamp descending.
    """
    db = get_db()
    try:
        drinks_ref = db.collection("users").document(user["uid"]).collection("drinks")
        # Order by timestamp descending
        docs = drinks_ref.order_by("timestamp", direction="DESCENDING").limit(50).stream()
        
        drinks = []
        for doc in docs:
            data = doc.to_dict()
            data["id"] = doc.id
            drinks.append(data)
            
        return {"status": "success", "drinks": drinks}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch drinks: {str(e)}")

@router.post("")
async def log_drink(drink: DrinkCreate, user=Depends(get_current_user)):
    """
    Log a new drink for the authenticated user.
    """
    db = get_db()
    try:
        # Use provided timestamp or current ISO string
        ts = drink.timestamp if drink.timestamp else datetime.now(timezone.utc).isoformat()
        
        drink_data = {
            "name": drink.name,
            "caffeine_mg": drink.caffeine_mg,
            "category": drink.category,
            "timestamp": ts,
            "logged_at": datetime.now(timezone.utc).isoformat()
        }
        
        drinks_ref = db.collection("users").document(user["uid"]).collection("drinks")
        doc_ref = drinks_ref.document()
        doc_ref.set(drink_data)
        
        drink_data["id"] = doc_ref.id
        return {"status": "success", "drink": drink_data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to log drink: {str(e)}")

@router.delete("/{drink_id}")
async def delete_drink(drink_id: str, user=Depends(get_current_user)):
    """
    Delete a logged drink by ID.
    """
    db = get_db()
    try:
        doc_ref = db.collection("users").document(user["uid"]).collection("drinks").document(drink_id)
        doc = doc_ref.get()
        if not doc.exists:
            raise HTTPException(status_code=404, detail="Drink not found")
            
        doc_ref.delete()
        return {"status": "success", "message": "Drink deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete drink: {str(e)}")
