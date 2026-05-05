import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import useGameStore from '../store/gameStore';
import { resumeAudio } from '../utils/soundEffects';
import BackgroundEffects from './BackgroundEffects';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || (typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'http://localhost:5001' : '');

const DIFFICULTY_OPTIONS = ['easy', 'medium', 'hard'];
const ROUND_OPTIONS = [5, 10, 15];

const DIFFICULTY_LABELS = {
  easy:   { label: 'Easy',   desc: '1–9, +/−',      color: '#00ff88' },
  medium: { label: 'Medium', desc: '1–49, all ops',  color: '#ffd700' },
  hard:   { label: 'Hard',   desc: '1–99, all ops',  color: '#ff4444' },
};

export default function PlayerSetup() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setGameId, setJoinCode, setPlayerId, setIsLocal, setPlayerNames, setDifficulty, setTotalRounds, setPhase } = useGameStore();

  const initialTab = new URLSearchParams(location.search).get('tab') === 'join' ? 'join' : 'host';
  const [activeTab, setActiveTab] = useState(initialTab);

  const [hostName, setHostName] = useState('');
  const [difficulty, setDifficultyLocal] = useState('medium');
  const [rounds, setRounds] = useState(10);
  const [mode, setMode] = useState('online');
  const [hostP2Name, setHostP2Name] = useState('');

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
        player1Name: name1, player2Name: name2, totalRounds: rounds, difficulty, isLocal: isLocalGame,
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
    if (!code) { setError('Please enter a Game Code.'); return; }
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.post(`${SERVER_URL}/api/game/join`, { joinCode: code, player2Name: name2 });
      if (!data.success) throw new Error(data.error || 'Failed to join game');
      setGameId(data.gameId);
      setJoinCode(code);
      setPlayerId('player2');
      setIsLocal(false);
      setPhase('waiting');
      navigate(`/game/${data.gameId}`);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Game not found or already started.');
    } finally {
      setLoading(false);
    }
  }

  const inputStyle = {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '8px',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-body)',
    fontSize: 'clamp(0.6rem, 1.5vh, 0.9rem)',
    fontWeight: 600,
    padding: 'clamp(0.25rem, 0.8vh, 0.55rem) clamp(0.4rem, 1vw, 0.7rem)',
    width: '100%',
    outline: 'none',
  };

  const labelStyle = {
    fontSize: 'clamp(0.44rem, 1vh, 0.62rem)',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: 'var(--text-muted)',
    display: 'block',
    marginBottom: 'clamp(0.15rem, 0.4vh, 0.3rem)',
    fontWeight: 700,
  };

  const pillStyle = (active, color) => ({
    fontFamily: 'var(--font-display)',
    fontSize: 'clamp(0.48rem, 1.1vh, 0.68rem)',
    padding: 'clamp(0.18rem, 0.5vh, 0.35rem) clamp(0.4rem, 0.9vw, 0.7rem)',
    borderRadius: '50px',
    border: active ? `1px solid ${color}` : '1px solid rgba(255,255,255,0.15)',
    background: active ? color : 'transparent',
    color: active ? '#0a0a1a' : 'var(--text-muted)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    minHeight: 'unset',
    fontWeight: 700,
  });

  const sectionGap = { marginTop: 'clamp(0.3rem, 0.9vh, 0.65rem)' };

  return (
    <div
      className="stars-bg"
      style={{
        width: '100%',
        height: '100dvh',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <BackgroundEffects />

      {/* Top line */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, var(--cyan), var(--pink), transparent)', zIndex: 5 }} />

      {/* Back Button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => navigate('/age-select')}
        style={{
          position: 'absolute',
          top: 'clamp(6px, 1.5vh, 14px)',
          left: 'clamp(8px, 1.5vw, 18px)',
          background: 'rgba(255,255,255,0.05)',
          border: '1.5px solid rgba(255,255,255,0.2)',
          color: 'var(--text-primary)',
          padding: 'clamp(0.18rem, 0.6vh, 0.45rem) clamp(0.4rem, 1.2vw, 0.85rem)',
          borderRadius: '50px',
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(0.5rem, 1.3vh, 0.78rem)',
          cursor: 'pointer',
          zIndex: 100,
        }}
      >
        ← Back
      </motion.button>

      {/* Content wrapper */}
      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '860px', padding: '0 clamp(0.5rem, 2vw, 1.5rem)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(0.3rem, 1vh, 0.7rem)' }}>

        {/* Title */}
        <motion.div initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center' }}>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(0.9rem, 2.8vh, 1.8rem)',
            fontWeight: 900,
            background: 'linear-gradient(135deg, var(--cyan), var(--pink))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Player Setup
          </div>
        </motion.div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 'clamp(0.4rem, 1.2vw, 0.9rem)', justifyContent: 'center' }}>
          <motion.button
            whileTap={{ scale: 0.95 }}
            className={`btn ${activeTab === 'host' ? 'btn-cyan' : 'btn-ghost'}`}
            onClick={() => setActiveTab('host')}
            style={{ padding: 'clamp(0.25rem, 0.8vh, 0.55rem) clamp(0.8rem, 2vw, 1.6rem)', fontSize: 'clamp(0.55rem, 1.3vh, 0.8rem)', minHeight: 'unset' }}
          >
            ➕ Host Game
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            className={`btn ${activeTab === 'join' ? 'btn-pink' : 'btn-ghost'}`}
            onClick={() => setActiveTab('join')}
            style={{ padding: 'clamp(0.25rem, 0.8vh, 0.55rem) clamp(0.8rem, 2vw, 1.6rem)', fontSize: 'clamp(0.55rem, 1.3vh, 0.8rem)', minHeight: 'unset' }}
          >
            🤝 Join Game
          </motion.button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'host' ? (
            <motion.div key="host" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }} style={{ width: '100%' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: mode === 'local' ? '1fr auto 1fr' : '1fr',
                gap: 'clamp(0.5rem, 1.5vw, 1.2rem)',
                maxWidth: mode === 'local' ? '760px' : '380px',
                margin: '0 auto',
              }}>

                {/* Card 1 */}
                <div style={{
                  background: 'rgba(0,245,255,0.04)',
                  border: '1px solid rgba(0,245,255,0.15)',
                  borderRadius: 'clamp(8px, 1.5vh, 14px)',
                  padding: 'clamp(0.5rem, 1.5vh, 1.2rem) clamp(0.6rem, 1.8vw, 1.2rem)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'clamp(0.2rem, 0.6vh, 0.45rem)',
                }}>
                  <div style={{ fontSize: 'clamp(0.6rem, 1.5vh, 0.88rem)', fontFamily: 'var(--font-display)', color: 'var(--cyan)', fontWeight: 700, marginBottom: 'clamp(0.1rem, 0.3vh, 0.2rem)' }}>
                    ⚡ {mode === 'local' ? 'Player 1' : 'Your Name'}
                  </div>

                  <div>
                    <label style={labelStyle}>Name</label>
                    <input type="text" placeholder="Enter name..." value={hostName} onChange={e => setHostName(e.target.value)} maxLength={16} style={{ ...inputStyle, borderColor: 'rgba(0,245,255,0.3)' }} className="input-field" />
                  </div>

                  <div style={sectionGap}>
                    <label style={labelStyle}>Difficulty</label>
                    <div style={{ display: 'flex', gap: 'clamp(0.2rem, 0.6vw, 0.45rem)', flexWrap: 'wrap' }}>
                      {DIFFICULTY_OPTIONS.map(d => (
                        <button key={d} style={pillStyle(difficulty === d, DIFFICULTY_LABELS[d].color)} onClick={() => setDifficultyLocal(d)}>
                          {DIFFICULTY_LABELS[d].label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={sectionGap}>
                    <label style={labelStyle}>Rounds</label>
                    <div style={{ display: 'flex', gap: 'clamp(0.2rem, 0.6vw, 0.45rem)' }}>
                      {ROUND_OPTIONS.map(r => (
                        <button key={r} style={pillStyle(rounds === r, 'var(--cyan)')} onClick={() => setRounds(r)}>
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={sectionGap}>
                    <label style={labelStyle}>Mode</label>
                    <div style={{ display: 'flex', gap: 'clamp(0.2rem, 0.6vw, 0.45rem)', flexWrap: 'wrap' }}>
                      <button style={pillStyle(mode === 'online', 'var(--cyan)')} onClick={() => setMode('online')}>🌐 Online</button>
                      <button style={pillStyle(mode === 'local', 'var(--pink)')} onClick={() => setMode('local')}>📱 Local</button>
                      <button style={pillStyle(mode === 'ai', '#ffd700')} onClick={() => setMode('ai')}>🤖 Vs AI</button>
                    </div>
                  </div>
                </div>

                {/* VS divider (local only) */}
                {mode === 'local' && (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: 'clamp(1rem, 2.5vh, 1.8rem)', fontWeight: 900, color: 'var(--gold)', textShadow: '0 0 16px var(--gold)' }}>VS</div>
                    <div style={{
                      background: 'rgba(255,0,128,0.04)',
                      border: '1px solid rgba(255,0,128,0.15)',
                      borderRadius: 'clamp(8px, 1.5vh, 14px)',
                      padding: 'clamp(0.5rem, 1.5vh, 1.2rem) clamp(0.6rem, 1.8vw, 1.2rem)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 'clamp(0.2rem, 0.6vh, 0.45rem)',
                    }}>
                      <div style={{ fontSize: 'clamp(0.6rem, 1.5vh, 0.88rem)', fontFamily: 'var(--font-display)', color: 'var(--pink)', fontWeight: 700 }}>🔥 Player 2</div>
                      <div>
                        <label style={labelStyle}>Name</label>
                        <input type="text" placeholder="Enter name..." value={hostP2Name} onChange={e => setHostP2Name(e.target.value)} maxLength={16} style={{ ...inputStyle, borderColor: 'rgba(255,0,128,0.3)' }} className="input-field" />
                      </div>
                      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ opacity: 0.5, fontSize: 'clamp(0.5rem, 1.2vh, 0.72rem)', color: 'var(--pink)', textAlign: 'center', lineHeight: 1.5 }}>Both players on this device!</div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Start button */}
              <div style={{ textAlign: 'center', marginTop: 'clamp(0.4rem, 1.2vh, 0.9rem)' }}>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="btn btn-cyan"
                  onClick={handleHost}
                  disabled={loading}
                  style={{ fontSize: 'clamp(0.6rem, 1.5vh, 0.9rem)', padding: 'clamp(0.35rem, 1vh, 0.7rem) clamp(1.5rem, 4vw, 3rem)', minHeight: 'unset' }}
                >
                  {loading ? '⏳ Creating...' : (mode === 'local' ? '⚡ Start Local Battle!' : mode === 'ai' ? '🤖 Start AI Battle!' : '🌐 Create Room')}
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div key="join" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} style={{ width: '100%', maxWidth: '380px', margin: '0 auto' }}>
              <div style={{
                background: 'rgba(255,0,128,0.04)',
                border: '1px solid rgba(255,0,128,0.15)',
                borderRadius: 'clamp(8px, 1.5vh, 14px)',
                padding: 'clamp(0.5rem, 1.5vh, 1.2rem) clamp(0.6rem, 1.8vw, 1.2rem)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'clamp(0.3rem, 0.9vh, 0.6rem)',
              }}>
                <div style={{ fontSize: 'clamp(0.65rem, 1.6vh, 0.95rem)', fontFamily: 'var(--font-display)', color: 'var(--pink)', fontWeight: 700, textAlign: 'center' }}>🤝 Join Room</div>

                <div>
                  <label style={labelStyle}>Your Name</label>
                  <input type="text" placeholder="Enter name..." value={joinName} onChange={e => setJoinName(e.target.value)} maxLength={16} style={{ ...inputStyle, borderColor: 'rgba(255,0,128,0.3)' }} className="input-field" />
                </div>

                <div>
                  <label style={labelStyle}>Game Code</label>
                  <input
                    type="text"
                    placeholder="e.g. ABCD"
                    value={joinCodeInput}
                    onChange={e => setJoinCodeInput(e.target.value.toUpperCase())}
                    maxLength={4}
                    style={{ ...inputStyle, borderColor: 'rgba(255,0,128,0.3)', fontFamily: 'var(--font-display)', letterSpacing: '0.2em', textTransform: 'uppercase', textAlign: 'center', fontSize: 'clamp(0.9rem, 2.2vh, 1.4rem)' }}
                    className="input-field"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="btn btn-pink"
                  onClick={handleJoin}
                  disabled={loading}
                  style={{ fontSize: 'clamp(0.6rem, 1.5vh, 0.9rem)', padding: 'clamp(0.35rem, 1vh, 0.7rem) clamp(1rem, 3vw, 2rem)', minHeight: 'unset', width: '100%', marginTop: 'clamp(0.1rem, 0.3vh, 0.2rem)' }}
                >
                  {loading ? '⏳ Joining...' : '🎯 Join Battle!'}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error */}
        {error && (
          <div style={{ background: 'rgba(255,68,68,0.12)', border: '1px solid rgba(255,68,68,0.35)', borderRadius: '8px', padding: 'clamp(0.25rem, 0.7vh, 0.5rem) clamp(0.6rem, 1.5vw, 1rem)', color: '#ff8888', fontSize: 'clamp(0.5rem, 1.2vh, 0.72rem)', fontFamily: 'var(--font-body)', maxWidth: '460px', margin: '0 auto', textAlign: 'center' }}>
            ⚠️ {error}
          </div>
        )}
      </div>
    </div>
  );
}
