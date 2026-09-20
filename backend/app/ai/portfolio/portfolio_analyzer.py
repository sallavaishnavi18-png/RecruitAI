import os
import json
from dotenv import load_dotenv
from google import genai

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("GEMINI_API_KEY is not set in .env")

client = genai.Client(api_key=api_key)


def analyze_portfolio_data(portfolio_data):

    prompt = f"""
You are an AI portfolio analyzer for RecruitAI.

Analyze the candidate's portfolio website.

Return ONLY valid JSON.

Use exactly this structure:

{{
    "technical_skills": [],
    "projects": [],
    "technologies": [],
    "experience_indicators": [],
    "summary": ""
}}

Rules:
- Use only information present in the portfolio data.
- Do not invent skills, projects, or experience.
- technical_skills should contain technical skills supported by the website.
- projects should contain projects mentioned on the website.
- technologies should contain technologies clearly mentioned.
- experience_indicators should contain evidence of technical work or experience.
- summary should briefly summarize the portfolio.
- Do not make a hiring decision.
- Do not rank the candidate.
- Return JSON only.
- Do not add markdown or explanations.

Portfolio Data:
{json.dumps(portfolio_data, indent=2)}
"""

    try:

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

        return json.loads(response_text)

    except Exception as error:

        error_message = str(error)

        if "429" in error_message or "RESOURCE_EXHAUSTED" in error_message:
            return {
                "technical_skills": [],
                "projects": [],
                "technologies": [],
                "experience_indicators": [],
                "summary": "Portfolio data was collected successfully, but AI analysis is temporarily unavailable because the Gemini API quota has been reached."
            }

        raise error