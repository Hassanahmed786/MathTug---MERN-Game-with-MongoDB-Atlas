import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { usePlayerStore } from '../store/usePlayerStore';

// Animated particle
function Particle({ x, y, delay, size, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 0.8, 0],
        scale: [0, 1, 0.5],
        y: [0, -30, -60],
      }}
      transition={{ duration: 3, delay, repeat: Infinity, repeatDelay: Math.random() * 2 }}
      style={{
        position: 'absolute',
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        borderRadius: '50%',
        background: color,
        boxShadow: `0 0 ${size * 2}px ${color}`,
        pointerEvents: 'none',
      }}
    />
  );
}

const particles = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: 30 + Math.random() * 60,
  delay: Math.random() * 4,
  size: 4 + Math.random() * 8,
  color: i % 2 === 0 ? 'rgba(0,245,255,0.7)' : 'rgba(255,0,128,0.7)',
}));

export default function Home() {
  const navigate = useNavigate();
  const { level, xp } = usePlayerStore();

  return (
    <div className="home-page stars-bg">
      {/* Profile Widget */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          zIndex: 100,
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.1)',
          padding: '0.6rem 1rem',
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.8rem',
        }}
      >
        <div style={{
          width: '36px', height: '36px', borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--gold), #aa8800)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: '900', color: '#0a0a1a', fontSize: '1rem',
          boxShadow: '0 0 15px rgba(255,215,0,0.4)',
        }}>
          {level}
        </div>
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>LVL {level}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--gold)', fontWeight: '700' }}>{xp} XP</div>
        </div>
      </motion.div>
      {/* Background particles */}
      {particles.map((p) => (
        <Particle key={p.id} {...p} />
      ))}

      {/* Glow orbs */}
      <div style={{
        position: 'absolute', left: '10%', top: '20%',
        width: '300px', height: '300px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,245,255,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', right: '10%', bottom: '20%',
        width: '300px', height: '300px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,0,128,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -40, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 18 }}
        style={{ textAlign: 'center', zIndex: 10 }}
      >
        {/* Rope icon */}
        <motion.div
          animate={{ rotate: [-3, 3, -3] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}
        >
          🪢
        </motion.div>

        <h1 className="home-logo">MathTug</h1>
        <p className="home-subtitle">Tug-of-War Number Battle</p>
      </motion.div>

      {/* Player preview */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2rem',
          zIndex: 10,
          marginTop: '1rem',
        }}
      >
        {/* P1 avatar */}
        <motion.div
          animate={{ x: [-4, 0, -4] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            width: '70px', height: '70px', borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--cyan), #004466)',
            border: '2px solid var(--cyan)',
            boxShadow: '0 0 20px var(--cyan-glow)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2rem',
          }}
        >🧠</motion.div>

        {/* Rope visual */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
          <motion.div 
            animate={{ scale: [1, 1.1, 1] }} 
            transition={{ duration: 1.5, repeat: Infinity }}
            className="home-vs"
            style={{ margin: '0.5rem 0' }}
          >VS</motion.div>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: 120 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            style={{
              height: '4px',
              background: 'linear-gradient(90deg, var(--cyan), var(--gold), var(--pink))',
              borderRadius: '2px',
              boxShadow: '0 0 10px rgba(255,215,0,0.5)',
            }} 
          />
        </div>

        {/* P2 avatar */}
        <motion.div
          animate={{ x: [4, 0, 4] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            width: '70px', height: '70px', borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--pink), #440022)',
            border: '2px solid var(--pink)',
            boxShadow: '0 0 20px var(--pink-glow)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2rem',
          }}
        >🎯</motion.div>
      </motion.div>

      {/* Feature pills */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center', zIndex: 10, margin: '1rem 0' }}
      >
        {['⚡ Real-time Multiplayer', '🎯 3 Difficulty Levels', '🏆 Leaderboard', '🎵 Sound Effects'].map((feat, index) => (
          <motion.span 
            key={feat} 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + index * 0.1, type: 'spring' }}
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(0.7rem, 2vw, 0.8rem)',
              padding: '0.4rem 1rem',
              borderRadius: '50px',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'var(--text-muted)',
              letterSpacing: '0.05em',
              cursor: 'default',
            }}>
            {feat}
          </motion.span>
        ))}
      </motion.div>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.75 }}
        style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', zIndex: 10 }}
      >
        <motion.button
          id="home-start-btn"
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          className="btn btn-cyan"
          onClick={() => navigate('/setup')}
          style={{ fontSize: '1.05rem', padding: '0.9rem 2.5rem' }}
        >
          ⚡ Start New Game
        </motion.button>
        <motion.button
          id="home-leaderboard-btn"
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          className="btn btn-ghost"
          onClick={() => navigate('/leaderboard')}
          style={{ fontSize: '1.05rem', padding: '0.9rem 2rem' }}
        >
          📊 Leaderboard
        </motion.button>
      </motion.div>
    </div>
  );
}
