"""
Database Connection Management

This file sets up the SQLAlchemy engine and session management.
It provides a reusable 'get_db' dependency for FastAPI endpoints.
"""

import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

# Get the database URL from the environment variable (set in docker-compose)
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://changeme:changeme@db/changeme")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is not set")


# Create the SQLAlchemy engine
engine = create_engine(DATABASE_URL)

# Create a configured "Session" class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create a Base class for our models to inherit from see models.py
Base = declarative_base()


# --- FastAPI Dependency ---

def get_db():
    """
    FastAPI dependency that provides a database session.
    It ensures the session is always closed after the request.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()