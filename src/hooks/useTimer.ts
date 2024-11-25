import { useState, useEffect, useCallback } from 'react';

export function useTimer(initialTime: number, onTimeout: () => void) {
  const [timeRemaining, setTimeRemaining] = useState(initialTime);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onTimeout]);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  return { timeRemaining, formatTime };
}