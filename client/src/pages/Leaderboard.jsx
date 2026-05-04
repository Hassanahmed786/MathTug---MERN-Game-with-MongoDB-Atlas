import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';

const DIFFICULTY_COLORS = {
  easy: '#00ff88',
  medium: '#ffd700',
  hard: '#ff4444',
};

function WinnerBadge({ winner, player1, player2 }) {
  if (winner === 'draw') {
    return <span style={{ color: 'var(--gold)', fontWeight: '700' }}>🤝 Draw</span>;
  }
  const name = winner === 'player1' ? player1 : player2;
  const color = winner === 'player1' ? 'var(--cyan)' : 'var(--pink)';
  return (
    <span style={{ color, fontWeight: '700' }}>
      🏆 {name}
    </span>
  );
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

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.07 } },
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 200, damping: 22 } },
  };

  return (
    <div className="leaderboard-page stars-bg">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center', marginBottom: '1.5rem', width: '100%' }}
      >
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.6rem, 3.5vw, 2.5rem)',
          fontWeight: '900',
          background: 'linear-gradient(135deg, var(--cyan), var(--gold), var(--pink))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: '0.06em',
        }}>
          📊 Leaderboard
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontFamily: 'var(--font-body)', marginTop: '0.3rem' }}>
          Recent completed games
        </p>
      </motion.div>

      {/* Back button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        whileTap={{ scale: 0.95 }}
        className="btn btn-ghost"
        onClick={() => navigate('/')}
        style={{ marginBottom: '1.5rem', fontSize: '0.85rem', padding: '0.5rem 1.2rem' }}
      >
        ← Back to Home
      </motion.button>

      {/* Loading */}
      {loading && (
        <div style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-body)', textAlign: 'center', padding: '2rem' }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            style={{ fontSize: '2rem', display: 'inline-block' }}
          >⏳</motion.div>
          <div style={{ marginTop: '0.5rem' }}>Loading...</div>
        </div>
      )}

      {/* Error */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            background: 'rgba(255,68,68,0.12)',
            border: '1px solid rgba(255,68,68,0.3)',
            borderRadius: '12px',
            padding: '1rem 1.5rem',
            color: '#ff8888',
            fontFamily: 'var(--font-body)',
            fontSize: '0.9rem',
            maxWidth: '500px',
          }}
        >
          ⚠️ {error}
        </motion.div>
      )}

      {/* Empty state */}
      {!loading && !error && games.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            textAlign: 'center',
            padding: '3rem',
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-body)',
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎮</div>
          <div style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>No games played yet!</div>
          <div style={{ fontSize: '0.85rem', opacity: 0.7 }}>Start a new game to see results here.</div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="btn btn-cyan"
            onClick={() => navigate('/setup')}
            style={{ marginTop: '1.5rem', fontSize: '0.9rem' }}
          >
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
        >
          <thead>
            <tr>
              <th>#</th>
              <th>Player 1</th>
              <th>Player 2</th>
              <th>Score</th>
              <th>Winner</th>
              <th>Difficulty</th>
              <th>Rounds</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {games.map((game, idx) => (
              <motion.tr key={game.gameId || idx} className="data-row" variants={rowVariants}>
                <td style={{ fontFamily: 'var(--font-display)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {idx + 1}
                </td>
                <td style={{ color: 'var(--cyan)', fontWeight: '700' }}>
                  {game.player1?.name || 'P1'}
                </td>
                <td style={{ color: 'var(--pink)', fontWeight: '700' }}>
                  {game.player2?.name || 'P2'}
                </td>
                <td style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--cyan)' }}>{game.player1?.score ?? 0}</span>
                  <span style={{ color: 'var(--text-muted)', margin: '0 0.4rem' }}>–</span>
                  <span style={{ color: 'var(--pink)' }}>{game.player2?.score ?? 0}</span>
                </td>
                <td>
                  <WinnerBadge
                    winner={game.winner}
                    player1={game.player1?.name}
                    player2={game.player2?.name}
                  />
                </td>
                <td>
                  <span style={{
                    fontSize: '0.75rem',
                    padding: '0.15rem 0.6rem',
                    borderRadius: '50px',
                    background: `${DIFFICULTY_COLORS[game.difficulty] || '#fff'}22`,
                    border: `1px solid ${DIFFICULTY_COLORS[game.difficulty] || '#fff'}44`,
                    color: DIFFICULTY_COLORS[game.difficulty] || 'var(--text-muted)',
                    fontFamily: 'var(--font-body)',
                    fontWeight: '700',
                    textTransform: 'capitalize',
                  }}>
                    {game.difficulty || 'medium'}
                  </span>
                </td>
                <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  {game.totalRounds}
                </td>
                <td style={{ color: 'var(--text-muted)', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
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
  );
}
