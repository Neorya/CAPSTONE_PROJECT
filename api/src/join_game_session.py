from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from sqlalchemy import func, extract, text
from database import get_db
from models import Student, StudentJoinGame, GameSession, MatchesForGame
from datetime import datetime


class JoinGameSession(BaseModel):
    """
    Request model for a student to join a game session
    """

    student_id: int = Field(
        ..., description="Student that will join to the game session"
    )
    game_id: int = Field(..., description="Game Session for the student")


class JoinGameSessionResponse(BaseModel):
    """
    Response model after a student joins a game session
    """

    msg: str


class GetNextUpcomingGameResponse(BaseModel):
    """
    Response model for the next upcoming game session
    """

    game_id: int
    name: str
    start_date: datetime

class StudentJoinedResponse(BaseModel):
    """
    Response model to indicate if a student has joined a specific game session
    """

    joined: bool

router = APIRouter(prefix="/api", tags=["join_game_session"])


@router.post(
    "/join_game_session",
    response_model=JoinGameSessionResponse,
    status_code=status.HTTP_201_CREATED,
    summary="The student joins a game session",
    description="Allows a student to join a game session",
)
async def student_join_game(
    input_data: JoinGameSession, db: Session = Depends(get_db)
) -> JoinGameSessionResponse:
    """
    Allows a student to join a game session
    If the student is already enrolled in that game session, it raises a 409 Conflict error
    If the game session is not the next upcoming one, it raises a 400 Bad Request error
    If no game sessions are found, it raises a 404 Not Found error
    If student already played all match settings of that game session, it raises a 400 Bad Request error
    If the game session has ACTUALLY started it is not possible to join, it raises a 400 Bad Request error
    On success, it returns a message indicating successful enrollment
    """
    time_difference = func.abs(extract("epoch", GameSession.start_date - func.now()))
    result = db.query(GameSession).order_by(time_difference).limit(1).first()

    if result is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="No game session found"
        )

    if input_data.game_id != result.game_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The game session passed is not the next upcoming one",
        )

    if result.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The game session has already started. It's not possible to join anymore",
        )
    
    game_match_ids = db.query(MatchesForGame.match_id).filter(MatchesForGame.game_id == input_data.game_id)
    
    played_match_ids =  db.query(StudentJoinGame.assigned_match_id.label("match_id")).filter(StudentJoinGame.student_id == input_data.student_id)

    remaing_matches = game_match_ids.except_(played_match_ids).first()

    if not remaing_matches:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already played all the game inside this game_session",
        )

    try:
        ins = StudentJoinGame(
            student_id=input_data.student_id, game_id=input_data.game_id
        )
        db.add(ins)
        db.flush()
        db.commit()
        return JoinGameSessionResponse(
            msg="Student has joined the session successfully"
        )

    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="The student is already enrolled in this game session",
        )
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error",
        )


@router.get(
    "/get_next_upcoming_game",
    response_model=GetNextUpcomingGameResponse,
    status_code=status.HTTP_200_OK,
    summary="Get the next upcoming game session",
    description="Allows a student to get next upcoming game session",
)
async def get_next_upcoming_game(
    db: Session = Depends(get_db),
) -> GetNextUpcomingGameResponse:
    """
    Allows a student to get the next upcoming game session
    The next upcoming game session is defined as: 
    - the one with the closest start to the current time (can be in the past or future)
    - the game session hasn't been manually started by the teacher yet (the is_active field is false)
    - the game starts in the current day
    If no game sessions are found, it raises a 404 Not Found
    On success, it returns the game ID of the next upcoming game session
    """
    now = func.now()
    time_difference = func.abs(extract("epoch", GameSession.start_date - now))
    
    result = (
        db.query(GameSession)
        # .filter(GameSession.is_active.is_(False))                          # not started yet
        .filter(func.date(GameSession.start_date) == func.current_date())  # same day (today)
        .order_by(time_difference.asc(), GameSession.start_date.asc())     # closest (can be past or future)
        .first()
    )
    
    if result is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="No upcoming game session found"
        )
        
    return GetNextUpcomingGameResponse(
        game_id=result.game_id,
        name=result.name,
        start_date=result.start_date
    )



@router.get(
    "/has_student_joined_game/{student_id}/{game_id}",
    response_model=StudentJoinedResponse,
    status_code=status.HTTP_200_OK,
    summary="Check if a student has joined a specific game session",
    description="Allows to check if a student has joined a specific game session",
)
async def has_student_joined_game(
    student_id: int,
    game_id: int,
    db: Session = Depends(get_db),
) -> StudentJoinedResponse:
    """
    Allows to check if a student has joined a specific game session
    On success, it returns True if the student has joined the game session, otherwise False
    """
    
    if not db.query(Student).filter(Student.student_id == student_id).first():
        raise HTTPException(404, "Student not found")

    if not db.query(GameSession).filter(GameSession.game_id == game_id).first():
        raise HTTPException(404, "Game session not found")

    enrollment = (
        db.query(StudentJoinGame)
        .filter(
            StudentJoinGame.student_id == student_id,
            StudentJoinGame.game_id == game_id,
        )
        .first()
    )

    return StudentJoinedResponse(joined=enrollment is not None)