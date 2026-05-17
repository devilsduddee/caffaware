import google.generativeai as genai
from .config import settings

def initialize_gemini():
    if settings.GEMINI_API_KEY:
        genai.configure(api_key=settings.GEMINI_API_KEY)
