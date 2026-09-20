import os
import json
from dotenv import load_dotenv
from google import genai

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("GEMINI_API_KEY is not set in .env")

client = genai.Client(api_key=api_key)


def analyze_job_description(title, description):

    prompt = f"""
You are an AI job description analyzer for RecruitAI.

Analyze the following job description.

Return ONLY valid JSON.

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
- Put each required skill as a separate item.
- Put qualifications in the qualifications list.
- Put experience requirements in the experience_requirements list.
- Put job duties in the responsibilities list.
- If information is missing, use an empty list.
- Return JSON only.
- Do not add markdown or explanations.

Job Title:
{title}

Job Description:
{description}
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