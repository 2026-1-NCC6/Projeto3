import asyncio
import json
import logging
from typing import Any, Dict
from datetime import datetime

import paho.mqtt.client as mqtt
from database import supabase
from websocket_manager import manager

logger = logging.getLogger(__name__)

MQTT_BROKER = "test.mosquitto.org" # Usar broker de teste para facilitar dev local
MQTT_PORT = 1883

async def process_payload(payload: dict, topic: str):
    # Validation
    required = ["temperature", "humidity", "device_id"]
    if not all(k in payload for k in required):
        logger.error(f"Invalid payload format: {payload}")
        return

    device_id = payload["device_id"]
    temperature = payload["temperature"]
    humidity = payload["humidity"]
    
    # Check if device exists
    dev_res = supabase.table("iot_devices").select("*").eq("device_id", device_id).execute()
    if not dev_res.data:
        logger.warning(f"Device not found: {device_id}")
        return
        
    device = dev_res.data[0]
    
    # Insert reading
    reading = {
        "device_id": device_id,
        "environment_id": device.get("environment_id"),
        "temperature": temperature,
        "humidity": humidity,
        "timestamp": datetime.utcnow().isoformat()
    }
    
    res = supabase.table("readings").insert(reading).execute()
    
    # Update last seen
    supabase.table("iot_devices").update({
        "last_seen": datetime.utcnow().isoformat(),
        "status": "online"
    }).eq("device_id", device_id).execute()

    # Rule checks (e.g. Temp > 35)
    if float(temperature) > 35.0:
        alert = {
            "device_id": device_id,
            "type": "high_temperature",
            "message": f"Temperature exceeded 35°C limit (Value: {temperature}°C)"
        }
        supabase.table("alerts").insert(alert).execute()
        
    # Broadcast to websocket
    await manager.broadcast(json.dumps({
        "type": "new_reading",
        "data": reading
    }))

def on_message(client, userdata, msg):
    try:
        payload = json.loads(msg.payload.decode())
        topic = msg.topic
        
        # Process asynchronously
        loop = asyncio.get_event_loop()
        if loop.is_running():
            asyncio.create_task(process_payload(payload, topic))
        else:
            loop.run_until_complete(process_payload(payload, topic))
            
    except Exception as e:
        logger.error(f"Error processing MQTT message: {e}")

def init_mqtt():
    client = mqtt.Client()
    client.on_message = on_message
    
    try:
        client.connect(MQTT_BROKER, MQTT_PORT, 60)
        # Subscribe to all subtopics under energy_monitor
        client.subscribe("energy_monitor/#")
        client.loop_start()
        logger.info(f"Connected to MQTT Broker: {MQTT_BROKER}")
    except Exception as e:
        logger.error(f"Could not connect to MQTT: {e}")
