from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
import models
import time
from sqlalchemy import text
from sqlalchemy.exc import OperationalError

# Import your new database engine and models
from database import engine, Base


from match_settings_api import router as match_settings_router

# Tell SQLAlchemy to create tables for any models
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# todo: CHECK THIS - added to make the call from frontend work
# Allow the URL(s) where your frontend is actually served to the browser
ALLOWED_ORIGINS = [
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=False,
)
# todo: CHECK THIS (end)

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
