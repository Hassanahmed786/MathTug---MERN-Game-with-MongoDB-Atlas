import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { usePlayerStore } from '../store/usePlayerStore';

const AGE_MODES = [
  {
    id: 'little-ones',
    name: '👶 Little Ones',
    ageRange: 'Ages 4–6',
    emoji: '🧸',
    description: 'Numbers 1–10, Basic +/−',
    color: '#FFB6C1',
    gradient: 'linear-gradient(135deg, #FFB6C1, #FF69B4)',
  },
  {
    id: 'explorers',
    name: '🔍 Math Explorers',
    ageRange: 'Ages 7–10',
    emoji: '🎓',
    description: 'Tables, Division & sums to 100',
    color: '#87CEEB',
    gradient: 'linear-gradient(135deg, #87CEEB, #4169E1)',
  },
  {
    id: 'ninjas',
    name: '🥷 Number Ninjas',
    ageRange: 'Ages 11+',
    emoji: '⚡',
    description: 'Advanced equations & multi-step ops',
    color: '#FFD700',
    gradient: 'linear-gradient(135deg, #FFD700, #FF6B35)',
  },
];

export default function AgeSelect() {
  const navigate = useNavigate();
  const { setAgeMode } = usePlayerStore();

  const handleSelectMode = (modeId) => {
    setAgeMode(modeId);
    navigate('/setup');
  };

  return (
    <div
      className="stars-bg"
      style={{
        width: '100%',
        height: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        padding: 'clamp(0.3rem, 2vh, 1rem) clamp(0.5rem, 2vw, 1.5rem)',
        gap: 'clamp(0.3rem, 1.5vh, 1rem)',
      }}
    >
      {/* Background grid */}
      <svg
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity: 0.05, zIndex: 1 }}
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0,245,255,0.3)" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Back button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => navigate('/')}
        style={{
          position: 'absolute',
          top: 'clamp(6px, 1.5vh, 16px)',
          left: 'clamp(8px, 1.5vw, 20px)',
          background: 'rgba(255,255,255,0.05)',
          border: '1.5px solid rgba(255,255,255,0.2)',
          color: 'var(--text-primary)',
          padding: 'clamp(0.2rem, 0.6vh, 0.5rem) clamp(0.5rem, 1.2vw, 1rem)',
          borderRadius: '50px',
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(0.58rem, 1.4vh, 0.85rem)',
          cursor: 'pointer',
          zIndex: 100,
        }}
      >
        ← Back
      </motion.button>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center', zIndex: 10, flexShrink: 0 }}
      >
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1rem, 3.5vh, 2.5rem)',
          fontWeight: 900,
          background: 'linear-gradient(135deg, var(--cyan) 0%, var(--gold) 50%, var(--pink) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          lineHeight: 1.1,
          margin: 0,
        }}>
          Choose Your Level
        </h1>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'clamp(0.58rem, 1.4vh, 0.9rem)',
          color: 'var(--text-muted)',
          letterSpacing: '0.08em',
          marginTop: 'clamp(0.1rem, 0.5vh, 0.4rem)',
        }}>
          🎯 Select a difficulty mode
        </p>
      </motion.div>

      {/* Mode Cards — always horizontal row in landscape */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 'clamp(0.4rem, 1.5vw, 1.2rem)',
          width: '100%',
          maxWidth: '900px',
          zIndex: 10,
          padding: '0 clamp(0.3rem, 1vw, 1rem)',
          flex: 1,
          minHeight: 0,
        }}
      >
        {AGE_MODES.map((mode, index) => (
          <motion.button
            key={mode.id}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + index * 0.08, type: 'spring' }}
            whileHover={{ scale: 1.04, y: -4 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => handleSelectMode(mode.id)}
            style={{
              background: mode.gradient,
              border: 'none',
              borderRadius: 'clamp(10px, 2vh, 18px)',
              padding: 'clamp(0.5rem, 2vh, 1.5rem) clamp(0.5rem, 1.5vw, 1.2rem)',
              color: '#fff',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
              textAlign: 'center',
              boxShadow: `0 6px 24px rgba(0,0,0,0.3), 0 0 20px ${mode.color}40`,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'clamp(0.15rem, 0.6vh, 0.5rem)',
            }}
          >
            <div style={{ fontSize: 'clamp(1.2rem, 3.5vh, 2.5rem)', lineHeight: 1 }}>{mode.emoji}</div>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(0.65rem, 1.8vh, 1.2rem)',
              fontWeight: 900,
              margin: 0,
              textShadow: '0 2px 8px rgba(0,0,0,0.3)',
              lineHeight: 1.2,
            }}>
              {mode.name}
            </h2>
            <div style={{
              fontSize: 'clamp(0.55rem, 1.3vh, 0.8rem)',
              fontWeight: 700,
              opacity: 0.9,
            }}>
              {mode.ageRange}
            </div>
            <p style={{
              fontSize: 'clamp(0.52rem, 1.2vh, 0.78rem)',
              fontWeight: 600,
              opacity: 0.85,
              lineHeight: 1.3,
              margin: 0,
            }}>
              {mode.description}
            </p>
          </motion.button>
        ))}
      </motion.div>

      {/* Tip text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'clamp(0.5rem, 1.2vh, 0.8rem)',
          color: 'var(--text-muted)',
          zIndex: 10,
          flexShrink: 0,
          margin: 0,
        }}
      >
        💡 You can change difficulty anytime from settings!
      </motion.p>
    </div>
  );
}
