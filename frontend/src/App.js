import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import HomePage from './components/Home';
import { CreateMatchForm } from './components/CreateMatchForm';
import { MatchSettingsList } from './components/MatchSettings';
import { GameSessionCreation } from './components/GameSessionCreation';
import { GameSessionList } from './components/GameSessionList';
import { StartGameSession } from './components/StartGameSession';
import { PreStartGameSession } from './components/PreStartGameSession';
import { Login } from './components/Login';
import { JoinGameSession } from './components/JoinGameSession';
import { Lobby } from './components/Lobby';
import AlgorithmMatchPhaseOne from './components/PhaseOne/AlgorithmMatchPhaseOne';
import { SolutionReview } from './components/SolutionReview';
import './App.css';
import { useEffect } from 'react';

function App() {

  // Simple token extraction on app load if present in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('access_token');
    if (token) {
      localStorage.setItem('token', token);
      // Optional: Clear URL params
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 6,
        },
      }}
    >
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/create-match" element={<CreateMatchForm />} />
            <Route path="/match-settings" element={<MatchSettingsList />} />
            <Route path="/create-game-session" element={<GameSessionCreation />} />
            <Route path="/game-sessions" element={<GameSessionList />} />
            <Route path="/start-game-session/:id" element={<StartGameSession />} />
            <Route path="/pre-start-game-session/:id" element={<PreStartGameSession />} />
            <Route path="/join-game-session" element={<JoinGameSession />} />
            <Route path="/lobby" element={<Lobby />} />
            <Route path="/phase1" element={<AlgorithmMatchPhaseOne />} />
            <Route path="/voting" element={<SolutionReview />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </ConfigProvider>
  );
}

export default App;
