import os
import json
from dotenv import load_dotenv
from google import genai

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("GEMINI_API_KEY is not set in .env")

client = genai.Client(api_key=api_key)


def analyze_transcript(transcript, candidate, requirements):

    prompt = f"""
You are an AI interview analysis system for RecruitAI.

Analyze the interview transcript using the candidate information
and job requirements.

Return ONLY valid JSON using exactly this structure:

{{
    "questions_analyzed": [],
    "key_evidence": [],
    "matched_requirements": [],
    "unanswered_requirements": [],
    "follow_up_questions": [],
    "overall_summary": ""
}}

Rules:
- Analyze only the information present in the transcript,
  candidate profile, and job requirements.
- Do not invent candidate information.
- questions_analyzed should contain important interview questions
  and a short summary of the candidate's answer.
- key_evidence should contain important evidence provided by the candidate.
- matched_requirements should contain job requirements supported by
  evidence from the interview.
- unanswered_requirements should contain important requirements that
  were not sufficiently discussed.
- follow_up_questions should contain useful questions for areas that
  need clarification or more evidence.
- overall_summary should briefly summarize the interview.
- Do not make hiring decisions.
- Do not add explanations outside the JSON.
- Return JSON only.

Candidate:
{json.dumps(candidate, indent=2)}

Job Requirements:
{json.dumps(requirements, indent=2)}

Interview Transcript:
{transcript}
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    response_text = response.text.strip()

    print("GEMINI RESPONSE:")
    print(response_text)

    if response_text.startswith("```"):
        response_text = response_text.replace("```json", "")
        response_text = response_text.replace("```", "")
        response_text = response_text.strip()

    return json.loads(response_text)