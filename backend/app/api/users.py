from fastapi import APIRouter, Depends, HTTPException
from ..core.auth import get_current_user
from ..core.firebase import get_db
from ..services.wellness import calculate_caffeine_limit
from pydantic import BaseModel, Field
from typing import Optional

router = APIRouter(prefix="/api/users", tags=["users"])

class OnboardingData(BaseModel):
    age: int = Field(..., ge=1, le=120)
    weight: float = Field(..., ge=20, le=300)
    sleep_time: str = Field(..., pattern=r"^\d{2}:\d{2}$")
    sensitivity: str = Field(..., pattern="^(low|medium|high)$")
    lifestyle: Optional[str] = None

@router.post("/onboarding")
async def complete_onboarding(data: OnboardingData, user=Depends(get_current_user)):
    db = get_db()
    
    # Calculate personalized limits
    wellness_profile = calculate_caffeine_limit(data.model_dump())
    
    # Prepare user profile
    profile = {
        "uid": user["uid"],
        "email": user["email"],
        "display_name": user.get("name"),
        "onboarding": data.model_dump(),
        "wellness_profile": wellness_profile,
        "created_at": user.get("auth_time") # Use token time as a reference
    }
    
    try:
        # Save to Firestore
        db.collection("users").document(user["uid"]).set(profile)
        return {"status": "success", "wellness_profile": wellness_profile}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save profile: {str(e)}")

class LanguageUpdate(BaseModel):
    language: str = Field(..., pattern="^(id|en)$")

@router.patch("/language")
async def update_language(data: LanguageUpdate, user=Depends(get_current_user)):
    db = get_db()
    try:
        db.collection("users").document(user["uid"]).set({"language": data.language}, merge=True)
        return {"status": "success", "language": data.language}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update language: {str(e)}")
