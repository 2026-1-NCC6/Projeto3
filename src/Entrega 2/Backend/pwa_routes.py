from fastapi import APIRouter, Depends, HTTPException
from security import get_current_user
from database import supabase
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/pwa", tags=["pwa"])

@router.get("/dashboard")
def pwa_dashboard(current_user: dict = Depends(get_current_user)):
    # Returns environments and their latest status/readings
    env_res = supabase.table("environments").select("*, iot_devices(*, readings(*))").execute()
    return env_res.data

@router.get("/environment/{env_id}")
def get_environment_detail(env_id: int, current_user: dict = Depends(get_current_user)):
    env_res = supabase.table("environments").select("*").eq("id", env_id).execute()
    if not env_res.data:
        raise HTTPException(status_code=404, detail="Environment not found")
        
    dev_res = supabase.table("iot_devices").select("*").eq("environment_id", env_id).execute()
    
    # Get last 24h readings for charts
    readings_res = supabase.table("readings").select("*").eq("environment_id", env_id).order("timestamp", desc=True).limit(50).execute()
    
    return {
        "environment": env_res.data[0],
        "devices": dev_res.data,
        "history": readings_res.data
    }

@router.get("/alerts")
def get_alerts(current_user: dict = Depends(get_current_user)):
    res = supabase.table("alerts").select("*, iot_devices(name)").order("timestamp", desc=True).limit(20).execute()
    return res.data

class PreferenceUpdate(BaseModel):
    units: Optional[str] = None
    update_interval: Optional[int] = None

@router.get("/preferences")
def get_preferences(current_user: dict = Depends(get_current_user)):
    res = supabase.table("preferences").select("*").eq("user_id", current_user["id"]).execute()
    if res.data:
        return res.data[0]
    return {"units": "celsius", "update_interval": 5}

@router.post("/preferences")
def update_preferences(prefs: PreferenceUpdate, current_user: dict = Depends(get_current_user)):
    existing = supabase.table("preferences").select("*").eq("user_id", current_user["id"]).execute()
    
    data = {k: v for k, v in prefs.dict().items() if v is not None}
    
    if existing.data:
        res = supabase.table("preferences").update(data).eq("user_id", current_user["id"]).execute()
    else:
        data["user_id"] = current_user["id"]
        res = supabase.table("preferences").insert(data).execute()
        
    return res.data[0] if res.data else None
