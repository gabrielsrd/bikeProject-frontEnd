import { useState, useEffect, useRef } from "react";
import { stationService } from "../services";

// Enhanced hook: accepts an optional `enabled` flag. When disabled, the hook
// will not perform network requests and returns an empty dataset. This lets
// callers avoid fetching the full histogram payload until a station/modal
// requests it.
export const useHistogram = (filters, enabled = true) => {
  const [histogramData, setHistogramData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const prevFiltersRef = useRef();

  useEffect(() => {
    if (!enabled) {
      // If disabled, clear any existing data and skip fetch
      setHistogramData([]);
      setLoading(false);
      return;
    }

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
  }, [filters, enabled]);

  return { histogramData, loading, error };
};