from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.firebase import initialize_firebase
from .core.gemini import initialize_gemini
from .api.auth import router as auth_router
from .api.users import router as users_router
from .api.drinks import router as drinks_router
from .api.ai import router as ai_router

from .core.config import settings

app = FastAPI(
    title="CaffAware AI API",
    description="Backend API for CaffAware wellness application",
    version="1.0.0"
)

# Initialize external services
initialize_firebase()
initialize_gemini()

# Include routers
app.include_router(auth_router)
app.include_router(users_router)
app.include_router(drinks_router)
app.include_router(ai_router)

# CORS configuration to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to CaffAware AI API"}

@app.get("/api/health")
def health_check():
    return {"status": "healthy"}