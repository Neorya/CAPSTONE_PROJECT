import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { getGameSessionDetails } from '../../../services/gameSessionService';

export const useStartGameSession = () => {
  const { id } = useParams();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [elapsedTime, setElapsedTime] = useState('00:00');

  const fetchSession = useCallback(async () => {
    try {
      if (!session) setLoading(true);
      
      const data = await getGameSessionDetails(id);
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
    
    const interval = setInterval(() => {
        const now = new Date().getTime();
        const diff = Math.max(0, ((session.start_date+ ( session.duration_first_phase * 60 * 1000)) - now ));
        
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        
        setElapsedTime(
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        );
    }, 1000);
    
    return () => clearInterval(interval);
  }, [session]);

  return {
    session,
    loading,
    error,
    elapsedTime
  };
};
