import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Home from './pages/Home';
import AgeSelect from './pages/AgeSelect';
import About from './pages/About';
import Game from './pages/Game';
import Leaderboard from './pages/Leaderboard';
import PlayerSetup from './components/PlayerSetup';

// Portrait-mode guard
function PortraitGuard() {
  return (
    <div className="portrait-guard">
      <div className="rotate-icon">📱↔️</div>
      <h2>Rotate Device</h2>
      <p>MathTug is designed for landscape mode. Please rotate your device to play!</p>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <PortraitGuard />
      <div className="app-root" style={{ width: '100%', minHeight: '100dvh' }}>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/age-select" element={<AgeSelect />} />
            <Route path="/setup" element={<PlayerSetup />} />
            <Route path="/game/:id" element={<Game />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </div>
    </BrowserRouter>
  );
}
