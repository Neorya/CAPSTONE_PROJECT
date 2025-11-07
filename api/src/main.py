from fastapi import FastAPI
import os
from match_settings_api import router as match_settings_router

app = FastAPI()

app.include_router(match_settings_router)

@app.get("/")
def read_root():
    # Reads the database URL from the environment variable
    db_url = os.getenv("DATABASE_URL", "DATABASE_URL not set")
    return {
        "message": "FastAPI server is running",
        "database_url_check": db_url
    }

@app.get("/health")
def health_check():
    return {"status": "ok"}
