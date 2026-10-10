from sqlalchemy import Column, Integer, String, Text, Boolean, Float, ForeignKey, JSON
from sqlalchemy.orm import relationship
from database import Base

class StudentProfile(Base):
    __tablename__ = "profiles"

    id = Column(Integer, primary_key=True, index=True)
    target_role = Column(String(120), default="AI Research Engineer")
    target_role_description = Column(Text, default="")
    experience_level = Column(String(50), default="intermediate")
    weekly_hours = Column(Integer, default=15)
    xp = Column(Integer, default=1350)
    level = Column(Integer, default=4)
    title = Column(String(100), default="Tensor Apprentice")
    competencies_verified_count = Column(Integer, default=3)
    skills_json = Column(JSON, default=list)
    projects_json = Column(JSON, default=list)

class RoadmapNodeModel(Base):
    __tablename__ = "roadmap_nodes"

    id = Column(String(100), primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    subtitle = Column(String(255), default="")
    tier = Column(Integer, default=1)
    category = Column(String(50), default="skill") # skill, project, assessment, milestone, boss_battle
    prerequisites = Column(JSON, default=list)
    estimated_hours = Column(Integer, default=10)
    status = Column(String(50), default="locked") # locked, available, active, completed
    pos_x = Column(Float, default=100.0)
    pos_y = Column(Float, default=100.0)
    quest_data = Column(JSON, default=dict)
    completed_at = Column(String(100), nullable=True)
    evidence_submitted = Column(JSON, nullable=True)

class InventoryModel(Base):
    __tablename__ = "inventory_items"

    id = Column(String(100), primary_key=True, index=True)
    node_id = Column(String(100), nullable=True)
    title = Column(String(200), nullable=False)
    category = Column(String(100), default="Deliverable")
    verification = Column(String(50), default="project_evidence") # self_reported, assessed, project_evidence
    deliverable_type = Column(String(50), default="github_repo")
    artifact_url = Column(String(500), default="")
    notes = Column(Text, default="")
    date_added = Column(String(50), default="")
    xp_earned = Column(Integer, default=350)

class BossBattleModel(Base):
    __tablename__ = "boss_battles"

    id = Column(String(100), primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    codename = Column(String(100), default="")
    description = Column(Text, default="")
    hp_total = Column(Integer, default=4000)
    hp_current = Column(Integer, default=4000)
    required_skills = Column(JSON, default=list)
    phases = Column(JSON, default=list)
    status = Column(String(50), default="locked")
    loot_summary = Column(Text, default="")
    xp_reward = Column(Integer, default=2000)
