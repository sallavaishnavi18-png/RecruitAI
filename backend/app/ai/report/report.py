import os
import json
from dotenv import load_dotenv
from google import genai

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("GEMINI_API_KEY is not set in .env")

client = genai.Client(api_key=api_key)


def generate_evaluation_report(
    candidate,
    requirements,
    match_result,
    skill_gap,
    evidence,
    interview_analysis=None
):

    prompt = f"""
You are an AI candidate evaluation report system for RecruitAI.

Create a standardized evaluation report using the candidate information,
job requirements, matching result, skill gap analysis, evidence,
and interview analysis.

Return ONLY valid JSON.

Use exactly this structure:

{{
    "candidate_name": "",
    "job_title": "",
    "match_summary": "",
    "overall_match": 0,
    "strengths": [],
    "skill_gaps": [],
    "verified_information": [],
    "needs_validation": [],
    "interview_summary": "",
    "follow_up_questions": [],
    "evidence_summary": "",
    "evaluation_summary": ""
}}

Rules:
- Use only information provided in the input.
- Do not invent candidate information.
- overall_match should use the available matching result.
- strengths should contain important skills or qualifications supported by evidence.
- skill_gaps should contain important missing skills.
- verified_information should contain claims supported by evidence.
- needs_validation should contain claims or requirements that need further validation.
- interview_summary should summarize the interview analysis when available.
- follow_up_questions should contain useful questions for unclear areas.
- evidence_summary should briefly explain the available evidence.
- evaluation_summary should provide a neutral summary of the candidate's information.
- Do not make a hiring decision.
- Do not say who should be hired.
- Do not rank candidates.
- Return JSON only.
- Do not add markdown or explanations.

Candidate:
{json.dumps(candidate, indent=2)}

Job Requirements:
{json.dumps(requirements, indent=2)}

Matching Result:
{json.dumps(match_result, indent=2)}

Skill Gap Analysis:
{json.dumps(skill_gap, indent=2)}

Evidence:
{json.dumps(evidence, indent=2)}

Interview Analysis:
{json.dumps(interview_analysis, indent=2)}
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
            raise ValueError(
                "Gemini API quota exceeded. Please try again later."
            )

        raise error