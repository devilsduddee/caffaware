import firebase_admin
from firebase_admin import credentials, auth, firestore
from .config import settings
import os
import json

def initialize_firebase():
    if not firebase_admin._apps:
        # 1. Check for raw JSON string in environment (Railway production priority)
        if settings.FIREBASE_CREDENTIALS_JSON:
            try:
                cred_dict = json.loads(settings.FIREBASE_CREDENTIALS_JSON)
                cred = credentials.Certificate(cred_dict)
                firebase_admin.initialize_app(cred)
                print("Firebase Admin initialized successfully from FIREBASE_CREDENTIALS_JSON.")
                return
            except Exception as e:
                print(f"Error parsing FIREBASE_CREDENTIALS_JSON: {e}. Falling back to file path...")

        # 2. Check if service account file exists (Local development fallback)
        if settings.FIREBASE_CREDENTIALS_PATH and os.path.exists(settings.FIREBASE_CREDENTIALS_PATH):
            cred = credentials.Certificate(settings.FIREBASE_CREDENTIALS_PATH)
            firebase_admin.initialize_app(cred)
            print("Firebase Admin initialized successfully from FIREBASE_CREDENTIALS_PATH.")
        else:
            # 3. Fallback for environment default credentials (GCP/Local)
            print("Warning: Firebase credentials not found in JSON or PATH. Using default initialization.")
            firebase_admin.initialize_app()

def get_db():
    return firestore.client()

def get_auth():
    return auth
