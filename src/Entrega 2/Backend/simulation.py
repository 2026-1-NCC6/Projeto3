import asyncio
import random
from datetime import datetime
from models import DeviceData, RoomConfig, Priority, RoomStatus, IoTDevice, Alert, ESGData
from logic import apply_prioritization_logic
from database import supabase

# Mantém os metadados fixos em memória caso queira fazer fallback,
# Mas em produção isso viria do BD.
state = {
    "rooms": [
        RoomConfig(name="Quarto principal", priority=Priority.high, base_consumption=0.8),
        RoomConfig(name="Cozinha", priority=Priority.high, base_consumption=1.5),
        RoomConfig(name="Sala de Estar", priority=Priority.medium, base_consumption=1.2),
        RoomConfig(name="Banheiro", priority=Priority.medium, base_consumption=2.0),
        RoomConfig(name="Garagem", priority=Priority.low, base_consumption=0.5)
    ],
    "iot_devices": [
        IoTDevice(id="iot_1", name="Sensor Sala", type="sensor", status="online", last_seen=datetime.now(), firmware_version="1.2.0", ip_address="192.168.1.10"),
        IoTDevice(id="iot_2", name="Medidor Principal", type="smart_meter", status="online", last_seen=datetime.now(), firmware_version="2.0.1", ip_address="192.168.1.1"),
        IoTDevice(id="iot_3", name="Atuador Ar Condicionado", type="actuator", status="offline", last_seen=datetime.now(), firmware_version="1.1.5", ip_address="192.168.1.15")
    ],
    "alerts": [
        Alert(id="al_1", severity="warning", message="Consumo elevado na Cozinha detectado.", timestamp=datetime.now(), resolved=False),
        Alert(id="al_2", severity="critical", message="Dispositivo IoT 'Atuador Ar Condicionado' perdeu conexão.", timestamp=datetime.now(), resolved=False)
    ],
    "history": [],
    "recent_measurements": [],
    "actions_log": [],
    "insights": [],
    "esg_data": ESGData(carbon_emitted=125.5, carbon_saved=45.2, renewable_percentage=85.0, trees_equivalent=12),
    "accumulated_savings": 0.0,
    "accumulated_spent": 0.0
}

def update_insights():
    if not state["recent_measurements"]: return
    
    total = sum(m.consumption for m in state["recent_measurements"])
    insights = []
    
    if total > 4.5:
        insights.append({"id": "high_total", "type": "warning", "message": "Pico de demanda identificado. Consumo acima do habitual."})
        
    if not insights:
        insights.append({"id": "ok", "type": "success", "message": "O seu perfil de consumo está excelente e sem desperdícios."})
        
    state["insights"] = insights
    
async def run_simulation():
    """Loop que constantemente injeta dados novos no Supabase"""
    while True:
        timestamp = datetime.now()
        hour = timestamp.hour
        
        is_evening = 18 <= hour <= 23 
        multiplier = 1.6 if is_evening else 1.0
        is_peak = random.random() > 0.90 
        peak_multiplier = 2.5 if is_peak else 1.0

        current_total = 0.0
        measurements = []
        db_inserts = []
        
        for room in state["rooms"]:
            if room.status == RoomStatus.offline:
                consumption = 0.0
                current = 0.0
                
                base_saving = room.base_consumption * multiplier * peak_multiplier
                state["accumulated_savings"] += base_saving * 0.95
                state["esg_data"].carbon_saved += (base_saving * 0.5)
            else:
                base = room.base_consumption
                variation = base * 0.25 * (random.random() * 2 - 1)
                consumption = (base + variation) * multiplier * peak_multiplier
                current = consumption * 1000 / 220.0 
                state["accumulated_spent"] += consumption * 0.95
                state["esg_data"].carbon_emitted += (consumption * 0.5)
                
            current_total += consumption
            
            dev_id = f"dev_{room.name.lower().replace(' ', '_')}"
            
            # Para memória (legacy/fallback)
            data = DeviceData(
                device_id=dev_id,
                room=room.name,
                consumption=round(consumption, 2),
                voltage=220.0 if room.status != RoomStatus.offline else 0.0,
                current=round(current, 2),
                timestamp=timestamp
            )
            measurements.append(data)
            
            # Para Supabase
            db_inserts.append({
                "device_id": dev_id,
                "room": room.name,
                "consumption": round(consumption, 2),
                "voltage": 220.0 if room.status != RoomStatus.offline else 0.0,
                "current": round(current, 2),
                "timestamp": timestamp.isoformat()
            })
            
        state["recent_measurements"] = measurements
        state["history"].extend(measurements)
        if len(state["history"]) > 60:
            state["history"] = state["history"][-60:]
            
        # Inserção no Supabase (em lote)
        try:
            supabase.table("measurements").insert(db_inserts).execute()
        except Exception as e:
            print(f"[Supabase Error] Falha ao inserir medições: {e}")
            
        # Atualiza métricas agregadas no Supabase
        try:
            supabase.table("system_metrics").update({
                "carbon_emitted": round(state["esg_data"].carbon_emitted, 2),
                "carbon_saved": round(state["esg_data"].carbon_saved, 2),
                "accumulated_savings": round(state["accumulated_savings"], 2),
                "accumulated_spent": round(state["accumulated_spent"], 2)
            }).eq("id", 1).execute()
        except Exception as e:
            pass
            
        actions = apply_prioritization_logic(state["rooms"], current_total)
        if actions:
            for a in actions:
                a["timestamp"] = timestamp.isoformat()
            state["actions_log"] = actions + state["actions_log"]
            if len(state["actions_log"]) > 10:
                state["actions_log"] = state["actions_log"][:10]
            
        update_insights()
            
        await asyncio.sleep(5) # Aumentado de 2s para 5s para não sobrecarregar a API do Supabase
