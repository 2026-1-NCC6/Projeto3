import React, { useState, useEffect } from 'react';
import { Leaf, TreePine, Wind } from 'lucide-react';
import Card from '../../components/ui/Card';
import './ESGPanel.css';

const ESGPanel = () => {
  const [data, setData] = useState({ esg: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/esg/metrics');
        const result = await response.json();
        setData(result);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching ESG data:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading || !data.esg) return <div>Carregando ESG...</div>;

  return (
    <div className="esg-page">
      <h1 className="page-title" style={{ marginBottom: '24px' }}>ESG & Sustentabilidade</h1>
      
      <div className="dashboard-grid">
        <div className="col-span-4">
          <Card className="esg-card green-tint">
            <div className="esg-icon">
              <Leaf size={32} />
            </div>
            <h3>Carbono Evitado</h3>
            <div className="esg-value">{data.esg.carbon_saved.toFixed(2)} kg</div>
            <p>Emissões de CO2 mitigadas pela gestão inteligente.</p>
          </Card>
        </div>
        
        <div className="col-span-4">
          <Card className="esg-card blue-tint">
            <div className="esg-icon">
              <Wind size={32} />
            </div>
            <h3>Carbono Emitido</h3>
            <div className="esg-value">{data.esg.carbon_emitted.toFixed(2)} kg</div>
            <p>Emissões totais equivalentes ao consumo atual.</p>
          </Card>
        </div>
        
        <div className="col-span-4">
          <Card className="esg-card neutral-tint">
            <div className="esg-icon">
              <TreePine size={32} />
            </div>
            <h3>Árvores Equivalentes</h3>
            <div className="esg-value">{Math.floor(data.esg.carbon_saved / 10) + data.esg.trees_equivalent}</div>
            <p>Árvores necessárias para absorver as emissões poupadas.</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ESGPanel;
