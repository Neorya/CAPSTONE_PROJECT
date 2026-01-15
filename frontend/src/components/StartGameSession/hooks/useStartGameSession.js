import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { getGameSessionDetails } from '../../../services/gameSessionService';

export const useStartGameSession = () => {
  const { id } = useParams();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [remainingTime, setRemainingTime] = useState('00:00');

  const fetchSession = useCallback(async () => {
    try {
      if (!session) setLoading(true);
      
      const data = await getGameSessionDetails(id);
      console.log("data: ", data);
      setSession(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id, session]);

  useEffect(() => {
    if (id) {
      fetchSession();
    }
  }, [id]);

  useEffect(() => {
    if (!session) return;
  
    const startDate = new Date(session.actual_start_date).getTime();
    const phase1End = startDate + session.duration_phase1 * 60 * 1000;
  
    const tick = () => {
      const now = Date.now();
      const diff = Math.max(0, phase1End - now);
      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
  
      setRemainingTime(
        `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
      );
    };
  
    tick();
  
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [session]);
  

  return {
    session,
    loading,
    error,
    remainingTime
  };
};
