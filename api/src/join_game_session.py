from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from sqlalchemy import func, extract
from database import get_db
from models import Student, StudentJoinGame, GameSession


class JoinGameSession(BaseModel):
    student_id: int = Field(
        ..., description="Student that will join to the game session"
    )
    game_id: int = Field(..., description="Game Session for the student")


class JoinGameSessionResponse(BaseModel):
    msg: str


class GetLastGameResponse(BaseModel):
    game_id: int


router = APIRouter(prefix="/api", tags=["join_game_session"])


@router.post(
    "/join_game_session",
    response_model=JoinGameSessionResponse,
    status_code=status.HTTP_201_CREATED,
    summary="The student has joined to that game session",
    description="Allows a student to join in a game session",
)
async def student_join_game(
    input_data: JoinGameSession, db: Session = Depends(get_db)
) -> JoinGameSessionResponse:
    time_difference = func.abs(extract("epoch", GameSession.start_date - func.now()))
    result = db.query(GameSession).order_by(time_difference).limit(1).first()

    if result is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="No game session found"
        )

    if input_data.game_id != result.game_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The game session passed is not the nearest one",
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
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        )


@router.get(
    "/get_last_game",
    response_model=GetLastGameResponse,
    status_code=status.HTTP_200_OK,
    summary="Recived last Game Session",
    description="Allows a student to get last game session",
)
async def student_get_last_game(db: Session = Depends(get_db)) -> GetLastGameResponse:
    time_difference = func.abs(extract("epoch", GameSession.start_date - func.now()))
    result = db.query(GameSession).order_by(time_difference).limit(1).first()

    if result is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="No game session found"
        )

    return GetLastGameResponse(game_id=result.game_id)
