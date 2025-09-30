import { useState, useEffect } from "react";
import { stationService } from "../services";

export const useHistogram = (filters) => {
  const [histogramData, setHistogramData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistogramData = async () => {
      try {
        setLoading(true);
        const data = await stationService.getStationHistogram(filters);
        setHistogramData(data);
        setError(null);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistogramData();
  }, [filters]);

  return { histogramData, loading, error };
};