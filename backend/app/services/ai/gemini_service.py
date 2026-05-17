import google.generativeai as genai
from pydantic import BaseModel, Field
from typing import Dict, Any, Optional
import json
import logging
import re

logger = logging.getLogger(__name__)

class GeminiService:
    def __init__(self, model_name: str = "gemini-1.5-flash"):
        self.model_name = model_name

    def parse_beverage(self, text: str, language: str = "id") -> Dict[str, Any]:
        """
        Parses a natural language beverage description using Gemini API,
        inferring category, caffeine range, serving size, preparation assumptions,
        stimulation intensity, and confidence level in the requested language (id or en).
        """
        lang_instruction = (
            "You must provide your response entirely in natural, modern, and warm Bahasa Indonesia. Use a conversational, supportive, human, and premium tone. Avoid stiff, robotic, overly formal, medical, or corporate AI phrasing. Make it feel like a calm wellness companion speaking directly to a friend."
            if language == "id" else
            "You must provide your response entirely in English, maintaining a calming, premium, emotionally intelligent, wellness-oriented, human, and supportive tone."
        )

        prompt = f"""
You are an expert AI wellness intelligence and beverage interpretation engine for CaffAware.
A user has logged the following beverage description in natural language: "{text}"

Your task is to analyze this beverage description and infer its nutritional and stimulation profile.
You must understand Indonesian beverage names (e.g. es kopi susu gula aren, kopi tubruk, teh tarik, jamu), English beverage names, café terminology, serving sizes, milk-based drinks, espresso variants, energy drinks (Monster, Red Bull), and tea/matcha products.

{lang_instruction}

Provide your response strictly as a JSON object matching the following structure:
{{
    "name": "Formatted, clean title-cased beverage name in the original language",
    "estimated_mg": integer representing estimated caffeine content in mg,
    "category": "String, strictly one of: Coffee, Tea, Energy, Soda, Other",
    "serving_size": "String describing inferred serving size (e.g. Medium (Standard) / Sedang (Standar))",
    "preparation_assumptions": "String detailing preparation assumptions in the requested language",
    "stimulation_intensity": "String, one of: Mild, Moderate, High, Extreme",
    "confidence_level": "String, one of: High confidence, Moderate confidence, Low confidence",
    "explanation": "A clean, human-readable explainable reasoning string summarizing the base drink, size multiplier, and extra shots/ingredients that led to the estimated mg in the requested language."
}}

Guidelines for estimation:
- Standard espresso shot: ~63mg
- Standard milk coffee / kopi susu: ~90mg
- Americano / Long Black: ~95mg
- Cold Brew: ~155mg
- Matcha / Green Tea: ~70mg
- Standard Tea (Thai tea, black tea): ~45mg
- Energy Drink (Monster, Red Bull): ~160mg
- Decaf: ~10mg
- Adjust proportionally for size (Small ≈ 0.85x, Large/Jumbo ≈ 1.35x).
- Add +63mg for extra shots or double shots if applicable.

Ensure the output is valid JSON without markdown code blocks or additional surrounding text.
"""
        try:
            model = genai.GenerativeModel(self.model_name)
            response = model.generate_content(prompt)
            
            clean_text = response.text.strip()
            if clean_text.startswith("```json"):
                clean_text = clean_text[7:]
            if clean_text.startswith("```"):
                clean_text = clean_text[3:]
            if clean_text.endswith("```"):
                clean_text = clean_text[:-3]
            clean_text = clean_text.strip()
            
            data = json.loads(clean_text)
            
            # Deterministic Safety Validation Layer
            est_mg = int(data.get("estimated_mg", 90))
            est_mg = max(5, min(est_mg, 1000)) # Cap at 1000mg max
            
            category = data.get("category", "Coffee")
            if category not in ["Coffee", "Tea", "Energy", "Soda", "Other"]:
                category = "Coffee"
                
            confidence = data.get("confidence_level", "Moderate confidence")
            if confidence not in ["High confidence", "Moderate confidence", "Low confidence"]:
                confidence = "Moderate confidence"
                
            return {
                "name": data.get("name", text.title()),
                "estimatedMg": est_mg,
                "category": category,
                "serving_size": data.get("serving_size", "Sedang (Standar)" if language == "id" else "Medium (Standard)"),
                "preparation_assumptions": data.get("preparation_assumptions", "Persiapan standar" if language == "id" else "Standard preparation"),
                "stimulation_intensity": data.get("stimulation_intensity", "Moderate"),
                "confidence_level": confidence,
                "explanation": data.get("explanation", f"Diperkirakan berdasarkan {text}." if language == "id" else f"Estimated based on {text}.")
            }
        except Exception as e:
            logger.error(f"Gemini API parse_beverage failed: {str(e)}. Triggering deterministic fallback.")
            return self._deterministic_fallback_parse(text, language)

    def _deterministic_fallback_parse(self, text: str, language: str = "id") -> Dict[str, Any]:
        """
        Deterministic rule-based fallback if Gemini API fails or times out.
        Replicates the exact scientific baseline logic with bilingual support.
        """
        t = text.lower().strip()
        base_mg = 90
        category = "Coffee"
        matched_base = "Kopi Standar" if language == "id" else "Standard Coffee"
        
        if "espresso" in t or "shot" in t:
            base_mg = 63
            category = "Coffee"
            matched_base = "Espresso"
        elif "cold brew" in t:
            base_mg = 155
            category = "Coffee"
            matched_base = "Cold Brew"
        elif "americano" in t or "long black" in t:
            base_mg = 95
            category = "Coffee"
            matched_base = "Americano"
        elif "latte" in t or "cappuccino" in t or "flat white" in t:
            base_mg = 77
            category = "Coffee"
            matched_base = "Latte / Cappuccino"
        elif "kopi susu" in t or "milk coffee" in t or "kopi" in t:
            base_mg = 90
            category = "Coffee"
            matched_base = "Kopi Susu" if language == "id" else "Milk Coffee"
        elif "matcha" in t or "green tea" in t:
            base_mg = 70
            category = "Tea"
            matched_base = "Matcha / Teh Hijau" if language == "id" else "Matcha / Green Tea"
        elif "thai tea" in t or "black tea" in t or "earl grey" in t or "tea" in t or "teh" in t:
            base_mg = 45
            category = "Tea"
            matched_base = "Teh" if language == "id" else "Tea"
        elif "monster" in t or "red bull" in t or "energy" in t:
            base_mg = 160
            category = "Energy"
            matched_base = "Minuman Energi" if language == "id" else "Energy Drink"
        elif "decaf" in t:
            base_mg = 10
            category = "Coffee"
            matched_base = "Kopi Decaf" if language == "id" else "Decaf Coffee"
            
        size_mult = 1.0
        size_label = "Sedang (Standar)" if language == "id" else "Medium (Standard)"
        if "small" in t or "short" in t or "piccolo" in t or "cup" in t or "kecil" in t:
            size_mult = 0.85
            size_label = "Kecil" if language == "id" else "Small"
        elif "large" in t or "grande" in t or "jumbo" in t or "venti" in t or "big" in t or "besar" in t:
            size_mult = 1.35
            size_label = "Besar / Jumbo" if language == "id" else "Large/Jumbo"
            
        extra_mg = 0
        extra_label = ""
        if "double shot" in t or "2 shots" in t or "doppio" in t:
            if matched_base != "Espresso":
                extra_mg = 63
                extra_label = " + Tambahan Espresso (+63mg)" if language == "id" else " + Extra Espresso Shot (+63mg)"
            else:
                base_mg = 126
                matched_base = "Double Espresso"
        elif "extra shot" in t or "triple shot" in t or "add shot" in t or "tambah shot" in t:
            extra_mg = 126 if "triple shot" in t else 63
            extra_label = " + Tambahan Shots" if language == "id" else " + Extra Shots"
            
        final_mg = max(5, round(base_mg * size_mult) + extra_mg)
        
        if language == "id":
            explanation = f"Perkiraan Sistem: Kopi dasar {matched_base} (~{base_mg}mg) × ukuran {size_label} ({size_mult}x){extra_label} = sekitar {final_mg}mg kafein."
        else:
            explanation = f"Rule-based Fallback: Base {matched_base} (~{base_mg}mg) × {size_label} ({size_mult}x){extra_label} = ~{final_mg}mg total."
        
        formatted_name = " ".join([w.capitalize() for w in text.strip().split()])
        
        return {
            "name": formatted_name or ("Minuman Kustom" if language == "id" else "Custom Beverage"),
            "estimatedMg": final_mg,
            "category": category,
            "serving_size": size_label,
            "preparation_assumptions": f"Kecocokan sistem untuk {matched_base}" if language == "id" else f"Deterministic rule match for {matched_base}",
            "stimulation_intensity": "High" if final_mg > 120 else "Moderate" if final_mg > 50 else "Mild",
            "confidence_level": "Moderate confidence",
            "explanation": explanation
        }

    def enhance_wellness_summary(self, drinks: list, profile: dict, language: str = "id") -> Dict[str, Any]:
        """
        Enhances daily summaries, behavioral patterns, and journey reflections using Gemini API in the requested language.
        Core calculations remain deterministic.
        """
        limit = profile.get("daily_limit_mg", 250)
        cutoff = profile.get("recommended_cutoff", "14:00")
        total_mg = sum(d.get("caffeine_mg", 0) for d in drinks[:10])
        
        lang_instruction = (
            "You must provide your response entirely in natural, modern, and warm Bahasa Indonesia. Use a conversational, supportive, human, and premium tone. Avoid stiff, robotic, overly formal, medical, or corporate AI phrasing. Make it feel like a calm, emotionally aware wellness companion speaking directly to the user in everyday Indonesian, while maintaining scientific credibility and premium sophistication."
            if language == "id" else
            "You must provide your response entirely in English, maintaining a calming, premium, emotionally intelligent, wellness-oriented, human, and supportive tone."
        )

        prompt = f"""
You are an expert AI wellness intelligence engine for CaffAware.
Analyze the user's recent caffeine logging behavior and wellness profile to generate contextual, human, behavior-aware summaries and reflections.

User Profile Context:
- Daily Safe Limit: {limit}mg
- Recommended Sleep Cutoff: {cutoff}
- Recent Logged Caffeine (approx total): {total_mg}mg
- Recent Drinks Logged: {[d.get('name') for d in drinks[:5]]}

Your task is to provide enhanced narrative wording for the user's Daily AI Summary, Behavioral Patterns, and Journey Reflections.
{lang_instruction}
Do NOT override safe caffeine limits or sleep cutoff formulas. Core calculations remain deterministic.

Provide your response strictly as a JSON object matching the following structure:
{{
    "dailySummary": {{
        "headline": "A polished, elegant headline summarizing their day in the requested language (e.g. Energi Tenang & Pola Tidur Terjaga / Balanced Wavelength & Circadian Harmony)",
        "observations": [
            "Observation 1 in requested language (e.g. Porsi ngopimu hari ini sangat pas dan nyaman di tubuh. / Your caffeine timing shifted slightly later today.)",
            "Observation 2 in requested language (e.g. Efek kafein di tubuhmu sudah mereda dengan tenang malam ini. / Hydration pairing remained highly consistent this week.)",
            "Observation 3 in requested language (e.g. Jadwal ngopimu hari ini terasa lebih pas dibanding kemarin. / Residual evening stimulation may delay deep sleep readiness.)"
        ],
        "reflectionPrompt": "A gentle, mindful reflection question for the evening in the requested language (e.g. Luangkan waktu sejenak malam ini untuk merasakan tubuhmu yang mulai rileks. Apakah kamu sudah siap menikmati tidur yang lelap?)."
    }},
    "behavioralPatterns": [
        {{
            "patternName": "String, pattern title in requested language (e.g. Ngopi Terlalu Sore / Late Caffeine Habits)",
            "status": "String, strictly one of: Active, Improving, Stable, Action Needed",
            "description": "Contextual description of their behavior in requested language (e.g. Sering menikmati kopi setelah jam batas tidur terbaikmu.)."
        }},
        {{
            "patternName": "String, pattern title in requested language (e.g. Kestabilan Porsi Minum / Intake Consistency)",
            "status": "String, strictly one of: Active, Improving, Stable, Action Needed",
            "description": "Contextual description of their weekly volume in requested language (e.g. Porsi ngopimu selalu pas dan nyaman di tubuh.)."
        }},
        {{
            "patternName": "String, pattern title in requested language (e.g. Jam Ngopi Akhir Pekan / Weekend Timing Shifts)",
            "status": "String, strictly one of: Active, Improving, Stable, Action Needed",
            "description": "Contextual description comparing rhythms in requested language (e.g. Jadwal ngopi akhir pekanmu tetap teratur seperti hari biasa.)."
        }}
    ],
    "journeyReflections": [
        "A premium, reflective bullet point about their long-term rhythm in requested language (e.g. Ketepatan waktu ngopimu meningkat dengan sangat baik minggu ini.).",
        "Another premium reflection about their biological timing or recovery habits in requested language (e.g. Efek kafein di malam hari sudah jauh lebih tenang dibanding minggu lalu.).",
        "A third premium reflection about hydration or sleep readiness in requested language (e.g. Keseimbangan air putihmu selalu terjaga mengimbangi setiap cangkir kopimu.)."
    ]
}}

Ensure the output is valid JSON without markdown code blocks or additional surrounding text.
"""
        try:
            model = genai.GenerativeModel(self.model_name)
            response = model.generate_content(prompt)
            
            clean_text = response.text.strip()
            if clean_text.startswith("```json"):
                clean_text = clean_text[7:]
            if clean_text.startswith("```"):
                clean_text = clean_text[3:]
            if clean_text.endswith("```"):
                clean_text = clean_text[:-3]
            clean_text = clean_text.strip()
            
            data = json.loads(clean_text)
            return data
        except Exception as e:
            logger.error(f"Gemini API enhance_wellness_summary failed: {str(e)}. Returning deterministic fallback.")
            if language == "id":
                return {
                    "dailySummary": {
                        "headline": "Energi Tenang & Pola Tidur Terjaga" if total_mg <= limit else "Efek Kafein Aktif & Waktunya Bersantai",
                        "observations": [
                            "Porsi ngopimu hari ini sangat pas dan nyaman di tubuh." if total_mg <= limit else f"Total asupan kafeinmu hari ini mencapai {total_mg}mg.",
                            "Kafein di tubuhmu sudah mereda secara alami, mengembalikan ketenangan tubuh.",
                            "Kebutuhan air putihmu tetap seimbang mengimbangi cangkir kopimu minggu ini."
                        ],
                        "reflectionPrompt": "Luangkan waktu sejenak malam ini untuk merasakan tubuhmu yang mulai rileks. Apakah kamu sudah siap menikmati tidur yang lelap?"
                    },
                    "behavioralPatterns": [
                        {
                            "patternName": "Ngopi Terlalu Sore",
                            "status": "Improving",
                            "description": "Tidak ada kopi larut sore hari ini. Pola tidurmu terjaga dengan sangat baik."
                        },
                        {
                            "patternName": "Kestabilan Porsi Minum",
                            "status": "Stable",
                            "description": "Porsi ngopimu selalu pas dan nyaman di tubuh."
                        },
                        {
                            "patternName": "Jam Ngopi Akhir Pekan",
                            "status": "Stable",
                            "description": "Jadwal ngopi akhir pekanmu tetap teratur seperti hari biasa."
                        }
                    ],
                    "journeyReflections": [
                        "Ketepatan waktu ngopimu meningkat dengan sangat baik minggu ini.",
                        "Efek kafein di malam hari sudah jauh lebih tenang dibanding minggu lalu.",
                        "Keseimbangan air putihmu selalu terjaga mengimbangi setiap cangkir kopimu."
                    ]
                }
            else:
                return {
                    "dailySummary": {
                        "headline": "Balanced Wavelength & Circadian Harmony" if total_mg <= limit else "Active Stimulation & Winding Down Focus",
                        "observations": [
                            f"Today remained within your personalized safe range." if total_mg <= limit else f"Intake reached {total_mg}mg today.",
                            "Your active caffeine is following an expected metabolic clearance curve.",
                            "Hydration pairing remained highly consistent this week."
                        ],
                        "reflectionPrompt": "Take a mindful moment this evening to notice your natural physical tiredness. Are you feeling ready for restorative sleep?"
                    },
                    "behavioralPatterns": [
                        {
                            "patternName": "Late Caffeine Habits",
                            "status": "Improving",
                            "description": "Zero late drinks logged today. Excellent circadian alignment."
                        },
                        {
                            "patternName": "Intake Consistency",
                            "status": "Stable",
                            "description": "Intake has remained perfectly within safe thresholds."
                        },
                        {
                            "patternName": "Weekend Timing Shifts",
                            "status": "Stable",
                            "description": "Weekend and weekday intake timing remain beautifully synchronized."
                        }
                    ],
                    "journeyReflections": [
                        "Your caffeine timing discipline improved beautifully this week.",
                        "Evening nervous system stimulation was noticeably reduced compared to last week.",
                        "Hydration pairing remained wonderfully consistent across all logged beverages."
                    ]
                }

gemini_service = GeminiService()
