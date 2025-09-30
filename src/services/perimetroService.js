/**
 * Fetch perimeter data from static file
 */
export const perimetroService = {
  getPerimetro: async () => {
    try {
      const response = await fetch("/perimetro-campus.geojson");
      return await response.json();
    } catch (error) {
      console.error("Erro ao buscar perimetro-campus.geojson:", error);
      throw error;
    }
  },
};