import { useState, useEffect, useRef } from "react";
import { stationService } from "../services";

export const useHistogram = (filters) => {
  const [histogramData, setHistogramData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const prevFiltersRef = useRef();

  useEffect(() => {
    // Deep comparison to avoid unnecessary API calls
    const hasFiltersChanged = JSON.stringify(prevFiltersRef.current) !== JSON.stringify(filters);
    
    if (!hasFiltersChanged) {
      return;
    }

    prevFiltersRef.current = filters;

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