from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any, Literal

class SkillSchema(BaseModel):
    id: str
    name: str
    category: str
    verification: Literal["self_reported", "assessed", "project_evidence"]
    rating: int = Field(ge=1, le=5)
    evidenceUrl: Optional[str] = None

class ProjectSchema(BaseModel):
    title: str
    description: str
    link: Optional[str] = None

class ProfileResponse(BaseModel):
    targetRole: str
    targetRoleDescription: str
    experienceLevel: str
    weeklyHours: int
    xp: int
    level: int
    title: str
    competenciesVerifiedCount: int
    currentSkills: List[SkillSchema] = []
    currentProjects: List[ProjectSchema] = []

class ProfileUpdateRequest(BaseModel):
    targetRole: Optional[str] = None
    targetRoleDescription: Optional[str] = None
    experienceLevel: Optional[str] = None
    weeklyHours: Optional[int] = None
    currentSkills: Optional[List[SkillSchema]] = None
    currentProjects: Optional[List[ProjectSchema]] = None

class RubricItem(BaseModel):
    id: str
    name: str
    weight: int
    description: str
    maxScore: int = 100

class ResourceItem(BaseModel):
    title: str
    url: str
    type: Literal["documentation", "paper", "guide"]

class QuestSchema(BaseModel):
    objective: str
    brief: str
    steps: List[str]
    tangibleDeliverable: str
    deliverableType: Literal["github_repo", "live_demo", "benchmark_report", "architecture_diagram", "code_review"]
    rubric: List[RubricItem]
    curatedResources: List[ResourceItem]
    interviewQuestions: List[str]
    xpReward: int
    estimatedHours: int

class NodeSchema(BaseModel):
    id: str
    title: str
    subtitle: str
    tier: int
    category: Literal["skill", "project", "assessment", "milestone", "boss_battle"]
    prerequisites: List[str]
    estimatedHours: int
    status: Literal["locked", "available", "active", "completed"]
    position: Dict[str, float]
    quest: QuestSchema
    completedAt: Optional[str] = None
    evidenceSubmitted: Optional[Dict[str, Any]] = None

class EdgeSchema(BaseModel):
    id: str
    source: str
    target: str
    animated: Optional[bool] = True

class RoadmapResponse(BaseModel):
    targetRole: str
    nodes: List[NodeSchema]
    edges: List[EdgeSchema]
    lastAdaptiveChange: Optional[Dict[str, Any]] = None

class QuestCompletionRequest(BaseModel):
    evidenceUrl: Optional[str] = None
    note: Optional[str] = None
    rubricScores: Optional[Dict[str, int]] = None
    verificationType: Optional[Literal["self_reported", "assessed", "project_evidence"]] = "project_evidence"

class MarkKnownRequest(BaseModel):
    nodeId: str
    reason: Optional[str] = None

class AIHintRequest(BaseModel):
    question: Optional[str] = None
