import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import HomePage from './components/Home';
import { CreateMatchForm } from './components/CreateMatchForm';
import { MatchSettingsList } from './components/MatchSettings';
import { GameSessionCreation } from './components/GameSessionCreation';
import { StartGameSession } from './components/StartGameSession';
import { PreStartGameSession } from './components/PreStartGameSession';
import { GameSessionList } from './components/GameSessionList';
import { LoginWrapper } from './components/Login';
import './App.css';

function App() {
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
                        <Route path="/" element={<LoginWrapper/>} />
                        <Route path="/home" element={<HomePage/>} />
                        <Route path="/create-match" element={<CreateMatchForm />} />
                        <Route path="/match-settings" element={<MatchSettingsList />} />
                        <Route path="/create-game-session" element={<GameSessionCreation />} />
                        <Route path="/game-sessions" element={<GameSessionList />} />
                        <Route path="/start-game-session" element={<StartGameSession />} />
                        <Route path="/pre-start-game-session" element={<PreStartGameSession />} />                        
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </div>
            </Router>
        </ConfigProvider>
    );
}

export default App;
