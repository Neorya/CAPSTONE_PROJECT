"""
Match Settings API Module

Provides endpoints for browsing and filtering match settings based on theri status.
"""

from typing import List, Optional
from fastapi import APIRouter, Query, Depends
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from database import get_db
from models import MatchSetting


# Pydantic Models

class MatchSettingResponse(BaseModel):
    """
    Response model for a single match setting.
    
    Attributes:
        match_set_id: Unique identifier for the match setting
        title: Name/title of the match setting
        description: Detailed description of the match setting
        is_ready: Readiness status (True = ready, False = draft)
        creator_id: ID of the teacher who created this setting
    """
    match_set_id: int = Field(..., description="Unique identifier for the match setting")
    title: str = Field(..., description="Title of the match setting")
    description: str = Field(..., description="Detailed description")
    is_ready: bool = Field(..., description="Readiness status: true=ready, false=draft")
    creator_id: int = Field(..., description="ID of the teacher who created this setting")

    class Config:
        #from_attributes = True because in the create_match function we work on an ORM object,
        # and we need to convert it into a dictionary to return a MatchResponse 
        from_attributes = True
        json_schema_extra = {
            "example": {
                "match_set_id": 1,
                "title": "Basic Math Challenge",
                "description": "A beginner-friendly math matching game",
                "is_ready": True,
                "creator_id": 101
            }
        }




# Router
router = APIRouter(
    prefix="/api",
    tags=["match-settings"]
)


@router.get(
    "/match-settings",
    response_model=List[MatchSettingResponse],
    summary="Browse all match settings",
    description="Retrieve all available match settings with optional filtering by readiness status."
    
)
async def get_match_settings(
    is_ready: Optional[bool] = Query(
        None,
        description="Filter by readiness status: true=ready, false=draft, omit=all"
    ),
    db: Session = Depends(get_db)
) -> List[MatchSettingResponse]:
    """
    Browse all available match settings with optional filtering.
    
    Args:
        is_ready: Optional filter for readiness status
        
    Returns:
        List of match settings matching the filter criteria
    """
    # Start by creating a query for the MatchSetting model
    query = db.query(MatchSetting)
    
    # Apply readiness filter if provided
    if is_ready is not None:
        # This adds a "WHERE is_ready = :is_ready_param" to the SQL query
        query = query.filter(MatchSetting.is_ready == is_ready)
    
    # Execute the query and return all results
    return query.all()

