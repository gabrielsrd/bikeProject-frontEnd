import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import axios from "axios";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

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
          id: feature.properties.id, // Adjust to match your data
          name: feature.properties.name, // Adjust as needed
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
        console.log("responswe ciclovia",response.data)
        const features = response.data.features.map((feature) => ({
          id: feature.properties.programa, // Use programa as ID or another unique property
          programa: feature.properties.programa,
          inauguracao: feature.properties.inauguracao,
          extensao_t: feature.properties.extensao_t,
          extensao_c: feature.properties.extensao_c,
          coordinates: feature.geometry.coordinates,
        }));
        console.log("features",features)
        setCicloviasData(features);
      })
      .catch((error) => {
        console.error("Error fetching ciclovias data:", error);
      });
  }, []);

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
        {stationsData.map((station) => (
          <Marker
            key={station.id}
            position={[station.coordinates[1], station.coordinates[0]]} // Lat, Lng format
          >
            <Popup>
              <strong>{station.name}</strong>
            </Popup>
          </Marker>
        ))}

        {/* Render Polylines for Ciclovias */}
        {cicloviasData.map((ciclovia) => (
          <Polyline
            key={ciclovia.id}
            positions={ciclovia.coordinates.map((coord) => [coord[1], coord[0]])} // Lat, Lng format
            color="blue" // Adjust the color as needed
          >
            <Popup>
              <strong>{ciclovia.programa}</strong>
              <br />
              Inauguração: {ciclovia.inauguracao}
              <br />
              Extensão Total: {ciclovia.extensao_t} m
              <br />
              Extensão Ciclovia: {ciclovia.extensao_c} m
            </Popup>
          </Polyline>
        ))}
      </MapContainer>
    </div>
  );
};

export default Mapa;
