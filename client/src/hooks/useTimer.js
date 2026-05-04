import { useState, useEffect, useRef, useCallback } from 'react';
import { playTick } from '../utils/soundEffects';

export default function useTimer(initialSeconds = 15, onExpire = null) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);
  const expiredRef = useRef(false);

  const stop = useCallback(() => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback((seconds = initialSeconds) => {
    stop();
    setTimeLeft(seconds);
    expiredRef.current = false;
    setIsRunning(true);
  }, [initialSeconds, stop]);

  const reset = useCallback((seconds = initialSeconds) => {
    stop();
    setTimeLeft(seconds);
    expiredRef.current = false;
  }, [initialSeconds, stop]);

  useEffect(() => {
    if (!isRunning) return;
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - 1;
        if (next <= 5 && next > 0) playTick();
        if (next <= 0) {
          if (!expiredRef.current) {
            expiredRef.current = true;
            stop();
            if (onExpire) onExpire();
          }
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, stop, onExpire]);

  const isUrgent = timeLeft <= 5 && timeLeft > 0;
  const progress = timeLeft / initialSeconds; // 1 → 0

  return { timeLeft, isRunning, isUrgent, progress, start, stop, reset };
}
