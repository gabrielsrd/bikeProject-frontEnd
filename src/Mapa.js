import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
  CircleMarker,
} from "react-leaflet";
import axios from "axios";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MarkerClusterGroup } from 'react-leaflet-cluster';


const FetchGeoJsonOnMove = ({ onBoundsChange }) => {
  const map = useMap();

  useEffect(() => {
    const handleBoundsChange = () => {
      const bounds = map.getBounds(); // Get current map bounds
      const bbox = {
        southwest: bounds.getSouthWest(),
        northeast: bounds.getNorthEast(),
      };
      onBoundsChange(bbox); // Pass bounding box to parent
    };

    map.on("moveend", handleBoundsChange); // Trigger on map move

    return () => {
      map.off("moveend", handleBoundsChange); // Cleanup
    };
  }, [map, onBoundsChange]);

  return null; // No UI for this component
};

const Mapa = () => {
  const [stationsData, setStationsData] = useState([]); // Data for stations (points)
  const [cicloviasData, setCicloviasData] = useState([]); // Data for ciclovias (lines)
  const [highlightedStation, setHighlightedStation] = useState(null); // Highlighted station
  const [highlightedLine, setHighlightedLine] = useState(null); // Line from ciclovia to station
  const [showStations, setShowStations] = useState(true); // Toggle visibility for stations
  const [showCiclovias, setShowCiclovias] = useState(true); // Toggle visibility for ciclovias
  const [distanceThreshold, setDistanceThreshold] = useState(1000); // Threshold for coloring
  const [distanceInput, setDistanceInput] = useState(1000); // User's input for threshold
  const position = [-23.533773, -46.625290]; // Map center coordinates

  // Fix default marker icon
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
    iconUrl: require("leaflet/dist/images/marker-icon.png"),
    shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
  });

  useEffect(() => {
    // Fetch GeoJSON data for stations
    axios
      .get("http://127.0.0.1:8000/api/ciclostation/")
      .then((response) => {
        const features = response.data.features.map((feature) => ({
          id: feature.properties.id,
          name: feature.properties.name,
          coordinates: feature.geometry.coordinates,
        }));
        setStationsData(features);
      })
      .catch((error) => {
        console.error("Error fetching station data:", error);
      });

    // Fetch GeoJSON data for ciclovias
    axios
      .get("http://127.0.0.1:8000/api/ciclovias/")
      .then((response) => {
        const features = response.data.features.map((feature) => ({
          id: feature.properties.programa,
          programa: feature.properties.programa,
          inauguracao: feature.properties.inauguracao,
          extensao_t: feature.properties.extensao_t,
          extensao_c: feature.properties.extensao_c,
          coordinates: feature.geometry.coordinates,
          closest_station_id: feature.properties.closest_station_id,
          distance_to_closest_station_m: feature.properties.distance_to_closest_station_m,
        }));
        setCicloviasData(features);
      })
      .catch((error) => {
        console.error("Error fetching ciclovias data:", error);
      });
  }, []);

  const handleCicloviaClick = (ciclovia) => {
    console.log(ciclovia);
    const nearestStation = stationsData.find(
      (station) => station.id === ciclovia.closest_station_id
    );

    if (nearestStation) {
      setHighlightedStation(nearestStation); // Highlight the station
      setHighlightedLine([
        [nearestStation.coordinates[1], nearestStation.coordinates[0]], // Lat, Lng
        [ciclovia.coordinates[0][1], ciclovia.coordinates[0][0]], // Start of the ciclovia
      ]);
    }
  };

  const handleDistanceSubmit = (e) => {
    e.preventDefault(); // Prevent page reload
    setShowCiclovias(false); // Ensure ciclovias are visible
    console.log(`Updating threshold to: ${distanceInput}`);
    setDistanceThreshold(Number(distanceInput)); // Update threshold
  };

  useEffect(() => {
    setShowCiclovias(true); // Re-enable ciclovias
  }, [distanceThreshold]);

  const loadFeatures = (bbox) => {
    console.log("Map moved, new bounds:", bbox);
    // Optionally, filter data based on bbox if needed
  };

  return (
    <div style={{ position: "relative" }}>
      <MapContainer
        center={position}
        zoom={13}
        style={{ height: "100vh", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <FetchGeoJsonOnMove onBoundsChange={loadFeatures} />

        {/* Render Markers for Stations */}
        <MarkerClusterGroup>
        {showStations &&
          stationsData.map((station) => (
            <Marker
              key={station.id}
              position={[station.coordinates[1], station.coordinates[0]]}
            >
              <Popup>
                <strong>{station.name}</strong>
                <br />
                ID: {station.id}
              </Popup>
            </Marker>
          ))}
          </MarkerClusterGroup>

        {/* Render Polylines for Ciclovias */}
        {showCiclovias &&
          cicloviasData.map((ciclovia) => (
            <Polyline
              key={ciclovia.id}
              positions={ciclovia.coordinates.map((coord) => [coord[1], coord[0]])}
              color={
                ciclovia.distance_to_closest_station_m > distanceThreshold
                  ? "red"
                  : "blue"
              }
              eventHandlers={{
                click: () => {
                  console.log(`Clicked on Ciclovia: ${ciclovia.programa}`);
                  handleCicloviaClick(ciclovia); // Call the click handler
                },
              }}
            >
              <Popup>
                <strong>{ciclovia.programa}</strong>
                <br />
                Inauguração: {ciclovia.inauguracao}
                <br />
                Extensão Total: {ciclovia.extensao_t} m
                <br />
                Extensão Ciclovia: {ciclovia.extensao_c} m
                <br />
                Estação mais Próxima: {ciclovia.closest_station_id}
                <br />
                Distância da estação mais próxima: {ciclovia.distance_to_closest_station_m} m
              </Popup>
            </Polyline>
          ))}

        {/* Highlighted Station */}
        {highlightedStation && (
          <CircleMarker
            center={[highlightedStation.coordinates[1], highlightedStation.coordinates[0]]}
            radius={10}
            color="red"
          />
        )}

        {/* Line to Nearest Station */}
        {highlightedLine && <Polyline positions={highlightedLine} color="red" />}
      </MapContainer>

      {/* Control Panel for Toggling Layers and Threshold */}
      <div
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          padding: "10px 15px",
          borderRadius: "8px",
          boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
          zIndex: 1000,
        }}
      >
        <div>
          <label>
            <input
              type="checkbox"
              checked={showStations}
              onChange={(e) => setShowStations(e.target.checked)}
            />
            Show Ciclostations
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              checked={showCiclovias}
              onChange={(e) => setShowCiclovias(e.target.checked)}
            />
            Show Ciclovias
          </label>
        </div>
        <form onSubmit={handleDistanceSubmit}>
          <label>
            Distance Threshold: 
            <input
              type="number"
              value={distanceInput}
              onChange={(e) => setDistanceInput(e.target.value)}
              style={{ width: "60px", marginLeft: "10px" }}
            />
          </label>
          <button type="submit" style={{ marginLeft: "10px" }}>Update</button>
        </form>
      </div>
    </div>
  );
};

export default Mapa;
