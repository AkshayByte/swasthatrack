from fastapi import APIRouter, HTTPException, status, Depends, Request
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
from typing import Annotated

import os
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

from database import get_db
from models.user import User
from schemas.auth import (
    Token,
    UserCreate,
    AdminUserCreate,
    User as UserSchema,
    LoginRequest,
    GoogleAuthRequest,
    UserRole,
)
from utils.security import verify_password, get_password_hash, create_access_token, decode_access_token, ACCESS_TOKEN_EXPIRE_MINUTES
from utils.limiter import limiter

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/token")

async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)], db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    payload = decode_access_token(token)
    if payload is None:
        raise credentials_exception
    
    user_id: int = payload.get("user_id")
    if user_id is None:
        raise credentials_exception
        
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise credentials_exception
    return user

@router.post("/register", response_model=UserSchema)
@limiter.limit("10/minute")
def register(request: Request, user: UserCreate, db: Session = Depends(get_db)):
    """
    Public patient / user registration.
    Security policy: Self-registration strictly defaults to the 'user' role.
    Clinical staff accounts can only be provisioned by an authenticated Administrator.
    """
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user.password)
    db_user = User(
        email=user.email,
        hashed_password=hashed_password,
        full_name=user.full_name,
        role=UserRole.USER.value,
        is_active=True
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.post("/users", response_model=UserSchema, status_code=status.HTTP_201_CREATED)
def create_staff_user(
    user_data: AdminUserCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Admin-only endpoint for provisioning clinical staff accounts (Doctor, Pharmacist, Lab, etc.)
    """
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access restricted. Only hospital administrators can provision clinical staff accounts."
        )

    db_user = db.query(User).filter(User.email == user_data.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Staff email already registered")

    hashed_password = get_password_hash(user_data.password)
    new_staff = User(
        email=user_data.email,
        hashed_password=hashed_password,
        full_name=user_data.full_name,
        role=user_data.role.value,
        is_active=user_data.is_active
    )
    db.add(new_staff)
    db.commit()
    db.refresh(new_staff)
    return new_staff

@router.post("/login", response_model=Token)
@limiter.limit("10/minute")
async def login(request: Request, login_data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_data.email).first()
    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"user_id": user.id, "role": user.role, "sub": user.email}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": user.role,
        "user_id": user.id,
        "name": user.full_name or user.email
    }

@router.post("/google", response_model=Token)
@limiter.limit("15/minute")
async def google_login(request: Request, auth_req: GoogleAuthRequest, db: Session = Depends(get_db)):
    """
    Verifies a Google ID token from the frontend Google Identity Services SDK,
    creates or finds the associated user, and issues a standard SwasthaTrack JWT.
    """
    google_client_id = os.getenv("GOOGLE_CLIENT_ID", "").strip()
    
    try:
        # Verify the Google ID token signature with Google's public certs
        if google_client_id:
            id_info = id_token.verify_oauth2_token(
                auth_req.credential, google_requests.Request(), google_client_id
            )
        else:
            # If no client ID configured yet, verify signature against Google's public certs
            id_info = id_token.verify_oauth2_token(
                auth_req.credential, google_requests.Request()
            )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid Google ID token: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )

    email = id_info.get("email")
    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Google account did not provide an email address."
        )

    name = id_info.get("name") or email.split("@")[0]
    
    # Check if this email is designated as a SuperAdmin (falls back to project owner email)
    superadmin_raw = os.getenv("SUPERADMIN_EMAILS", "akshayislesnar@gmail.com")
    superadmin_emails = [e.strip().lower() for e in superadmin_raw.split(",") if e.strip()]
    if "akshayislesnar@gmail.com" not in superadmin_emails:
        superadmin_emails.append("akshayislesnar@gmail.com")
    
    # Look up existing user
    user = db.query(User).filter(User.email == email.lower()).first()
    if not user:
        # Automatically assign admin if in SUPERADMIN_EMAILS, otherwise default to user role
        assigned_role = UserRole.ADMIN.value if email.lower() in superadmin_emails else UserRole.USER.value
        user = User(
            email=email.lower(),
            hashed_password=get_password_hash("OAuth_Google_Managed_" + email.lower()),
            full_name=name,
            role=assigned_role,
            is_active=True
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    elif email.lower() in superadmin_emails and user.role != "admin":
        # Upgrade existing user to admin if in superadmin list
        user.role = "admin"
        db.commit()
        db.refresh(user)

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is deactivated. Please contact hospital administrator."
        )

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"user_id": user.id, "role": user.role, "sub": user.email},
        expires_delta=access_token_expires
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": user.role,
        "user_id": user.id,
        "name": user.full_name or user.email
    }

# OAuth2 compatible token endpoint
@router.post("/token", response_model=Token)
@limiter.limit("15/minute")
async def login_for_access_token(request: Request, form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"user_id": user.id, "role": user.role, "sub": user.email}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": user.role,
        "user_id": user.id,
        "name": user.full_name or user.email
    }

@router.get("/me", response_model=UserSchema)
async def read_users_me(current_user: Annotated[User, Depends(get_current_user)]):
    return current_user