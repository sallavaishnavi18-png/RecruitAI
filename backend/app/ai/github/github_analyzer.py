import os
import json
from dotenv import load_dotenv
from google import genai

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("GEMINI_API_KEY is not set in .env")

client = genai.Client(api_key=api_key)


def analyze_github_data(github_data):

    prompt = f"""
You are an AI GitHub profile analyzer for RecruitAI.

Analyze the GitHub profile and repositories.

Return ONLY valid JSON.

Use exactly this structure:

{{
    "technical_skills": [],
    "project_evidence": [],
    "relevant_projects": [],
    "experience_indicators": [],
    "summary": ""
}}

Rules:
- Use only information present in the GitHub data.
- Do not invent skills or experience.
- technical_skills should contain programming languages and technical skills
  clearly supported by the repositories.
- project_evidence should describe useful evidence from the repositories.
- relevant_projects should list projects that demonstrate useful technical work.
- experience_indicators should mention evidence supported by the data.
- summary should briefly summarize the GitHub profile.
- Do not make a hiring decision.
- Do not rank the candidate.
- Return JSON only.
- Do not add markdown or explanations.

GitHub Data:
{json.dumps(github_data, indent=2)}
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

        try:
            return json.loads(response_text)

        except json.JSONDecodeError as error:
            print("JSON ERROR:")
            print(error)

            print("GEMINI RESPONSE:")
            print(response_text)

            raise ValueError("Gemini returned invalid JSON.")

    except Exception as error:

        error_message = str(error)

        if "429" in error_message or "RESOURCE_EXHAUSTED" in error_message:

            return {
                "technical_skills": [],
                "project_evidence": [],
                "relevant_projects": [],
                "experience_indicators": [],
                "summary": "GitHub data was collected successfully, but AI analysis is temporarily unavailable because the Gemini API quota has been reached."
            }

        raise error