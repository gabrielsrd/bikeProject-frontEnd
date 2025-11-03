import { useState, useEffect } from "react";
import { flowService } from "../services";

export const useFlows = (filters) => {
  const [flows, setFlows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFlows = async () => {
      setLoading(true);
      try {
        const data = await flowService.getTripFlows(filters);
        setFlows(data);
        setError(null);
      } catch (err) {
        console.error("Erro ao buscar fluxos:", err);
        setError(err);
        setFlows([]);
      } finally {
        setLoading(false);
      }
    };

    // Apenas buscar se tiver filtros definidos
    if (filters) {
      fetchFlows();
    }
  }, [
    filters?.selectedDays?.join(','),
    filters?.excludeMonths?.join(','),
    filters?.uspFilter,
    filters?.selectedStationId,
    filters?.limit,
    filters?.minTrips
  ]);

  return { flows, loading, error };
};
