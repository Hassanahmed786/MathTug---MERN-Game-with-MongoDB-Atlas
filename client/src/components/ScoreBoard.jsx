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
    <div className="score-column">
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
  const ropePositionPercent = ((scores?.player2 || 0) - (scores?.player1 || 0)) / totalRounds;
  const cyanWidth = Math.max(5, (scores?.player1 || 0) / totalRounds * 100);
  const pinkWidth = Math.max(5, (scores?.player2 || 0) / totalRounds * 100);

  return (
    <div className="scoreboard-container">
      <ScoreColumn
        player="player1"
        name={player1 || 'Player 1'}
        score={scores?.player1 || 0}
        roundHistory={roundHistory || []}
        totalRounds={totalRounds || 10}
      />

      {/* Enhanced Tug Visual */}
      <div className="tug-visual">
        {/* Rope tug bar */}
        <div style={{
          width: '100%',
          height: '24px',
          background: 'linear-gradient(90deg, rgba(0,245,255,0.1) 0%, rgba(255,0,128,0.1) 100%)',
          border: '2px solid rgba(255,255,255,0.2)',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)',
          position: 'relative',
        }}>
          {/* P1 side */}
          <div style={{
            position: 'absolute',
            left: '0',
            top: '0',
            height: '100%',
            width: `${cyanWidth}%`,
            background: 'linear-gradient(90deg, var(--cyan), #00a8b5)',
            boxShadow: '0 0 20px var(--cyan-glow)',
            transition: 'width 0.3s ease',
            borderRadius: '10px 0 0 10px',
          }} />
          {/* P2 side */}
          <div style={{
            position: 'absolute',
            right: '0',
            top: '0',
            height: '100%',
            width: `${pinkWidth}%`,
            background: 'linear-gradient(90deg, #cc0066, var(--pink))',
            boxShadow: 'inset 0 0 20px var(--pink-glow)',
            transition: 'width 0.3s ease',
            borderRadius: '0 10px 10px 0',
          }} />
          {/* Center knot */}
          <div style={{
            position: 'absolute',
            left: `${50 + ropePositionPercent * 25}%`,
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: '8px',
            height: '100%',
            background: 'linear-gradient(90deg, var(--cyan), var(--pink))',
            boxShadow: '0 0 15px rgba(255,255,255,0.8), 0 0 30px rgba(255,215,0,0.5)',
            transition: 'left 0.3s ease',
            borderRadius: '2px',
            zIndex: 10,
          }} />
        </div>
        {/* VS text */}
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: '0.9rem',
          fontWeight: '900',
          color: 'var(--gold)',
          textShadow: '0 0 12px rgba(255,215,0,0.5)',
          letterSpacing: '0.1em',
        }}>VS</div>
      </div>

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
