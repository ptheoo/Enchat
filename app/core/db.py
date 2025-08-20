from motor.motor_asyncio import AsyncIOMotorClient
from config.settings import MONGO_URI, MONGO_DB

_client = None
_db = None

def get_mongo_client():
    global _client
    if _client is None:
        _client = AsyncIOMotorClient(MONGO_URI)
    return _client

def get_db():
    global _db
    if _db is None:
        _db = get_mongo_client()[MONGO_DB]
    return _db
