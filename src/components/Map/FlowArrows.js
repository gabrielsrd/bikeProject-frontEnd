import React, { useMemo } from "react";
import { Polyline, Tooltip } from "react-leaflet";
import L from "leaflet";

const createCurvedPath = (start, end, curveOffset) => {
  const [lat1, lon1] = start;
  const [lat2, lon2] = end;
  
  // Ponto médio
  const midLat = (lat1 + lat2) / 2;
  const midLon = (lon1 + lon2) / 2;
  
  // Vetor perpendicular para deslocar o ponto médio
  const dLat = lat2 - lat1;
  const dLon = lon2 - lon1;
  const length = Math.sqrt(dLat * dLat + dLon * dLon);
  
  if (length === 0) return [start, end];
  
  // Ponto de controle deslocado perpendicularmente
  const perpLat = -dLon / length * curveOffset;
  const perpLon = dLat / length * curveOffset;
  const controlPoint = [midLat + perpLat, midLon + perpLon];
  
  // Gerar curva de Bézier quadrática
  const points = [];
  for (let i = 0; i <= 30; i++) {
    const t = i / 30;
    const t1 = 1 - t;
    const lat = t1 * t1 * lat1 + 2 * t1 * t * controlPoint[0] + t * t * lat2;
    const lon = t1 * t1 * lon1 + 2 * t1 * t * controlPoint[1] + t * t * lon2;
    points.push([lat, lon]);
  }
  
  return points;
};

export const FlowArrows = ({ flows, visible = false, minThreshold = 100 }) => {
  const flowStats = useMemo(() => {
    if (!flows || flows.length === 0) return { max: 0, min: 0, filtered: [] };
    
    const filtered = flows.filter(f => f.trip_count >= minThreshold);
    
    if (filtered.length === 0) return { max: 0, min: 0, filtered: [] };
    
    const counts = filtered.map(f => f.trip_count);
    return {
      max: Math.max(...counts),
      min: Math.min(...counts),
      filtered
    };
  }, [flows, minThreshold]);

  const getFlowStyle = (tripCount) => {
    const { max, min } = flowStats;
    const range = max - min;
    
    const intensity = range > 0 ? (tripCount - min) / range : 0.5;
    
    const weight = 2 + (intensity * 6);
    
    // Cor baseada na intensidade (gradiente verde → amarelo → vermelho)
    let color;
    if (intensity < 0.33) {
      color = "#4CAF50";
    } else if (intensity < 0.66) {
      color = "#FFC107";
    } else {
      color = "#F44336";
    }
    
    return { 
      weight, 
      color, 
      opacity: 0.7
    };
  };

  if (!visible || !flowStats.filtered || flowStats.filtered.length === 0) {
    return null;
  }

  return (
    <>
      {flowStats.filtered.map((flow, index) => {
        const style = getFlowStyle(flow.trip_count);
        const key = `flow-${flow.origin_station_id}-${flow.destination_station_id}-${index}`;
        
        // Determinar direção da curva: ida e volta curvam para lados opostos
        const curveDirection = flow.origin_station_id < flow.destination_station_id ? 1 : -1;
        const curveOffset = 0.003 * curveDirection;
        
        // Criar caminho curvo
        const positions = createCurvedPath(
          flow.origin_coords,
          flow.destination_coords,
          curveOffset
        );
        
        return (
          <Polyline
            key={key}
            positions={positions}
            {...style}
            // Adicionar eventos para interatividade
            eventHandlers={{
              mouseover: (e) => {
                e.target.setStyle({ weight: style.weight + 2, opacity: 1 });
              },
              mouseout: (e) => {
                e.target.setStyle({ weight: style.weight, opacity: style.opacity });
              }
            }}
          >
            <Tooltip direction="center" permanent={false}>
              <div style={{ textAlign: 'center' }}>
                <strong>{flow.trip_count} viagens</strong>
                <br />
                <small>
                  {flow.origin_station_name}
                  <br />
                  ↓
                  <br />
                  {flow.destination_station_name}
                </small>
              </div>
            </Tooltip>
          </Polyline>
        );
      })}
      
      {/* Legenda inline */}
      {flowStats.filtered.length > 0 && (
        <div className="flow-legend">
          <small>
            <strong>Fluxos:</strong> {flowStats.filtered.length} rotas
            <br />
            <span style={{ color: '#4CAF50' }}>●</span> Baixo
            {' '}
            <span style={{ color: '#FFC107' }}>●</span> Médio
            {' '}
            <span style={{ color: '#F44336' }}>●</span> Alto
          </small>
        </div>
      )}
    </>
  );
};
