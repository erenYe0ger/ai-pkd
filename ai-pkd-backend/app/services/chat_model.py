from groq import Groq
import os
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key = os.getenv("GROQ_API_KEY"))

def generate_answer(question: str, context: str) -> str:    
    prompt = (
        f"You are a helpful assistant. Based on the following context, provide a concise and accurate answer to the question.\n\n"
        f"Context: {context}\n\n"
        f"Question: {question}"
    )

    response = client.chat.completions.create(
        model = "llama-3.1-8b-instant",
        messages = [{"role": "user", "content": prompt}]
    )

    return response.choices[0].message.content