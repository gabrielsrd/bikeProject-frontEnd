import { useState, useEffect } from "react";
import { perimetroService } from "../services";

export const usePerimetro = () => {
  const [perimetro, setPerimetro] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPerimetro = async () => {
      try {
        setLoading(true);
        const data = await perimetroService.getPerimetro();
        setPerimetro(data);
        setError(null);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPerimetro();
  }, []);

  return { perimetro, loading, error };
};