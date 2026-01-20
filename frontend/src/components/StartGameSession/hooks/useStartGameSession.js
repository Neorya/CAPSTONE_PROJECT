import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getGameSessionDetails } from '../../../services/gameSessionService';

export const useStartGameSession = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [remainingTime, setRemainingTime] = useState('00:00');
  const [currentPhase, setCurrentPhase] = useState(1);

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
    console.log("id: ", id);
    if (id) {
      fetchSession();
    }
  }, [id]);

  useEffect(() => {
    if (!session) return;

    const startDate = new Date(session.actual_start_date).getTime();
    const phase1End = startDate + session.duration_phase1 * 60 * 1000;
    const phase2End = phase1End + session.duration_phase2 * 60 * 1000;

    const tick = () => {
      const now = Date.now();

      if (now < phase1End) {
        // Still in phase 1
        setCurrentPhase(1);
        const diff = Math.max(0, phase1End - now);
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        setRemainingTime(
          `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
        );
      } else if (now < phase2End) {
        // Phase 1 ended, now in phase 2
        setCurrentPhase(2);
        const diff = Math.max(0, phase2End - now);
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        setRemainingTime(
          `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
        );
      } else {
        // Both phases ended
        setCurrentPhase(0);
        setRemainingTime("00:00");
        // Optionally redirect to results or hall of fame
        // navigate('/hall-of-fame');
      }
    };

    tick();

    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [session]);


  return {
    session,
    loading,
    error,
    remainingTime,
    currentPhase
  };
};
