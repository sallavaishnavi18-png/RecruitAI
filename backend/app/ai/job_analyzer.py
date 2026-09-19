import os
import json
from dotenv import load_dotenv
from google import genai

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("GEMINI_API_KEY is not set in .env")

client = genai.Client(api_key=api_key)


def analyze_job(job_description):
    prompt = f"""
You are an AI job description analyzer for RecruitAI.

Analyze the following job description and return ONLY valid JSON.

Use exactly this structure:

{{
    "job_title": "",
    "required_skills": [],
    "qualifications": [],
    "experience_requirements": [],
    "responsibilities": []
}}

Rules:
- Extract only information present in the job description.
- Do not invent requirements.
- Put each skill as a separate item.
- Put qualifications in the qualifications list.
- Put experience requirements in the experience_requirements list.
- Put responsibilities in the responsibilities list.
- If something is missing, use an empty list or empty string.
- Return JSON only.
- Do not add explanations or markdown.

Job Description:
{job_description}
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    response_text = response.text.strip()

    return json.loads(response_text)