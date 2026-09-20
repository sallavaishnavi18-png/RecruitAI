from app.ai.groq import client as groq_client
from app.ai.gemini_client import client as gemini_client


def generate_ai_response(prompt):

    # Try Groq first
    try:
        response = groq_client.chat.completions.create(
            model="openai/gpt-oss-20b",
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )

        return response.choices[0].message.content

    except Exception as groq_error:
        print("Groq failed:", groq_error)
        print("Trying Gemini...")

        # Try Gemini as backup
        try:
            response = gemini_client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt
            )

            return response.text

        except Exception as gemini_error:
            raise ValueError(
                f"Both Groq and Gemini failed. "
                f"Groq error: {groq_error}. "
                f"Gemini error: {gemini_error}"
            )