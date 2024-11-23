import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
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
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [renderedFeatures, setRenderedFeatures] = useState([]); // Rendered features
  const CHUNK_SIZE = 50; // Number of features to render per chunk
  const position = [-23.533773, -46.625290]; // Map center coordinates

  // Fix default marker icon
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
    iconUrl: require("leaflet/dist/images/marker-icon.png"),
    shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
  });


  useEffect(() => {
    // Fetch GeoJSON data from API
    axios
      .get("http://127.0.0.1:8000/api/ciclovias/")
      .then((response) => {
        setGeoJsonData(response.data);
        setRenderedFeatures(response.data.features.slice(0, CHUNK_SIZE)); // Load the first chunk
      })
      .catch((error) => {
        console.error("Erro ao buscar dados GeoJSON:", error);
      });
  }, []);

  const loadMoreFeatures = (bbox) => {
    if (geoJsonData) {
      // get the features in the bbox
      const { southwest, northeast } = bbox;
      const features = geoJsonData.features.filter((feature) => {
        const [lng, lat] = feature.geometry.coordinates;
        return lng > southwest.lng && lng < northeast.lng && lat > southwest.lat && lat < northeast.lat;
      });
      // Load the next chunk
      console.log("bboxParam", bbox);
      console.log("features", features);
      setTimeout(() => {
        setRenderedFeatures([features]);
      }, 10000);

    }
  };



  const loadFeatures = async (bbox) => {
    loadMoreFeatures(bbox)
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
          attribution='&copy; OpenStreetMap contributors'
        />
        <FetchGeoJsonOnMove onBoundsChange={loadFeatures} />


        {renderedFeatures.length > 0 && (
          <GeoJSON
            data={{
              ...geoJsonData,
              features: renderedFeatures, // Render only the current chunk
            }}
          />
        )}
      </MapContainer>

      {/* Button to load more features */}
      <div
        style={{
          position: "absolute",
          bottom: "20px",
          right: "20px",
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          padding: "10px 15px",
          borderRadius: "8px",
          boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
          zIndex: 1000,
        }}
      >

        {/* <button onClick={loadMoreFeatures} disabled={renderedFeatures.length >= geoJsonData?.features.length}>
          {renderedFeatures.length >= geoJsonData?.features.length
            ? "All features loaded"
            : "Load more features"}
        </button> */}
      </div>
    </div>
  );
};

export default Mapa;
