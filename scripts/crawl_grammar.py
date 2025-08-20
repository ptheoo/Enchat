import requests
from bs4 import BeautifulSoup
import pymongo
import sys
import hashlib

def get_mongo_collection():
    client = pymongo.MongoClient("mongodb://localhost:27017/")
    db = client["grammar_db"]
    return db["grammar_articles"]

def extract_main_content(soup):
    # Các selector phổ biến cho phần nội dung chính
    possible_selectors = [
        "article",
        "#main",
        "#content",
        ".content",
        ".main-content",
        ".post-content",
        ".entry-content"
    ]
    for sel in possible_selectors:
        el = soup.select_one(sel)
        if el:
            return el.get_text(separator="\n", strip=True)
    # Nếu không có thì fallback toàn bộ body
    return soup.body.get_text(separator="\n", strip=True) if soup.body else ""

def crawl_page(url):
    try:
        res = requests.get(url, headers={"User-Agent": "Mozilla/5.0"}, timeout=15)
        res.raise_for_status()
        soup = BeautifulSoup(res.text, "html.parser")
        
        title = soup.title.string.strip() if soup.title else "No title"
        text_content = extract_main_content(soup)
        
        if not text_content or len(text_content) < 50:
            print(f"⚠️ Nội dung quá ngắn hoặc trống cho {url}")
        
        return {
            "_id": hashlib.md5(url.encode()).hexdigest(),
            "url": url,
            "title": title,
            "content": text_content,
            "length": len(text_content)
        }
    except Exception as e:
        print(f"❌ Lỗi crawl {url}: {e}")
        return None

def main(source_file):
    col = get_mongo_collection()
    
    with open(source_file, "r", encoding="utf-8") as f:
        for line in f:
            url = line.strip()
            if not url:
                continue
            print(f"🌐 Đang tải: {url}")
            data = crawl_page(url)
            if data:
                try:
                    col.insert_one(data)
                    print(f"📥 Lưu vào MongoDB: {data['title']} ({data['length']} ký tự)")
                except pymongo.errors.DuplicateKeyError:
                    print(f"⚠️ Bỏ qua (đã tồn tại): {url}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Cách dùng: python crawl_grammar.py urls.txt")
    else:
        main(sys.argv[1])
