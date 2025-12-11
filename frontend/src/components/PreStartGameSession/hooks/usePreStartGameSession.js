import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
// import { getGameSessionDetails } from '../../../services/gameSessionService';



export const usePreStartGameSession = () => {
  const MOCK_SESSION = {
    game_id: 1,
    name: "Game Session",
    creator_id: 1,
    start_date: "2025-12-04T15:00:00Z",
    matches: [
      { match_id: 1, title: "Match 1" },
      { match_id: 2, title: "Match 2" },
      { match_id: 3, title: "Match 3" }
    ],
    students: [
      { student_id: 1, first_name: "Aimee", last_name: "", email: "aimee@test.com", score: 0 },
      { student_id: 2, first_name: "Diego", last_name: "", email: "diego@test.com", score: 0 },
      { student_id: 3, first_name: "Ethan", last_name: "", email: "ethan@test.com", score: 0 },
      { student_id: 4, first_name: "Lucas", last_name: "", email: "lucas@test.com", score: 0 },
      { student_id: 5, first_name: "Sophia", last_name: "", email: "sophia@test.com", score: 0 }
    ]
  };
  
  const { id } = useParams();
  const [session, setSession] = useState(MOCK_SESSION);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [elapsedTime, setElapsedTime] = useState('00:00');



  const fetchSession = useCallback(async () => {
    console.log("ciao");
    try {
      // Don't set loading to true on subsequent polls to avoid flickering
     
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      //setSession(MOCK_SESSION);
      
      // const data = await getGameSessionDetails(id);
      // setSession(data);
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
  }, [id]); // Run once on mount/id change

  // Poll for new students every 5 seconds
  useEffect(() => {
      if (!id) return;
      const interval = setInterval(fetchSession, 5000);
      return () => clearInterval(interval);
  }, [id, fetchSession]);

  // Calculate time remaining
  useEffect(() => {
    
    if (!session) return;
    
    const interval = setInterval(() => {
        const start = new Date(session.start_date).getTime();
        const now = new Date().getTime();
        const diff = Math.max(0, start - now);
        
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
    gameId: id,
    elapsedTime
  };
};
