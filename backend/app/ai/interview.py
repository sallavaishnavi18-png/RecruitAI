import os
import json
from dotenv import load_dotenv
from google import genai

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("GEMINI_API_KEY is not set in .env")

client = genai.Client(api_key=api_key)


def generate_interview_questions(candidate, requirements):

    prompt = f"""
You are an AI interview question generator for RecruitAI.

Generate interview questions based on the candidate profile
and the job requirements.

Return ONLY valid JSON using exactly this structure:

{{
    "technical_questions": [],
    "experience_questions": [],
    "missing_skill_questions": [],
    "behavioral_questions": []
}}

Rules:
- Generate 3 technical questions.
- Generate 2 questions about the candidate's experience.
- Generate questions about important missing skills from the job requirements.
- Generate 2 behavioral questions.
- Questions should be relevant to the specific job.
- Do not ask about information that is not related to the job or candidate.
- Do not invent facts about the candidate.
- Keep questions clear and suitable for a real interview.
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

    return json.loads(response_text)