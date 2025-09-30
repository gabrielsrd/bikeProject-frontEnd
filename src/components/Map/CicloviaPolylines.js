import React, { useMemo } from "react";
import { Polyline, Popup } from "react-leaflet";
import { MAP_COLORS } from "../../constants";

export const CicloviaPolylines = ({ 
  ciclovias, 
  distanceThreshold, 
  stations,
  onCicloviaClick
}) => {
  const polylines = useMemo(() => {
    const handleCicloviaClick = (ciclovia) => {
      const nearestStation = stations.find(
        (station) => station.id === ciclovia.closest_station_id
      );
      if (nearestStation && onCicloviaClick) {
        onCicloviaClick(ciclovia, nearestStation);
      }
    };

    return ciclovias.map((ciclovia) => (
      <Polyline
        key={ciclovia.id}
        positions={ciclovia.coordinates.map((coord) => [coord[1], coord[0]])}
        color={ciclovia.distance_to_closest_station_m > distanceThreshold ? MAP_COLORS.CICLOVIA_FAR : MAP_COLORS.CICLOVIA_CLOSE}
        eventHandlers={{ click: () => handleCicloviaClick(ciclovia) }}
      >
        <Popup>
          <strong>{ciclovia.programa}</strong>
          <br />
          Inauguração: {ciclovia.inauguracao}
          <br />
          Comprimento Total: {ciclovia.extensao_t} m
          <br />
          Comprimento Ciclovia: {ciclovia.extensao_c} m
          <br />
          Estação Mais Próxima: {ciclovia.closest_station_id}
          <br />
          Distância à Estação Mais Próxima: {ciclovia.distance_to_closest_station_m} m
        </Popup>
      </Polyline>
    ));
  }, [ciclovias, distanceThreshold, stations, onCicloviaClick]);

  return <>{polylines}</>;
};