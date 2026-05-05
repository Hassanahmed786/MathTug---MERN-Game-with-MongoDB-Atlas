import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { usePlayerStore } from '../store/usePlayerStore';
import BackgroundEffects from '../components/BackgroundEffects';

const STATS = [
  { value: '10K+', label: 'Students' },
  { value: '3', label: 'Age Modes' },
  { value: '∞', label: 'Questions' },
  { value: '#1', label: 'Math Game' },
];

export default function Home() {
  const navigate = useNavigate();
  const { level, xp } = usePlayerStore();

  const BUTTONS = [
    { id: 'home-start-btn',       label: '⚡ Start Game',   onClick: () => navigate('/age-select'), color: 'btn-cyan' },
    { id: 'home-join-btn',        label: '🤝 Join Room',    onClick: () => navigate('/setup?tab=join'), color: 'btn-join' },
    { id: 'home-leaderboard-btn', label: '📊 Leaderboard', onClick: () => navigate('/leaderboard'), color: 'btn-ghost' },
    { id: 'home-about-btn',       label: 'ℹ️ About',        onClick: () => navigate('/about'), color: 'btn-ghost' },
  ];

  return (
    <div
      className="stars-bg home-root"
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

      {/* Decorative corner accents */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '280px', height: '280px', background: 'linear-gradient(135deg, rgba(0,245,255,0.07) 0%, transparent 60%)', pointerEvents: 'none', zIndex: 1 }} />
      <div style={{ position: 'absolute', bottom: 0, right: 0, width: '280px', height: '280px', background: 'linear-gradient(315deg, rgba(255,0,128,0.07) 0%, transparent 60%)', pointerEvents: 'none', zIndex: 1 }} />

      {/* Left decorative strip — hidden on tiny screens via CSS class */}
      <div className="home-deco-strip home-deco-left">
        {['➕', '✖️', '➗', '🟰', '➖'].map((sym, i) => (
          <motion.div
            key={i}
            animate={{ opacity: [0.3, 0.7, 0.3], y: [0, -4, 0] }}
            transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.4 }}
            style={{ fontSize: 'clamp(0.7rem, 1.8vw, 1.3rem)', color: i % 2 === 0 ? 'var(--cyan)' : 'var(--pink)', fontFamily: 'var(--font-display)' }}
          >{sym}</motion.div>
        ))}
      </div>

      {/* Right decorative strip */}
      <div className="home-deco-strip home-deco-right">
        {['🎯', '⚡', '🏆', '🧮', '🤖'].map((sym, i) => (
          <motion.div
            key={i}
            animate={{ opacity: [0.3, 0.7, 0.3], y: [0, -4, 0] }}
            transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.3 + 1 }}
            style={{ fontSize: 'clamp(0.8rem, 1.8vw, 1.2rem)' }}
          >{sym}</motion.div>
        ))}
      </div>

      {/* Top decorative line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, var(--cyan), var(--pink), transparent)', transformOrigin: 'left', zIndex: 5 }}
      />

      {/* Level badge — top right */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        style={{
          position: 'absolute',
          top: 'clamp(8px, 1.5vh, 18px)',
          right: 'clamp(8px, 1.5vw, 20px)',
          zIndex: 100,
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.12)',
          padding: 'clamp(0.2rem, 0.6vh, 0.5rem) clamp(0.4rem, 1vw, 0.8rem)',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          gap: 'clamp(0.3rem, 0.7vw, 0.6rem)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div style={{
          width: 'clamp(22px, 4vh, 36px)',
          height: 'clamp(22px, 4vh, 36px)',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--gold), #aa8800)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: '900', color: '#0a0a1a',
          fontSize: 'clamp(0.6rem, 1.5vh, 0.9rem)',
          boxShadow: '0 0 12px rgba(255,215,0,0.5)',
        }}>
          {level}
        </div>
        <div>
          <div style={{ fontSize: 'clamp(0.45rem, 1vh, 0.6rem)', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.04em' }}>LVL {level}</div>
          <div style={{ fontSize: 'clamp(0.55rem, 1.3vh, 0.8rem)', color: 'var(--gold)', fontWeight: 700 }}>{xp} XP</div>
        </div>
      </motion.div>

      {/* Main layout: logo LEFT | buttons RIGHT */}
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'clamp(1rem, 4vw, 4rem)',
        width: '100%',
        maxWidth: '1100px',
        padding: '0 clamp(0.6rem, 2vw, 2.5rem)',
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
            gap: 'clamp(0.25rem, 1vh, 0.9rem)',
            flex: '0 0 auto',
          }}
        >
          {/* Rope icon */}
          <motion.div
            animate={{ rotate: [-5, 5, -5], y: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            style={{ fontSize: 'clamp(1.4rem, 5vh, 3.8rem)', filter: 'drop-shadow(0 0 16px rgba(0,245,255,0.5))', lineHeight: 1 }}
          >🪢</motion.div>

          <h1 className="home-logo">MathTug</h1>
          <p className="home-subtitle">⚔️ Tug-of-War Number Battle ⚔️</p>

          {/* Animated underline */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 'clamp(80px, 18vw, 200px)' }}
            transition={{ delay: 0.4, duration: 0.8, type: 'spring' }}
            style={{ height: '2px', background: 'linear-gradient(90deg, var(--cyan), var(--gold), var(--pink))', borderRadius: '2px', boxShadow: '0 0 10px rgba(255,215,0,0.4)' }}
          />

          {/* Player avatars */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'clamp(0.6rem, 1.8vw, 1.5rem)',
          }}>
            <motion.div
              animate={{ x: [-3, 0, -3], y: [0, -3, 0] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              style={{
                width: 'clamp(34px, 6.5vh, 64px)',
                height: 'clamp(34px, 6.5vh, 64px)',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--cyan), #004466)',
                border: '2px solid var(--cyan)',
                boxShadow: '0 0 16px var(--cyan-glow)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 'clamp(0.9rem, 3vh, 1.8rem)',
              }}
            >🧠</motion.div>

            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 1.4, repeat: Infinity }}
              className="home-vs"
              style={{ fontSize: 'clamp(0.75rem, 2vh, 1.2rem)', margin: 0 }}
            >VS</motion.div>

            <motion.div
              animate={{ x: [3, 0, 3], y: [0, -3, 0] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              style={{
                width: 'clamp(34px, 6.5vh, 64px)',
                height: 'clamp(34px, 6.5vh, 64px)',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--pink), #440022)',
                border: '2px solid var(--pink)',
                boxShadow: '0 0 16px var(--pink-glow)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 'clamp(0.9rem, 3vh, 1.8rem)',
              }}
            >🎯</motion.div>
          </div>

          {/* Stats strip */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            style={{ display: 'flex', gap: 'clamp(0.4rem, 1.2vw, 1rem)' }}
          >
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + i * 0.06 }}
                style={{
                  textAlign: 'center',
                  padding: 'clamp(0.15rem, 0.6vh, 0.5rem) clamp(0.3rem, 0.7vw, 0.65rem)',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '8px',
                  backdropFilter: 'blur(6px)',
                }}
              >
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(0.6rem, 1.7vh, 1rem)',
                  fontWeight: 900,
                  background: 'linear-gradient(135deg, var(--cyan), var(--gold))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>{s.value}</div>
                <div style={{
                  fontSize: 'clamp(0.38rem, 0.85vh, 0.55rem)',
                  color: 'var(--text-muted)',
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  marginTop: '1px',
                }}>{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* ── RIGHT: CTA Buttons + Feature pills ── */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 15, delay: 0.15 }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'clamp(0.25rem, 0.9vh, 0.7rem)',
            alignItems: 'stretch',
            flex: '0 0 auto',
            minWidth: 'clamp(150px, 26vw, 260px)',
          }}
        >
          {/* Quick description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            style={{
              fontSize: 'clamp(0.52rem, 1.2vh, 0.78rem)',
              color: 'var(--text-muted)',
              letterSpacing: '0.03em',
              lineHeight: 1.5,
              padding: 'clamp(0.2rem, 0.6vh, 0.45rem) clamp(0.4rem, 1vw, 0.75rem)',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '8px',
              textAlign: 'center',
              margin: 0,
            }}
          >
            🧮 Solve math faster than your opponent.<br />Pull the rope. Win the match!
          </motion.p>

          {BUTTONS.map((btn, i) => (
            <motion.button
              key={btn.id}
              id={btn.id}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.18 + i * 0.07, type: 'spring' }}
              whileHover={{ scale: 1.04, x: 3 }}
              whileTap={{ scale: 0.96 }}
              onClick={btn.onClick}
              className={`btn ${btn.color === 'btn-join' ? '' : btn.color}`}
              style={{
                width: '100%',
                textAlign: 'left',
                padding: 'clamp(0.28rem, 1.1vh, 0.75rem) clamp(0.6rem, 1.5vw, 1.2rem)',
                fontSize: 'clamp(0.58rem, 1.5vh, 0.88rem)',
                fontWeight: '800',
                letterSpacing: '0.05em',
                minHeight: 'unset',
                ...(btn.color === 'btn-join' ? {
                  background: 'rgba(0,255,136,0.1)',
                  border: '2px solid rgba(0,255,136,0.4)',
                  color: '#00ff88',
                  boxShadow: '0 0 16px rgba(0,255,136,0.12)',
                  borderRadius: '50px',
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
            gap: 'clamp(0.15rem, 0.5vh, 0.35rem)',
          }}>
            {[
              { icon: '⚡', label: 'Multiplayer' },
              { icon: '🤖', label: 'AI Mode' },
              { icon: '🏆', label: 'Ranks' },
              { icon: '🎵', label: 'Sound' },
            ].map((feat, i) => (
              <motion.span
                key={feat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.07 }}
                style={{
                  fontSize: 'clamp(0.44rem, 1vh, 0.65rem)',
                  padding: 'clamp(0.12rem, 0.4vh, 0.28rem) clamp(0.35rem, 0.8vw, 0.6rem)',
                  borderRadius: '50px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'var(--text-muted)',
                  fontWeight: '600',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '2px',
                }}
              >
                {feat.icon} {feat.label}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom decorative line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
        style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, var(--pink), var(--gold), transparent)', transformOrigin: 'right', zIndex: 5 }}
      />
    </div>
  );
}
