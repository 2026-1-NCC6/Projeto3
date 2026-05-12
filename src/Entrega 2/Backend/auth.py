from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr
from security import get_password_hash, verify_password, create_access_token
from database import supabase

router = APIRouter(prefix="/auth", tags=["auth"])

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: dict

@router.post("/register", response_model=TokenResponse)
def register(user: UserCreate):
    # Check if user exists
    existing = supabase.table("users").select("id").eq("email", user.email).execute()
    if existing.data:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_pw = get_password_hash(user.password)
    
    new_user = {
        "email": user.email,
        "password_hash": hashed_pw,
        "name": user.name,
        "role": "client",
        "lgpd_accepted": False
    }
    
    res = supabase.table("users").insert(new_user).execute()
    if not res.data:
        raise HTTPException(status_code=500, detail="Error creating user")
        
    created_user = res.data[0]
    
    token = create_access_token({"sub": created_user["email"]})
    
    # Remove password hash from response
    user_data = {k: v for k, v in created_user.items() if k != "password_hash"}
    
    return {"access_token": token, "token_type": "bearer", "user": user_data}

@router.post("/login", response_model=TokenResponse)
def login(form: OAuth2PasswordRequestForm = Depends()):
    try:
        user_res = supabase.table("users").select("*").eq("email", form.username).execute()
        if not user_res.data:
            raise HTTPException(status_code=401, detail="Incorrect email or password")
            
        user = user_res.data[0]
        
        if not verify_password(form.password, user["password_hash"]):
            raise HTTPException(status_code=401, detail="Incorrect email or password")
            
        token = create_access_token({"sub": user["email"]})
        user_data = {k: v for k, v in user.items() if k != "password_hash"}
        
        return {"access_token": token, "token_type": "bearer", "user": user_data}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Erro inesperado no login: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")

class LGPDAccept(BaseModel):
    accepted: bool

from security import get_current_user

@router.post("/lgpd")
def accept_lgpd(data: LGPDAccept, current_user: dict = Depends(get_current_user)):
    if not data.accepted:
        raise HTTPException(status_code=400, detail="Must accept terms")
        
    supabase.table("users").update({"lgpd_accepted": True}).eq("id", current_user["id"]).execute()
    return {"status": "success", "message": "LGPD terms accepted"}
