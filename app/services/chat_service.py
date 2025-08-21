from app.core.chat_engine import get_chat_response
from app.core.vector_store import add_to_vector_store, search_similar
from app.utils.logger import logger

async def process_user_message(user_id: str, user_input: str, db):
    logger.info(f"User({user_id}) input: {user_input}")

    # Lấy lịch sử chat gần đây của user (giữ context)
    try:
        cursor = db.chat_history.find(
            {"user_id": user_id},
            {"role": 1, "content": 1, "_id": 0}
        ).sort("_id", -1).limit(10)
        
        recent_history = await cursor.to_list(length=10)  # Chuyển cursor thành list
        
        # Đảo ngược để có thứ tự đúng (cũ nhất trước)
        conversation_history = list(reversed(recent_history))
        
        logger.info(f"Loaded {len(conversation_history)} previous messages for context")
        
    except Exception as e:
        logger.error(f"Error loading chat history: {e}")
        conversation_history = []  # Fallback: không có context
    
    # Tìm context liên quan từ vector store
    try:
        context = search_similar(user_input)
        context_text = "\n".join(context) if context else "No specific context found"
    except Exception as e:
        logger.error(f"Error searching vector store: {e}")
        context_text = "No specific context found"
    
    system_prompt = """You are a helpful assistant for English grammar. You should:

IMPORTANT CONTEXT RULES:
1. ALWAYS remember the context of the conversation
2. If the user asks "why?" or "tại sao?", ALWAYS refer to the previous question and answer
3. If the user asks follow-up questions, ALWAYS connect them to previous context
4. If the user asks about grammar rules, refer to previous examples discussed
5. Maintain conversation continuity - don't start new topics unless asked
6. If user asks "what about X?" or similar, connect to previous grammar points

CONVERSATION FLOW:
- Keep track of what grammar topic was discussed
- Reference previous examples when explaining
- Build upon previous explanations
- If user seems confused, clarify by referring to earlier context

Context from knowledge base:
""" + context_text

    # Tạo messages với context đầy đủ
    messages = [{"role": "system", "content": system_prompt}]
    
    # Thêm lịch sử hội thoại gần đây (nếu có)
    if conversation_history:
        for msg in conversation_history:
            messages.append({"role": msg["role"], "content": msg["content"]})
        logger.info(f"Added {len(conversation_history)} context messages")
    else:
        logger.info("No previous context found, starting fresh conversation")
    
    # Thêm message hiện tại
    messages.append({"role": "user", "content": user_input})
    
    # Log context để debug
    logger.debug(f"System prompt: {system_prompt[:200]}...")
    logger.debug(f"Total messages sent to AI: {len(messages)}")

    reply = get_chat_response(messages)
    logger.info(f"Model reply: {reply}")

    # Lưu vector store
    try:
        add_to_vector_store(user_input)
        add_to_vector_store(reply)
        logger.info("Vector store updated successfully")
    except Exception as e:
        logger.error(f"Error updating vector store: {e}")
        # Không fail nếu không lưu được vector store

    # Lưu lịch sử chat theo user vào MongoDB
    try:
        await db.chat_history.insert_many([
            {"user_id": user_id, "role": "user", "content": user_input},
            {"user_id": user_id, "role": "assistant", "content": reply},
        ])
        logger.info("Chat history saved successfully")
    except Exception as e:
        logger.error(f"Error saving chat history: {e}")
        # Không fail nếu không lưu được lịch sử

    return reply, [
        {"role": "user", "content": user_input},
        {"role": "assistant", "content": reply}
    ]
