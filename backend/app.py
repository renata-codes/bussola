from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from consumer_service import buscar_empresa

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/search")
def search(query: str):
    return {
        "empresa": query,
        "resultados": buscar_empresa(query)
    }