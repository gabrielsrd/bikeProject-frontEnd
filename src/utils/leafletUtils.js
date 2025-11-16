import L from "leaflet";

// configurar markers padrão do leaflet
export const configureLeafletMarkers = () => {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
    iconUrl: require("leaflet/dist/images/marker-icon.png"),
    shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
  });
};

// calcular linha entre estacao e ciclovia
export const calculateHighlightLine = (station, ciclovia) => {
  return [
    [station.coordinates[1], station.coordinates[0]],
    [ciclovia.coordinates[0][1], ciclovia.coordinates[0][0]],
  ];
};