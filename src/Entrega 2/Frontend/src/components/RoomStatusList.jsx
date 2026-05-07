import { Zap, ZapOff, Home } from 'lucide-react';
import { updateRoomPriority } from '../services/api';

export default function RoomStatusList({ rooms }) {
  const sortedRooms = [...rooms].sort((a, b) => {
    if (a.status === 'offline' && b.status !== 'offline') return -1;
    if (a.status !== 'offline' && b.status === 'offline') return 1;
    
    // Sort priority: high > medium > low
    const pVal = { high: 3, medium: 2, low: 1 };
    return pVal[b.priority] - pVal[a.priority];
  });

  const handlePriorityChange = async (roomName, e) => {
    try {
      await updateRoomPriority(roomName, e.target.value);
    } catch(err) {
      console.error(err);
    }
  };

  return (
    <div className="room-list">
      {sortedRooms.map(room => {
        const isOffline = room.status === 'offline';
        return (
          <div key={room.name} className={`room-item ${isOffline ? 'offline' : ''}`}>
            <div className="room-info">
              <div className="room-icon flex-center">
                <Home size={20} />
              </div>
              <div style={{display:'flex', flexDirection:'column', gap:'6px'}}>
                <div className="room-name">{room.name}</div>
                <div className="room-meta" style={{display:'flex', alignItems:'center', gap:'8px'}}>
                  <span>Prioridade:</span>
                  <select 
                    value={room.priority} 
                    onChange={(e) => handlePriorityChange(room.name, e)}
                    style={{
                      background: 'rgba(255,255,255,0.05)', 
                      color: 'var(--text-main)', 
                      border: '1px solid var(--border)',
                      borderRadius: '4px',
                      padding: '4px',
                      fontSize: '0.8rem',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="high" style={{color: 'black'}}>Alta (Essencial)</option>
                    <option value="medium" style={{color: 'black'}}>Média</option>
                    <option value="low" style={{color: 'black'}}>Baixa (Pode Cortar)</option>
                  </select>
                </div>
              </div>
            </div>
            <div>
               {isOffline ? (
                 <span className="badge badge-danger" style={{display:'flex', alignItems:'center', gap:'4px'}}>
                   <ZapOff size={14} /> Corte Ativo
                 </span>
               ) : (
                 <span className="badge badge-info" style={{display:'flex', alignItems:'center', gap:'4px'}}>
                   <Zap size={14} /> {room.base_consumption} kW/h
                 </span>
               )}
            </div>
          </div>
        )
      })}
    </div>
  );
}
