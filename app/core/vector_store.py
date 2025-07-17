from sentence_transformers import SentenceTransformer
import chromadb

# Initialize persistent ChromaDB client
client = chromadb.PersistentClient(path="./chroma_db")

# Create or get a collection named "chat_history"
collection = client.get_or_create_collection("chat_history")

# Load sentence embedding model
EMBED_MODEL = SentenceTransformer("all-MiniLM-L6-v2")

def add_to_vector_store(text: str):
    """
    Add a piece of text to the ChromaDB vector store.

    Args:
        text (str): The text to be embedded and stored.

    Returns:
        None
    """
    # Generate embedding
    embedding = EMBED_MODEL.encode([text])[0]

    # Generate a unique document ID based on current collection size
    doc_id = f"doc_{len(collection.get()['ids'])}"

    # Add to Chroma collection
    collection.add(
        documents=[text],
        embeddings=[embedding.tolist()],
        ids=[doc_id]
    )

def search_similar(query: str, k: int = 3) -> list[str]:
    """
    Search for top-k similar documents in the vector store based on a query.

    Args:
        query (str): The input query to search against the collection.
        k (int): The number of top similar results to return.

    Returns:
        list[str]: List of top-k similar document texts. Empty if collection is empty.
    """
    # Return empty list if collection has no documents
    if len(collection.get()["documents"]) == 0:
        return []

    # Generate embedding for query
    embedding = EMBED_MODEL.encode([query])[0]

    # Query the collection using the embedding
    results = collection.query(query_embeddings=[embedding.tolist()], n_results=k)

    return results["documents"][0] if results["documents"] else []
