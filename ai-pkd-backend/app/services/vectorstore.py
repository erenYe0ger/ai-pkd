import chromadb

client = chromadb.PersistentClient(path="data/chroma_db")

collection = client.get_or_create_collection(
    name = "documents",
    metadata = {"hnsw:space": "cosine"}
)

def add_embeddings(doc_id: str, chunks: list[str], embeddings: list[list[float]]):
    ids = [f"{doc_id}_{i}" for i in range(len(chunks))]

    collection.add(
        ids = ids,
        documents = chunks,
        embeddings = embeddings
    )


def query_embeddings(query_embedding: list[float], k: int = 5):
    return collection.query(
        query_embeddings = [query_embedding],
        n_results = k
    )