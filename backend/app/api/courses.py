from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from app.db import SessionLocal
from app.schemas.course import CourseCreate, CourseRead
from app.crud import course as course_crud, round as round_crud

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/", response_model=list[CourseRead])
def search_courses(search: str = Query("", min_length=1), db: Session = Depends(get_db)):
    return course_crud.search_courses(db, search)


@router.post("/", response_model=CourseRead)
def create_course(course: CourseCreate, db: Session = Depends(get_db)):
    return course_crud.create_course(db, course)


@router.post("/assign/{round_id}/{course_id}", response_model=CourseRead)
def assign_course(round_id: int, course_id: int, db: Session = Depends(get_db)):
    from app.models.round import Round
    rnd = db.query(Round).filter(Round.id == round_id).first()
    if not rnd or rnd.completed:
        raise HTTPException(
            status_code=403, detail="Round is complete. No further edits allowed.")

    # Reuse, or create new method
    rnd = round_crud.complete_round(db, round_id)
    course = course_crud.get_course_by_id(db, course_id)
    if not rnd or not course:
        raise HTTPException(
            status_code=404, detail="Round or Course not found")
    rnd.course_id = course.id
    db.commit()
    return course
