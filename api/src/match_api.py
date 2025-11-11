"""
Matches API Module

Provides endpoints for creating, browsing matches.
"""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

# Import the database dependency and ORM models
from database import get_db
from models import Match, Teacher, MatchSetting

# ============================================================================
# Pydantic Models
# ============================================================================

class MatchCreate(BaseModel):
    """
    Request model for creating a new match.
    All fields are now required, matching the schema.
    """
    title: str = Field(..., description="Title of the match", max_length=150)
    match_set_id: int = Field(..., description="ID of the parent Match Setting")
    creator_id: int = Field(..., description="ID of the teacher creating this match")
    difficulty_level: int = Field(..., description="Difficulty level")
    review_number: int = Field(..., description="Number of reviews")
    duration_phase1: int = Field(..., description="Duration of phase 1 in minutes")
    duration_phase2: int = Field(..., description="Duration of phase 2 in minutes")

    class Config:
        json_schema_extra = {
            "example": {
                "title": "Algebra 101 - Week 1 Match",
                "match_set_id": 1,
                "creator_id": 101,
                "difficulty_level": 1,
                "review_number": 3,
                "duration_phase1": 60,
                "duration_phase2": 30
            }
        }


class MatchResponse(BaseModel):
    """
    Response model for a single match, includes all fields.
    """
    match_id: int = Field(..., description="Unique identifier for the match")
    title: str = Field(..., description="Title of the match")
    match_set_id: int = Field(..., description="ID of the parent Match Setting")
    creator_id: int = Field(..., description="ID of the teacher")
    difficulty_level: int = Field(..., description="Difficulty level")
    review_number: int = Field(..., description="Number of reviews")
    duration_phase1: int = Field(..., description="Duration of phase 1 in minutes")
    duration_phase2: int = Field(..., description="Duration of phase 2 in minutes")

    class Config:
        from_attributes = True # Enable ORM mode (reads from SQLAlchemy model)
        json_schema_extra = {
            "example": {
                "match_id": 5,
                "title": "Algebra 101 - Week 1 Match",
                "match_set_id": 1,
                "creator_id": 101,
                "difficulty_level": 1,
                "review_number": 3,
                "duration_phase1": 60,
                "duration_phase2": 30
            }
        }

# ============================================================================
# Router
# ============================================================================

router = APIRouter(
    prefix="/api",
    tags=["matches"]
)

# ============================================================================
# Endpoints
# ============================================================================

@router.post(
    "/matches",
    response_model=MatchResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new match",
    description="Allows a teacher to create a new match based on a match setting."
)
async def create_match(
    match: MatchCreate,
    db: Session = Depends(get_db)
) -> MatchResponse:
    """
    Create a new match resource in the database.
    
    Args:
        match: The request body containing match data.
        db: The SQLAlchemy database session.
        
    Returns:
        The newly created match object.
        
    Raises:
        HTTPException (404): If the 'creator_id' or 'match_set_id' does not exist.
        HTTPException (500): On database operation failure.
    """
    
    # --- Validation ---
    # Check if the creator (teacher) exists     
    teacher = db.query(Teacher).filter(Teacher.teacher_id == match.creator_id).first()
    if not teacher:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Teacher with id {match.creator_id} not found."
        )
        
    # Check if the match setting exists
    setting = db.query(MatchSetting).filter(MatchSetting.match_set_id == match.match_set_id).first()
    if not setting:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Match Setting with id {match.match_set_id} not found."
        )

    # --- Create Operation ---
    try:
        # Create a new ORM object from the Pydantic model
        # **match.model_dump() unpacks the request body fields
        new_match = Match(**match.model_dump())
        
        # Add to the session and commit
        db.add(new_match)
        db.commit()
        
        # Refresh the object to get the new 'match_id' from the DB
        db.refresh(new_match)
        
        return new_match
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create match: {str(e)}"
        )

@router.get(
    "/matches",
    response_model=List[MatchResponse],
    summary="Browse all matches",
    description="Retrieve all available matches."
)
async def get_matches(
    db: Session = Depends(get_db)
) -> List[MatchResponse]:
    """
    Browse all available matches from the database.
    
    Args:
        db: The SQLAlchemy database session.
        
    Returns:
        List of all matches.
    """
    return db.query(Match).all()