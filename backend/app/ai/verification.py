import os
import json
from dotenv import load_dotenv
from google import genai

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("GEMINI_API_KEY is not set in .env")

client = genai.Client(api_key=api_key)


def verify_resume_claims(candidate, transcript):

    prompt = f"""
You are an AI resume claim verification system for RecruitAI.

Compare the claims in the candidate's resume with evidence
from the interview transcript.

Return ONLY valid JSON using exactly this structure:

{{
    "claims": [
        {{
            "claim": "",
            "evidence": "",
            "status": "",
            "follow_up_question": ""
        }}
    ]
}}

Rules:
- Identify important claims from the candidate's resume.
- Use only claims supported by the candidate information.
- Check whether the interview transcript provides evidence for each claim.
- "Verified" means the interview provides clear supporting evidence.
- "Needs Validation" means the claim is not sufficiently supported.
- Do not assume information that is not provided.
- Keep evidence short and specific.
- Add a follow-up question when a claim needs more validation.
- Do not make a hiring decision.
- Return JSON only.
- Do not add markdown or explanations outside the JSON.

Candidate Resume Information:
{json.dumps(candidate, indent=2)}

Interview Transcript:
{transcript}
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

    return json.loads(response_text)