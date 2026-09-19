import os
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

Analyze the following resume and extract the candidate information.

Return these sections:
- Name
- Email
- Phone
- Skills
- Education
- Experience
- Achievements

Do not invent information that is not present in the resume.

Resume:
{resume_text}
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    return response.text