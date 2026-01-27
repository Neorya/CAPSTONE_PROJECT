import os
from typing import List, Optional, Annotated
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field

from database import get_db
from datetime import datetime, timezone
from models import (
    StudentJoinGame,
    Match,
    MatchSetting,
    Test,
    TestScope,
    MatchesForGame,
    StudentTest,
    StudentSolution,
    GameSession,
)
from authentication.routes.auth_routes import get_current_user
from code_runner import compile_cpp, run_cpp_executable
from models import StudentSolutionTest

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
    student_code: Optional[str] = None  # Template code for students
    duration_phase1: int  # Duration in minutes
    actual_start_date: Optional[str] = None  # ISO format datetime string
    remaining_seconds: int  # Remaining seconds for phase 1

class SubmitSolutionRequest(BaseModel):
    student_id: int
    game_id: int
    code: str = Field(..., description="The source code of the solution")

class SubmitSolutionResponse(BaseModel):
    solution_id: int
    message: str

class TestResultDetail(BaseModel):
    test_id: int
    status: str # "pass", "fail", "timeout", "runtime_error"
    message: str
    actual_output: Optional[str] = None

class SubmitSolutionResponse(BaseModel):
    solution_id: Optional[int] = None
    message: str
    compiled: bool
    test_results: List[TestResultDetail] = []

class CustomTestRequest(BaseModel):
    student_id: int
    game_id: int
    code: str = Field(..., description="The source code to test")

class CustomTestResponse(BaseModel):
    message: str
    compiled: bool
    test_results: List[TestResultDetail] = []

class StudentGameStatusResponse(BaseModel):
    game_id: Optional[int] = None
    game_name: Optional[str] = None
    current_phase: str  # "lobby", "phase_one", "phase_two", "ended", or "none"
    remaining_seconds: int = 0
    has_active_game: bool



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


@router.delete("/student_test/{test_id}")
def delete_student_test(
    test_id: int,
    current_user: Annotated[dict, Depends(get_current_user)],
    db: Session = Depends(get_db),
):
    """
    Delete a student test by its ID.
    Only the student who created the test can delete it.
    """
    requester_id = int(current_user["sub"])
    
    test = db.query(StudentTest).filter(StudentTest.test_id == test_id).first()
    
    if not test:
        raise HTTPException(status_code=404, detail="Test not found")
    
    if test.student_id != requester_id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this test")
    
    db.delete(test)
    db.commit()
    
    return {"message": "Test deleted successfully", "test_id": test_id}


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
        raise HTTPException(status_code=403, detail="Not authorized to submit code for another student")

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

    # Match Entry to get settings
    match_entry = (
        db.query(Match)
        .filter(Match.match_id == join_entry.assigned_match_id)
        .first()
    )
    
    if not match_entry or not match_entry.match_set_id:
         raise HTTPException(status_code=404, detail="Match configuration error")

    # Compile the code
    exe_path, compile_error = compile_cpp(request.code)
    
    if exe_path is None:
        return SubmitSolutionResponse(
            message=f"Compilation failed: {compile_error}",
            compiled=False,
            solution_id=None
        )

    # Run against tests
    tests = (
        db.query(Test)
        .filter(Test.match_set_id == match_entry.match_set_id)
        .all()
    )

    all_passed = True
    test_results = []
    
    passed_test_count = 0
    encountered_error = False
    
    passed_public_tests = 0
    total_public_tests = 0
    
    
    execution_results_to_save = []
    
    try:
        for test in tests:
            result = run_cpp_executable(exe_path, test.test_in or "")
            
            is_public = (test.scope == TestScope.public)
            if is_public:
                total_public_tests += 1
            
            status = "fail"
            message = ""
            actual_out = ""
            
            if result["status"] == "success":
                actual_out = (result["stdout"] or "").strip()
                expected_out = (test.test_out or "").strip()
                if actual_out == expected_out:
                    status = "pass"
                    passed_test_count += 1
                    if is_public:
                        passed_public_tests += 1
                else:
                    message = f"Output mismatch"
            else:
                status = result["status"]
                message = result["stderr"]
                encountered_error = True

            if status != "pass":
                all_passed = False
            
            # Prepare result for frontend response
            if is_public:
                test_results.append(TestResultDetail(
                    test_id=test.test_id,
                    status=status,
                    message=message,
                    actual_output=actual_out if status != "timeout" and status != "runtime_error" else None
                ))
            
            output_to_save = actual_out
            if status != "pass" and status != "fail" and message:
                 pass

            execution_results_to_save.append({
                "teacher_test_id": test.test_id,
                "test_output": actual_out
            })
            
    finally:
        if os.path.exists(exe_path):
            try:
                os.remove(exe_path)
            except:
                pass

    solution_id = None
    final_message = "Solution ran successfully."

    
    should_save = False
    solution_obj = None

    if not encountered_error:
        # Check if a solution already exists
        existing_solution = (
            db.query(StudentSolution)
            .filter(
                StudentSolution.student_id == request.student_id,
                StudentSolution.match_for_game_id == match_for_game.match_for_game_id
            )
            .first()
        )
        
        # If a solution has passed all the public test is marked as has_passed = true
        if total_public_tests > 0 and passed_public_tests == total_public_tests:
            solution_has_passed = True
        else:
            solution_has_passed = False
            
        if existing_solution:
            # If exists, check if It is improved or equaled
            current_best = existing_solution.passed_test or 0
            # Allow equal score to update (e.g. code refactoring)
            if passed_test_count >= current_best:
                should_save = True
                existing_solution.code = request.code
                existing_solution.has_passed = solution_has_passed
                existing_solution.passed_test = passed_test_count
                solution_obj = existing_solution
                final_message = "Solution updated (score improved or matched)."
            else:
                final_message = f"Solution not saved: Score ({passed_test_count}) is lower than best ({current_best})."
                solution_id = existing_solution.solution_id 
        else:
            should_save = True
            new_solution = StudentSolution(
                code=request.code,
                has_passed=solution_has_passed,
                passed_test=passed_test_count,
                match_for_game_id=match_for_game.match_for_game_id,
                student_id=request.student_id
            )
            db.add(new_solution)
            # Need flush to get solution_id
            db.flush() 
            solution_obj = new_solution
            solution_id = new_solution.solution_id
            final_message = "Solution submitted successfully."
            
        if should_save and solution_obj:
        
        
            db.query(StudentSolutionTest).filter(
                StudentSolutionTest.solution_id == solution_obj.solution_id
            ).delete()
            
            for res in execution_results_to_save:
                new_test_result = StudentSolutionTest(
                    solution_id=solution_obj.solution_id,
                    teacher_test_id=res["teacher_test_id"],
                    test_output=res["test_output"],
                    student_test_id=None
                )
                db.add(new_test_result)
            
            db.commit()
            db.refresh(solution_obj)
            solution_id = solution_obj.solution_id

    else:
        final_message = "Solution not saved due to runtime errors."
    
    return SubmitSolutionResponse(
        solution_id=solution_id,
        message=final_message,
        compiled=True,
        test_results=test_results
    )


@router.post("/custom_test", response_model=CustomTestResponse)
def run_custom_tests(
    current_user: Annotated[dict, Depends(get_current_user)],
    request: CustomTestRequest,
    db: Session = Depends(get_db),
):
    """
    Run the student's code against their own custom tests.
    Does NOT store the solution.
    """
    if request.student_id != int(current_user["sub"]):
        raise HTTPException(status_code=403, detail="Not authorized")

    # Fetch Student Tests
    student_tests = (
        db.query(StudentTest)
        .join(MatchesForGame, StudentTest.match_for_game_id == MatchesForGame.match_for_game_id)
        .filter(
            StudentTest.student_id == request.student_id,
            MatchesForGame.game_id == request.game_id
        )
        .all()
    )

    if not student_tests:
        return CustomTestResponse(
            message="No custom tests found. Create a test case first.",
            compiled=False
        )

    exe_path, compile_error = compile_cpp(request.code)
    
    if exe_path is None:
        return CustomTestResponse(
            message=f"Compilation failed: {compile_error}",
            compiled=False
        )

    test_results = []
    
    try:
        for test in student_tests:
            result = run_cpp_executable(exe_path, test.test_in or "")
            
            status = "fail"
            message = ""
            actual_out = ""

            if result["status"] == "success":
                actual_out = (result["stdout"] or "").strip()
                expected_out = (test.test_out or "").strip()
                
                if actual_out == expected_out:
                    status = "pass"
                else:
                    message = "Output mismatch"
            else:
                status = result["status"]
                message = result["stderr"]

            test_results.append(TestResultDetail(
                test_id=test.test_id,
                status=status,
                message=message,
                actual_output=actual_out if status != "timeout" and status != "runtime_error" else None
            ))
            
    finally:
        if os.path.exists(exe_path):
            try:
                os.remove(exe_path)
            except:
                pass

    return CustomTestResponse(
        message="Custom tests executed.",
        compiled=True,
        test_results=test_results
    )


@router.get("/student-game-status", response_model=StudentGameStatusResponse)
def get_student_game_status(
    current_user: Annotated[dict, Depends(get_current_user)],
    db: Session = Depends(get_db),
):
    """
    Get the current game status for a student.
    Returns which phase the student should be in (lobby, phase_one, phase_two, ended, or none).
    Used for re-entry navigation when students navigate away from active games.
    """
    student_id = int(current_user["sub"])
    
    # Find the most recent game session the student has joined, based on game start time
    join_entry = (
        db.query(StudentJoinGame)
        .join(GameSession, StudentJoinGame.game_id == GameSession.game_id)
        .filter(StudentJoinGame.student_id == student_id)
        .order_by(GameSession.actual_start_date.desc(), StudentJoinGame.game_id.desc())
        .first()
    )
    
    if not join_entry:
        return StudentGameStatusResponse(
            has_active_game=False,
            current_phase="none"
        )
    
    game_id = join_entry.game_id
    
    # Get the game session details
    game_session = db.query(GameSession).filter(GameSession.game_id == game_id).first()
    
    if not game_session:
        return StudentGameStatusResponse(
            has_active_game=False,
            current_phase="none"
        )
    
    # If game hasn't started yet, student should be in lobby
    if game_session.actual_start_date is None:
        return StudentGameStatusResponse(
            game_id=game_id,
            game_name=game_session.name,
            has_active_game=True,
            current_phase="lobby",
            remaining_seconds=0
        )
    
    # Calculate elapsed time since game started
    start_dt = game_session.actual_start_date
    if start_dt.tzinfo is None or start_dt.tzinfo.utcoffset(start_dt) is None:
        start_dt = start_dt.replace(tzinfo=timezone.utc)
    
    now = datetime.now(timezone.utc).timestamp()
    start_timestamp = start_dt.timestamp()
    elapsed_seconds = now - start_timestamp
    
    # Phase 1 duration in seconds
    phase1_duration_seconds = game_session.duration_phase1 * 60
    # Phase 2 duration in seconds
    phase2_duration_seconds = game_session.duration_phase2 * 60
    
    # Determine current phase based on elapsed time
    if elapsed_seconds < phase1_duration_seconds:
        # Still in phase 1
        remaining_seconds = int(phase1_duration_seconds - elapsed_seconds)
        return StudentGameStatusResponse(
            game_id=game_id,
            game_name=game_session.name,
            has_active_game=True,
            current_phase="phase_one",
            remaining_seconds=max(0, remaining_seconds)
        )
    elif elapsed_seconds < (phase1_duration_seconds + phase2_duration_seconds):
        # In phase 2
        phase2_elapsed = elapsed_seconds - phase1_duration_seconds
        remaining_seconds = int(phase2_duration_seconds - phase2_elapsed)
        return StudentGameStatusResponse(
            game_id=game_id,
            game_name=game_session.name,
            has_active_game=True,
            current_phase="phase_two",
            remaining_seconds=max(0, remaining_seconds)
        )
    else:
        # Game has ended
        return StudentGameStatusResponse(
            game_id=game_id,
            game_name=game_session.name,
            has_active_game=False,
            current_phase="ended",
            remaining_seconds=0
        )


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

    # Get game session for timing info
    game_session = db.query(GameSession).filter(GameSession.game_id == game_id).first()
    if not game_session:
        raise HTTPException(status_code=404, detail="Game session not found")

    # Calculate remaining time for phase 1
    remaining_seconds = 0
    if game_session.actual_start_date:
        # Initialize start_dt with the actual_start_date of the game session
        start_dt = game_session.actual_start_date

        # duration_phase1 is in minutes, convert to seconds
        # Ensure start_dt is timezone-aware (assume UTC if naive)
        if start_dt.tzinfo is None or start_dt.tzinfo.utcoffset(start_dt) is None:
            start_dt = start_dt.replace(tzinfo=timezone.utc)
        phase1_end_time = start_dt.timestamp() + (game_session.duration_phase1 * 60)
        now = datetime.now(timezone.utc).timestamp()
        remaining_seconds = max(0, int(phase1_end_time - now))

    return MatchDetailsResponse(
        title=match_entry.title,
        description=match_entry.match_setting.description,
        student_code=match_entry.match_setting.student_code,
        duration_phase1=game_session.duration_phase1,
        actual_start_date=game_session.actual_start_date.isoformat() if game_session.actual_start_date else None,
        remaining_seconds=remaining_seconds
    )
