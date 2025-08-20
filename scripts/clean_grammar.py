import pymongo

MONGO_URI = "mongodb://localhost:27017/"
DB_NAME = "grammar_db"
RAW_COL = "grammar_articles"
NOISE_COL = "noise_lines"
CLEAN_COL = "grammar_articles_clean"

def get_collection(name):
    client = pymongo.MongoClient(MONGO_URI)
    return client[DB_NAME][name]

if __name__ == "__main__":
    raw_col = get_collection(RAW_COL)
    noise_col = get_collection(NOISE_COL)
    clean_col = get_collection(CLEAN_COL)

    clean_col.delete_many({})  # clear cũ

    noise_set = set(doc["line"] for doc in noise_col.find())
    print(f"🧹 Đang bỏ {len(noise_set)} dòng rác...")

    for doc in raw_col.find():
        lines = [l for l in doc["content"].split("\n") if l.strip() and l.strip() not in noise_set]
        clean_text = "\n".join(lines)
        clean_doc = {**doc, "content": clean_text}
        clean_col.insert_one(clean_doc)

    print(f"✅ Đã tạo {clean_col.count_documents({})} bản ghi sạch trong '{CLEAN_COL}'")
