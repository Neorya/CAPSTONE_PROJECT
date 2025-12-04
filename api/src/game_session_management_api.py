"""
Game Session Management API Module

Provides endpoints for:
- Retrieving game session details with students and matches
- Retrieving all joined students for a game session
- Starting a game session (activating and assigning students to matches)

User Story 3: Teacher starts game session and views joined students and matches
"""

from typing import List, Dict, Any
from datetime import datetime
from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field, field_validator


from database import get_db

# Import Pydantic models
from models import (
    StudentResponse,
    GameSessionStudentsResponse,
    MatchInfoResponse,
    GameSessionFullDetailResponse,
    StudentMatchAssignment,
    GameSessionStartResponse,
)



class Student(BaseModel):
    student_id: int = Field(..., description="Unique identifier for the student")
    email: str = Field(..., description="Email address of the student")
    first_name: str = Field(..., description="First name of the student")
    last_name: str = Field(..., description="Last name of the student")
    score: int = Field(..., description="Score of the student")


class GameSession(BaseModel):
    game_id: int = Field(..., description="Unique identifier for the game session")
    name: str = Field(..., description="Name of the game session")
    start_date: datetime = Field(..., description="Start date and time of the game session")
    creator_id: int = Field(..., description="ID of the teacher who created the session")
    is_active: bool = Field(..., description="Indicates if the session is active")

class Match(BaseModel):
    match_id: int = Field(..., description="Unique identifier for the match")
    title: str = Field(..., description="Title of the match")
    match_set_id: int = Field(..., description="ID of the parent Match Setting")
    creator_id: int = Field(..., description="ID of the teacher")
    difficulty_level: int = Field(..., description="Difficulty level")
    review_number: int = Field(..., description="Number of reviews")
    duration_phase1: int = Field(..., description="Duration of phase 1 in minutes")
    duration_phase2: int = Field(..., description="Duration of phase 2 in minutes")

class StudentJoinGame(BaseModel):
    student_id: int = Field(..., description="ID of the student")
    assigned_match_id: int | None = Field(None, description="ID of the assigned match")

class MatchForGame(BaseModel):
    game_id: int = Field(..., description="ID of the game session")
    match_id: int = Field(..., description="ID of the match")



# ============================================================================
# Helper Functions
# ============================================================================

def _distribute_students_to_matches(
    student_ids: List[int],
    match_ids: List[int]
) -> List[Dict[str, int]]:
    """
    Distributes students fairly across matches using round-robin algorithm.
    
    Args:
        student_ids: List of student IDs to assign
        match_ids: List of match IDs available for assignment
        
    Returns:
        List of dicts with student_id and assigned_match_id
    """
    if not match_ids:
        return []
    
    assignments = []
    for idx, student_id in enumerate(student_ids):
        # Round-robin: assign student to match based on index modulo number of matches
        match_index = idx % len(match_ids)
        assignments.append({
            "student_id": student_id,
            "assigned_match_id": match_ids[match_index]
        })
    
    return assignments


# ============================================================================
# Router
# ============================================================================

router = APIRouter(
    prefix="/api",
    tags=["game_session_management"]
)


# ============================================================================
# Endpoints
# ============================================================================

@router.get(
    "/game_session/{game_id}/details",
    response_model=GameSessionFullDetailResponse,
    status_code=status.HTTP_200_OK,
    summary="Get full game session details",
    description="Retrieves complete game session details including joined students, matches, and active status."
)
async def get_game_session_full_details(
    game_id: int, db: Session = Depends(get_db)
) -> GameSessionFullDetailResponse:
    """
    Get full details of a game session including:
    - Basic session info (name, start_date, is_active)
    - List of all joined students with their details
    - List of all matches in the session
    - Total student count
    """
    # TODO: Replace with database query
    game_session = db.query(GameSession).filter(GameSession.game_id == game_id).first()
    
    if not game_session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Game session with id {game_id} not found"
        )
    
    # Get joined students
    # TODO: Replace with database join query

    joined_records = db.query(Student).join(StudentJoinGame, Student.student_id == StudentJoinGame.student_id).filter(StudentJoinGame.game_id == game_id).all()

    students = []
    for record in joined_records:
        student_data = {
            "student_id": record.student_id,
            "first_name": record.first_name,
            "last_name": record.last_name,
            "email": record.email
        }
        if student_data:
            students.append(StudentResponse(
                student_id=student_data["student_id"],  #should be student_data.student_id
                first_name=student_data["first_name"],  #should be student_data.first_name
                last_name=student_data["last_name"],  #should be student_data.last_name
                email=student_data["email"]  #should be student_data.email
            ))
    
    # Get matches for this game session
    # TODO: Replace with database join query
    match_ids = db.query(Match).join(MatchForGame, Match.match_id == MatchForGame.match_id).filter(MatchForGame.game_id == game_id).all()
    matches = []
    for match_id in match_ids:
        match_data =    {
            "match_id": match_id.match_id,
            "title": match_id.title,
            "difficulty_level": match_id.difficulty_level,
            "duration_phase1": match_id.duration_phase1,
            "duration_phase2": match_id.duration_phase2
        }
        if match_data:
            matches.append(MatchInfoResponse(
                match_id=match_data["match_id"],  
                title=match_data["title"],  
                difficulty_level=match_data["difficulty_level"],  
                duration_phase1=match_data["duration_phase1"],  
                duration_phase2=match_data["duration_phase2"]  
            ))
    
    return GameSessionFullDetailResponse(
        game_id=game_session["game_id"], #should be game_session.game_id?
        name=game_session["name"],  #should be game_session.name?
        start_date=game_session["start_date"],  #should be game_session.start_date?
        creator_id=game_session["creator_id"],  #should be game_session.creator_id?
        is_active=game_session["is_active"],    #should be game_session.is_active?
        total_students=len(students),   
        students=students,
        matches=matches
    )


@router.get(
    "/game_session/{game_id}/students",
    response_model=GameSessionStudentsResponse,
    status_code=status.HTTP_200_OK,
    summary="Get all joined students for a game session",
    description="Retrieves the list of all students who have joined a specific game session."
)
async def get_game_session_students(
    game_id: int, db: Session = Depends(get_db)
) -> GameSessionStudentsResponse:
    """
    Get all students who have joined a specific game session.
    Returns student details including name and email.
    """
    # TODO: Replace with database query
    game_session = db.query(GameSession).filter(GameSession.game_id == game_id).first()
    
    if not game_session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Game session with id {game_id} not found"
        )
    
    # Get joined students
    # TODO: Replace with database join query on student_join_game and student tables
    joined_records = db.query(Student).join(StudentJoinGame, Student.student_id == StudentJoinGame.student_id).filter(StudentJoinGame.game_id == game_id).all()
    students = []
    for record in joined_records:
        student_data = {
            "student_id": record.student_id,
            "first_name": record.first_name,
            "last_name": record.last_name,
            "email": record.email
        }
        if student_data:
            students.append(StudentResponse(
                student_id=student_data["student_id"],  
                first_name=student_data["first_name"],  
                last_name=student_data["last_name"],  
                email=student_data["email"]  
            ))
    
    return GameSessionStudentsResponse(
        game_id=game_id,
        total_students=len(students),
        students=students
    )


@router.post(
    "/game_session/{game_id}/start",
    response_model=GameSessionStartResponse,
    status_code=status.HTTP_200_OK,
    summary="Start a game session",
    description="Starts a game session by setting is_active to true and assigning students to matches fairly."
)
async def start_game_session(
    game_id: int, db: Session = Depends(get_db)
) -> GameSessionStartResponse:
    """
    Start a game session:
    1. Validates the game session exists
    2. Checks if the session is not already active
    3. Sets is_active to True
    4. Assigns students to matches using fair distribution (round-robin)
    5. Returns the assignments
    """
    # TODO: Replace with database query
    game_session = db.query(GameSession).filter(GameSession.game_id == game_id).first()
    
    if not game_session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Game session with id {game_id} not found"
        )
    
    # game_session = MOCK_GAME_SESSIONS[game_id]
    
    # Check if session is already active
    if game_session.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Game session is already active"
        )
    
    # Get joined students
    joined_records = db.query(StudentJoinGame).filter(StudentJoinGame.game_id == game_id).all()
    if not joined_records:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot start session: No students have joined"
        )
    
    # Get matches for this game session
    match_ids = db.query(MatchForGame).filter(MatchForGame.game_id == game_id).all()
    if not match_ids:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot start session: No matches configured for this session"
        )
    
    # Get student IDs
    student_ids = [record.student_id for record in joined_records]
    #match_ids = [match.match_id for match in match_ids]
    
    # Distribute students to matches fairly
    raw_assignments = _distribute_students_to_matches(student_ids, match_ids)
    
    # TODO: Update database
    # 1. Update game_session.is_active = True
    # 2. Update student_join_game.assigned_match_id for each student
    
    game_session.is_active = True
    #db.commit()
    for assignment in raw_assignments:
        for record in joined_records:
            if record.student_id == assignment["student_id"]:
                record.assigned_match_id = assignment["assigned_match_id"]
                break
    db.commit()
    
    # Build response with full assignment details
    assignments = []
    for assignment in raw_assignments:
        student_data = db.query(Student).filter(Student.id == assignment["student_id"]).first()
        match_data = db.query(Match).filter(Match.id == assignment["assigned_match_id"]).first()
        if student_data and match_data:
            assignments.append(StudentMatchAssignment(
                student_id=assignment["student_id"],  
                student_name=f"{student_data.first_name} {student_data.last_name}", 
                assigned_match_id=assignment["assigned_match_id"], 
                assigned_match_title=match_data.title
            ))


    
    return GameSessionStartResponse(
        game_id=game_id,
        message="The game session has started.",
        is_active=True,
        total_students_assigned=len(assignments),
        assignments=assignments
    )

