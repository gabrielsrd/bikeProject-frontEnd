import { useState, useEffect } from "react";
import { hotzoneService } from "../services";

export const useHotzones = () => {
  const [hotzones, setHotzones] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHotzones = async () => {
      try {
        setLoading(true);
        const data = await hotzoneService.getHotzones();
        setHotzones(data);
        setError(null);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHotzones();
  }, []);

  return { hotzones, loading, error };
};