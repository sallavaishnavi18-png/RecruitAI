import json
from app.ai.ai_service import generate_ai_response


def group_candidates(candidates, requirements):

    prompt = f"""
You are an AI candidate grouping system for RecruitAI.

Group candidates based on how relevant their profile is to the job requirements.

Job Requirements:
{json.dumps(requirements, indent=2)}

Candidates:
{json.dumps(candidates, indent=2)}

Return ONLY valid JSON using exactly this structure:

{{
    "strong_match": [],
    "potential_match": [],
    "needs_validation": []
}}

Rules:

- strong_match:
  Candidates whose skills, experience, education and projects are strongly relevant
  to the job requirements.

- potential_match:
  Candidates who have some relevant skills or experience but do not fully match
  the requirements.

- needs_validation:
  Candidates where important information is missing, unclear or requires
  verification before judging their suitability.

- Use the candidate's name in each list.
- Do not invent candidate information.
- Base grouping only on the provided candidate profiles and job requirements.
- Do not make a final hiring decision.
- A candidate can appear in only one group.
- Return JSON only.
- Do not add explanations or markdown.
"""

    try:

        response_text = generate_ai_response(prompt)

        response_text = response_text.strip()

        if response_text.startswith("```"):
            response_text = response_text.replace("```json", "")
            response_text = response_text.replace("```", "")
            response_text = response_text.strip()

        start = response_text.find("{")
        end = response_text.rfind("}")

        if start == -1 or end == -1:
            raise ValueError("AI did not return valid JSON.")

        response_text = response_text[start:end + 1]

        return json.loads(response_text)

    except Exception as error:

        raise ValueError(
            f"Candidate grouping failed: {error}"
        )