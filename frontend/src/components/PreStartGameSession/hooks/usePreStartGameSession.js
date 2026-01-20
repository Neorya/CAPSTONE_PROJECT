import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { getGameSessionDetails, startGameSession } from '../../../services/gameSessionService';



export const usePreStartGameSession = () => {

  const { id } = useParams();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSession = useCallback(async () => {
    try {

      const data = await getGameSessionDetails(id);
      console.log("data: ", data);
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

  return {
    session,
    loading,
    error,
    gameId: id,
    startSession
  };
};
