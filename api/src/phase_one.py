from typing import List, Optional, Annotated
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field

from database import get_db
from models import (
    StudentJoinGame,
    Match,
    MatchSetting,
    Test,
    TestScope,
    MatchesForGame,
    StudentTest,
    StudentSolution,
)
from authentication.routes.auth_routes import get_current_user

router = APIRouter(prefix="/api/phase-one", tags=["phase-one"])


class TestResponse(BaseModel):
    test_id: int
    test_in: str
    test_out: str
    scope: str
    
    class Config:
        orm_mode = True

class StudentTestRequest(BaseModel):
    student_id: int
    game_id: int
    test_in: str = Field(..., description="The input of the test")
    test_out: str = Field(..., description="The expected output of the test")

class StudentTestResponse(BaseModel):
    test_id: int
    message: str

class StudentTestRead(BaseModel):
    test_id: int
    test_in: str
    test_out: str
    match_for_game_id: int
    student_id: int

    class Config:
        orm_mode = True

class MatchDetailsResponse(BaseModel):
    title: str
    description: str

class SubmitSolutionRequest(BaseModel):
    student_id: int
    game_id: int
    code: str = Field(..., description="The source code of the solution")

class SubmitSolutionResponse(BaseModel):
    solution_id: int
    message: str



@router.get("/tests", response_model=List[TestResponse])
def get_correlated_tests(
    student_id: int = Query(..., description="ID of the student"),
    game_id: int = Query(..., description="ID of the game session"),
    db: Session = Depends(get_db),
):
    """
    Retrieve all tests correlated to the match setting of the assigned match to the student.
    """
    join_entry = (
        db.query(StudentJoinGame)
        .filter(
            StudentJoinGame.student_id == student_id,
            StudentJoinGame.game_id == game_id,
        )
        .first()
    )

    if not join_entry:
        raise HTTPException(status_code=404, detail="Student not found in this game session")

    if not join_entry.assigned_match_id:
        raise HTTPException(status_code=404, detail="No match assigned to this student yet")

    match_entry = (
        db.query(Match)
        .filter(Match.match_id == join_entry.assigned_match_id)
        .first()
    )
    
    if not match_entry:
        raise HTTPException(status_code=404, detail="Assigned match not found")

    if not match_entry.match_set_id:
         raise HTTPException(status_code=404, detail="Match has no settings linked")
    tests = (
        db.query(Test)
        .filter(
            Test.match_set_id == match_entry.match_set_id,
            Test.scope == TestScope.public
        )
        .all()
    )
    
    return [
        TestResponse(
            test_id=t.test_id,
            test_in=t.test_in,
            test_out=t.test_out,
            scope=t.scope.name if hasattr(t.scope, 'name') else str(t.scope)
        )
        for t in tests
    ]


@router.post("/student_test", response_model=StudentTestResponse)
def add_student_test(
    request: StudentTestRequest,
    current_user: Annotated[dict, Depends(get_current_user)],
    db: Session = Depends(get_db),
):
    """
    Add a new test by the student.
    """
    if request.student_id != int(current_user["sub"]):
        raise HTTPException(status_code=403, detail="Not authorized to add test for another student")

    join_entry = (
        db.query(StudentJoinGame)
        .filter(
            StudentJoinGame.student_id == request.student_id,
            StudentJoinGame.game_id == request.game_id,
        )
        .first()
    )
    
    if not join_entry or not join_entry.assigned_match_id:
        raise HTTPException(status_code=404, detail="Student assignment not valid")

    match_for_game = (
        db.query(MatchesForGame)
        .filter(
            MatchesForGame.match_id == join_entry.assigned_match_id,
            MatchesForGame.game_id == request.game_id
        )
        .first()
    )
    
    if not match_for_game:
        raise HTTPException(status_code=404, detail="Match not linked to this game session")

    new_test = StudentTest(
        test_in=request.test_in,
        test_out=request.test_out,
        match_for_game_id=match_for_game.match_for_game_id,
        student_id=request.student_id
    )
    
    db.add(new_test)
    db.commit()
    db.refresh(new_test)
    
    return StudentTestResponse(test_id=new_test.test_id, message="Test added successfully")


@router.get("/student_tests", response_model=List[StudentTestRead])
def get_student_tests(
    current_user: Annotated[dict, Depends(get_current_user)],
    db: Session = Depends(get_db),
    game_id: int = Query(..., description="ID of the game session"),
    student_id: Optional[int] = Query(None, description="ID of the student (Admin/Teacher only)"),
):
    """
    Retrieve all tests created by the student for a specific game session.
    If student_id is provided, checks if the requester is that student or an admin/teacher.
    """
    requester_id = int(current_user["sub"])

    if student_id is not None:
        if student_id != requester_id:
            raise HTTPException(status_code=403, detail="Not authorized to view other students' tests")
        target_student_id = student_id
    else:
        target_student_id = requester_id

    tests = (
        db.query(StudentTest)
        .join(MatchesForGame, StudentTest.match_for_game_id == MatchesForGame.match_for_game_id)
        .filter(
            StudentTest.student_id == target_student_id,
            MatchesForGame.game_id == game_id
        )
        .all()
    )

    return tests


@router.post("/solution", response_model=SubmitSolutionResponse)
def submit_solution(
    current_user: Annotated[dict, Depends(get_current_user)],
    request: SubmitSolutionRequest,
    db: Session = Depends(get_db),
):
    """
    Submit the solution of the student.
    """

    if request.student_id != int(current_user["sub"]):
        raise HTTPException(status_code=403, detail="Not authorized to add test for another student")

    join_entry = (
        db.query(StudentJoinGame)
        .filter(
            StudentJoinGame.student_id == request.student_id,
            StudentJoinGame.game_id == request.game_id,
        )
        .first()
    )
    
    if not join_entry or not join_entry.assigned_match_id:
        raise HTTPException(status_code=404, detail="Student assignment not valid")

    match_for_game = (
        db.query(MatchesForGame)
        .filter(
            MatchesForGame.match_id == join_entry.assigned_match_id,
            MatchesForGame.game_id == request.game_id
        )
        .first()
    )
    
    if not match_for_game:
        raise HTTPException(status_code=404, detail="Match not linked to this game session")

    new_solution = StudentSolution(
        code=request.code,
        has_passed=False,
        match_for_game_id=match_for_game.match_for_game_id,
        student_id=request.student_id
    )
    
    db.add(new_solution)
    db.commit()
    db.refresh(new_solution)
    
    return SubmitSolutionResponse(solution_id=new_solution.solution_id, message="Solution submitted successfully")


@router.get("/match_details", response_model=MatchDetailsResponse)
def get_match_details(
    current_user: Annotated[dict, Depends(get_current_user)],
    db: Session = Depends(get_db),
    game_id: int = Query(..., description="ID of the game session"),
):
    """
    Retrieve the title and description of the match assigned to the student.
    """
    target_student_id = int(current_user["sub"])

    join_entry = (
        db.query(StudentJoinGame)
        .filter(
            StudentJoinGame.student_id == target_student_id,
            StudentJoinGame.game_id == game_id,
        )
        .first()
    )

    if not join_entry:
        raise HTTPException(status_code=404, detail="Student not found in this game session")

    if not join_entry.assigned_match_id:
        raise HTTPException(status_code=404, detail="No match assigned to this student yet")

    match_entry = (
        db.query(Match)
        .filter(Match.match_id == join_entry.assigned_match_id)
        .first()
    )

    if not match_entry:
        raise HTTPException(status_code=404, detail="Assigned match not found")
        
    if not match_entry.match_setting:
         raise HTTPException(status_code=404, detail="Match setting not found")

    return MatchDetailsResponse(
        title=match_entry.title,
        description=match_entry.match_setting.description
    )
