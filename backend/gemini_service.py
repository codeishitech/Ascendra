import os
import json
from google import genai
from google.genai import types

def get_gemini_client():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return None
    return genai.Client(
        api_key=api_key,
        http_options={"headers": {"User-Agent": "aistudio-build"}}
    )

def generate_roadmap_json(target_role: str, experience_level: str, weekly_hours: int, current_skills: list):
    client = get_gemini_client()
    if not client:
        return None

    prompt = f"""You are the Ascendra Career World Architect.
Create a personalized 4-tier RPG skill tree and career roadmap for target role: '{target_role}'.
Context:
- Level: {experience_level}
- Weekly hours: {weekly_hours}
- Existing Skills: {current_skills}

Generate 6-8 interconnected nodes spanning 4 Tiers:
- Tier 1: Foundations
- Tier 2: Core Architecture
- Tier 3: Advanced Systems & Rigorous Evaluation
- Tier 4: Boss Battle Capstone (category must be 'boss_battle')

Return valid JSON with targetRole, nodes, and edges."""

    try:
        response = client.models.generate_content(
            model="gemini-3.8-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json"
            )
        )
        return json.loads(response.text)
    except Exception as e:
        print(f"Gemini generation error: {e}")
        return None
