import { useState, useEffect, useCallback } from 'react';

// We use this free API endpoint which doesn't require a key for basic usage
const API_URL = 'https://open.er-api.com/v6/latest/USD';

export const useExchangeRate = () => {
  // Default fallback: 1 USD = 80 INR
  const [rate, setRate] = useState<number>(80); 
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const fetchRate = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Network response was not ok');
      
      const data = await response.json();
      
      // We specifically want the USD -> INR rate
      if (data && data.rates && data.rates.INR) {
        setRate(data.rates.INR);
        // Format the time nicely
        const now = new Date();
        setLastUpdated(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      } else {
        throw new Error('Invalid data format');
      }
    } catch (err) {
      setError('Failed to fetch live rates. Using cached values.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch automatically when the component mounts
  useEffect(() => {
    fetchRate();
  }, [fetchRate]);

  return { rate, loading, error, lastUpdated, refetch: fetchRate };
};