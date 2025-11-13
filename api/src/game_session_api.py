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
from models import Match, GameSession, MatchesForGame, Teacher

# ============================================================================
# Pydantic Models
# ============================================================================

class GameSessionCreate(BaseModel):
    """
    Request model for creating a new match.
    All fields are now required, matching the schema.
    """
    match_id: List[int] = Field(..., description="List of the Match Ids to insert in the Game Session")
    creator_id: int = Field(..., description="Id of the Teachet that creates the Game Session")



class GameSessionResponse(BaseModel):
    game_id: int = Field(..., description="Id of the newly added Game Session")


# ============================================================================
# Router
# ============================================================================

router = APIRouter(
    prefix="/api",
    tags=["game_session"]
)

# ============================================================================
# Endpoints
# ============================================================================

@router.post(
    "/game_session",
    response_model=GameSessionResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new game session",
    description="Allows a teacher to create a new match based on a match setting."
)
async def create_game_session(
    game_session_data: GameSessionCreate,
    db: Session = Depends(get_db)
    ) -> GameSessionResponse:

    teacher = db.query(Teacher).filter(Teacher.teacher_id == game_session_data.creator_id).first()
    if not teacher:
        raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Request error"
        )
    
    matches = db.query(Match).filter(Match.match_id.in_(game_session_data.match_id)).all()
    
    if len(matches) != len(game_session_data.match_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Request error"
        )
        
    new_game_session = GameSession(creator_id=game_session_data.creator_id) 
    db.add(new_game_session)
    
    db.flush() 

    for match in matches:
        match_link = MatchesForGame(
            game_id=new_game_session.game_id,
            match_id=match.match_id
        )
        db.add(match_link)

    try:
        db.commit()
        db.refresh(new_game_session)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Server error"
        )

    return new_game_session
