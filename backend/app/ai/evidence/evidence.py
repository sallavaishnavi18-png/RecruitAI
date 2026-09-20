import os
import json
from dotenv import load_dotenv
from google import genai

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("GEMINI_API_KEY is not set in .env")

client = genai.Client(api_key=api_key)


def generate_evidence(candidate, requirements, match_result, verification):

    prompt = f"""
You are an evidence and audit trail system for RecruitAI.

Analyze the candidate information, job requirements, matching result,
and verification result.

Return ONLY valid JSON.

Use exactly this structure:

{{
    "candidate_name": "",
    "evidence": [
        {{
            "requirement": "",
            "status": "",
            "evidence": "",
            "source": "",
            "confidence": ""
        }}
    ]
}}

Rules:
- Use only information provided in the input.
- Do not invent evidence.
- requirement should identify the job requirement being evaluated.
- status should be one of:
  "Supported", "Needs Validation", or "Not Found".
- evidence should briefly explain the information supporting the status.
- source should identify where the evidence came from:
  "Resume", "Interview", "Resume + Interview", or "Not Available".
- confidence should be:
  "High", "Medium", or "Low".
- Every important requirement should have an evidence entry.
- Do not make a hiring decision.
- Do not say who should be hired.
- Return JSON only.
- Do not add markdown or explanations.

Candidate:
{json.dumps(candidate, indent=2)}

Job Requirements:
{json.dumps(requirements, indent=2)}

Matching Result:
{json.dumps(match_result, indent=2)}

Verification Result:
{json.dumps(verification, indent=2)}
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