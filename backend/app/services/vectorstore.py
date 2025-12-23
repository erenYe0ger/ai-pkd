import chromadb

STORE_DIR = "data/chroma"


def get_store(doc_uid: str):
    client = chromadb.PersistentClient(path=f"{STORE_DIR}/{doc_uid}")

    return client.get_or_create_collection(
        name="chunks", metadata={"hnsw:space": "cosine"}
    )


def add_embeddings(doc_uid: str, chunks, embeddings):
    collection = get_store(doc_uid)

    ids = [str(i) for i in range(len(chunks))]

    collection.add(ids=ids, documents=chunks, embeddings=embeddings)


def query_embeddings(doc_uid: str, query_embedding: list[float], k: int = 5):
    collection = get_store(doc_uid)

    return collection.query(query_embeddings=[query_embedding], n_results=k)
