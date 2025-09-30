import api from "./api";

export const stationService = {
  /**
   * Fetch all bike stations
   */
  getStations: async () => {
    try {
      const response = await api.get("/ciclostation/");
      return response.data.features.map((feature) => ({
        id: feature.properties.id,
        name: feature.properties.name,
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

      const response = await api.get("/station_histogram/", { params });
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar dados do histograma:", error);
      throw error;
    }
  },
};