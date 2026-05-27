import { useState, useEffect } from "react";
import { useWallet } from "./useWallet";

export function useFetch<T>(
  url: string,
  method: "GET" | "POST" | "PATCH" = "GET",
  immediate = true
) {
  const wallet = useWallet();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState<string | null>(null);

  const fetch = async (body?: any) => {
    setLoading(true);
    setError(null);

    try {
      const response = await globalThis.fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${wallet.token}`,
        },
        ...(body && { body: JSON.stringify(body) }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      setData(result.data || result);
      return result.data || result;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (immediate && wallet.token) {
      fetch();
    }
  }, [wallet.token]);

  return { data, loading, error, fetch };
}
