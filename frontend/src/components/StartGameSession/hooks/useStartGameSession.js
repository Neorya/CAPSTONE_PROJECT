import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
// import { getGameSessionDetails } from '../../../services/gameSessionService';

export const useStartGameSession = () => {
  const MOCK_SESSION = {
    game_id: 1,
    name: "Lesson 1",
    creator_id: 1,
    start_date:  new Date().getTime(),
    duration_first_phase: 100,
    matches: [],
    students: [
      { student_id: 1, first_name: "Anna", last_name: "Smith", email: "anna@test.com", score: 0 },
      { student_id: 2, first_name: "Kathy", last_name: "Browne", email: "kathy@test.com", score: 0 },
      { student_id: 3, first_name: "Sarah", last_name: "Catt", email: "sarah@test.com", score: 0 },
      { student_id: 4, first_name: "Steve", last_name: "Latem", email: "steve@test.com", score: 0 },
      { student_id: 5, first_name: "Andrew", last_name: "Max", email: "andrew@test.com", score: 0 },
      { student_id: 6, first_name: "Bette", last_name: "Grammer", email: "bette@test.com", score: 0 },
      { student_id: 7, first_name: "John", last_name: "Clinton", email: "john@test.com", score: 0 },
      { student_id: 8, first_name: "Jance", last_name: "I Hanson", email: "jance@test.com", score: 0 },
      { student_id: 9, first_name: "John", last_name: "Gibson", email: "john.g@test.com", score: 0 },
      { student_id: 10, first_name: "Stefan", last_name: "Koesters", email: "stefan@test.com", score: 0 },
      { student_id: 11, first_name: "Martina", last_name: "Puring", email: "martina@test.com", score: 0 },
      { student_id: 12, first_name: "Caroline", last_name: "Smith", email: "caroline@test.com", score: 0 }
    ]
  };
  const { id } = useParams();
  const [session, setSession] = useState(MOCK_SESSION);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [elapsedTime, setElapsedTime] = useState('00:00');

  const fetchSession = useCallback(async () => {
    try {
      if (!session) setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setSession(MOCK_SESSION);
      
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
