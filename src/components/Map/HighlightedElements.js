import React from "react";
import { CircleMarker, Polyline } from "react-leaflet";
import { MAP_COLORS } from "../../constants";

export const HighlightedElements = ({ highlightedStation, highlightedLine }) => {
  return (
    <>
      {highlightedStation && (
        <CircleMarker
          center={[highlightedStation.coordinates[1], highlightedStation.coordinates[0]]}
          radius={10}
          color={MAP_COLORS.HIGHLIGHT}
        />
      )}
      {highlightedLine && <Polyline positions={highlightedLine} color={MAP_COLORS.HIGHLIGHT} />}
    </>
  );
};