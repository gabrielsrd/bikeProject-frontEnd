import api from "./api";

export const hotzoneService = {
  // buscar hotzones
  getHotzones: async () => {
    try {
      const response = await api.get("/hotzones/");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar dados das zonas quentes:", error);
      throw error;
    }
  },
};