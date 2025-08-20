from collections import Counter
import pymongo

MONGO_URI = "mongodb://localhost:27017/"
DB_NAME = "grammar_db"
RAW_COL = "grammar_articles"
NOISE_COL = "noise_lines"

def get_collection(name):
    client = pymongo.MongoClient(MONGO_URI)
    return client[DB_NAME][name]

def find_common_lines(min_freq=5):
    raw_col = get_collection(RAW_COL)
    counter = Counter()

    for doc in raw_col.find({}, {"content": 1}):
        lines = [l.strip() for l in doc["content"].split("\n") if l.strip()]
        counter.update(lines)

    common_lines = [line for line, freq in counter.items() if freq >= min_freq]
    return common_lines

if __name__ == "__main__":
    noise_col = get_collection(NOISE_COL)
    noise_col.delete_many({})  # clear cũ

    common_lines = find_common_lines()
    if common_lines:
        noise_col.insert_many([{"line": l} for l in common_lines])
        print(f"✅ Lưu {len(common_lines)} dòng nghi rác vào '{NOISE_COL}'")
    else:
        print("Không tìm thấy dòng rác.")
