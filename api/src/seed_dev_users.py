"""
Seed script to create development test users.

This script creates two test users for development:
- dev.student@test.com (student role)
- dev.teacher@test.com (teacher role)

Run this script to enable dev mode login functionality.
"""

from sqlalchemy.orm import Session
from database import SessionLocal
from authentication.models.user import User, UserRoleEnum
from authentication.repositories.user_repository import UserRepository


def seed_dev_users():
    """Create development test users if they don't exist."""
    db: Session = SessionLocal()
    
    try:
        dev_users = [
            {
                "email": "dev.student@test.com",
                "google_sub": "dev_student_sub_123",
                "first_name": "Dev",
                "last_name": "Student",
                "role": UserRoleEnum.student,
                "profile_url": None
            },
            {
                "email": "dev.teacher@test.com",
                "google_sub": "dev_teacher_sub_456",
                "first_name": "Dev",
                "last_name": "Teacher",
                "role": UserRoleEnum.teacher,
                "profile_url": None
            }
        ]
        
        for user_data in dev_users:
            # Check if user already exists
            existing_user = UserRepository.get_by_email(db, user_data["email"])
            
            if existing_user:
                print(f"✓ User {user_data['email']} already exists (ID: {existing_user.id})")
            else:
                # Create new user
                new_user = User(
                    google_sub=user_data["google_sub"],
                    email=user_data["email"],
                    first_name=user_data["first_name"],
                    last_name=user_data["last_name"],
                    role=user_data["role"],
                    profile_url=user_data["profile_url"]
                )
                db.add(new_user)
                db.commit()
                db.refresh(new_user)
                print(f"✓ Created user {user_data['email']} (ID: {new_user.id}, Role: {new_user.role.value})")
        
        print("\n✅ Dev users seeding completed successfully!")
        
    except Exception as e:
        print(f"❌ Error seeding dev users: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    print("🌱 Seeding development users...\n")
    seed_dev_users()
