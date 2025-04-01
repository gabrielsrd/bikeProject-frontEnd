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
  const [perimetroData, setPerimetroData] = useState(null);
  const [highlightedStation, setHighlightedStation] = useState(null);
  const [highlightedLine, setHighlightedLine] = useState(null);
  const [showStations, setShowStations] = useState(true);
  const [showCiclovias, setShowCiclovias] = useState(true);
  const [distanceThreshold, setDistanceThreshold] = useState(1000);
  const [showHotzones, setShowHotzones] = useState(true);
  const [distanceInput, setDistanceInput] = useState(1000);
  const [showHistogramModal, setShowHistogramModal] = useState(false);
  const [selectedStation, setSelectedStation] = useState(null);
  const [selectedDays, setSelectedDays] = useState([]);
  const [excludeMonths, setExcludeMonths] = useState([]);
  const [selectedStationId, setSelectedStationId] = useState(null);
  const [uspFilter, setUspFilter] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const position = [-23.5577, -46.7312];

  const daysOfWeek = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
  const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
    iconUrl: require("leaflet/dist/images/marker-icon.png"),
    shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
  });

  useEffect(() => {
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
      .catch((error) => console.error("Erro ao buscar dados das estações:", error));

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
      .catch((error) => console.error("Erro ao buscar dados das ciclovias:", error));

    axios
      .get("http://127.0.0.1:8000/api/hotzones/")
      .then((response) => setHotzonesData(response.data))
      .catch((error) => console.error("Erro ao buscar dados das zonas quentes:", error));

    fetch("/perimetro-campus.geojson")
      .then((response) => response.json())
      .then((data) => setPerimetroData(data))
      .catch((error) => console.error("Erro ao buscar perimetro-campus.geojson:", error));
  }, []);

  useEffect(() => {
    const fetchHistogramData = async () => {
      try {
        const params = {};
        if (selectedDays.length > 0) params.days = selectedDays.join(",");
        if (excludeMonths.length > 0) params.months = excludeMonths.join(",");
        if (selectedStationId) params.station_id = selectedStationId;
        if (uspFilter) params.usp = true;
        if (startDate) params.start_date = startDate;
        if (endDate) params.end_date = endDate;
        const response = await axios.get("http://127.0.0.1:8000/api/station_histogram/", { params });
        setHistogramData(response.data);
      } catch (error) {
        console.error("Erro ao buscar dados do histograma:", error);
      }
    };
    fetchHistogramData();
  }, [selectedDays, excludeMonths, selectedStationId, uspFilter, startDate, endDate]);

  const handleDistanceSubmit = (e) => {
    e.preventDefault();
    setShowCiclovias(false);
    setDistanceThreshold(Number(distanceInput));
  };

  useEffect(() => {
    setShowCiclovias(true);
  }, [distanceThreshold]);

  const loadFeatures = (bbox) => {
    console.log("Mapa movido, novas bordas:", bbox);
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
        { label: "Partidas", data: departures, backgroundColor: "rgba(75, 192, 192, 0.6)" },
        { label: "Chegadas", data: arrivals, backgroundColor: "rgba(255, 99, 132, 0.6)" },
      ],
    };
  };

  const handleHistogramClick = (station) => {
    setSelectedStation(station);
    setSelectedStationId(station.id);
    setShowHistogramModal(true);
  };

  const handleDayChange = (dayIndex) => {
    setSelectedDays((prev) =>
      prev.includes(dayIndex) ? prev.filter((d) => d !== dayIndex) : [...prev, dayIndex]
    );
  };

  const handleMonthChange = (monthIndex) => {
    setExcludeMonths((prev) =>
      prev.includes(monthIndex + 1) ? prev.filter((m) => m !== (monthIndex + 1)) : [...prev, monthIndex + 1]
    );
  };

  const markers = useMemo(() => {
    return stationsData.map((station) => (
      <Marker key={station.id} position={[station.coordinates[1], station.coordinates[0]]}>
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
                  plugins: { legend: { position: "top" }, title: { display: false } },
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
          Inauguração: {ciclovia.inauguracao}
          <br />
          Comprimento Total: {ciclovia.extensao_t} m
          <br />
          Comprimento Ciclovia: {ciclovia.extensao_c} m
          <br />
          Estação Mais Próxima: {ciclovia.closest_station_id}
          <br />
          Distância à Estação Mais Próxima: {ciclovia.distance_to_closest_station_m} m
        </Popup>
      </Polyline>
    ));
  }, [cicloviasData, distanceThreshold, stationsData]);

  return (
    <div style={{ position: "relative" }}>
      <MapContainer center={position} zoom={14} style={{ height: "100vh", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
        />
        <FetchGeoJsonOnMove onBoundsChange={loadFeatures} />
        {perimetroData && (
          <GeoJSON
            data={perimetroData}
            style={() => ({ color: "green", weight: 2, fillColor: "green", fillOpacity: 0.2 })}
          >
            <LeafletTooltip>Perímetro do Campus</LeafletTooltip>
          </GeoJSON>
        )}
        {showStations && markers}
        {showCiclovias && polylines}
        {showHotzones && hotzonesData && (
          <GeoJSON
            data={hotzonesData}
            style={{ color: "purple", weight: 2, fillColor: "purple", fillOpacity: 0.5 }}
          >
            <LeafletTooltip>Zona Quente</LeafletTooltip>
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
            Mostrar Ciclostations
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              checked={showCiclovias}
              onChange={(e) => setShowCiclovias(e.target.checked)}
            />
            Mostrar Ciclovias
          </label>
        </div>
        {/* <div>
          <label>
            <input
              type="checkbox"
              checked={showHotzones}
              onChange={(e) => setShowHotzones(e.target.checked)}
            />
            Mostrar Zonas Quentes
          </label>
        </div> */}
        {/* <form onSubmit={handleDistanceSubmit}>
          <label>
            Limiar de Distância:
            <input
              type="number"
              value={distanceInput}
              onChange={(e) => setDistanceInput(e.target.value)}
              style={{ width: "60px", marginLeft: "10px" }}
            />
          </label>
          <button type="submit" style={{ marginLeft: "10px" }}>Atualizar</button>
        </form> */}

        <div style={{ marginTop: "10px" }}>
          <label>Filtrar por Dias:</label>
          <div>
            {daysOfWeek.map((day, index) => (
              <label key={index} style={{ marginRight: "10px" }}>
                <input
                  type="checkbox"
                  checked={selectedDays.includes(index)}
                  onChange={() => handleDayChange(index)}
                />
                {day}
              </label>
            ))}
          </div>
        </div>

        <div style={{ marginTop: "10px" }}>
          <label>Excluir Meses:</label>
          <div>
            {months.map((month, index) => (
              <label key={index} style={{ marginRight: "10px" }}>
                <input
                  type="checkbox"
                  checked={excludeMonths.includes(index + 1)}
                  onChange={() => handleMonthChange(index)}
                />
                {month}
              </label>
            ))}
          </div>
        </div>

        <div style={{ marginTop: "10px" }}>
          <label>
            <input
              type="checkbox"
              checked={uspFilter}
              onChange={(e) => setUspFilter(e.target.checked)}
            />
            Estações USP (242-260)
          </label>
        </div>

        <div style={{ marginTop: "10px" }}>
          <label>Filtrar por Intervalo de Data:</label>
          <div style={{ display: "flex", gap: "10px" }}>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={{ padding: "5px" }}
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={{ padding: "5px" }}
            />
          </div>
        </div>
      </div>

      <Modal
        show={showHistogramModal}
        onHide={() => {
          setShowHistogramModal(false);
          setSelectedStationId(null);
        }}
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
                    title: { display: true, text: "Média de Partidas e Chegadas por Hora" },
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