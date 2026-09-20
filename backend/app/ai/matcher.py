import json
from app.ai.ai_service import generate_ai_response


def match_candidate_to_job(candidate, requirements):

    prompt = f"""
You are an AI candidate-job matching system for RecruitAI.

Compare the candidate against the job requirements.

Return ONLY valid JSON.

Use exactly this structure:

{{
    "matched_skills": [],
    "missing_skills": [],
    "qualification_match": "",
    "experience_match": "",
    "overall_match": 0,
    "explanation": ""
}}

Rules:
- Use only information present in the candidate and job requirements.
- Do not invent skills, qualifications, or experience.
- matched_skills should contain required skills that the candidate has.
- missing_skills should contain required skills that the candidate does not have.
- qualification_match should describe how the candidate's qualifications match the job.
- experience_match should describe how the candidate's experience matches the job.
- overall_match should be a percentage from 0 to 100.
- explanation should briefly explain the result.
- Do not make a hiring decision.
- Return JSON only.
- Do not add markdown or explanations.

Candidate:
{json.dumps(candidate, indent=2)}

Job Requirements:
{json.dumps(requirements, indent=2)}
"""

    response_text = generate_ai_response(prompt).strip()

    # Remove markdown code fences if the AI adds them
    if response_text.startswith("```"):
        response_text = response_text.replace("```json", "")
        response_text = response_text.replace("```", "")
        response_text = response_text.strip()

    # Find JSON object
    start = response_text.find("{")
    end = response_text.rfind("}")

    if start == -1 or end == -1:
        raise ValueError("AI did not return valid JSON.")

    response_text = response_text[start:end + 1]

    try:
        return json.loads(response_text)

    except json.JSONDecodeError as error:
        print("JSON ERROR:")
        print(error)
        print("AI RESPONSE:")
        print(response_text)

        raise ValueError("AI returned invalid JSON.")