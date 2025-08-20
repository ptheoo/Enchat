# load_data.py
from app.core.vector_store import add_to_vector_store
from pymongo import MongoClient

# Kết nối MongoDB
client = MongoClient("mongodb://localhost:27017")
db = client["grammar_db"]
collection = db["grammar_articles_chunks"]

# Lấy dữ liệu
docs = collection.find({})
texts = [doc["content"] for doc in docs if "content" in doc]

# Nhúng + lưu vào ChromaDB
if texts:
    add_to_vector_store(texts)
    print(f"✅ Added {len(texts)} chunks into ChromaDB")
else:
    print("⚠️ No data found in MongoDB")
