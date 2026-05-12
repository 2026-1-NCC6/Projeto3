from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from enum import Enum

class Priority(str, Enum):
    high = "high"
    medium = "medium"
    low = "low"

class RoomStatus(str, Enum):
    active = "active"
    reduced = "reduced"
    offline = "offline"

class RoomConfig(BaseModel):
    name: str
    priority: Priority
    status: RoomStatus = RoomStatus.active
    base_consumption: float

class DeviceData(BaseModel):
    device_id: str
    room: str
    consumption: float
    voltage: float
    current: float
    timestamp: datetime

class Insight(BaseModel):
    id: str
    message: str
    type: str # info, warning, success

class ClientData(BaseModel):
    id: str
    name: str
    total_consumption: float
    rooms: List[RoomConfig]

class RoomPriorityUpdate(BaseModel):
    room_name: str
    priority: Priority

class IoTDevice(BaseModel):
    id: str
    name: str
    type: str # sensor, actuator, smart_meter
    status: str # online, offline, error
    last_seen: datetime
    firmware_version: str
    ip_address: str

class Alert(BaseModel):
    id: str
    severity: str # critical, warning, info
    message: str
    timestamp: datetime
    resolved: bool

class ESGData(BaseModel):
    carbon_emitted: float
    carbon_saved: float
    renewable_percentage: float
    trees_equivalent: int
