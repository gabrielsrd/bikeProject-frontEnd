import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";

const Mapa = () => {
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [showCiclovias, setShowCiclovias] = useState(true); // Estado para controlar o filtro
  const position = [-23.533773, -46.625290]; // Coordenadas centrais do mapa

  useEffect(() => {
    // Buscar dados GeoJSON da API Django usando axios
    axios
      .get("http://127.0.0.1:8000/api/ciclovias/") // Endpoint da API Django
      .then((response) => {
        setGeoJsonData(response.data); // Armazena os dados GeoJSON no estado
      })
      .catch((error) => {
        console.error("Erro ao buscar dados GeoJSON:", error);
      });
  }, []);

  // Função para adicionar popups para cada feature
  const onEachFeature = (feature, layer) => {
    if (feature.properties && feature.properties.name) {
      layer.bindPopup(
        `<strong>${feature.properties.name}</strong><br/>${feature.properties.description}`
      );
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <MapContainer center={position} zoom={13} style={{ height: "100vh", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        {/* Renderiza o GeoJSON apenas se showCiclovias estiver ativo */}
        {showCiclovias && geoJsonData && (
          <GeoJSON data={geoJsonData} onEachFeature={onEachFeature} />
        )}
      </MapContainer>

      {/* Caixa de seleção de filtro no canto inferior direito */}
      <div style={{
        position: "absolute",
        bottom: "20px",
        right: "20px",
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        padding: "10px 15px",
        borderRadius: "8px",
        boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
        zIndex: 1000,
      }}>
      
        <label style={{ fontSize: "14px", color: "#333" }}>
          <input
            type="checkbox"
            checked={showCiclovias}
            onChange={() => setShowCiclovias(!showCiclovias)}
            style={{ marginRight: "8px" }}
          />
          Mostrar Ciclovias
        </label>
      </div>
    </div>
  );
};

export default Mapa;
