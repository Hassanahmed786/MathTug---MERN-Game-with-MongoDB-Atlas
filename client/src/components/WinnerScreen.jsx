import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { playFanfare } from '../utils/soundEffects';
import { usePlayerStore } from '../store/usePlayerStore';

export default function WinnerScreen({ winner, winnerName, scores, playerNames, onPlayAgain, onRematchRequest, isRematchRequested, playerId }) {
  const isCyan = winner === 'player1';
  const isDraw = winner === 'draw';

  const winnerColor = isDraw ? '#ffd700' : isCyan ? 'var(--cyan)' : 'var(--pink)';
  const winnerGlow = isDraw
    ? 'rgba(255,215,0,0.5)'
    : isCyan ? 'rgba(0,245,255,0.5)' : 'rgba(255,0,128,0.5)';

  const { xp, level, addXp, recordMatch } = usePlayerStore();
  const [xpGained, setXpGained] = useState(0);

  useEffect(() => {
    if (playerId === 'player1' || playerId === 'player2') {
      const myScore = playerId === 'player1' ? scores?.player1 : scores?.player2;
      const isWin = winner === playerId;
      const earned = (myScore * 10) + (isWin ? 50 : 0) + (isDraw ? 20 : 0);
      setXpGained(earned);
      addXp(earned);
      recordMatch(isWin);
    }

    // Confetti burst
    const fire = () => {
      confetti({
        particleCount: 300,
        spread: 120,
        origin: { y: 0.4 },
        colors: isDraw
          ? ['#ffd700', '#ffaa00', '#ffffff']
          : isCyan
            ? ['#00f5ff', '#00c4cc', '#ffffff', '#00ff88']
            : ['#ff0080', '#cc0066', '#ffffff', '#ff88cc'],
        startVelocity: 45,
        gravity: 0.8,
        ticks: 200,
      });
    };

    fire();
    const t1 = setTimeout(fire, 700);
    playFanfare();

    return () => clearTimeout(t1);
  }, []); // eslint-disable-line

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: `radial-gradient(ellipse at center, ${winnerGlow} 0%, rgba(10,10,26,0.97) 65%)`,
        backdropFilter: 'blur(4px)',
      }}
    >
      {/* Big burst circle */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.3, 1], opacity: [0, 0.3, 0] }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        style={{
          position: 'absolute',
          width: 'min(150vw, 600px)',
          height: 'min(150vw, 600px)',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${winnerColor} 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      {/* Avatar */}
      <motion.div
        animate={{
          y: [0, -20, 0, -14, 0, -8, 0],
          rotate: [0, -5, 5, -3, 3, 0],
        }}
        transition={{ duration: 1.6, ease: 'easeInOut', repeat: 1 }}
        style={{
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${winnerColor}, rgba(255,255,255,0.2))`,
          border: `3px solid ${winnerColor}`,
          boxShadow: `0 0 40px ${winnerGlow}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '3rem',
          marginBottom: '1.5rem',
        }}
      >
        {isDraw ? '🤝' : '🏆'}
      </motion.div>

      {/* Winner Label */}
      <motion.div
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 14, delay: 0.3 }}
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(0.75rem, 1.5vw, 1rem)',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
          marginBottom: '0.3rem',
        }}
      >
        {isDraw ? 'It\'s a Tie!' : '🎉 Winner'}
      </motion.div>

      {/* Winner Name */}
      <motion.h1
        initial={{ scale: 0.3, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 220, damping: 12, delay: 0.5 }}
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2.5rem, 6vw, 5rem)',
          fontWeight: '900',
          color: winnerColor,
          textShadow: `0 0 30px ${winnerGlow}, 0 0 60px ${winnerGlow}`,
          letterSpacing: '0.06em',
          lineHeight: 1.1,
          textAlign: 'center',
          maxWidth: '80vw',
        }}
      >
        {isDraw ? 'DRAW!' : winnerName?.toUpperCase()}
      </motion.h1>

      {/* Final scores */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        style={{
          display: 'flex',
          gap: '3rem',
          marginTop: '1.5rem',
          alignItems: 'center',
        }}
      >
        {[
          { player: 'player1', name: playerNames?.player1, score: scores?.player1 },
          { player: 'player2', name: playerNames?.player2, score: scores?.player2 },
        ].map(({ player, name, score }) => (
          <div key={player} style={{ textAlign: 'center' }}>
            <div style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: '0.25rem',
            }}>
              {name}
            </div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: '2.5rem',
              fontWeight: '900',
              color: player === 'player1' ? 'var(--cyan)' : 'var(--pink)',
            }}>
              {score}
            </div>
          </div>
        ))}
      </motion.div>

      {/* XP Bar Display */}
      {xpGained > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          style={{
            marginTop: '1.5rem',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            padding: '0.8rem 1.5rem',
            borderRadius: '12px',
            textAlign: 'center',
          }}
        >
          <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Level {level}
          </div>
          <div style={{ color: '#00ff88', fontSize: '1.2rem', fontFamily: 'var(--font-display)', fontWeight: 'bold' }}>
            +{xpGained} XP
          </div>
          <div style={{ width: '150px', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', marginTop: '0.5rem', overflow: 'hidden' }}>
            <motion.div
              initial={{ width: `${((xp - xpGained) % 100)}%` }}
              animate={{ width: `${(xp % 100)}%` }}
              transition={{ duration: 1, delay: 1.2 }}
              style={{ height: '100%', background: '#00ff88', boxShadow: '0 0 8px #00ff88' }}
            />
          </div>
        </motion.div>
      )}

      {/* Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1 }}
        style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem', flexWrap: 'wrap', justifyContent: 'center' }}
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn btn-pink"
          onClick={onRematchRequest}
          disabled={isRematchRequested}
          style={{ minWidth: '160px', opacity: isRematchRequested ? 0.6 : 1 }}
        >
          {isRematchRequested ? '⏳ Waiting...' : '⚔️ Rematch'}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn btn-ghost"
          onClick={onPlayAgain}
          style={{ minWidth: '160px' }}
        >
          🏠 Main Menu
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
