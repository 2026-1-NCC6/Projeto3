import asyncio
from database import supabase
from datetime import datetime, timedelta
import random

def seed_database():
    print("Iniciando inserção de dados falsos no banco...")
    
    # 1. Verificar se já existem ambientes
    res = supabase.table("environments").select("*").execute()
    if res.data:
        print("Já existem ambientes. Pulando a inserção.")
        return

    # 2. Criar Ambientes
    envs = [
        {"name": "Sala de Estar", "location": "Térreo", "active": True},
        {"name": "Quarto Principal", "location": "2º Andar", "active": True},
        {"name": "Cozinha", "location": "Térreo", "active": True}
    ]
    env_res = supabase.table("environments").insert(envs).execute()
    inserted_envs = env_res.data
    print(f"Inseridos {len(inserted_envs)} ambientes.")

    # 3. Criar Dispositivos IoT
    devices = []
    for i, env in enumerate(inserted_envs):
        devices.append({
            "device_id": f"dev_temp_{i}",
            "name": f"Sensor Temp {env['name']}",
            "environment_id": env["id"],
            "type": "sensor",
            "status": "online",
            "mqtt_topic": f"energy_monitor/{env['id']}/temp"
        })
    dev_res = supabase.table("iot_devices").insert(devices).execute()
    inserted_devs = dev_res.data
    print(f"Inseridos {len(inserted_devs)} dispositivos.")

    # 4. Criar Leituras Falsas para as últimas 24 horas
    readings = []
    now = datetime.utcnow()
    for dev in inserted_devs:
        for i in range(24):
            time_point = now - timedelta(hours=i)
            # Temp entre 20 e 28
            temp = round(20 + random.random() * 8, 1)
            # Humidade entre 40 e 60
            hum = round(40 + random.random() * 20, 1)
            
            readings.append({
                "device_id": dev["device_id"],
                "environment_id": dev["environment_id"],
                "temperature": temp,
                "humidity": hum,
                "timestamp": time_point.isoformat()
            })
            
    # Inserir em lotes para não sobrecarregar
    for i in range(0, len(readings), 50):
        supabase.table("readings").insert(readings[i:i+50]).execute()
        
    print(f"Inseridas {len(readings)} leituras falsas.")
    print("Seed finalizado!")

if __name__ == "__main__":
    seed_database()
