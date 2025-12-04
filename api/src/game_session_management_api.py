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
from fastapi import APIRouter, HTTPException, status

# Import Pydantic models
from models import (
    StudentResponse,
    GameSessionStudentsResponse,
    MatchInfoResponse,
    GameSessionFullDetailResponse,
    StudentMatchAssignment,
    GameSessionStartResponse,
)

# ============================================================================
# MOCK DATA - REMOVE AFTER CONNECTING TO DATABASE
# ============================================================================
# This mock data mirrors the init.sql sample data for testing purposes.
# TODO: Replace with actual database queries using SQLAlchemy ORM

MOCK_STUDENTS: Dict[int, Dict[str, Any]] = {
    1: {"student_id": 1, "email": "mario.rossi@studenti.it", "first_name": "Mario", "last_name": "Rossi", "score": 95},
    2: {"student_id": 2, "email": "sara.bianchi@studenti.it", "first_name": "Sara", "last_name": "Bianchi", "score": 78},
    3: {"student_id": 3, "email": "andrea.verdi@studenti.it", "first_name": "Andrea", "last_name": "Verdi", "score": 55},
    4: {"student_id": 4, "email": "chiara.neri@studenti.it", "first_name": "Chiara", "last_name": "Neri", "score": 88},
    5: {"student_id": 5, "email": "luca.gialli@studenti.it", "first_name": "Luca", "last_name": "Gialli", "score": 62},
    6: {"student_id": 6, "email": "elena.ferri@studenti.it", "first_name": "Elena", "last_name": "Ferri", "score": 72},
    7: {"student_id": 7, "email": "marco.conti@studenti.it", "first_name": "Marco", "last_name": "Conti", "score": 81},
    8: {"student_id": 8, "email": "giulia.romano@studenti.it", "first_name": "Giulia", "last_name": "Romano", "score": 90},
    9: {"student_id": 9, "email": "francesco.marino@studenti.it", "first_name": "Francesco", "last_name": "Marino", "score": 67},
    10: {"student_id": 10, "email": "alessia.costa@studenti.it", "first_name": "Alessia", "last_name": "Costa", "score": 85},
}

MOCK_MATCHES: Dict[int, Dict[str, Any]] = {
    1: {"match_id": 1, "title": "Standard Match - Class 5A", "match_set_id": 1, "creator_id": 1, "difficulty_level": 1, "review_number": 5, "duration_phase1": 7, "duration_phase2": 10},
    2: {"match_id": 2, "title": "Standard Match - Class 5B", "match_set_id": 1, "creator_id": 1, "difficulty_level": 1, "review_number": 5, "duration_phase1": 7, "duration_phase2": 10},
    3: {"match_id": 3, "title": "Functions Lab - Group 1", "match_set_id": 4, "creator_id": 2, "difficulty_level": 4, "review_number": 3, "duration_phase1": 10, "duration_phase2": 5},
    4: {"match_id": 4, "title": "Functions Lab - Group 2", "match_set_id": 4, "creator_id": 2, "difficulty_level": 4, "review_number": 3, "duration_phase1": 10, "duration_phase2": 5},
    5: {"match_id": 5, "title": "Variable Declarations - Section A", "match_set_id": 5, "creator_id": 3, "difficulty_level": 3, "review_number": 4, "duration_phase1": 15, "duration_phase2": 10},
    6: {"match_id": 6, "title": "Variable Declarations - Section B", "match_set_id": 5, "creator_id": 3, "difficulty_level": 3, "review_number": 4, "duration_phase1": 15, "duration_phase2": 10},
    7: {"match_id": 7, "title": "If Statement - Group 1", "match_set_id": 8, "creator_id": 4, "difficulty_level": 5, "review_number": 3, "duration_phase1": 10, "duration_phase2": 5},
    8: {"match_id": 8, "title": "If Statement - Group 2", "match_set_id": 8, "creator_id": 4, "difficulty_level": 5, "review_number": 3, "duration_phase1": 10, "duration_phase2": 5},
    9: {"match_id": 9, "title": "Pointers Basics - Section A", "match_set_id": 9, "creator_id": 5, "difficulty_level": 8, "review_number": 3, "duration_phase1": 15, "duration_phase2": 10},
    10: {"match_id": 10, "title": "Pointers Basics - Section B", "match_set_id": 9, "creator_id": 5, "difficulty_level": 8, "review_number": 3, "duration_phase1": 15, "duration_phase2": 10},
}

MOCK_GAME_SESSIONS: Dict[int, Dict[str, Any]] = {
    1: {"game_id": 1, "name": "Spring Semester Game Session", "start_date": datetime(2024, 1, 15, 9, 0, 0), "creator_id": 1, "is_active": False},
    2: {"game_id": 2, "name": "Summer Workshop Session", "start_date": datetime(2024, 1, 16, 10, 30, 0), "creator_id": 2, "is_active": False},
    3: {"game_id": 3, "name": "Fall Competition Session", "start_date": datetime(2024, 1, 17, 14, 0, 0), "creator_id": 3, "is_active": True},
    4: {"game_id": 4, "name": "Winter Training Session", "start_date": datetime(2024, 1, 18, 11, 0, 0), "creator_id": 4, "is_active": False},
    5: {"game_id": 5, "name": "Annual Championship Session", "start_date": datetime(2024, 1, 19, 15, 30, 0), "creator_id": 5, "is_active": False},
}

# Maps game_id -> list of match_ids
MOCK_MATCHES_FOR_GAME: Dict[int, List[int]] = {
    1: [1, 2],
    2: [3, 4],
    3: [5, 6],
    4: [7, 8],
    5: [9, 10],
}

# Maps game_id -> list of {student_id, assigned_match_id}
MOCK_STUDENT_JOIN_GAME: Dict[int, List[Dict[str, Any]]] = {
    1: [
        {"student_id": 1, "assigned_match_id": None},
        {"student_id": 2, "assigned_match_id": None},
        {"student_id": 3, "assigned_match_id": None},
        {"student_id": 4, "assigned_match_id": None},
        {"student_id": 5, "assigned_match_id": None},
    ],
    2: [
        {"student_id": 1, "assigned_match_id": None},
        {"student_id": 3, "assigned_match_id": None},
        {"student_id": 5, "assigned_match_id": None},
        {"student_id": 6, "assigned_match_id": None},
        {"student_id": 7, "assigned_match_id": None},
        {"student_id": 8, "assigned_match_id": None},
    ],
    3: [
        {"student_id": 2, "assigned_match_id": 5},
        {"student_id": 4, "assigned_match_id": 6},
        {"student_id": 6, "assigned_match_id": 5},
        {"student_id": 8, "assigned_match_id": 6},
        {"student_id": 9, "assigned_match_id": 5},
        {"student_id": 10, "assigned_match_id": 6},
    ],
    4: [
        {"student_id": 1, "assigned_match_id": None},
        {"student_id": 2, "assigned_match_id": None},
        {"student_id": 7, "assigned_match_id": None},
        {"student_id": 9, "assigned_match_id": None},
    ],
    5: [
        {"student_id": 3, "assigned_match_id": None},
        {"student_id": 4, "assigned_match_id": None},
        {"student_id": 5, "assigned_match_id": None},
        {"student_id": 6, "assigned_match_id": None},
        {"student_id": 7, "assigned_match_id": None},
        {"student_id": 8, "assigned_match_id": None},
        {"student_id": 9, "assigned_match_id": None},
        {"student_id": 10, "assigned_match_id": None},
    ],
}

# ============================================================================
# END OF MOCK DATA
# ============================================================================


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
    game_id: int
) -> GameSessionFullDetailResponse:
    """
    Get full details of a game session including:
    - Basic session info (name, start_date, is_active)
    - List of all joined students with their details
    - List of all matches in the session
    - Total student count
    """
    # TODO: Replace with database query
    # game_session = db.query(GameSession).filter(GameSession.game_id == game_id).first()
    
    if game_id not in MOCK_GAME_SESSIONS:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Game session with id {game_id} not found"
        )
    
    game_session = MOCK_GAME_SESSIONS[game_id]
    
    # Get joined students
    # TODO: Replace with database join query
    joined_records = MOCK_STUDENT_JOIN_GAME.get(game_id, [])
    students = []
    for record in joined_records:
        student_data = MOCK_STUDENTS.get(record["student_id"])
        if student_data:
            students.append(StudentResponse(
                student_id=student_data["student_id"],
                first_name=student_data["first_name"],
                last_name=student_data["last_name"],
                email=student_data["email"]
            ))
    
    # Get matches for this game session
    # TODO: Replace with database join query
    match_ids = MOCK_MATCHES_FOR_GAME.get(game_id, [])
    matches = []
    for match_id in match_ids:
        match_data = MOCK_MATCHES.get(match_id)
        if match_data:
            matches.append(MatchInfoResponse(
                match_id=match_data["match_id"],
                title=match_data["title"],
                difficulty_level=match_data["difficulty_level"],
                duration_phase1=match_data["duration_phase1"],
                duration_phase2=match_data["duration_phase2"]
            ))
    
    return GameSessionFullDetailResponse(
        game_id=game_session["game_id"],
        name=game_session["name"],
        start_date=game_session["start_date"],
        creator_id=game_session["creator_id"],
        is_active=game_session["is_active"],
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
    game_id: int
) -> GameSessionStudentsResponse:
    """
    Get all students who have joined a specific game session.
    Returns student details including name and email.
    """
    # TODO: Replace with database query
    # game_session = db.query(GameSession).filter(GameSession.game_id == game_id).first()
    
    if game_id not in MOCK_GAME_SESSIONS:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Game session with id {game_id} not found"
        )
    
    # Get joined students
    # TODO: Replace with database join query on student_join_game and student tables
    joined_records = MOCK_STUDENT_JOIN_GAME.get(game_id, [])
    students = []
    for record in joined_records:
        student_data = MOCK_STUDENTS.get(record["student_id"])
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
    game_id: int
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
    # game_session = db.query(GameSession).filter(GameSession.game_id == game_id).first()
    
    if game_id not in MOCK_GAME_SESSIONS:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Game session with id {game_id} not found"
        )
    
    game_session = MOCK_GAME_SESSIONS[game_id]
    
    # Check if session is already active
    if game_session["is_active"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Game session is already active"
        )
    
    # Get joined students
    joined_records = MOCK_STUDENT_JOIN_GAME.get(game_id, [])
    if not joined_records:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot start session: No students have joined"
        )
    
    # Get matches for this game session
    match_ids = MOCK_MATCHES_FOR_GAME.get(game_id, [])
    if not match_ids:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot start session: No matches configured for this session"
        )
    
    # Get student IDs
    student_ids = [record["student_id"] for record in joined_records]
    
    # Distribute students to matches fairly
    raw_assignments = _distribute_students_to_matches(student_ids, match_ids)
    
    # TODO: Update database
    # 1. Update game_session.is_active = True
    # 2. Update student_join_game.assigned_match_id for each student
    
    # Update mock data (simulating DB update)
    MOCK_GAME_SESSIONS[game_id]["is_active"] = True
    for assignment in raw_assignments:
        for record in MOCK_STUDENT_JOIN_GAME[game_id]:
            if record["student_id"] == assignment["student_id"]:
                record["assigned_match_id"] = assignment["assigned_match_id"]
                break
    
    # Build response with full assignment details
    assignments = []
    for assignment in raw_assignments:
        student_data = MOCK_STUDENTS.get(assignment["student_id"])
        match_data = MOCK_MATCHES.get(assignment["assigned_match_id"])
        if student_data and match_data:
            assignments.append(StudentMatchAssignment(
                student_id=assignment["student_id"],
                student_name=f"{student_data['first_name']} {student_data['last_name']}",
                assigned_match_id=assignment["assigned_match_id"],
                assigned_match_title=match_data["title"]
            ))
    
    return GameSessionStartResponse(
        game_id=game_id,
        message="The game session has started.",
        is_active=True,
        total_students_assigned=len(assignments),
        assignments=assignments
    )

