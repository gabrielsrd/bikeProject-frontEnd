import api from "./api";

export const stationService = {
  /**
   * Fetch all bike stations
   */
  getStations: async () => {
    try {
      const response = await api.get("/ciclostation/");
      console.log("resposta aqui",response.data.features[0].geometry.coordinates)
      
      return response.data.features
        .filter((feature) => feature.geometry && feature.geometry.coordinates)
        .map((feature) => ({
          id: feature.properties?.id,
          station_id: feature.properties?.station_id,
          name: feature.properties?.name,
          coordinates: feature.geometry.coordinates,
        }));
    } catch (error) {
      console.error("Erro ao buscar dados das estações:", error);
      throw error;
    }
  },

  /**
   * Fetch histogram data for stations with filters
   */
  getStationHistogram: async (filters = {}) => {
    try {
      const params = {};
      
      if (filters.selectedDays?.length > 0) {
        params.days = filters.selectedDays.join(",");
      }
      if (filters.excludeMonths?.length > 0) {
        params.months = filters.excludeMonths.join(",");
      }
      if (filters.selectedStationId) {
        params.station_id = filters.selectedStationId;
      }
      if (filters.uspFilter) {
        params.usp = true;
      }
      if (filters.startDate) {
        params.start_date = filters.startDate;
      }
      if (filters.endDate) {
        params.end_date = filters.endDate;
      }
      // Allow aggregation mode: 'avg' or 'total'
      if (filters.aggregation) {
        params.aggregation = filters.aggregation;
      }

  const response = await api.get("/station_histogram_test/", { params });
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar dados do histograma:", error);
      throw error;
    }
  },
};