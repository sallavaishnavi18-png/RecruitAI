import json
from app.ai.ai_service import generate_ai_response


def analyze_resume(resume_text):

    prompt = f"""
You are an AI resume analyzer for RecruitAI.

Analyze the resume and return ONLY valid JSON.

Use exactly this structure:

{{
    "name": "",
    "email": "",
    "phone": "",
    "skills": [],
    "education": [],
    "experience": [],
    "achievements": []
}}

Rules:
- Extract only information present in the resume.
- Do not invent information.
- Put each skill as a separate item in the skills list.
- Put education details in the education list.
- Put each job or experience entry in the experience list.
- Put achievements in the achievements list.
- If information is missing, use an empty string or empty list.
- Do not add explanations or markdown.
- Return JSON only.

Resume:
{resume_text}
"""

    try:

        response_text = generate_ai_response(prompt)

        response_text = response_text.strip()

        if response_text.startswith("```"):
            response_text = response_text.replace("```json", "")
            response_text = response_text.replace("```", "")
            response_text = response_text.strip()

        return json.loads(response_text)

    except Exception as error:

        raise ValueError(
            f"Resume analysis failed: {error}"
        )