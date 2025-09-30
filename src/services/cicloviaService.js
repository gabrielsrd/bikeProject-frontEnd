import api from "./api";

export const cicloviaService = {
  /**
   * Fetch all ciclovias (bike lanes)
   */
  getCiclovias: async () => {
    try {
      const response = await api.get("/ciclovias/");
      return response.data.features.map((feature) => ({
        id: feature.properties.programa,
        programa: feature.properties.programa,
        inauguracao: feature.properties.inauguracao,
        extensao_t: feature.properties.extensao_t,
        extensao_c: feature.properties.extensao_c,
        coordinates: feature.geometry.coordinates,
        closest_station_id: feature.properties.closest_station_id,
        distance_to_closest_station_m: feature.properties.distance_to_closest_station_m,
      }));
    } catch (error) {
      console.error("Erro ao buscar dados das ciclovias:", error);
      throw error;
    }
  },
};