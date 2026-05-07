from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import asyncio
from simulation import run_simulation, state
from models import RoomPriorityUpdate
from database import supabase

app = FastAPI(title="Energy Monitor API Enterprise")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(run_simulation())

@app.post("/api/dashboard/client/rooms/priority")
def update_room_priority(payload: RoomPriorityUpdate):
    for room in state["rooms"]:
        if room.name == payload.room_name:
            room.priority = payload.priority
            return {"status": "success", "room": room.name, "new_priority": room.priority}
    return {"status": "error", "message": "Room not found"}

# --- ENTERPRISE ENDPOINTS ---

@app.get("/api/admin/dashboard")
def get_admin_dashboard():
    # Fallbacks in case tables don't exist yet
    alerts_count = len([a for a in state["alerts"] if not a.resolved])
    devices_online = len([d for d in state["iot_devices"] if d.status == "online"])
    carbon_saved = state["esg_data"].carbon_saved
    recent_meas = state["recent_measurements"]
    hist = state["history"][-60:]
    
    try:
        # Try fetching from DB if tables exist
        al_res = supabase.table("alerts").select("id").eq("resolved", False).execute()
        dev_res = supabase.table("iot_devices").select("id").eq("status", "online").execute()
        sys_res = supabase.table("system_metrics").select("carbon_saved").eq("id", 1).execute()
        
        alerts_count = len(al_res.data) if al_res.data else 0
        devices_online = len(dev_res.data) if dev_res.data else 0
        if sys_res.data:
            carbon_saved = sys_res.data[0].get("carbon_saved", carbon_saved)
            
        # We could also fetch measurements from DB, but for real-time dashboard 
        # using the in-memory circular buffer is faster and avoids hitting rate limits constantly.
    except Exception as e:
        print(f"[Supabase fallback] {e}")

    total = sum(m.consumption for m in recent_meas)
    MONTHLY_HOURS = 720
    estimated_bill = total * MONTHLY_HOURS * 0.95
    
    return {
        "kpis": {
            "current_consumption": round(total, 2),
            "estimated_cost": round(estimated_bill, 2),
            "active_alerts": alerts_count,
            "devices_online": devices_online,
            "carbon_saved": round(carbon_saved, 2)
        },
        "measurements": recent_meas,
        "history": hist,
        "rooms_status": state["rooms"],
        "actions_log": state["actions_log"]
    }

@app.get("/api/iot/devices")
def get_iot_devices():
    try:
        res = supabase.table("iot_devices").select("*").execute()
        if res.data:
            return {"devices": res.data}
    except Exception:
        pass
    return {"devices": state["iot_devices"]}

@app.get("/api/alerts")
def get_alerts():
    try:
        res = supabase.table("alerts").select("*").execute()
        if res.data:
            return {"alerts": res.data}
    except Exception:
        pass
    return {"alerts": state["alerts"]}

@app.get("/api/esg/metrics")
def get_esg_metrics():
    try:
        res = supabase.table("system_metrics").select("*").eq("id", 1).execute()
        if res.data:
            return {"esg": res.data[0]}
    except Exception:
        pass
    return {"esg": state["esg_data"]}

@app.get("/api/finance/overview")
def get_finance_overview():
    try:
        res = supabase.table("system_metrics").select("accumulated_spent, accumulated_savings").eq("id", 1).execute()
        if res.data:
            spent = res.data[0]["accumulated_spent"]
            savings = res.data[0]["accumulated_savings"]
            total = sum(m.consumption for m in state["recent_measurements"])
            estimated_bill = total * 720 * 0.95
            return {
                "accumulated_spent": round(spent, 2),
                "accumulated_savings": round(savings, 2),
                "projected_bill": round(estimated_bill, 2),
                "roi_energy": round((savings / (spent + 1)) * 100, 2)
            }
    except Exception:
        pass
        
    total = sum(m.consumption for m in state["recent_measurements"])
    MONTHLY_HOURS = 720
    estimated_bill = total * MONTHLY_HOURS * 0.95
    return {
        "accumulated_spent": round(state["accumulated_spent"], 2),
        "accumulated_savings": round(state["accumulated_savings"], 2),
        "projected_bill": round(estimated_bill, 2),
        "roi_energy": round((state["accumulated_savings"] / (state["accumulated_spent"] + 1)) * 100, 2)
    }

# --- LEGACY ENDPOINTS ---

@app.get("/api/dashboard/client")
def get_client_dashboard():
    total = sum(m.consumption for m in state["recent_measurements"])
    MONTHLY_HOURS = 720
    estimated_bill = total * MONTHLY_HOURS * 0.95
    annual_forecast = estimated_bill * 12
    return {
        "current_total": round(total, 2),
        "measurements": state["recent_measurements"],
        "rooms_status": state["rooms"],
        "actions_log": state["actions_log"], 
        "insights": state["insights"],
        "financials": {
            "estimated_bill": round(estimated_bill, 2),
            "annual_forecast": round(annual_forecast, 2),
            "savings_period": round(state["accumulated_savings"], 2)
        }
    }

@app.get("/api/dashboard/history")
def get_history():
    return {
        "history": state["history"][-200:]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
