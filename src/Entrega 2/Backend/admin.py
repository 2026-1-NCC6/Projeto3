from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from security import require_admin
from database import supabase

router = APIRouter(prefix="/admin", tags=["admin"])

class EnvironmentCreate(BaseModel):
    name: str
    location: Optional[str] = None
    active: bool = True

class DeviceCreate(BaseModel):
    device_id: str
    name: str
    environment_id: Optional[int] = None
    type: str = "sensor"
    mqtt_topic: Optional[str] = None

@router.get("/dashboard")
def get_dashboard(current_user: dict = Depends(require_admin)):
    env_res = supabase.table("environments").select("*").execute()
    dev_res = supabase.table("iot_devices").select("*").execute()
    alert_res = supabase.table("alerts").select("*").eq("resolved", False).execute()
    
    return {
        "environments": len(env_res.data) if env_res.data else 0,
        "devices": len(dev_res.data) if dev_res.data else 0,
        "active_alerts": len(alert_res.data) if alert_res.data else 0
    }

@router.get("/environments")
def list_environments(current_user: dict = Depends(require_admin)):
    res = supabase.table("environments").select("*").execute()
    return res.data

@router.post("/environments")
def create_environment(env: EnvironmentCreate, current_user: dict = Depends(require_admin)):
    res = supabase.table("environments").insert(env.dict()).execute()
    return res.data[0] if res.data else None

@router.get("/devices")
def list_devices(current_user: dict = Depends(require_admin)):
    res = supabase.table("iot_devices").select("*, environments(name)").execute()
    return res.data

@router.post("/devices")
def create_device(dev: DeviceCreate, current_user: dict = Depends(require_admin)):
    res = supabase.table("iot_devices").insert(dev.dict()).execute()
    return res.data[0] if res.data else None

@router.get("/reports/summary")
def get_reports_summary(current_user: dict = Depends(require_admin)):
    # Simpler summary for the UI
    res = supabase.table("readings").select("*").order("timestamp", desc=True).limit(100).execute()
    return {"latest_readings": res.data}

@router.get("/reports/export")
def export_csv(current_user: dict = Depends(require_admin)):
    from fastapi.responses import StreamingResponse
    import io
    import csv
    
    res = supabase.table("readings").select("*").order("timestamp", desc=True).limit(1000).execute()
    
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["id", "device_id", "environment_id", "temperature", "humidity", "timestamp"])
    
    for row in res.data:
        writer.writerow([
            row.get("id"),
            row.get("device_id"),
            row.get("environment_id"),
            row.get("temperature"),
            row.get("humidity"),
            row.get("timestamp")
        ])
    
    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=readings.csv"}
    )
    
@router.get("/audit")
def list_audit_logs(current_user: dict = Depends(require_admin)):
    res = supabase.table("audit_logs").select("*, users(name, email)").order("timestamp", desc=True).limit(50).execute()
    return res.data
