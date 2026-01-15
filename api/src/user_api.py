from typing import List, Optional, Annotated
from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field

from database import get_db
from authentication.routes.auth_routes import get_current_user
from authentication.repositories.user_repository import UserRepository
from student_results_api import _get_test_status
from leaderboard_api import _calculate_all_student_scores_optimized, _assign_ranks
from models import (
    StudentSolution,
    StudentSolutionTest,
    Match,
    GameSession,
    Teacher,
    Student
)

router = APIRouter(
    prefix="/api/user",
    tags=["User Profile"]
)

class UserProfileResponse(BaseModel):
    """
    Response model for user profile details.
    """
    user_id: int
    email: str
    first_name: str
    last_name: str
    role: str
    score: float
    rank: Optional[int] = None
    profile_url: Optional[str] = None
    # Common stats
    total_matches_played: int = 0
    # Student specific
    total_tests_passed: int = 0
    total_tests_run: int = 0
    # Teacher specific
    total_matches_created: int = 0
    total_sessions_created: int = 0

@router.get(
    "/profile",
    response_model=UserProfileResponse,
    status_code=status.HTTP_200_OK,
    summary="Get current user profile",
    description="Returns detailed profile information for the authenticated user."
)
async def get_user_profile(
    current_user: Annotated[dict, Depends(get_current_user)],
    db: Session = Depends(get_db)
) -> UserProfileResponse:
    user_id = int(current_user["sub"])
    role = current_user.get("role", "student")
    
    # Fetch core user data
    user = UserRepository.get_by_id(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    profile = UserProfileResponse(
        user_id=user.id,
        email=user.email,
        first_name=user.first_name,
        last_name=user.last_name,
        role=user.role,
        score=float(user.score),
        profile_url=user.profile_url
    )
    
    if role == "student":
        # For students, we need to find their rank and calculate real-time score
        # Note: We reuse the leaderboard logic for consistency
        student_scores = _calculate_all_student_scores_optimized(db)
        full_leaderboard = _assign_ranks(student_scores)
        
        # In our system, student_id might match user_id if they are synced
        # or we might need to find the student record by email
        student = db.query(Student).filter(Student.email == user.email).first()
        if student:
            for entry in full_leaderboard:
                if entry.student_id == student.student_id:
                    profile.rank = entry.rank
                    profile.score = entry.score
                    break
            
            # Fetch student stats
            solutions = db.query(StudentSolution).filter(StudentSolution.student_id == student.student_id).all()
            profile.total_matches_played = len(solutions)
            
            # Calculate total tests passed and run
            from models import Test
            test_results = db.query(
                StudentSolutionTest.test_output,
                Test.test_out
            ).join(
                StudentSolution, StudentSolution.solution_id == StudentSolutionTest.solution_id
            ).join(
                Test, Test.test_id == StudentSolutionTest.teacher_test_id
            ).filter(StudentSolution.student_id == student.student_id).all()
            
            profile.total_tests_run = len(test_results)
            profile.total_tests_passed = sum(1 for out, expected in test_results if _get_test_status(out, expected) == "Passed")
    
    elif role == "teacher":
        # For teachers, find how many matches/sessions they created
        teacher = db.query(Teacher).filter(Teacher.email == user.email).first()
        if teacher:
            profile.total_matches_created = db.query(Match).filter(Match.creator_id == teacher.teacher_id).count()
            profile.total_sessions_created = db.query(GameSession).filter(GameSession.creator_id == teacher.teacher_id).count()
            profile.total_matches_played = profile.total_matches_created # Placeholder meaning
            
    return profile
