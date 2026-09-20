import json
from app.ai.ai_service import generate_ai_response


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

    try:

        response_text = generate_ai_response(prompt)

        response_text = response_text.strip()

        # Remove markdown code fences if the AI adds them
        if response_text.startswith("```"):
            response_text = response_text.replace("```json", "")
            response_text = response_text.replace("```", "")
            response_text = response_text.strip()

        # Find the JSON object
        start = response_text.find("{")
        end = response_text.rfind("}")

        if start == -1 or end == -1:
            raise ValueError("AI did not return valid JSON.")

        response_text = response_text[start:end + 1]

        return json.loads(response_text)

    except json.JSONDecodeError as error:

        print("JSON ERROR:")
        print(error)

        print("AI RESPONSE:")
        print(response_text)

        raise ValueError("AI returned invalid JSON.")

    except Exception as error:

        raise ValueError(
            f"Job description analysis failed: {error}"
        )