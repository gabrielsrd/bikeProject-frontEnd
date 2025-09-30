import { useEffect } from "react";
import { useMap } from "react-leaflet";

export const FetchGeoJsonOnMove = ({ onBoundsChange }) => {
  const map = useMap();

  useEffect(() => {
    const handleBoundsChange = () => {
      const bounds = map.getBounds();
      const bbox = {
        southwest: bounds.getSouthWest(),
        northeast: bounds.getNorthEast(),
      };
      onBoundsChange(bbox);
    };

    map.on("moveend", handleBoundsChange);

    return () => {
      map.off("moveend", handleBoundsChange);
    };
  }, [map, onBoundsChange]);

  return null;
};