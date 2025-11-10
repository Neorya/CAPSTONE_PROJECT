from fastapi import FastAPI
import os
import models
import time
from sqlalchemy import text
from sqlalchemy.exc import OperationalError

# Import your new database engine and models
from database import engine, Base


from match_settings_api import router as match_settings_router


# Wait for database to be ready and create schema/tables
def init_db():
    max_retries = 5
    retry_delay = 2
    
    for attempt in range(max_retries):
        try:
            with engine.connect() as conn:
                # Create the capstone_app schema if it doesn't exist
                conn.execute(text("CREATE SCHEMA IF NOT EXISTS capstone_app"))
                conn.commit()
            
            # Tell SQLAlchemy to create tables for any models
            models.Base.metadata.create_all(bind=engine)
            print("Database initialized successfully!")
            return
        except OperationalError as e:
            if attempt < max_retries - 1:
                print(f"Database not ready (attempt {attempt + 1}/{max_retries}), retrying in {retry_delay}s...")
                time.sleep(retry_delay)
            else:
                print(f"Failed to connect to database after {max_retries} attempts")
                raise

init_db()

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
