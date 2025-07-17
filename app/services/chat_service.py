from app.core.chat_engine import get_chat_response
from app.core.vector_store import add_to_vector_store, search_similar
from app.utils.logger import logger

def process_user_message(user_input: str):
    """
    Process the user's message by retrieving relevant context from the vector store,
    generating a response using a chat model, and storing both the user input and model reply.

    Args:
        user_input (str): The message entered by the user.

    Returns:
        tuple[str, list[dict]]: A tuple containing the model's reply and the updated conversation list.
    """
    logger.info(f"User input: {user_input}")

    # Retrieve similar past messages (context) to provide to the model
    context = search_similar(user_input)
    logger.debug(f"Retrieved context: {context}")

    # Construct system prompt with context to guide the model's response
    system_prompt = "You are a helpful assistant. Context:\n" + "\n".join(context)
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_input}
    ]

    # Get response from the configured chat model
    reply = get_chat_response(messages)
    logger.info(f"Model reply: {reply}")

    # Save both user input and model reply to the vector store
    add_to_vector_store(user_input)
    add_to_vector_store(reply)

    # Return reply and conversation history
    return reply, [
        {"role": "user", "content": user_input},
        {"role": "assistant", "content": reply}
    ]
