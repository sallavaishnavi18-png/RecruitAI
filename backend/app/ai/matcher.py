import os
import json
from dotenv import load_dotenv
from google import genai

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("GEMINI_API_KEY is not set in .env")

client = genai.Client(api_key=api_key)


def match_candidate(candidate, requirements):

    prompt = f"""
You are an AI candidate matching system for RecruitAI.

Compare the candidate information with the job requirements.

Return ONLY valid JSON using exactly this structure:

{{
    "matched_skills": [],
    "missing_skills": [],
    "qualification_match": "",
    "experience_match": "",
    "overall_match": "",
    "explanation": ""
}}

Rules:
- Use only the information provided.
- Do not invent candidate skills, qualifications, or experience.
- matched_skills should contain skills present in both the candidate and job requirements.
- missing_skills should contain required skills that are not found in the candidate information.
- qualification_match should briefly explain whether the candidate's education matches the requirement.
- experience_match should briefly explain whether the candidate's experience matches the requirement.
- overall_match should be a percentage such as "75%".
- explanation should briefly explain the important reasons for the match.
- Return JSON only.
- Do not add markdown or extra text.

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

    return json.loads(response_text)