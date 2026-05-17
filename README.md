# CaffAware AI

CaffAware AI is a premium, bilingual modern wellness application designed to help users build healthier caffeine habits. It leverages advanced AI to track consumption, analyze sleep architecture impact, and provide personalized wellness guidance in both **Bahasa Indonesia** and **English**.

## Key Features

- **Bilingual Internationalization (i18n):** Full support for Bahasa Indonesia (default) and English across all UI components, modals, analytics cards, and AI summaries. Language preferences are seamlessly synced between local storage and Firebase Firestore.
- **Adaptive AI Wellness Layer:** Real-time synthesis of daily intake, active caffeine timelines, sleep impact analysis, and behavioral pattern detection powered by Gemini AI.
- **Premium Design Aesthetics:** Curated earth-tone color palettes (`#3D2B1F`, `#C6A49A`, `#76A8A1`, `#8D7B68`), glassmorphism cards, smooth micro-animations, and dynamic visual graphs.
- **Gentle Consistency System:** Gamified streak tracking for hydration balance, sleep-friendly timing, and limit adherence without toxic pressure.

## Tech Stack

- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui, Lucide Icons
- **Backend:** Python FastAPI
- **Database:** Firebase Firestore
- **Authentication:** Firebase Auth (Google Login)
- **AI Engine:** Google Gemini API

## Project Structure

- `frontend/`: Next.js web application featuring the `LanguageContext` i18n architecture
- `backend/`: FastAPI Python application with Firestore profile and language persistence
- `docs/`: Product Requirement Document (PRD) and architecture plans

## Local Development

### Frontend
1. Navigate to `frontend/`
2. Run `npm install`
3. Run `npm run dev`

### Backend
1. Navigate to `backend/`
2. Run `pip install -r requirements.txt`
3. Run `python -m uvicorn app.main:app --reload`
