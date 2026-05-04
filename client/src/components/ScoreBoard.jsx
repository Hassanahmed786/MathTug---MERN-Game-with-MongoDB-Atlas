import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function FloatingParticle({ id, player }) {
  return (
    <motion.div
      key={id}
      initial={{ opacity: 1, y: 0, scale: 1 }}
      animate={{ opacity: 0, y: -60, scale: 1.4 }}
      transition={{ duration: 1.1, ease: 'easeOut' }}
      style={{
        position: 'absolute',
        top: '-5px',
        right: player === 'player1' ? 'auto' : '10px',
        left: player === 'player1' ? '10px' : 'auto',
        fontFamily: 'var(--font-display)',
        fontSize: '1.1rem',
        fontWeight: '700',
        color: player === 'player1' ? 'var(--cyan)' : 'var(--pink)',
        textShadow: player === 'player1'
          ? '0 0 10px var(--cyan)'
          : '0 0 10px var(--pink)',
        pointerEvents: 'none',
        zIndex: 50,
      }}
    >
      +1
    </motion.div>
  );
}

function ScoreColumn({ player, name, score, roundHistory, totalRounds }) {
  const isCyan = player === 'player1';
  const accent = isCyan ? 'var(--cyan)' : 'var(--pink)';
  const accentGlow = isCyan ? 'var(--cyan-glow)' : 'var(--pink-glow)';
  const prevScore = useRef(score);
  const [particles, setParticles] = useState([]);
  const particleId = useRef(0);

  useEffect(() => {
    if (score > prevScore.current) {
      const id = ++particleId.current;
      setParticles((p) => [...p, id]);
      setTimeout(() => setParticles((p) => p.filter((x) => x !== id)), 1200);
    }
    prevScore.current = score;
  }, [score]);

  // Build dot indicators
  const dots = Array.from({ length: totalRounds }, (_, i) => {
    const entry = roundHistory[i];
    if (!entry) return 'empty';
    if (entry.winner === player) return 'won';
    if (entry.winner === 'draw' || entry.winner === 'timeout' || entry.winner === 'both_wrong') return 'draw';
    return 'lost';
  });

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '0.4rem',
      position: 'relative',
    }}>
      {/* Floating particles */}
      {particles.map((id) => (
        <FloatingParticle key={id} id={id} player={player} />
      ))}

      {/* Player name */}
      <div style={{
        fontFamily: 'var(--font-body)',
        fontSize: '0.75rem',
        fontWeight: '700',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: 'var(--text-muted)',
      }}>
        {name}
      </div>

      {/* Score number */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={score}
          initial={{ scale: 1.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 4vw, 3.5rem)',
            fontWeight: '900',
            color: accent,
            textShadow: `0 0 20px ${accentGlow}, 0 0 40px ${accentGlow}`,
            lineHeight: 1,
          }}
        >
          {score}
        </motion.div>
      </AnimatePresence>

      {/* Round dots */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.25rem',
        justifyContent: 'center',
        maxWidth: '120px',
      }}>
        {dots.map((status, i) => (
          <motion.div
            key={i}
            initial={status !== 'empty' ? { scale: 0 } : false}
            animate={{ scale: 1 }}
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: status === 'won'
                ? accent
                : status === 'draw'
                  ? 'var(--gold)'
                  : status === 'lost'
                    ? 'rgba(255,255,255,0.15)'
                    : 'rgba(255,255,255,0.08)',
              border: `1px solid ${status === 'won' ? accent : 'rgba(255,255,255,0.15)'}`,
              boxShadow: status === 'won' ? `0 0 6px ${accentGlow}` : 'none',
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function ScoreBoard({ player1, player2, scores, roundHistory, totalRounds }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr auto 1fr',
      alignItems: 'center',
      width: '100%',
      padding: '0.75rem 1rem',
      gap: '0.5rem',
    }}>
      <ScoreColumn
        player="player1"
        name={player1 || 'Player 1'}
        score={scores?.player1 || 0}
        roundHistory={roundHistory || []}
        totalRounds={totalRounds || 10}
      />

      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: '0.9rem',
        fontWeight: '900',
        color: 'var(--gold)',
        textShadow: '0 0 12px rgba(255,215,0,0.5)',
        letterSpacing: '0.1em',
      }}>VS</div>

      <ScoreColumn
        player="player2"
        name={player2 || 'Player 2'}
        score={scores?.player2 || 0}
        roundHistory={roundHistory || []}
        totalRounds={totalRounds || 10}
      />
    </div>
  );
}
