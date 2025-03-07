import React, { useEffect, useState, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
  CircleMarker,
  GeoJSON,
  Circle,
  Tooltip as LeafletTooltip,
} from "react-leaflet";
import axios from "axios";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const FetchGeoJsonOnMove = ({ onBoundsChange }) => {
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

const Mapa = () => {
  const [stationsData, setStationsData] = useState([]);
  const [cicloviasData, setCicloviasData] = useState([]);
  const [hotzonesData, setHotzonesData] = useState(null);
  const [histogramData, setHistogramData] = useState([]);
  const [perimetroData, setPerimetroData] = useState(null); // Novo estado para o perímetro
  const [highlightedStation, setHighlightedStation] = useState(null);
  const [highlightedLine, setHighlightedLine] = useState(null);
  const [showStations, setShowStations] = useState(true);
  const [showCiclovias, setShowCiclovias] = useState(true);
  const [distanceThreshold, setDistanceThreshold] = useState(1000);
  const [showHotzones, setShowHotzones] = useState(true);
  const [distanceInput, setDistanceInput] = useState(1000);
  const [showHistogramModal, setShowHistogramModal] = useState(false);
  const [selectedStation, setSelectedStation] = useState(null);
  const position = [-23.5577, -46.7312];

  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
    iconUrl: require("leaflet/dist/images/marker-icon.png"),
    shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
  });

  useEffect(() => {
    // Fetch ciclostations
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
      .catch((error) => console.error("Error fetching station data:", error));

    // Fetch ciclovias
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
      .catch((error) => console.error("Error fetching ciclovias data:", error));

    // Fetch hotzones
    axios
      .get("http://127.0.0.1:8000/api/hotzones/")
      .then((response) => setHotzonesData(response.data))
      .catch((error) => console.error("Error fetching hotzones data:", error));

    // Fetch histogram data
    axios
      .get("http://127.0.0.1:8000/api/station_histogram/")
      .then((response) => setHistogramData(response.data))
      .catch((error) => console.error("Error fetching histogram data:", error));

    // Fetch perimetro-campus.geojson
    fetch("/perimetro-campus.geojson")
      .then((response) => response.json())
      .then((data) => setPerimetroData(data))
      .catch((error) => console.error("Error fetching perimetro-campus.geojson:", error));
  }, []);

  const handleDistanceSubmit = (e) => {
    e.preventDefault();
    setShowCiclovias(false);
    setDistanceThreshold(Number(distanceInput));
  };

  useEffect(() => {
    setShowCiclovias(true);
  }, [distanceThreshold]);

  const loadFeatures = (bbox) => {
    console.log("Map moved, new bounds:", bbox);
  };

  const getStationHistogramChart = (stationId) => {
    const stationData = histogramData.filter((data) => data.station_id === stationId);
    const hourlyData = {};

    stationData.forEach((data) => {
      const hour = data.hour;
      if (!hourlyData[hour]) {
        hourlyData[hour] = { departures: 0, arrivals: 0, count: 0 };
      }
      hourlyData[hour].departures += data.departures;
      hourlyData[hour].arrivals += data.arrivals;
      hourlyData[hour].count += 1;
    });

    const labels = [];
    const departures = [];
    const arrivals = [];
    for (let hour = 0; hour < 24; hour++) {
      labels.push(hour);
      departures.push(hourlyData[hour] ? hourlyData[hour].departures / hourlyData[hour].count : 0);
      arrivals.push(hourlyData[hour] ? hourlyData[hour].arrivals / hourlyData[hour].count : 0);
    }

    return {
      labels,
      datasets: [
        {
          label: "Departures",
          data: departures,
          backgroundColor: "rgba(75, 192, 192, 0.6)",
        },
        {
          label: "Arrivals",
          data: arrivals,
          backgroundColor: "rgba(255, 99, 132, 0.6)",
        },
      ],
    };
  };

  const handleHistogramClick = (station) => {
    setSelectedStation(station);
    setShowHistogramModal(true);
  };

  const markers = useMemo(() => {
    return stationsData.map((station) => (
      <Marker
        key={station.id}
        position={[station.coordinates[1], station.coordinates[0]]}
      >
        <Popup>
          <strong>{station.name}</strong>
          <br />
          ID: {station.id}
          <br />
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleHistogramClick(station)}
            style={{ marginTop: "10px" }}
          >
            Ver Histograma Completo
          </Button>
          {histogramData.length > 0 && (
            <div style={{ width: "300px", height: "200px", marginTop: "10px" }}>
              <Bar
                data={getStationHistogramChart(station.id)}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: "top" },
                    title: { display: false },
                  },
                }}
              />
            </div>
          )}
        </Popup>
      </Marker>
    ));
  }, [stationsData, histogramData]);

  const polylines = useMemo(() => {
    const handleCicloviaClick = (ciclovia) => {
      const nearestStation = stationsData.find(
        (station) => station.id === ciclovia.closest_station_id
      );
      if (nearestStation) {
        setHighlightedStation(nearestStation);
        setHighlightedLine([
          [nearestStation.coordinates[1], nearestStation.coordinates[0]],
          [ciclovia.coordinates[0][1], ciclovia.coordinates[0][0]],
        ]);
      }
    };

    return cicloviasData.map((ciclovia) => (
      <Polyline
        key={ciclovia.id}
        positions={ciclovia.coordinates.map((coord) => [coord[1], coord[0]])}
        color={ciclovia.distance_to_closest_station_m > distanceThreshold ? "red" : "blue"}
        eventHandlers={{ click: () => handleCicloviaClick(ciclovia) }}
      >
        <Popup>
          <strong>{ciclovia.programa}</strong>
          <br />
          Inauguration: {ciclovia.inauguracao}
          <br />
          Total Length: {ciclovia.extensao_t} m
          <br />
          Ciclovia Length: {ciclovia.extensao_c} m
          <br />
          Nearest Station: {ciclovia.closest_station_id}
          <br />
          Distance to Nearest Station: {ciclovia.distance_to_closest_station_m} m
        </Popup>
      </Polyline>
    ));
  }, [cicloviasData, distanceThreshold, stationsData]);

  return (
    <div style={{ position: "relative" }}>
      <MapContainer
        center={position}
        zoom={14}
        style={{ height: "100vh", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
        />
        <FetchGeoJsonOnMove onBoundsChange={loadFeatures} />

        {/* Camada do perímetro do campus */}
        {perimetroData && (
          <GeoJSON
            data={perimetroData}
            style={() => ({
              color: "green",
              weight: 2,
              fillColor: "green",
              fillOpacity: 0.2,
            })}
          >
            <LeafletTooltip>Perímetro do Campus</LeafletTooltip>
          </GeoJSON>
        )}

        {showStations && markers}
        {showCiclovias && polylines}

        {showHotzones && hotzonesData && (
          <GeoJSON
            data={hotzonesData}
            style={{
              color: "purple",
              weight: 2,
              fillColor: "purple",
              fillOpacity: 0.5,
            }}
          >
            <LeafletTooltip>Hotzone</LeafletTooltip>
          </GeoJSON>
        )}

        {highlightedStation && (
          <CircleMarker
            center={[highlightedStation.coordinates[1], highlightedStation.coordinates[0]]}
            radius={10}
            color="red"
          />
        )}

        {highlightedLine && <Polyline positions={highlightedLine} color="red" />}
      </MapContainer>

      {/* Control Panel */}
      <div
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          padding: "10px 15px",
          borderRadius: "8px",
          boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
          zIndex: 1001,
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
        <div>
          <label>
            <input
              type="checkbox"
              checked={showHotzones}
              onChange={(e) => setShowHotzones(e.target.checked)}
            />
            Show Hotzones
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

      {/* Histogram Modal */}
      <Modal
        show={showHistogramModal}
        onHide={() => setShowHistogramModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Histograma Detalhado - {selectedStation?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedStation && histogramData.length > 0 && (
            <div style={{ width: "100%", height: "400px" }}>
              <Bar
                data={getStationHistogramChart(selectedStation.id)}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: "top" },
                    title: {
                      display: true,
                      text: "Média de Partidas e Chegadas por Hora",
                    },
                  },
                  scales: {
                    x: { title: { display: true, text: "Hora do Dia" } },
                    y: { title: { display: true, text: "Quantidade" } },
                  },
                }}
              />
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Mapa;