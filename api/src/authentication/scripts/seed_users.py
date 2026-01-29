"""
Seed script to create development test users.

This script creates two test users for development:
- dev.student@test.com (student role)
- dev.teacher@test.com (teacher role)

Run this script to enable dev mode login functionality.
Usage: python -m authentication.scripts.seed_users
"""

import sys
import os
import logging

# Add the parent directory (api/src) to sys.path to ensure absolute imports work
# when running this script directly
sys.path.append(os.path.join(os.path.dirname(__file__), "../../../"))

from sqlalchemy.orm import Session
from database import SessionLocal
from authentication.models.user import User, UserRoleEnum
from authentication.repositories.user_repository import UserRepository
from models import Student, Teacher

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

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
            },
            {
                "email": "dev.admin@test.com",
                "google_sub": "dev_admin_sub_789",
                "first_name": "Dev",
                "last_name": "Admin",
                "role": UserRoleEnum.admin,
                "profile_url": None
            }
        ]
        
        for user_data in dev_users:
            # Check if user already exists
            user = UserRepository.get_by_email(db, user_data["email"])
            
            if user:
                logger.info(f"✓ User {user_data['email']} already exists (ID: {user.id})")
            else:
                # Create new user using Repository to ensure consistency
                try:
                    user = UserRepository.create(db, user_data)
                    logger.info(f"✓ Created user {user_data['email']} (ID: {user.id}, Role: {user.role.value})")
                except Exception as e:
                    logger.error(f"Failed to create user {user_data['email']}: {e}")
                    continue

            # Ensure corresponding Student/Teacher record exists
            if user.role == UserRoleEnum.student:
                student = db.query(Student).filter(Student.student_id == user.id).first()
                if not student:
                    student = Student(
                        student_id=user.id,
                        email=user.email,
                        first_name=user.first_name,
                        last_name=user.last_name,
                        score=0,
                        user_id=user.id
                    )
                    db.add(student)
                    db.commit()
                    logger.info(f"  ✓ Created Student record for {user.email}")
                else:
                    logger.info(f"  ✓ Student record for {user.email} already exists")

            elif user.role == UserRoleEnum.teacher:
                teacher = db.query(Teacher).filter(Teacher.teacher_id == user.id).first()
                if not teacher:
                    teacher = Teacher(
                        teacher_id=user.id,
                        first_name=user.first_name,
                        last_name=user.last_name,
                        email=user.email
                    )
                    db.add(teacher)
                    db.commit()
                    logger.info(f"  ✓ Created Teacher record for {user.email}")
                else:
                    logger.info(f"  ✓ Teacher record for {user.email} already exists")
        
        logger.info("\n✅ Dev users seeding completed successfully!")
        
    except Exception as e:
        logger.error(f"❌ Error seeding dev users: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    print("🌱 Seeding development users...\n")
    seed_dev_users()
