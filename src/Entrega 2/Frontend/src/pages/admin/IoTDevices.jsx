import React, { useState, useEffect } from 'react';
import { Cpu, RefreshCw, Signal, SignalHigh, SignalLow, WifiOff } from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import './IoTDevices.css';

const IoTDevices = () => {
  const [data, setData] = useState({ devices: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/iot/devices');
        const result = await response.json();
        setData(result);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching IoT data:', error);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Carregando dispositivos...</div>;

  return (
    <div className="iot-devices-page">
      <div className="header-actions">
        <h1 className="page-title">Gestão de Dispositivos IoT</h1>
        <button className="primary-btn"><RefreshCw size={16} /> Sincronizar Tudo</button>
      </div>

      <div className="dashboard-grid">
        {data.devices.map(device => (
          <div key={device.id} className="col-span-4">
            <Card className="device-card">
              <div className="device-header">
                <div className="device-icon">
                  <Cpu size={24} />
                </div>
                <div className="device-status">
                  {device.status === 'online' ? <SignalHigh color="var(--color-success)" /> : <WifiOff color="var(--color-danger)" />}
                </div>
              </div>
              <div className="device-info">
                <h3>{device.name}</h3>
                <p>ID: {device.id} | Tipo: {device.type}</p>
              </div>
              <div className="device-footer">
                <Badge variant={device.status === 'online' ? 'success' : 'danger'}>
                  {device.status}
                </Badge>
                <span className="fw-version">v{device.firmware_version}</span>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IoTDevices;
