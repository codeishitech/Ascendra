from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import engine, Base, get_db
import models, schemas
import gemini_service
import os

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Ascendra — Career World API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health():
    return {"status": "operational", "engine": "Ascendra FastAPI"}

@app.get("/api/profile")
def get_profile(db: Session = Depends(get_db)):
    profile = db.query(models.StudentProfile).first()
    if not profile:
        profile = models.StudentProfile()
        db.add(profile)
        db.commit()
        db.refresh(profile)
    return {
        "targetRole": profile.target_role,
        "targetRoleDescription": profile.target_role_description,
        "experienceLevel": profile.experience_level,
        "weeklyHours": profile.weekly_hours,
        "xp": profile.xp,
        "level": profile.level,
        "title": profile.title,
        "competenciesVerifiedCount": profile.competencies_verified_count,
        "currentSkills": profile.skills_json or [],
        "currentProjects": profile.projects_json or [],
    }

@app.get("/api/roadmap")
def get_roadmap(db: Session = Depends(get_db)):
    nodes = db.query(models.RoadmapNodeModel).all()
    # Return nodes or seed if empty
    return {"nodes": nodes}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
