from typing import List, Optional, Annotated
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field
import os

from database import get_db
from models import (
    StudentAssignedReview,
    StudentReviewVote,
    StudentSolution,
    VoteType,
    MatchesForGame,
    Match,
    MatchSetting,
    Test,
)
from authentication.routes.auth_routes import get_current_user
from code_runner import compile_cpp, run_cpp_executable

router = APIRouter(prefix="/api/phase-two", tags=["phase-two"])

class ExistingVoteResponse(BaseModel):
    """Response model for an existing vote on a review."""
    vote: str
    valid: Optional[bool] = None
    proof_test_in: Optional[str] = None
    proof_test_out: Optional[str] = None
    note: Optional[str] = None


class AssignedSolutionResponse(BaseModel):
    """Response model for an assigned solution to review."""
    student_assigned_review_id: int
    assigned_solution_id: int
    code: str
    pseudonym: str

    class Config:
        orm_mode = True


class VoteRequest(BaseModel):
    """Request model for submitting a vote."""
    student_assigned_review_id: int = Field(..., description="ID of the assigned review")
    vote: str = Field(..., description="Vote type: 'correct', 'incorrect', or 'skip'")
    proof_test_in: Optional[str] = Field(None, description="Test input (required for 'incorrect' vote)")
    proof_test_out: Optional[str] = Field(None, description="Expected test output (required for 'incorrect' vote)")
    note: Optional[str] = Field(None, description="Optional note about the review")


class VoteResponse(BaseModel):
    """Response model for a submitted vote."""
    review_vote_id: int
    message: str
    valid: Optional[bool] = None



@router.get("/assigned_solutions", response_model=List[AssignedSolutionResponse])
def get_assigned_solutions(
    current_user: Annotated[dict, Depends(get_current_user)],
    game_id: int = Query(..., description="ID of the game session"),
    db: Session = Depends(get_db),
):
    """
    Retrieve all solutions assigned to the authenticated student for review.
    """
    student_id = int(current_user["sub"])

    assigned_reviews = (
        db.query(StudentAssignedReview)
        .join(StudentSolution, StudentAssignedReview.assigned_solution_id == StudentSolution.solution_id)
        .join(MatchesForGame, StudentSolution.match_for_game_id == MatchesForGame.match_for_game_id)
        .filter(
            StudentAssignedReview.student_id == student_id,
            MatchesForGame.game_id == game_id
        )
        .all()
    )

    result = []
    for review in assigned_reviews:
        solution = review.assigned_solution
        
        pseudonym = f"Candidate #{solution.solution_id}"
        
        result.append(AssignedSolutionResponse(
            student_assigned_review_id=review.student_assigned_review_id,
            assigned_solution_id=solution.solution_id,
            code=solution.code,
            pseudonym=pseudonym,
        ))

    return result


@router.post("/vote", response_model=VoteResponse)
def submit_vote(
    current_user: Annotated[dict, Depends(get_current_user)],
    request: VoteRequest,
    db: Session = Depends(get_db),
):
    """
    Submit a vote for an assigned solution review.
    """
    student_id = int(current_user["sub"])

    assigned_review = (
        db.query(StudentAssignedReview)
        .filter(StudentAssignedReview.student_assigned_review_id == request.student_assigned_review_id)
        .first()
    )

    if not assigned_review:
        raise HTTPException(status_code=404, detail="Assigned review not found")

    if assigned_review.student_id != student_id:
        raise HTTPException(status_code=403, detail="Not authorized to vote on this review")

    existing_vote = (
        db.query(StudentReviewVote)
        .filter(StudentReviewVote.student_assigned_review_id == request.student_assigned_review_id)
        .first()
    )
    if existing_vote:
        raise HTTPException(status_code=400, detail="You have already voted on this review")

    vote_type_str = request.vote.lower()
    if vote_type_str not in ["correct", "incorrect", "skip"]:
        raise HTTPException(status_code=400, detail="Invalid vote type. Must be 'correct', 'incorrect', or 'skip'")

    if vote_type_str == "incorrect":
        if not request.proof_test_in or not request.proof_test_out:
            raise HTTPException(status_code=400, detail="Proof test input and output are required for 'incorrect' vote")

    solution = assigned_review.assigned_solution
    if not solution:
        raise HTTPException(status_code=404, detail="Solution not found")

    # Get match info to access reference solution and tests (single joined query instead of 3 sequential)
    result = (
        db.query(MatchesForGame, Match, MatchSetting)
        .join(Match, Match.match_id == MatchesForGame.match_id)
        .join(MatchSetting, MatchSetting.match_set_id == Match.match_set_id)
        .filter(MatchesForGame.match_for_game_id == solution.match_for_game_id)
        .first()
    )

    if not result:
        raise HTTPException(status_code=404, detail="Match configuration not found")
    
    match_for_game, match, match_setting = result

    valid = None

    if vote_type_str == "incorrect":
        valid = _validate_incorrect_vote(
            student_code=solution.code,
            reference_code=match_setting.reference_solution,
            test_in=request.proof_test_in,
            test_out=request.proof_test_out
        )
    elif vote_type_str == "correct":
        valid = _validate_correct_vote(
            solution=solution,
            match_set_id=match.match_set_id,
            db=db
        )
  
    vote_enum = VoteType(vote_type_str)

  
    new_vote = StudentReviewVote(
        student_assigned_review_id=request.student_assigned_review_id,
        vote=vote_enum,
        proof_test_in=request.proof_test_in if vote_type_str == "incorrect" else None,
        proof_test_out=request.proof_test_out if vote_type_str == "incorrect" else None,
        valid=valid,
        note=request.note
    )
    db.add(new_vote)
    db.commit()
    db.refresh(new_vote)

    return VoteResponse(
        review_vote_id=new_vote.review_vote_id,
        message="Vote submitted successfully",
        valid=valid
    )

def _validate_incorrect_vote(
    student_code: str,
    reference_code: str,
    test_in: str,
    test_out: str
) -> bool:
    """
    Validate an 'incorrect' vote by running the proof test on both solutions.
    
    Returns True if:
    - The test FAILS on the student's solution, AND
    - The test PASSES on the reference solution
    
    This proves the student's code has a bug that the reference solution doesn't have.
    """
    # Compile and run test on student solution
    student_exe, student_compile_error = compile_cpp(student_code)
    if student_exe is None:
        # Student code doesn't compile - test fails on student code
        student_test_passes = False
    else:
        try:
            student_result = run_cpp_executable(student_exe, test_in)
            student_output = (student_result.get("stdout") or "").strip()
            expected_output = test_out.strip()
            student_test_passes = (student_result["status"] == "success" and student_output == expected_output)
        finally:
            if os.path.exists(student_exe):
                try:
                    os.remove(student_exe)
                except:
                    pass

    # Compile and run test on reference solution
    ref_exe, ref_compile_error = compile_cpp(reference_code)
    if ref_exe is None:
        # Reference code doesn't compile - something is wrong with reference
        return False
    
    try:
        ref_result = run_cpp_executable(ref_exe, test_in)
        ref_output = (ref_result.get("stdout") or "").strip()
        expected_output = test_out.strip()
        ref_test_passes = (ref_result["status"] == "success" and ref_output == expected_output)
    finally:
        if os.path.exists(ref_exe):
            try:
                os.remove(ref_exe)
            except:
                pass

    return (not student_test_passes) and ref_test_passes


def _validate_correct_vote(
    solution: StudentSolution,
    match_set_id: int,
    db: Session
) -> bool:
    """
    Validate a 'correct' vote by checking if the solution passed all tests.
    
    Uses the pre-computed passed_test count from Phase 1 instead of re-running tests.
    
    Returns True if passed_test == total_tests
    """
    total_tests = (
        db.query(Test)
        .filter(Test.match_set_id == match_set_id)
        .count()
    )

    passed_tests = solution.passed_test or 0

    return passed_tests == total_tests
