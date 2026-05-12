from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from auth import router as auth_router
from admin import router as admin_router
from pwa_routes import router as pwa_router
from websocket_manager import router as ws_router
from mqtt_client import init_mqtt

app = FastAPI(title="Energy Monitor API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(admin_router)
app.include_router(pwa_router)
app.include_router(ws_router)

@app.on_event("startup")
async def startup_event():
    init_mqtt()

@app.get("/")
def root():
    return {"status": "ok", "message": "Energy Monitor API Running"}
