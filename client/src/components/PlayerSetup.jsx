import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import useGameStore from '../store/gameStore';
import { resumeAudio } from '../utils/soundEffects';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || (typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'http://localhost:5001' : '');

const DIFFICULTY_OPTIONS = ['easy', 'medium', 'hard'];
const ROUND_OPTIONS = [5, 10, 15];

const DIFFICULTY_LABELS = {
  easy: { label: 'Easy', desc: '1–9, +/−', color: '#00ff88' },
  medium: { label: 'Medium', desc: '1–49, all ops', color: '#ffd700' },
  hard: { label: 'Hard', desc: '1–99, all ops', color: '#ff4444' },
};

import BackgroundEffects from './BackgroundEffects';

export default function PlayerSetup() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setGameId, setJoinCode, setPlayerId, setIsLocal, setPlayerNames, setDifficulty, setTotalRounds, setPhase } = useGameStore();

  // Pre-select join tab if navigated here via ?tab=join (from Home's "Join Room" button)
  const initialTab = new URLSearchParams(location.search).get('tab') === 'join' ? 'join' : 'host';
  const [activeTab, setActiveTab] = useState(initialTab);
  
  // Host state
  const [hostName, setHostName] = useState('');
  const [difficulty, setDifficultyLocal] = useState('medium');
  const [rounds, setRounds] = useState(10);
  const [mode, setMode] = useState('online'); // 'online' | 'local' | 'ai'
  const [hostP2Name, setHostP2Name] = useState(''); // Only used if mode is 'local'

  // Join state
  const [joinName, setJoinName] = useState('');
  const [joinCodeInput, setJoinCodeInput] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleHost() {
    resumeAudio();
    const name1 = hostName.trim() || 'Player 1';
    const isLocalGame = mode === 'local' || mode === 'ai';
    const name2 = mode === 'local' ? (hostP2Name.trim() || 'Player 2') : (mode === 'ai' ? 'AI Bot' : 'Waiting...');

    setLoading(true);
    setError(null);

    try {
      const { data } = await axios.post(`${SERVER_URL}/api/game/new`, {
        player1Name: name1,
        player2Name: name2,
        totalRounds: rounds,
        difficulty,
        isLocal: isLocalGame,
      });

      if (!data.success) throw new Error('Failed to create game');

      setGameId(data.gameId);
      setJoinCode(data.joinCode);
      setPlayerId('player1');
      setIsLocal(isLocalGame);
      setPlayerNames({ player1: name1, player2: name2 });
      setDifficulty(difficulty);
      setTotalRounds(rounds);
      setPhase('waiting');

      navigate(`/game/${data.gameId}`);
    } catch (err) {
      console.error(err);
      setError('Could not connect to server. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  }

  async function handleJoin() {
    resumeAudio();
    const name2 = joinName.trim() || 'Player 2';
    const code = joinCodeInput.trim().toUpperCase();

    if (!code) {
      setError('Please enter a Game Code.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data } = await axios.post(`${SERVER_URL}/api/game/join`, {
        joinCode: code,
        player2Name: name2,
      });

      if (!data.success) throw new Error(data.error || 'Failed to join game');

      setGameId(data.gameId);
      setJoinCode(code);
      setPlayerId('player2');
      setIsLocal(false);
      setPhase('waiting'); // the socket will push state and auto-start

      navigate(`/game/${data.gameId}`);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Game not found or already started.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="setup-container stars-bg">
      <BackgroundEffects />
      
      {/* Back Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => navigate('/age-select')}
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          background: 'rgba(255,255,255,0.05)',
          border: '2px solid rgba(255,255,255,0.2)',
          color: 'var(--text-primary)',
          padding: '0.6rem 1.2rem',
          borderRadius: '50px',
          fontFamily: 'var(--font-display)',
          fontSize: '0.9rem',
          cursor: 'pointer',
          zIndex: 100,
          transition: 'all 0.3s ease',
        }}
      >
        ← Back
      </motion.button>
      
      <div style={{ position: 'relative', zIndex: 10, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: '1.5rem', zIndex: 10 }}>
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: '900',
            background: 'linear-gradient(135deg, var(--cyan), var(--pink))',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            Player Setup
          </div>
        </motion.div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', justifyContent: 'center' }}>
          <motion.button 
            whileTap={{ scale: 0.95 }}
            className={`btn ${activeTab === 'host' ? 'btn-cyan' : 'btn-ghost'}`}
            onClick={() => setActiveTab('host')}
            style={{ padding: '0.6rem 2rem' }}
          >
            ➕ Host Game
          </motion.button>
          <motion.button 
            whileTap={{ scale: 0.95 }}
            className={`btn ${activeTab === 'join' ? 'btn-pink' : 'btn-ghost'}`}
            onClick={() => setActiveTab('join')}
            style={{ padding: '0.6rem 2rem' }}
          >
            🤝 Join Game
          </motion.button>
        </div>

        <AnimatePresence mode="wait">
        {activeTab === 'host' ? (
          <motion.div key="host" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
            <div className="setup-grid" style={{ gridTemplateColumns: mode === 'local' ? '1fr auto 1fr' : '1fr', maxWidth: mode === 'local' ? '800px' : '400px', margin: '0 auto' }}>
              
              <div className="glass setup-card" style={{ borderColor: 'rgba(0,245,255,0.2)' }}>
                <h3 style={{ color: 'var(--cyan)' }}>⚡ {mode === 'local' ? 'Player 1' : 'Your Name'}</h3>
                <div>
                  <input
                    type="text"
                    placeholder="Enter name..."
                    value={hostName}
                    onChange={(e) => setHostName(e.target.value)}
                    maxLength={16}
                    className="input-field"
                    style={{ borderColor: 'rgba(0,245,255,0.3)', marginBottom: '1rem' }}
                  />
                </div>

                <div className="option-group" style={{ alignItems: 'flex-start' }}>
                  <label>Difficulty</label>
                  <div className="option-pills" style={{ justifyContent: 'flex-start' }}>
                    {DIFFICULTY_OPTIONS.map((d) => (
                      <button
                        key={d}
                        className={`pill ${difficulty === d ? 'active-gold' : ''}`}
                        style={difficulty === d ? { background: DIFFICULTY_LABELS[d].color, borderColor: DIFFICULTY_LABELS[d].color, color: '#0a0a1a' } : { padding: '0.3rem 0.8rem', fontSize: '0.7rem' }}
                        onClick={() => setDifficultyLocal(d)}
                        title={DIFFICULTY_LABELS[d].desc}
                      >
                        {DIFFICULTY_LABELS[d].label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="option-group" style={{ alignItems: 'flex-start', marginTop: '1rem' }}>
                  <label>Rounds</label>
                  <div className="option-pills" style={{ justifyContent: 'flex-start' }}>
                    {ROUND_OPTIONS.map((r) => (
                      <button
                        key={r}
                        className={`pill ${rounds === r ? 'active-cyan' : ''}`}
                        style={rounds !== r ? { padding: '0.3rem 0.8rem', fontSize: '0.7rem' } : {}}
                        onClick={() => setRounds(r)}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="option-group" style={{ alignItems: 'flex-start', marginTop: '1rem' }}>
                  <label>Mode</label>
                  <div className="option-pills" style={{ justifyContent: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <button className={`pill ${mode === 'online' ? 'active-cyan' : ''}`} onClick={() => setMode('online')}>🌐 Online</button>
                    <button className={`pill ${mode === 'local' ? 'active-pink' : ''}`} onClick={() => setMode('local')}>📱 Local</button>
                    <button className={`pill ${mode === 'ai' ? 'active-gold' : ''}`} onClick={() => setMode('ai')}>🤖 Vs AI</button>
                  </div>
                </div>
              </div>

              {mode === 'local' && (
                <>
                  <div className="setup-vs-divider">VS</div>
                  <div className="glass setup-card" style={{ borderColor: 'rgba(255,0,128,0.2)' }}>
                    <h3 style={{ color: 'var(--pink)' }}>🔥 Player 2</h3>
                    <div>
                      <input
                        type="text"
                        placeholder="Enter name..."
                        value={hostP2Name}
                        onChange={(e) => setHostP2Name(e.target.value)}
                        maxLength={16}
                        className="input-field"
                        style={{ borderColor: 'rgba(255,0,128,0.3)', marginBottom: '1rem' }}
                      />
                    </div>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ opacity: 0.5, fontSize: '0.8rem', color: 'var(--pink)', textAlign: 'center' }}>Both players will play<br/>on this device!</div>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} className="btn btn-cyan" onClick={handleHost} disabled={loading} style={{ fontSize: '1.1rem', padding: '0.9rem 3rem' }}>
                {loading ? '⏳ Creating...' : (mode === 'local' ? '⚡ Start Local Battle!' : mode === 'ai' ? '🤖 Start AI Battle!' : '🌐 Create Room')}
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div key="join" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="glass setup-card" style={{ maxWidth: '400px', margin: '0 auto', borderColor: 'rgba(255,0,128,0.2)' }}>
              <h3 style={{ color: 'var(--pink)', textAlign: 'center' }}>🤝 Join Room</h3>
              
              <div style={{ marginTop: '1.5rem' }}>
                <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>Your Name</label>
                <input
                  type="text"
                  placeholder="Enter name..."
                  value={joinName}
                  onChange={(e) => setJoinName(e.target.value)}
                  maxLength={16}
                  className="input-field"
                  style={{ borderColor: 'rgba(255,0,128,0.3)', marginBottom: '1.5rem' }}
                />

                <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>Game Code</label>
                <input
                  type="text"
                  placeholder="e.g. ABCD"
                  value={joinCodeInput}
                  onChange={(e) => setJoinCodeInput(e.target.value.toUpperCase())}
                  maxLength={4}
                  className="input-field"
                  style={{ borderColor: 'rgba(255,0,128,0.3)', fontFamily: 'var(--font-display)', letterSpacing: '0.2em', textTransform: 'uppercase', textAlign: 'center', fontSize: '1.2rem' }}
                />
              </div>

              <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} className="btn btn-pink" onClick={handleJoin} disabled={loading} style={{ fontSize: '1.1rem', padding: '0.9rem 3rem', width: '100%' }}>
                  {loading ? '⏳ Joining...' : '🎯 Join Battle!'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <div style={{ background: 'rgba(255,68,68,0.15)', border: '1px solid rgba(255,68,68,0.4)', borderRadius: '10px', padding: '0.6rem 1.2rem', color: '#ff8888', fontSize: '0.8rem', fontFamily: 'var(--font-body)', maxWidth: '500px', margin: '1rem auto 0', textAlign: 'center' }}>
          ⚠️ {error}
        </div>
      )}
      </div>
    </div>
  );
}
