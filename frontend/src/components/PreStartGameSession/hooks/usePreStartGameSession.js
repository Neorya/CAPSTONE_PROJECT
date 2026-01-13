import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { getGameSessionDetails, startGameSession } from '../../../services/gameSessionService';



export const usePreStartGameSession = () => {
  
  const { id } = useParams();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [remainingTime, setRemainingTime] = useState('00:00');




  const fetchSession = useCallback(async () => {
    try {
      
      const data = await getGameSessionDetails(id);
      setSession(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id, session]);

  const startSession = useCallback(async () => {
    try {
      await startGameSession(id);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  }, [id]);
  

  useEffect(() => {
    if (id) {
      fetchSession();
    }
  }, [id]); // Run once on mount/id change

  // Poll for new students every 5 seconds
  useEffect(() => {
      if (!id) return;
      const interval = setInterval(fetchSession, 5000);
      return () => clearInterval(interval);
  }, [id, fetchSession]);

  // Calculate time remaining
  useEffect(() => {
    const startStr = session?.actual_start_date;
    if (!startStr) {
      setRemainingTime("00:00");
      return;
    }
  
    const startMs = new Date(startStr).getTime();
    const phase1Minutes = Number(session?.duration_phase1);
    const phase1DurationMs =
      (Number.isFinite(phase1Minutes) ? phase1Minutes : 0) * 60 * 1000;
  
    const phase1EndMs = startMs + phase1DurationMs;
  
    // 🔎 one-time diagnostics
    console.log("actual_start_date raw:", startStr);
    console.log("duration_phase1:", session?.duration_phase1, "->", phase1Minutes);
    console.log("start:", new Date(startMs).toISOString());
    console.log("end:", new Date(phase1EndMs).toISOString());
  
    const tick = () => {
      const nowMs = Date.now();
      const remainingMs = Math.max(0, phase1EndMs - nowMs);
  
      const minutes = Math.floor(remainingMs / 60000);
      const seconds = Math.floor((remainingMs % 60000) / 1000);
  
      setRemainingTime(
        `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
      );
    };
  
    tick(); // set immediately (don’t wait 1s)
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [session?.actual_start_date, session?.duration_phase1]);
  
  

  return {
    session,
    loading,
    error,
    gameId: id,
    remainingTime,
    startSession
  };
};
