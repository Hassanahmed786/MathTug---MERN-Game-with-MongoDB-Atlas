import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { usePlayerStore } from '../store/usePlayerStore';
import BackgroundEffects from '../components/BackgroundEffects';

export default function Home() {
  const navigate = useNavigate();
  const { level, xp } = usePlayerStore();

  const BUTTONS = [
    { id: 'home-start-btn',       label: '⚡ Start Game',      onClick: () => navigate('/age-select'), color: 'btn-cyan' },
    { id: 'home-join-btn',        label: '🤝 Join Room',       onClick: () => navigate('/setup?tab=join'), color: 'btn-green' },
    { id: 'home-leaderboard-btn', label: '📊 Leaderboard',    onClick: () => navigate('/leaderboard'), color: 'btn-ghost' },
    { id: 'home-about-btn',       label: 'ℹ️ About',           onClick: () => navigate('/about'), color: 'btn-ghost' },
  ];

  return (
    <div
      className="stars-bg"
      style={{
        width: '100%',
        height: '100dvh',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <BackgroundEffects />

      {/* Level badge — top right */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        style={{
          position: 'absolute',
          top: 'clamp(6px, 1.5vh, 16px)',
          right: 'clamp(8px, 1.5vw, 20px)',
          zIndex: 100,
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.1)',
          padding: 'clamp(0.3rem, 0.8vh, 0.7rem) clamp(0.5rem, 1.2vw, 1rem)',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: 'clamp(0.3rem, 0.8vw, 0.7rem)',
        }}
      >
        <div style={{
          width: 'clamp(28px, 5vh, 38px)',
          height: 'clamp(28px, 5vh, 38px)',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--gold), #aa8800)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: '900', color: '#0a0a1a',
          fontSize: 'clamp(0.7rem, 1.8vh, 1rem)',
          boxShadow: '0 0 16px rgba(255,215,0,0.5)',
        }}>
          {level}
        </div>
        <div>
          <div style={{ fontSize: 'clamp(0.52rem, 1.1vh, 0.65rem)', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.04em' }}>LVL {level}</div>
          <div style={{ fontSize: 'clamp(0.65rem, 1.5vh, 0.9rem)', color: 'var(--gold)', fontWeight: 700 }}>{xp} XP</div>
        </div>
      </motion.div>

      {/* Main two-column layout: logo LEFT, buttons RIGHT */}
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'clamp(1.5rem, 5vw, 5rem)',
        width: '100%',
        maxWidth: '1000px',
        padding: '0 clamp(0.8rem, 3vw, 2.5rem)',
        zIndex: 10,
      }}>

        {/* ── LEFT: Logo + Player preview ── */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 15 }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'clamp(0.4rem, 1.5vh, 1.2rem)',
            flex: '0 0 auto',
          }}
        >
          {/* Rope icon */}
          <motion.div
            animate={{ rotate: [-5, 5, -5], y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              fontSize: 'clamp(2rem, 7vh, 4.5rem)',
              filter: 'drop-shadow(0 0 16px rgba(0,245,255,0.4))',
              lineHeight: 1,
            }}
          >
            🪢
          </motion.div>

          <h1 className="home-logo">MathTug</h1>
          <p className="home-subtitle">⚔️ Tug-of-War Number Battle ⚔️</p>

          {/* Animated underline */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 'clamp(100px, 20vw, 200px)' }}
            transition={{ delay: 0.4, duration: 0.8, type: 'spring' }}
            style={{
              height: '2px',
              background: 'linear-gradient(90deg, var(--cyan), var(--gold), var(--pink))',
              borderRadius: '2px',
              boxShadow: '0 0 12px rgba(255,215,0,0.5)',
            }}
          />

          {/* Player avatars */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'clamp(0.8rem, 2vw, 1.8rem)',
            marginTop: 'clamp(0.2rem, 0.8vh, 0.6rem)',
          }}>
            <motion.div
              animate={{ x: [-4, 0, -4], y: [0, -3, 0] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              style={{
                width: 'clamp(44px, 8vh, 72px)',
                height: 'clamp(44px, 8vh, 72px)',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--cyan), #004466)',
                border: 'clamp(2px, 0.4vh, 3px) solid var(--cyan)',
                boxShadow: '0 0 20px var(--cyan-glow)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 'clamp(1.2rem, 3.5vh, 2.2rem)',
              }}
            >🧠</motion.div>

            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 1.4, repeat: Infinity }}
              className="home-vs"
              style={{ fontSize: 'clamp(0.9rem, 2.5vh, 1.4rem)', margin: 0 }}
            >VS</motion.div>

            <motion.div
              animate={{ x: [4, 0, 4], y: [0, -3, 0] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              style={{
                width: 'clamp(44px, 8vh, 72px)',
                height: 'clamp(44px, 8vh, 72px)',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--pink), #440022)',
                border: 'clamp(2px, 0.4vh, 3px) solid var(--pink)',
                boxShadow: '0 0 20px var(--pink-glow)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 'clamp(1.2rem, 3.5vh, 2.2rem)',
              }}
            >🎯</motion.div>
          </div>
        </motion.div>

        {/* ── RIGHT: CTA Buttons + Feature pills ── */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 15, delay: 0.15 }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'clamp(0.35rem, 1.2vh, 0.9rem)',
            alignItems: 'stretch',
            flex: '0 0 auto',
            minWidth: 'clamp(170px, 30vw, 260px)',
          }}
        >
          {BUTTONS.map((btn, i) => (
            <motion.button
              key={btn.id}
              id={btn.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.08, type: 'spring' }}
              whileHover={{ scale: 1.04, x: 4 }}
              whileTap={{ scale: 0.96 }}
              onClick={btn.onClick}
              className={`btn ${btn.color === 'btn-green' ? 'btn-ghost' : btn.color}`}
              style={{
                width: '100%',
                textAlign: 'left',
                padding: 'clamp(0.4rem, 1.4vh, 0.85rem) clamp(0.8rem, 2vw, 1.5rem)',
                fontSize: 'clamp(0.65rem, 1.8vh, 0.95rem)',
                fontWeight: '800',
                letterSpacing: '0.06em',
                minHeight: 'unset',
                ...(btn.color === 'btn-green' ? {
                  border: '2px solid rgba(0,255,136,0.4)',
                  color: '#00ff88',
                } : {}),
              }}
            >
              {btn.label}
            </motion.button>
          ))}

          {/* Feature pills */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'clamp(0.2rem, 0.6vh, 0.45rem)',
            marginTop: 'clamp(0.1rem, 0.5vh, 0.4rem)',
          }}>
            {['⚡ Multiplayer', '🤖 AI Mode', '🏆 Ranks', '🎵 Sound'].map((feat, i) => (
              <motion.span
                key={feat}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.55 + i * 0.08 }}
                style={{
                  fontSize: 'clamp(0.5rem, 1.2vh, 0.72rem)',
                  padding: 'clamp(0.15rem, 0.5vh, 0.35rem) clamp(0.4rem, 1vw, 0.8rem)',
                  borderRadius: '50px',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: 'var(--text-muted)',
                  fontWeight: '600',
                  whiteSpace: 'nowrap',
                }}
              >
                {feat}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
