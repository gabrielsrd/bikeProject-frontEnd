import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./components/Map/MarkerClusterStyles.css";

// Hooks
import { 
  useStations, 
  useCiclovias, 
  useHotzones, 
  usePerimetro, 
  useHistogram 
} from "./hooks";

// Components
import {
  StationMarkers,
  CicloviaPolylines,
  HotzonesLayer,
  PerimetroLayer,
  HighlightedElements,
  FetchGeoJsonOnMove,
  MapControls,
  HistogramModal,
  AppHeader,
  MapLoadingOverlay,
  ErrorAlert,
} from "./components";

// Constants and utilities
import { MAP_CONFIG, DAYS_OF_WEEK, MONTHS } from "./constants";
import { configureLeafletMarkers, calculateHighlightLine } from "./utils";

const Mapa = () => {
  // State management
  const [highlightedStation, setHighlightedStation] = useState(null);
  const [highlightedLine, setHighlightedLine] = useState(null);
  const [showStations, setShowStations] = useState(true);
  const [showCiclovias, setShowCiclovias] = useState(true);
  const [distanceThreshold] = useState(MAP_CONFIG.DEFAULT_DISTANCE_THRESHOLD);
  const [showHotzones] = useState(true);
  const [showHistogramModal, setShowHistogramModal] = useState(false);
  const [selectedStation, setSelectedStation] = useState(null);
  const [selectedDays, setSelectedDays] = useState([]);
  const [excludeMonths, setExcludeMonths] = useState([]);
  const [selectedStationId, setSelectedStationId] = useState(null);
  const [uspFilter, setUspFilter] = useState(true); // Default to true for USP stations
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Data fetching with custom hooks
  const { stations, loading: stationsLoading, error: stationsError } = useStations();
  const { ciclovias, loading: cicloviasLoading, error: cicloviasError } = useCiclovias();
  const { hotzones, loading: hotzonesLoading, error: hotzonesError } = useHotzones();
  const { perimetro, loading: perimetroLoading, error: perimetroError } = usePerimetro();
  
  const histogramFilters = {
    selectedDays,
    excludeMonths,
    selectedStationId,
    uspFilter,
    startDate,
    endDate,
  };
  const { histogramData } = useHistogram(histogramFilters);

  // Calculate loading state
  const isLoading = stationsLoading || cicloviasLoading || hotzonesLoading || perimetroLoading;
  const hasErrors = stationsError || cicloviasError || hotzonesError || perimetroError;

  // Configure Leaflet markers on component mount
  useEffect(() => {
    configureLeafletMarkers();
  }, []);

  // Event handlers
  const loadFeatures = (bbox) => {
    console.log("Mapa movido, novas bordas:", bbox);
  };

  const handleHistogramClick = (station) => {
    setSelectedStation(station);
    setSelectedStationId(station.id);
    setShowHistogramModal(true);
  };

  const handleCicloviaClick = (ciclovia, nearestStation) => {
    setHighlightedStation(nearestStation);
    setHighlightedLine(calculateHighlightLine(nearestStation, ciclovia));
  };

  return (
    <>
      <AppHeader 
        stationsCount={stations.length}
        cicloviasCount={ciclovias.length}
        hotzonesCount={hotzones ? 1 : 0}
      />
      
      <div style={{ position: "relative", height: "calc(100vh - 56px)" }}>
        {/* Error handling */}
        {hasErrors && (
          <ErrorAlert 
            error={stationsError || cicloviasError || hotzonesError || perimetroError}
            onRetry={() => window.location.reload()}
          />
        )}

        <MapContainer center={MAP_CONFIG.CENTER} zoom={MAP_CONFIG.ZOOM} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="© OpenStreetMap contributors"
          />
          <FetchGeoJsonOnMove onBoundsChange={loadFeatures} />
          
          <PerimetroLayer perimetro={perimetro} />
          
          {showStations && (
            <StationMarkers
              stations={stations}
              histogramData={histogramData}
              onHistogramClick={handleHistogramClick}
              uspFilter={uspFilter}
            />
          )}
          
          {showCiclovias && (
            <CicloviaPolylines
              ciclovias={ciclovias}
              distanceThreshold={distanceThreshold}
              stations={stations}
              onCicloviaClick={handleCicloviaClick}
            />
          )}
          
          {showHotzones && <HotzonesLayer hotzones={hotzones} />}
          
          <HighlightedElements
            highlightedStation={highlightedStation}
            highlightedLine={highlightedLine}
          />
        </MapContainer>

        {/* Loading overlay */}
        <MapLoadingOverlay 
          show={isLoading} 
          message="Carregando dados do mapa..."
        />

        <MapControls
          showStations={showStations}
          setShowStations={setShowStations}
          showCiclovias={showCiclovias}
          setShowCiclovias={setShowCiclovias}
          selectedDays={selectedDays}
          setSelectedDays={setSelectedDays}
          excludeMonths={excludeMonths}
          setExcludeMonths={setExcludeMonths}
          uspFilter={uspFilter}
          setUspFilter={setUspFilter}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          daysOfWeek={DAYS_OF_WEEK}
          months={MONTHS}
        />

        <HistogramModal
          show={showHistogramModal}
          onHide={() => setShowHistogramModal(false)}
          selectedStation={selectedStation}
          histogramData={histogramData}
          onStationIdChange={setSelectedStationId}
        />
      </div>
    </>
  );
};

export default Mapa;