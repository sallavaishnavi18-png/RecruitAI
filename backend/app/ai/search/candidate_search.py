import os
import json
from dotenv import load_dotenv
from google import genai

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("GEMINI_API_KEY is not set in .env")

client = genai.Client(api_key=api_key)


def search_candidates(query, candidates):

    prompt = f"""
You are an AI candidate search system for RecruitAI.

The recruiter has entered this search query:

{query}

Search the candidate pool and identify candidates relevant to the query.

Return ONLY valid JSON using exactly this structure:

{{
    "query": "",
    "matching_candidates": [
        {{
            "name": "",
            "reason": "",
            "matched_skills": []
        }}
    ]
}}

Rules:
- Use only information present in the candidate data.
- Do not invent skills, experience, education, or achievements.
- Include candidates only when their information matches the search query.
- Explain briefly why each candidate matches.
- If no candidates match, return an empty list.
- Return JSON only.
- Do not add markdown or explanations.

Candidate Pool:
{json.dumps(candidates, indent=2)}
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    response_text = response.text.strip()

    # Remove markdown code fences if Gemini adds them
    if response_text.startswith("```"):
        response_text = response_text.replace("```json", "")
        response_text = response_text.replace("```", "")
        response_text = response_text.strip()

    # Find JSON object
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