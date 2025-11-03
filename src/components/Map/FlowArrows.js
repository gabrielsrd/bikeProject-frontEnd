import React, { useMemo } from "react";
import { Polyline, Tooltip } from "react-leaflet";
import L from "leaflet";

/**
 * Componente que renderiza setas de fluxo entre estações
 * As setas são proporcionais ao volume de viagens
 */
export const FlowArrows = ({ flows, visible = false, minThreshold = 100 }) => {
  // Calcular estatísticas dos fluxos
  const flowStats = useMemo(() => {
    if (!flows || flows.length === 0) return { max: 0, min: 0, filtered: [] };
    
    // Filtrar por limiar mínimo
    const filtered = flows.filter(f => f.trip_count >= minThreshold);
    
    if (filtered.length === 0) return { max: 0, min: 0, filtered: [] };
    
    const counts = filtered.map(f => f.trip_count);
    return {
      max: Math.max(...counts),
      min: Math.min(...counts),
      filtered
    };
  }, [flows, minThreshold]);

  /**
   * Calcula estilo da linha baseado no volume de viagens
   */
  const getFlowStyle = (tripCount) => {
    const { max, min } = flowStats;
    const range = max - min;
    
    // Normalizar entre 0 e 1
    const intensity = range > 0 ? (tripCount - min) / range : 0.5;
    
    // Espessura: 2px (baixo) até 8px (alto)
    const weight = 2 + (intensity * 6);
    
    // Cor baseada na intensidade (gradiente verde → amarelo → vermelho)
    let color;
    if (intensity < 0.33) {
      // Verde para fluxos baixos
      color = "#4CAF50";
    } else if (intensity < 0.66) {
      // Amarelo para fluxos médios
      color = "#FFC107";
    } else {
      // Vermelho para fluxos altos
      color = "#F44336";
    }
    
    return { 
      weight, 
      color, 
      opacity: 0.7,
      // Adicionar seta no final da linha
      className: "flow-arrow"
    };
  };

  /**
   * Cria decorador de seta para a polyline
   */
  const createArrowDecorator = (map, polyline, color) => {
    if (!map || !polyline || !L.polylineDecorator) return null;
    
    return L.polylineDecorator(polyline, {
      patterns: [
        {
          offset: '100%',
          repeat: 0,
          symbol: L.Symbol.arrowHead({
            pixelSize: 15,
            polygon: false,
            pathOptions: {
              stroke: true,
              weight: 2,
              color: color,
              fillOpacity: 1
            }
          })
        }
      ]
    });
  };

  if (!visible || !flowStats.filtered || flowStats.filtered.length === 0) {
    return null;
  }

  return (
    <>
      {flowStats.filtered.map((flow, index) => {
        const style = getFlowStyle(flow.trip_count);
        const key = `flow-${flow.origin_station_id}-${flow.destination_station_id}-${index}`;
        
        return (
          <Polyline
            key={key}
            positions={[
              flow.origin_coords,
              flow.destination_coords
            ]}
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
