"""
This file defines Python classes that map to your database tables.
This is the "Object-Relational Mapping" (ORM) layer.
"""

from sqlalchemy import Boolean, Column, Integer, String, Text, ForeignKey, Enum
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
    matches = relationship("Match", back_populates="creator")
    game_sessions = relationship("GameSession", back_populates="creator")

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
    matches = relationship("Match", back_populates="match_setting")


class Match(Base):
    """
    SQLAlchemy model for the 'match' table.

    """
    __tablename__ = "match"
    __table_args__ = {'schema': SCHEMA_NAME}

    match_id = Column(Integer, primary_key=True)

    title = Column(String(150), nullable=False) 

    match_set_id = Column(Integer, ForeignKey(f"{SCHEMA_NAME}.match_setting.match_set_id"))
    creator_id = Column(Integer, ForeignKey(f"{SCHEMA_NAME}.teacher.teacher_id"))
    difficulty_level = Column(Integer, nullable=False)
    review_number = Column(Integer, nullable=False)
    duration_phase1 = Column(Integer, nullable=False)
    duration_phase2 = Column(Integer, nullable=False)
    
    # Relationships
    creator = relationship("Teacher", back_populates="matches")
    match_setting = relationship("MatchSetting", back_populates="matches")


class MatchesForGame(Base):
    __tablename__ = "matches_for_game"
    __table_args__ = {'schema': SCHEMA_NAME}

    match_for_game_id = Column(Integer, primary_key=True)
    match_id = Column(Integer, ForeignKey(f"{SCHEMA_NAME}.match.match_id"))
    game_id = Column(Integer, ForeignKey(f"{SCHEMA_NAME}.game_session.game_id"))

class GameStatusEnum(enum.Enum):
    active = "active"
    inactive = "inactive"

class GameSession(Base):
    __tablename__ = "game_session"
    __table_args__ = {'schema': SCHEMA_NAME}

    game_id = Column(Integer, primary_key=True)
    status = Column(Enum(GameStatusEnum, name='game_status', schema='capstone_app'), nullable=False, default=GameStatusEnum.inactive)
    creator_id = Column(Integer, ForeignKey(f"{SCHEMA_NAME}.teacher.teacher_id"))
    creator = relationship("Teacher", back_populates="game_sessions")
