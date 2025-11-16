import api from "./api";

export const flowService = {
  // buscar fluxos de viagens entre estacoes
  getTripFlows: async (filters = {}) => {
    try {
      const params = {};
      
      if (filters.selectedDays?.length > 0) {
        params.days = filters.selectedDays.join(",");
      }
      if (filters.excludeMonths?.length > 0) {
        params.months = filters.excludeMonths.join(",");
      }
      if (filters.uspFilter !== undefined) {
        params.usp = filters.uspFilter;
      }
      if (filters.selectedStationId) {
        params.station_id = filters.selectedStationId;
      }
      if (filters.limit) {
        params.limit = filters.limit;
      }
      if (filters.minTrips) {
        params.min_trips = filters.minTrips;
      }

      const response = await api.get("/trip_flows/", { params });
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar fluxos de viagens:", error);
      throw error;
    }
  },
};
