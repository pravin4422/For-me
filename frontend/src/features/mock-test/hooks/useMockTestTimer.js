import { useState, useEffect, useRef, useCallback } from 'react';

export default function useMockTestTimer(durationSeconds, onExpire) {
  const [remaining, setRemaining] = useState(durationSeconds);
  const [running, setRunning]     = useState(false);
  const expireRef                 = useRef(onExpire);
  expireRef.current               = onExpire;

  const start = useCallback(() => setRunning(true),  []);
  const pause = useCallback(() => setRunning(false), []);

  useEffect(() => {
    setRemaining(durationSeconds);
  }, [durationSeconds]);

  useEffect(() => {
    if (!running) return;
    if (remaining <= 0) { expireRef.current?.(); return; }
    const id = setInterval(() => {
      setRemaining(r => {
        if (r <= 1) { clearInterval(id); expireRef.current?.(); return 0; }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running, remaining]);

  const hh = String(Math.floor(remaining / 3600)).padStart(2, '0');
  const mm = String(Math.floor((remaining % 3600) / 60)).padStart(2, '0');
  const ss = String(remaining % 60).padStart(2, '0');
  const display = `${hh}:${mm}:${ss}`;
  const isWarning = remaining <= 300; // last 5 min

  return { remaining, display, isWarning, start, pause };
}
