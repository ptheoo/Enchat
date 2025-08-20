from app.core.chat_engine import get_chat_response
from app.core.vector_store import add_to_vector_store, search_similar
from app.utils.logger import logger

async def process_user_message(user_id: str, user_input: str, db):
    logger.info(f"User({user_id}) input: {user_input}")

    context = search_similar(user_input)
    system_prompt = "You are a helpful assistant for English grammar. Context:\n" + "\n".join(context)
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_input}
    ]

    reply = get_chat_response(messages)
    logger.info(f"Model reply: {reply}")

    # Lưu vector store
    add_to_vector_store(user_input)
    add_to_vector_store(reply)

    # Lưu lịch sử chat theo user vào MongoDB
    await db.chat_history.insert_many([
        {"user_id": user_id, "role": "user", "content": user_input},
        {"user_id": user_id, "role": "assistant", "content": reply},
    ])

    return reply, [
        {"role": "user", "content": user_input},
        {"role": "assistant", "content": reply}
    ]
