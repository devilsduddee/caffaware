from fastapi import APIRouter, Depends
from ..core.auth import get_current_user
from ..core.firebase import get_db

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.get("/me")
async def get_me(user: dict = Depends(get_current_user)):
    """
    Returns the authenticated user's information and onboarding status.
    """
    uid = user.get("uid")
    db = get_db()
    
    # Check if user document exists in Firestore
    user_ref = db.collection("users").document(uid)
    user_doc = user_ref.get()
    
    return {
        "uid": uid,
        "email": user.get("email"),
        "name": user.get("name"),
        "picture": user.get("picture"),
        "onboarded": user_doc.exists
    }
