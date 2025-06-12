import { useState, useCallback } from "react";
import { Channel } from "./variables";

interface SessionTokenResponse {
  sessionKey: string;
  authorization: string;
  merchantId: string;
}

export function usePaymentSessionToken(
  channel: Channel,
  email?: string,
  amount?: string,
  storeId?: string

) {
  const [data, setData] = useState<SessionTokenResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchToken = useCallback(async () => {
    const API_URL = "https://xzhs9465bd.execute-api.us-east-1.amazonaws.com/prod/v1/payment/session-token";
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channel, email, amount, storeId }),
      });

      if (!response.ok) {
        throw new Error("Error al obtener el token");
      }

      const result = await response.json();
      const { sessionKey, authorization, merchantId } = result.data;

      setData({ sessionKey, authorization, merchantId });
    } catch (err: any) {
      console.error(err);
      setError("❌ Error al generar la URL. Revisa la consola.");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [channel, email, amount, storeId]);
  return {
    sessionKey: data?.sessionKey ?? null,
    authorization: data?.authorization ?? null,
    merchantId: data?.merchantId ?? null,
    loading,
    error,
    fetchToken,
  };
}
