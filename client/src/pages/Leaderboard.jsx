import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || (typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'http://localhost:5001' : '');

const DIFFICULTY_COLORS = {
  easy: '#00ff88',
  medium: '#ffd700',
  hard: '#ff4444',
};

function WinnerBadge({ winner, player1, player2 }) {
  if (winner === 'draw') return <span style={{ color: 'var(--gold)', fontWeight: 700 }}>🤝 Draw</span>;
  const name = winner === 'player1' ? player1 : player2;
  const color = winner === 'player1' ? 'var(--cyan)' : 'var(--pink)';
  return <span style={{ color, fontWeight: 700 }}>🏆 {name}</span>;
}

export default function Leaderboard() {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const { data } = await axios.get(`${SERVER_URL}/api/game/history`);
        setGames(data.games || []);
      } catch (err) {
        console.error(err);
        setError('Could not load leaderboard. Is the server running?');
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, []);

  const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };
  const rowVariants = { hidden: { opacity: 0, x: -24 }, visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 200, damping: 22 } } };

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
      }}
    >
      {/* Top decorative line */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, var(--cyan), var(--gold), var(--pink), transparent)', zIndex: 5, pointerEvents: 'none' }} />

      {/* Fixed top bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 'clamp(0.3rem, 1.2vh, 0.9rem) clamp(0.6rem, 2vw, 1.5rem)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        flexShrink: 0,
        position: 'relative',
        zIndex: 10,
        background: 'rgba(10,10,26,0.3)',
        backdropFilter: 'blur(10px)',
      }}>
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileTap={{ scale: 0.95 }}
          className="btn btn-ghost"
          onClick={() => navigate('/')}
          style={{
            fontSize: 'clamp(0.52rem, 1.3vh, 0.78rem)',
            padding: 'clamp(0.18rem, 0.6vh, 0.42rem) clamp(0.5rem, 1.3vw, 0.9rem)',
            minHeight: 'unset',
          }}
        >
          ← Home
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', flex: 1 }}
        >
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(0.85rem, 2.5vh, 1.8rem)',
            fontWeight: 900,
            background: 'linear-gradient(135deg, var(--cyan), var(--gold), var(--pink))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '0.06em',
            margin: 0,
          }}>
            📊 Leaderboard
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 'clamp(0.44rem, 1vh, 0.65rem)', fontFamily: 'var(--font-body)', margin: 0, marginTop: '2px' }}>
            Recent completed games
          </p>
        </motion.div>

        <div style={{ width: 'clamp(50px, 8vw, 80px)' }} />{/* spacer */}
      </div>

      {/* Scrollable table area */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        overflowX: 'auto',
        position: 'relative',
        zIndex: 10,
        padding: 'clamp(0.3rem, 1vh, 0.8rem) clamp(0.5rem, 1.5vw, 1.2rem)',
      }}>
        {/* Loading */}
        {loading && (
          <div style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-body)', textAlign: 'center', padding: '2rem' }}>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }} style={{ fontSize: 'clamp(1.2rem, 3vh, 2rem)', display: 'inline-block' }}>⏳</motion.div>
            <div style={{ marginTop: '0.5rem', fontSize: 'clamp(0.6rem, 1.5vh, 0.9rem)' }}>Loading...</div>
          </div>
        )}

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ background: 'rgba(255,68,68,0.12)', border: '1px solid rgba(255,68,68,0.3)', borderRadius: '12px', padding: 'clamp(0.5rem, 1.5vh, 1rem) clamp(0.8rem, 2vw, 1.5rem)', color: '#ff8888', fontFamily: 'var(--font-body)', fontSize: 'clamp(0.6rem, 1.5vh, 0.9rem)', maxWidth: '500px', margin: '0 auto' }}
          >
            ⚠️ {error}
          </motion.div>
        )}

        {/* Empty state */}
        {!loading && !error && games.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ textAlign: 'center', padding: 'clamp(1rem, 4vh, 3rem)', color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}
          >
            <div style={{ fontSize: 'clamp(1.5rem, 4vh, 3rem)', marginBottom: 'clamp(0.4rem, 1vh, 1rem)' }}>🎮</div>
            <div style={{ fontSize: 'clamp(0.7rem, 1.8vh, 1.1rem)', marginBottom: '0.5rem' }}>No games played yet!</div>
            <div style={{ fontSize: 'clamp(0.55rem, 1.3vh, 0.85rem)', opacity: 0.7, marginBottom: 'clamp(0.5rem, 1.5vh, 1.5rem)' }}>Start a new game to see results here.</div>
            <motion.button whileTap={{ scale: 0.95 }} className="btn btn-cyan" onClick={() => navigate('/setup')} style={{ fontSize: 'clamp(0.6rem, 1.5vh, 0.9rem)', padding: 'clamp(0.3rem, 0.9vh, 0.6rem) clamp(1rem, 3vw, 2rem)', minHeight: 'unset' }}>
              ⚡ Play Now
            </motion.button>
          </motion.div>
        )}

        {/* Table */}
        {!loading && games.length > 0 && (
          <motion.table
            className="leaderboard-table"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{ width: '100%', minWidth: 'clamp(500px, 80vw, 900px)' }}
          >
            <thead>
              <tr>
                {['#', 'Player 1', 'Player 2', 'Score', 'Winner', 'Difficulty', 'Rounds', 'Date'].map(h => (
                  <th key={h} style={{ fontSize: 'clamp(0.44rem, 1.1vh, 0.7rem)', padding: 'clamp(0.2rem, 0.6vh, 0.5rem) clamp(0.3rem, 0.8vw, 1rem)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {games.map((game, idx) => (
                <motion.tr key={game.gameId || idx} className="data-row" variants={rowVariants}>
                  <td style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(0.5rem, 1.2vh, 0.8rem)', color: 'var(--text-muted)', padding: 'clamp(0.3rem, 0.9vh, 0.9rem) clamp(0.3rem, 0.8vw, 1rem)' }}>{idx + 1}</td>
                  <td style={{ color: 'var(--cyan)', fontWeight: 700, fontSize: 'clamp(0.5rem, 1.2vh, 0.85rem)', padding: 'clamp(0.3rem, 0.9vh, 0.9rem) clamp(0.3rem, 0.8vw, 1rem)' }}>{game.player1?.name || 'P1'}</td>
                  <td style={{ color: 'var(--pink)', fontWeight: 700, fontSize: 'clamp(0.5rem, 1.2vh, 0.85rem)', padding: 'clamp(0.3rem, 0.9vh, 0.9rem) clamp(0.3rem, 0.8vw, 1rem)' }}>{game.player2?.name || 'P2'}</td>
                  <td style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(0.5rem, 1.2vh, 0.9rem)', padding: 'clamp(0.3rem, 0.9vh, 0.9rem) clamp(0.3rem, 0.8vw, 1rem)' }}>
                    <span style={{ color: 'var(--cyan)' }}>{game.player1?.score ?? 0}</span>
                    <span style={{ color: 'var(--text-muted)', margin: '0 0.3rem' }}>–</span>
                    <span style={{ color: 'var(--pink)' }}>{game.player2?.score ?? 0}</span>
                  </td>
                  <td style={{ fontSize: 'clamp(0.5rem, 1.2vh, 0.85rem)', padding: 'clamp(0.3rem, 0.9vh, 0.9rem) clamp(0.3rem, 0.8vw, 1rem)' }}>
                    <WinnerBadge winner={game.winner} player1={game.player1?.name} player2={game.player2?.name} />
                  </td>
                  <td style={{ padding: 'clamp(0.3rem, 0.9vh, 0.9rem) clamp(0.3rem, 0.8vw, 1rem)' }}>
                    <span style={{
                      fontSize: 'clamp(0.44rem, 1.1vh, 0.75rem)',
                      padding: 'clamp(0.08rem, 0.3vh, 0.15rem) clamp(0.3rem, 0.7vw, 0.6rem)',
                      borderRadius: '50px',
                      background: `${DIFFICULTY_COLORS[game.difficulty] || '#fff'}22`,
                      border: `1px solid ${DIFFICULTY_COLORS[game.difficulty] || '#fff'}44`,
                      color: DIFFICULTY_COLORS[game.difficulty] || 'var(--text-muted)',
                      fontFamily: 'var(--font-body)',
                      fontWeight: 700,
                      textTransform: 'capitalize',
                    }}>
                      {game.difficulty || 'medium'}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: 'clamp(0.46rem, 1.1vh, 0.82rem)', padding: 'clamp(0.3rem, 0.9vh, 0.9rem) clamp(0.3rem, 0.8vw, 1rem)' }}>{game.totalRounds}</td>
                  <td style={{ color: 'var(--text-muted)', fontSize: 'clamp(0.44rem, 1vh, 0.75rem)', whiteSpace: 'nowrap', padding: 'clamp(0.3rem, 0.9vh, 0.9rem) clamp(0.3rem, 0.8vw, 1rem)' }}>
                    {game.finishedAt
                      ? new Date(game.finishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                      : '—'}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </motion.table>
        )}
      </div>
    </div>
  );
}
