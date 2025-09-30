import { useState, useEffect } from "react";
import { cicloviaService } from "../services";

export const useCiclovias = () => {
  const [ciclovias, setCiclovias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCiclovias = async () => {
      try {
        setLoading(true);
        const data = await cicloviaService.getCiclovias();
        setCiclovias(data);
        setError(null);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCiclovias();
  }, []);

  return { ciclovias, loading, error };
};