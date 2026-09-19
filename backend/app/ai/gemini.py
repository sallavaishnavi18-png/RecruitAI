import os
import json
from dotenv import load_dotenv
from google import genai

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("GEMINI_API_KEY is not set in .env")

client = genai.Client(api_key=api_key)


def analyze_resume(resume_text):
    prompt = f"""
You are an AI resume analyzer for RecruitAI.

Analyze the resume and return ONLY valid JSON.

Use exactly this structure:

{{
    "name": "",
    "email": "",
    "phone": "",
    "skills": [],
    "education": [],
    "experience": [],
    "achievements": []
}}

Rules:
- Extract only information present in the resume.
- Do not invent information.
- Put each skill as a separate item in the skills list.
- Put education details in the education list.
- Put each job or experience entry in the experience list.
- Put achievements in the achievements list.
- If information is missing, use an empty string or empty list.
- Do not add explanations or markdown.
- Return JSON only.

Resume:
{resume_text}
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    response_text = response.text.strip()

    return json.loads(response_text)