import React, { useEffect, useState, useCallback } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./components/Map/MarkerClusterStyles.css";
import "./components/Map/FlowArrows.css";

// Hooks
import { 
  useStations, 
  useCiclovias, 
  useHotzones, 
  usePerimetro, 
  useHistogram,
  useFlows
} from "./hooks";

// Components
import {
  StationMarkers,
  CicloviaPolylines,
  HotzonesLayer,
  PerimetroLayer,
  HighlightedElements,
  FetchGeoJsonOnMove,
  FlowArrows,
  MapControls,
  HistogramModal,
  AppHeader,
  MapLoadingOverlay,
  ErrorAlert,
} from "./components";

// Constants and utilities
import { MAP_CONFIG } from "./constants";
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
  const [showFlowArrows, setShowFlowArrows] = useState(false);
  const [flowThreshold, setFlowThreshold] = useState(100); // Limiar mínimo de viagens
  
  // Map display filters (for stations/ciclovias visibility)
  const [uspMapFilter, setUspMapFilter] = useState(true); // Default to true for USP stations on map
  
  // Histogram analysis filters (separate from map display)
  const [histogramFilters, setHistogramFilters] = useState({
    selectedDays: [0, 1, 2, 3, 4], // Default weekdays for analysis
    excludeMonths: [],
    startDate: "",
    endDate: "",
    selectedStationId: null
  });

  // Data fetching with custom hooks
  const { stations, loading: stationsLoading, error: stationsError } = useStations();
  const { ciclovias, loading: cicloviasLoading, error: cicloviasError } = useCiclovias();
  const { hotzones, loading: hotzonesLoading, error: hotzonesError } = useHotzones();
  const { perimetro, loading: perimetroLoading, error: perimetroError } = usePerimetro();
  
  // Use histogram filters directly for histogram data, but only fetch when a
  // station is explicitly selected. The modal now fetches per-station data on
  // demand, so we avoid fetching the full dataset when the modal simply opens.
  const shouldFetchHistogram = !!histogramFilters.selectedStationId;
  const { histogramData } = useHistogram(histogramFilters, shouldFetchHistogram);

  // Fetch flow data with same filters as histogram
  const flowFilters = {
    selectedDays: histogramFilters.selectedDays,
    excludeMonths: histogramFilters.excludeMonths,
    uspFilter: uspMapFilter,
    limit: 100, // Top 100 flows
    minTrips: flowThreshold // Aplicar limiar
  };
  const { flows } = useFlows(showFlowArrows ? flowFilters : null);

  // Calculate loading state
  const isLoading = stationsLoading || cicloviasLoading || hotzonesLoading || perimetroLoading;
  const hasErrors = stationsError || cicloviasError || hotzonesError || perimetroError;

  // Configure Leaflet markers on component mount
  useEffect(() => {
    configureLeafletMarkers();
  }, []);

  // Event handlers - memoized to prevent unnecessary re-renders
  const loadFeatures = useCallback((bbox) => {
    // Future feature: Load features based on map bounds
    // Currently not implemented to avoid unnecessary API calls
  }, []);

  const handleHistogramClick = useCallback((station) => {
    setSelectedStation(station);
    setHistogramFilters(prev => ({
      ...prev,
      selectedStationId: station.id
    }));
    setShowHistogramModal(true);
  }, []);

  const handleCicloviaClick = useCallback((ciclovia, nearestStation) => {
    setHighlightedStation(nearestStation);
    setHighlightedLine(calculateHighlightLine(nearestStation, ciclovia));
  }, []);

  const handleModalClose = useCallback(() => {
    setShowHistogramModal(false);
  }, []);

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
              uspFilter={uspMapFilter}
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
          
          {/* Flow Arrows - mostrar fluxos de viagens */}
          <FlowArrows 
            flows={flows}
            visible={showFlowArrows}
            minThreshold={flowThreshold}
          />
          
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
          uspMapFilter={uspMapFilter}
          setUspMapFilter={setUspMapFilter}
          showFlowArrows={showFlowArrows}
          setShowFlowArrows={setShowFlowArrows}
          flowThreshold={flowThreshold}
          setFlowThreshold={setFlowThreshold}
        />

        <HistogramModal
          show={showHistogramModal}
          onHide={handleModalClose}
          selectedStation={selectedStation}
          histogramData={histogramData}
          onStationIdChange={(stationId) => {
            setHistogramFilters(prev => ({
              ...prev,
              selectedStationId: stationId
            }));
          }}
          filters={histogramFilters}
          onFiltersChange={setHistogramFilters}
        />
      </div>
    </>
  );
};

export default Mapa;