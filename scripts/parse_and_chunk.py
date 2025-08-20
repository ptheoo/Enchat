# scripts/chunk_grammar.py
import os
import re
import math
from nltk.tokenize import sent_tokenize
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

# ===== Kết nối MongoDB =====
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
DB_NAME = os.getenv("DB_NAME", "grammar_db")
COLL_INPUT = "grammar_articles_clean"
COLL_OUTPUT = "grammar_articles_chunks"

client = MongoClient(MONGO_URI)
db = client[DB_NAME]

# ===== Hàm chunk =====
def chunk_text(text, min_tokens=200, max_tokens=400):
    sentences = sent_tokenize(text)
    chunks, current_chunk = [], []
    token_count = 0

    for sent in sentences:
        tokens = sent.split()
        token_count += len(tokens)
        current_chunk.append(sent)

        if token_count >= min_tokens:
            chunks.append(" ".join(current_chunk))
            current_chunk = []
            token_count = 0

    if current_chunk:
        chunks.append(" ".join(current_chunk))

    return chunks

# ===== Main process =====
def main():
    docs = list(db[COLL_INPUT].find({}))
    print(f"🔍 Tìm thấy {len(docs)} documents từ {COLL_INPUT}")

    for doc in docs:
        text = doc.get("content", "").strip()
        if not text:
            continue

        chunks = chunk_text(text)

        output_docs = []
        for idx, chunk in enumerate(chunks):
            output_docs.append({
                "topic": doc.get("topic"),
                "source_doc": doc.get("source_doc"),
                "page": idx + 1,
                "type": doc.get("type", "explain"),
                "content": chunk
            })

        if output_docs:
            db[COLL_OUTPUT].insert_many(output_docs)

    print(f"✅ Hoàn tất chunking! Lưu vào collection `{COLL_OUTPUT}`")

if __name__ == "__main__":
    import nltk
    nltk.download("punkt")
    main()
