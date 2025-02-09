import { useState, useCallback } from "react";

export function useErrorHandler() {
  const [error, setError] = useState<string | null>(null);

  const handleError = useCallback((e: unknown) => {
    const errorMessage =
      e instanceof Error ? e.message : "An unexpected error occurred";
    setError(errorMessage);
    console.error(errorMessage);
  }, []);

  return { error, setError, handleError };
}
