import json
from app.ai.ai_service import generate_ai_response


def generate_interview_questions(candidate, requirements):

    prompt = f"""
You are an AI interview question generator for RecruitAI.

Your task is to generate interview questions specifically for the
candidate and the job role described below.

The questions MUST be based on:
1. The job role and job description requirements.
2. The skills required for the job.
3. The candidate's skills.
4. The candidate's education and experience.
5. Important skills required by the job that are missing or unclear
   in the candidate profile.

Return ONLY valid JSON using exactly this structure:

{{
    "technical_questions": [],
    "experience_questions": [],
    "missing_skill_questions": [],
    "behavioral_questions": []
}}

Rules:

- Generate exactly 3 technical questions.
- Generate exactly 2 questions about the candidate's experience.
- Generate exactly 2 missing-skill questions.
- Generate exactly 2 behavioral questions.
- Technical questions must be relevant to the job role and required skills.
- Experience questions must refer to the candidate's actual experience
  when relevant.
- Missing-skill questions should focus on important job requirements
  that are missing or unclear in the candidate profile.
- Behavioral questions should be relevant to the responsibilities
  and nature of the job.
- Do not invent candidate experience, projects, skills, education,
  achievements, or other facts.
- Do not ask generic questions when a more role-specific question
  can be generated.
- Questions should be clear and suitable for a real interview.
- Do not repeat the same question in different categories.
- Return JSON only.
- Do not add markdown.
- Do not add explanations.

Candidate Profile:
{json.dumps(candidate, indent=2)}

Job Requirements:
{json.dumps(requirements, indent=2)}
"""

    try:

        response_text = generate_ai_response(prompt)

        response_text = response_text.strip()

        # Remove markdown code fences if the AI adds them
        if response_text.startswith("```"):
            response_text = response_text.replace("```json", "")
            response_text = response_text.replace("```", "")
            response_text = response_text.strip()

        interview_questions = json.loads(response_text)

        return interview_questions

    except Exception as error:

        raise ValueError(
            f"Interview question generation failed: {error}"
        )