from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from typing import Dict, Any, List, Optional
from ..core.auth import get_current_user
from ..services.ai.gemini_service import gemini_service

router = APIRouter(prefix="/api/ai", tags=["ai"])

class ParseRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=200)
    language: Optional[str] = "id"

class SummaryRequest(BaseModel):
    drinks: List[Dict[str, Any]]
    profile: Optional[Dict[str, Any]] = None
    language: Optional[str] = "id"

@router.post("/parse-drink")
async def parse_drink(req: ParseRequest, user=Depends(get_current_user)):
    """
    Parses a natural language beverage description using Gemini API with deterministic fallback and bilingual support.
    """
    try:
        result = gemini_service.parse_beverage(req.text, req.language or "id")
        return {"status": "success", "result": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI parsing failed: {str(e)}")

@router.post("/wellness-summary")
async def wellness_summary(req: SummaryRequest, user=Depends(get_current_user)):
    """
    Generates enhanced AI wellness summaries, behavioral patterns, and reflections with deterministic fallback and bilingual support.
    """
    try:
        profile = req.profile or {}
        result = gemini_service.enhance_wellness_summary(req.drinks, profile, req.language or "id")
        return {"status": "success", "result": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI summary failed: {str(e)}")
