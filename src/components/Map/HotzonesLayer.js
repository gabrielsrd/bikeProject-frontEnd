import React from "react";
import { GeoJSON, Tooltip as LeafletTooltip } from "react-leaflet";
import { MAP_COLORS } from "../../constants";

export const HotzonesLayer = ({ hotzones }) => {
  if (!hotzones) return null;

  return (
    <GeoJSON
      data={hotzones}
      style={{ 
        color: MAP_COLORS.HOTZONE, 
        weight: 2, 
        fillColor: MAP_COLORS.HOTZONE, 
        fillOpacity: 0.5 
      }}
    >
      <LeafletTooltip>Zona Quente</LeafletTooltip>
    </GeoJSON>
  );
};