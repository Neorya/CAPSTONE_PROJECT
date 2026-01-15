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

class TestItemResponse(BaseModel):
    test_id: int
    test_in: str
    test_out: str
    scope: str
    
    class Config:
        orm_mode = True


class MatchSettingResponse(BaseModel):
    """
    Response model for a single match setting.

    Attributes:
        match_set_id: Unique identifier for the match setting
        title: Name/title of the match setting
        description: Detailed description of the match setting
        is_ready: Readiness status (True = ready, False = draft)
        public_test: The public tests (input and expected output)
        private_test: The private tests (input and expected output)
        reference_solution: The reference solution code
        creator_id: ID of the teacher who created this setting
    """

    match_set_id: int = Field(
        ..., description="Unique identifier for the match setting"
    )
    title: str = Field(..., description="Title of the match setting")
    description: str = Field(..., description="Detailed description")
    is_ready: bool = Field(..., description="Readiness status: true=ready, false=draft")
    public_test: Optional[str] = Field(None, description="Public tests (input and expected output)")
    private_test: Optional[str] = Field(None, description="Private tests (input and expected output)")
    reference_solution: str = Field(..., description="Reference solution code")
    creator_id: int = Field(
        ..., description="ID of the teacher who created this setting"
    )
    tests: List[TestItemResponse] = Field(default=[], description="List of tests for this setting")

    class Config:
        orm_mode = True


# Router
router = APIRouter(prefix="/api", tags=["match-settings"])


@router.get(
    "/match-settings",
    response_model=List[MatchSettingResponse],
    summary="Browse all match settings",
    description="Retrieve all available match settings with optional filtering by readiness status.",
)
async def get_match_settings(
    is_ready: Optional[bool] = Query(
        None,
        description="Filter by readiness status: true=ready, false=draft, omit=all",
    ),
    db: Session = Depends(get_db),
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
    # Execute the query
    results = query.all()

    # Transform results to match response model, extracting tests
    response = []
    for ms in results:
        # Find first public test
        pub_test_obj = next((t for t in ms.tests if t.scope.name == "public"), None)
        # Find first private test
        priv_test_obj = next((t for t in ms.tests if t.scope.name == "private"), None)
        
        # Format strings as "Input: ..., Output: ..."
        pub_str = f"Input: {pub_test_obj.test_in}, Output: {pub_test_obj.test_out}" if pub_test_obj else ""
        priv_str = f"Input: {priv_test_obj.test_in}, Output: {priv_test_obj.test_out}" if priv_test_obj else ""
        
        response.append(MatchSettingResponse(
            match_set_id=ms.match_set_id,
            title=ms.title,
            description=ms.description,
            is_ready=ms.is_ready,
            public_test=pub_str,
            private_test=priv_str,
            reference_solution=ms.reference_solution,
            creator_id=ms.creator_id,
            tests=[
                TestItemResponse(
                    test_id=t.test_id,
                    test_in=t.test_in,
                    test_out=t.test_out,
                    scope=t.scope.name if hasattr(t.scope, 'name') else str(t.scope)
                ) for t in ms.tests
            ]
        ))
    
    return response
