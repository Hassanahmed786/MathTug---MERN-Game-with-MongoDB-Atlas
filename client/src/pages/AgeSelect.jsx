import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { usePlayerStore } from '../store/usePlayerStore';

const AGE_MODES = [
  {
    id: 'little-ones',
    name: '👶 The Little Ones',
    ageRange: 'Ages 4-6',
    emoji: '🧸',
    description: 'Numbers 1-10, Basic Addition & Subtraction',
    color: '#FFB6C1',
    gradient: 'linear-gradient(135deg, #FFB6C1, #FF69B4)',
  },
  {
    id: 'explorers',
    name: '🔍 Math Explorers',
    ageRange: 'Ages 7-10',
    emoji: '🎓',
    description: 'Multiplication Tables, Division & Sums up to 100',
    color: '#87CEEB',
    gradient: 'linear-gradient(135deg, #87CEEB, #4169E1)',
  },
  {
    id: 'ninjas',
    name: '🥷 Number Ninjas',
    ageRange: 'Ages 11+',
    emoji: '⚡',
    description: 'Advanced Equations, Negatives & Multi-Step Operations',
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

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="home-page stars-bg">
      {/* Back button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleBack}
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          background: 'rgba(255,255,255,0.05)',
          border: '2px solid rgba(255,255,255,0.2)',
          color: 'var(--text-primary)',
          padding: '0.6rem 1.2rem',
          borderRadius: '50px',
          fontFamily: 'var(--font-display)',
          fontSize: '0.9rem',
          cursor: 'pointer',
          zIndex: 100,
          transition: 'all 0.3s ease',
        }}
      >
        ← Back
      </motion.button>

      {/* Grid Pattern Background */}
      <svg 
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          opacity: 0.05,
          zIndex: 1,
        }} 
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0,245,255,0.3)" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 120, damping: 15 }}
        style={{
          textAlign: 'center',
          zIndex: 10,
          marginBottom: '1rem',
        }}
      >
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2rem, 5vw, 4rem)',
          fontWeight: 900,
          background: 'linear-gradient(135deg, var(--cyan) 0%, var(--gold) 50%, var(--pink) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: '0.5rem',
        }}>
          Choose Your Level
        </h1>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '1.1rem',
          color: 'var(--text-muted)',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
        }}>
          🎯 Select a difficulty mode to get started
        </p>
      </motion.div>

      {/* Mode Cards */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          padding: '2rem',
          maxWidth: '1200px',
          margin: '0 auto',
          zIndex: 10,
          position: 'relative',
        }}
      >
        {AGE_MODES.map((mode, index) => (
          <motion.button
            key={mode.id}
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1, type: 'spring' }}
            whileHover={{ scale: 1.05, y: -8 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSelectMode(mode.id)}
            style={{
              background: mode.gradient,
              border: 'none',
              borderRadius: '20px',
              padding: '2rem 1.5rem',
              color: '#fff',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
              textAlign: 'center',
              boxShadow: `0 12px 40px rgba(0,0,0,0.3), 0 0 30px ${mode.color}40`,
              transition: 'all 0.3s ease',
              textDecoration: 'none',
            }}
          >
            {/* Glow overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              style={{
                position: 'absolute',
                inset: 0,
                background: `radial-gradient(circle at center, ${mode.color}20, transparent)`,
                pointerEvents: 'none',
              }}
            />

            {/* Content */}
            <div style={{ position: 'relative', zIndex: 2 }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{mode.emoji}</div>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.6rem',
                fontWeight: 900,
                marginBottom: '0.3rem',
                textShadow: '0 2px 10px rgba(0,0,0,0.3)',
              }}>
                {mode.name}
              </h2>
              <div style={{
                fontSize: '0.9rem',
                fontWeight: 700,
                marginBottom: '0.8rem',
                opacity: 0.95,
                letterSpacing: '0.05em',
              }}>
                {mode.ageRange}
              </div>
              <p style={{
                fontSize: '0.95rem',
                fontWeight: 600,
                opacity: 0.9,
                lineHeight: 1.5,
              }}>
                {mode.description}
              </p>
            </div>
          </motion.button>
        ))}
      </motion.div>

      {/* Info section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        style={{
          position: 'absolute',
          bottom: '30px',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          zIndex: 10,
        }}
      >
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.9rem',
          color: 'var(--text-muted)',
          letterSpacing: '0.05em',
        }}>
          💡 You can change difficulty anytime from settings!
        </p>
      </motion.div>
    </div>
  );
}
