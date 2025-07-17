from config.settings import (
    USE_GEMINI,
    GEMINI_API_KEY,
    GEMINI_MODEL,
    OPENAI_API_KEY,
    OPENAI_API_BASE,
    MODEL_NAME,
)

import logging

logger = logging.getLogger("chatbot")

# Initialize the selected model
if USE_GEMINI:
    import google.generativeai as genai

    # Configure Gemini API key
    genai.configure(api_key=GEMINI_API_KEY)

    # Initialize Gemini model instance
    gemini_model = genai.GenerativeModel(GEMINI_MODEL)
else:
    import openai

    # Configure OpenAI API
    openai.api_key = OPENAI_API_KEY
    openai.api_base = OPENAI_API_BASE

def get_chat_response(messages: list[dict]) -> str:
    """
    Generate a chat response using either Google Gemini or OpenAI GPT model,
    based on the configuration.

    Args:
        messages (list[dict]): A list of message dicts with 'role' and 'content',
                               e.g., [{'role': 'user', 'content': 'Hello!'}]

    Returns:
        str: The response message content from the AI model.

    Raises:
        Exception: If the model fails to generate a valid response.
    """
    logger.info("Generating chat response...")

    if USE_GEMINI:
        try:
            # Convert messages into Gemini-friendly prompt format
            prompt = ""
            for m in messages:
                role = "User" if m["role"] == "user" else "Assistant"
                prompt += f"{role}: {m['content']}\n"

            logger.debug(f"Gemini prompt:\n{prompt.strip()}")

            # Generate response from Gemini
            response = gemini_model.generate_content(prompt)

            return response.text.strip()
        except Exception as e:
            logger.error(f"Gemini error: {str(e)}")
            raise Exception("Failed to generate response using Gemini API.")
    else:
        try:
            # Generate response from OpenAI ChatCompletion API
            response = openai.ChatCompletion.create(
                model=MODEL_NAME,
                messages=messages
            )

            return response.choices[0].message.content.strip()
        except Exception as e:
            logger.error(f"OpenAI error: {str(e)}")
            raise Exception("Failed to generate response using OpenAI API.")
