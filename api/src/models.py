"""
This file defines Python classes that map to your database tables.
This is the "Object-Relational Mapping" (ORM) layer.
"""

from sqlalchemy import Boolean, Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

# Note: The 'capstone_app' schema is specified here
SCHEMA_NAME = "capstone_app"

class Teacher(Base):
    """
    SQLAlchemy model for the 'teacher' table.
    
    *** CORRECTED TO MATCH YOUR SQL SCHEMA ***
    """
    __tablename__ = "teacher"
    __table_args__ = {'schema': SCHEMA_NAME}

    teacher_id = Column(Integer, primary_key=True)
    
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    
    email = Column(String(150), unique=True, nullable=False) 

    # Relationships: A teacher can create many...
    match_settings = relationship("MatchSetting", back_populates="creator")
    

class MatchSetting(Base):
    """
    SQLAlchemy model for the 'match_setting' table.
    """
    __tablename__ = "match_setting"
    __table_args__ = {'schema': SCHEMA_NAME}

    match_set_id = Column(Integer, primary_key=True)
    title = Column(String(150), nullable=False, unique=True)
    description = Column(Text, nullable=False)
    is_ready = Column(Boolean, nullable=False, default=False)
    
    creator_id = Column(Integer, ForeignKey(f"{SCHEMA_NAME}.teacher.teacher_id"))
    
    # Relationship: This setting belongs to one teacher
    creator = relationship("Teacher", back_populates="match_settings")