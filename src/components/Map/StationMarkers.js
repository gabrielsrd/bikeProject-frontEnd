import React, { useMemo } from "react";
import { Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { StationChart } from "../Charts/StationChart";
import { StationPopupContent } from "../UI/StationPopupContent";
import L from "leaflet";

// Create custom cluster icon
const createClusterCustomIcon = (cluster) => {
  const count = cluster.getChildCount();
  let size = 'small';
  
  if (count >= 100) {
    size = 'large';
  } else if (count >= 10) {
    size = 'medium';
  }
  
  return L.divIcon({
    html: `<div class="cluster-icon cluster-${size}"><span>${count}</span></div>`,
    className: 'custom-marker-cluster',
    iconSize: L.point(40, 40, true),
  });
};

export const StationMarkers = ({ 
  stations, 
  histogramData, 
  onHistogramClick,
  uspFilter = false
}) => {
  // Filter stations based on USP filter and memoize for performance
  const filteredStations = useMemo(() => {
    if (!uspFilter) return stations;
    
    // USP stations are typically in the range 242-260
    return stations.filter(station => 
      station.station_id >= 242 && station.station_id <= 260
    );
  }, [stations, uspFilter]);

  const markers = useMemo(() => {
    return filteredStations.map((station) => (
      <Marker 
        key={station.id} 
        position={[station.coordinates[1], station.coordinates[0]]}
      >
        <Popup maxWidth={350} closeButton={true}>
          <StationPopupContent 
            station={station}
            onHistogramClick={onHistogramClick}
            histogramData={histogramData}
            StationChart={StationChart}
          />
        </Popup>
      </Marker>
    ));
  }, [filteredStations, histogramData, onHistogramClick]);

  return (
    <MarkerClusterGroup
      chunkedLoading
      iconCreateFunction={createClusterCustomIcon}
      showCoverageOnHover={true}
      spiderfyOnMaxZoom={true}
      removeOutsideVisibleBounds={true}
      animate={true}
      animateAddingMarkers={true}
      maxClusterRadius={60}
    >
      {markers}
    </MarkerClusterGroup>
  );
};