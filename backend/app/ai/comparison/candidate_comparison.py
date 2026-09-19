import os
import json
from dotenv import load_dotenv
from google import genai

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("GEMINI_API_KEY is not set in .env")

client = genai.Client(api_key=api_key)


def compare_candidates(candidates, requirements):

    prompt = f"""
You are an AI candidate comparison system for RecruitAI.

Compare the candidates against the same job requirements.

Return ONLY valid JSON.

Use exactly this structure:

{{
    "job_title": "",
    "candidates": [
        {{
            "name": "",
            "matched_skills": [],
            "missing_skills": [],
            "qualification_match": "",
            "experience_match": "",
            "overall_match": 0,
            "explanation": ""
        }}
    ]
}}

Rules:
- Use only information present in the candidate data and job requirements.
- Do not invent skills, qualifications, experience, or achievements.
- matched_skills should contain required skills that the candidate has.
- missing_skills should contain required skills that the candidate does not have or that are not shown.
- qualification_match should describe how the candidate's qualifications relate to the job.
- experience_match should describe how the candidate's experience relates to the job.
- overall_match should be a percentage from 0 to 100 based on the available evidence.
- explanation should briefly explain the candidate's match.
- Do not make a hiring decision.
- Do not say who should be hired.
- Return all candidates provided.
- Return JSON only.
- Do not add markdown or explanations.

Candidates:
{json.dumps(candidates, indent=2)}

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