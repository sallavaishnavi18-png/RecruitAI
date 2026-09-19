import os
import json
from dotenv import load_dotenv
from google import genai

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("GEMINI_API_KEY is not set in .env")

client = genai.Client(api_key=api_key)


def analyze_skill_gap(candidate, requirements):

    prompt = f"""
You are an AI skill gap analysis system for RecruitAI.

Analyze the candidate's skills against the job requirements.

Return ONLY valid JSON.

Use exactly this structure:

{{
    "existing_skills": [],
    "missing_skills": [],
    "skill_coverage": 0,
    "skill_gap_summary": "",
    "recommended_questions": []
}}

Rules:
- Use only information present in the candidate data and job requirements.
- Do not invent candidate skills.
- existing_skills should contain required skills that the candidate already has.
- missing_skills should contain required skills that are not present in the candidate data.
- skill_coverage should be the percentage of required skills that the candidate has.
- skill_gap_summary should briefly explain the main skill gaps.
- recommended_questions should contain interview questions that can help validate missing or unclear skills.
- Return JSON only.
- Do not add markdown or explanations.

Candidate:
{json.dumps(candidate, indent=2)}

Job Requirements:
{json.dumps(requirements, indent=2)}
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    response_text = response.text.strip()

    if response_text.startswith("```"):
        response_text = response_text.replace("```json", "")
        response_text = response_text.replace("```", "")
        response_text = response_text.strip()

    start = response_text.find("{")
    end = response_text.rfind("}")

    if start == -1 or end == -1:
        raise ValueError("Gemini did not return valid JSON.")

    response_text = response_text[start:end + 1]

    try:
        return json.loads(response_text)

    except json.JSONDecodeError as error:
        print("JSON ERROR:")
        print(error)

        print("GEMINI RESPONSE:")
        print(response_text)

        raise ValueError("Gemini returned invalid JSON.")