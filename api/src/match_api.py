"""
Matches API Module

Provides endpoints for creating, browsing matches previously created.
"""

import re
import html
import logging

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field, field_validator
from sqlalchemy.orm import Session

from database import get_db
from models import Match, Teacher, MatchSetting


# Pydantic Models


class MatchCreate(BaseModel):
    """
    Request model for creating a new match.
    """

    title: str = Field(..., description="Title of the match")
    match_set_id: int = Field(..., description="ID of the parent Match Setting")
    creator_id: int = Field(..., description="ID of the teacher creating this match")
    difficulty_level: int = Field(..., description="Difficulty level", ge=0, le=10)
    review_number: int = Field(..., description="Number of reviews", ge=1, le=100)
    duration_phase1: int = Field(..., description="Estimated duration of phase 1 in minutes", ge=1)
    duration_phase2: int = Field(..., description="Estimated duration of phase 2 in minutes", ge=1)

class MatchResponse(BaseModel):
    """
    Response model for a single match
    """

    match_id: int = Field(..., description="Unique identifier for the match")
    title: str = Field(..., description="Title of the match")
    match_set_id: int = Field(..., description="ID of the parent Match Setting")
    creator_id: int = Field(..., description="ID of the teacher")
    difficulty_level: int = Field(..., description="Difficulty level")
    review_number: int = Field(..., description="Number of reviews")
    duration_phase1: int = Field(..., description="Estimated duration of phase 1 in minutes")
    duration_phase2: int = Field(..., description="Estimated duration of phase 2 in minutes")


# Router


router = APIRouter(prefix="/api", tags=["matches"])

# Endpoints


@router.post(
    "/matches",
    response_model=MatchResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new match",
    description="Allows a teacher to create a new match based on a match setting.",
)
async def create_match(
    match: MatchCreate, db: Session = Depends(get_db)
) -> MatchResponse:
    """
    Create a new match resource in the database.

    Args:
        match: The request body containing match data.
        db: The SQLAlchemy database session.

    Returns:
        The newly created match object.

    Raises:
        HTTPException (400): If the 'creator_id' or 'match_set_id' does not exist.
        HTTPException (500): On database operation failure.
    """

    # Check if the creator (teacher) exists
    teacher = db.query(Teacher).filter(Teacher.teacher_id == match.creator_id).first()
    # Check if the match setting exists
    setting = (
        db.query(MatchSetting)
        .filter(MatchSetting.match_set_id == match.match_set_id)
        .first()
    )

    if not teacher or not setting:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid creator_id or match_set_id.",
        )

    try:
        # Create a new ORM object
        new_match = Match(**match.model_dump())

        # Add to the session and commit
        db.add(new_match)
        db.commit()

        # Refresh the object to get the new 'match_id' from the DB
        db.refresh(new_match)

        return new_match

    except Exception as e:
        db.rollback()

        logging.error(f"Failed to create match: {str(e)}")

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An internal error occurred while creating the match.",
        )


@router.get(
    "/matches",
    response_model=List[MatchResponse],
    summary="Browse all matches",
    description="Retrieve all available matches.",
)
async def get_matches(db: Session = Depends(get_db)) -> List[MatchResponse]:
    """
    Browse all available matches from the database.

    Args:
        db: The SQLAlchemy database session.

    Returns:
        List of all matches.
    """
    return db.query(Match).all()

