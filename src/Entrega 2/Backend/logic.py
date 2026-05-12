from models import RoomConfig, Priority, RoomStatus, DeviceData
from typing import List

MAX_TOTAL_CONSUMPTION_THRESHOLD = 5.0 # kWh limite antes de cortar energia 

def apply_prioritization_logic(rooms: List[RoomConfig], current_total_consumption: float) -> List[dict]:
    actions_taken = []
    
    # 1) Avaliar restauração de energia (se houver folga)
    # Se o consumo total atual for bem abaixo do teto, reativamos os que estavam offline
    if current_total_consumption < MAX_TOTAL_CONSUMPTION_THRESHOLD * 0.7:
        for room in rooms:
            if room.status == RoomStatus.offline:
                room.status = RoomStatus.active
                actions_taken.append({
                    "room": room.name,
                    "action": "restored",
                    "message": f"Energia restaurada: {room.name}"
                })
                # Evitar ligar todos de uma vez e causar outro pico, vamos restaurar um por vez
                break
                
    # 2) Avaliar corte de energia em emergências de pico
    if current_total_consumption > MAX_TOTAL_CONSUMPTION_THRESHOLD:
        # Proteger o circuito cortando cômodos não críticos
        # Prioridades para corte: low, depois medium
        for priority_level in [Priority.low, Priority.medium]:
            for room in rooms:
                if room.priority == priority_level and room.status == RoomStatus.active:
                    room.status = RoomStatus.offline
                    actions_taken.append({
                        "room": room.name,
                        "action": "cut",
                        "message": f"Energia de {room.name} interrompida preventivamente devido ao alto consumo."
                    })
                    break 
            if actions_taken: # Se já cortamos pelo menos um nesta iteração, encerramos por agora
                break
                
    return actions_taken
