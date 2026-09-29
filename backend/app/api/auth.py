from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.user import User, UserRole
from app.models.profile import StudentProfile
from app.schemas.user import UserCreate, UserLogin, Token, UserOut
from app.utils.security import verify_password, get_password_hash, create_access_token, oauth2_scheme, decode_token
from app.config import settings

router = APIRouter(prefix="/auth", tags=["Authentication"])

def get_current_user(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)) -> User:
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication credentials were not provided",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user_id = decode_token(token)
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user = db.query(User).filter(User.id == int(user_id)).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.post("/register", response_model=Token)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user_in.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="An account with this email already exists")

    hashed_pw = get_password_hash(user_in.password)
    new_user = User(
        email=user_in.email,
        hashed_password=hashed_pw,
        full_name=user_in.full_name,
        role=user_in.role or "student",
        college=user_in.college,
        degree=user_in.degree,
        graduation_year=user_in.graduation_year,
        avatar_url=f"https://api.dicebear.com/7.x/avataaars/svg?seed={user_in.full_name.replace(' ', '')}"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Create associated student profile
    profile = StudentProfile(
        user_id=new_user.id,
        bio=f"Student at {user_in.college or 'University'} pursuing {user_in.degree or 'Engineering'}.",
        branch=user_in.degree or "Computer Science",
        profile_completion_pct=35.0,
        profile_readiness_pct=20.0,
        earned_badges_json='["First Profile"]'
    )
    db.add(profile)
    db.commit()

    access_token = create_access_token(subject=new_user.id)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": new_user
    }

@router.post("/login", response_model=Token)
def login(user_in: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_in.email).first()
    if not user or not verify_password(user_in.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Account is disabled")

    access_token = create_access_token(subject=user.id)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.post("/refresh", response_model=Token)
def refresh_token(current_user: User = Depends(get_current_user)):
    access_token = create_access_token(subject=current_user.id)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": current_user
    }

@router.post("/forgot-password")
def forgot_password(payload: dict):
    # Simulated password reset link dispatch
    email = payload.get("email")
    return {"message": f"Password reset instructions have been sent to {email} if an account exists."}
