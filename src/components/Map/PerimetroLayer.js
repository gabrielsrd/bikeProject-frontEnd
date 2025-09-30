import React from "react";
import { GeoJSON, Tooltip as LeafletTooltip } from "react-leaflet";
import { MAP_COLORS } from "../../constants";

export const PerimetroLayer = ({ perimetro }) => {
  if (!perimetro) return null;

  return (
    <GeoJSON
      data={perimetro}
      style={() => ({ 
        color: MAP_COLORS.PERIMETER, 
        weight: 2, 
        fillColor: MAP_COLORS.PERIMETER, 
        fillOpacity: 0.2 
      })}
    >
      <LeafletTooltip>Perímetro do Campus</LeafletTooltip>
    </GeoJSON>
  );
};