"""
Match Settings API Module

Provides endpoints for browsing and filtering match settings.
Uses in-memory mock data until database integration is ready.
"""

from typing import List, Optional
from fastapi import APIRouter, Query
from pydantic import BaseModel, Field


# ============================================================================
# Pydantic Models
# ============================================================================

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
        json_schema_extra = {
            "example": {
                "match_set_id": 1,
                "title": "Basic Math Challenge",
                "description": "A beginner-friendly math matching game",
                "is_ready": True,
                "creator_id": 101
            }
        }


# ============================================================================
# Mock Data
# ============================================================================

MOCK_MATCH_SETTINGS = [
    {
        "match_set_id": 1,
        "title": "Basic Math Challenge",
        "description": "A beginner-friendly math matching game covering addition and subtraction",
        "is_ready": True,
        "creator_id": 101
    },
    {
        "match_set_id": 2,
        "title": "Advanced Algebra Set",
        "description": "Complex algebraic expressions and equations for advanced students",
        "is_ready": True,
        "creator_id": 102
    },
    {
        "match_set_id": 3,
        "title": "Geometry Fundamentals Draft",
        "description": "Work in progress - basic geometry shapes and properties",
        "is_ready": False,
        "creator_id": 101
    }
]


# ============================================================================
# Router
# ============================================================================

router = APIRouter(
    prefix="/api",
    tags=["match-settings"]
)


@router.get(
    "/match-settings",
    response_model=List[MatchSettingResponse],
    summary="Browse all match settings",
    description="""
    Retrieve all available match settings with optional filtering by readiness status.
    
    **Query Parameters:**
    - `is_ready` (optional): Filter by readiness status
      - `true`: Returns only ready match settings
      - `false`: Returns only draft match settings
      - omitted: Returns all match settings
    
    **Example Responses:**
    
    All match settings:
    ```json
    [
      {
        "match_set_id": 1,
        "title": "Basic Math Challenge",
        "description": "A beginner-friendly math matching game",
        "is_ready": true,
        "creator_id": 101
      },
      {
        "match_set_id": 3,
        "title": "Geometry Fundamentals Draft",
        "description": "Work in progress - basic geometry",
        "is_ready": false,
        "creator_id": 101
      }
    ]
    ```
    
    Only ready settings (?is_ready=true):
    ```json
    [
      {
        "match_set_id": 1,
        "title": "Basic Math Challenge",
        "description": "A beginner-friendly math matching game",
        "is_ready": true,
        "creator_id": 101
      }
    ]
    ```
    """
)
async def get_match_settings(
    is_ready: Optional[bool] = Query(
        None,
        description="Filter by readiness status: true=ready, false=draft, omit=all"
    )
) -> List[MatchSettingResponse]:
    """
    Browse all available match settings with optional filtering.
    
    Args:
        is_ready: Optional filter for readiness status
        
    Returns:
        List of match settings matching the filter criteria
    """
    # Start with all mock data
    filtered_settings = MOCK_MATCH_SETTINGS
    
    # Apply readiness filter if provided
    if is_ready is not None:
        filtered_settings = [
            setting for setting in MOCK_MATCH_SETTINGS
            if setting["is_ready"] == is_ready
        ]
    
    # Convert to response models
    return [MatchSettingResponse(**setting) for setting in filtered_settings]

