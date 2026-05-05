import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { usePlayerStore } from '../store/usePlayerStore';

const AGE_MODES = [
  {
    id: 'little-ones',
    name: 'Little Ones',
    emoji: '🧸',
    ageRange: 'Ages 4–6',
    description: 'Numbers 1–10, Basic +/−',
    tagline: 'Perfect for beginners!',
    gradient: 'linear-gradient(145deg, #FFB6C1 0%, #FF69B4 50%, #FF1493 100%)',
    glowColor: 'rgba(255,105,180,0.4)',
    borderColor: 'rgba(255,105,180,0.6)',
  },
  {
    id: 'explorers',
    name: 'Math Explorers',
    emoji: '🎓',
    ageRange: 'Ages 7–10',
    description: 'Tables, Division & sums to 100',
    tagline: 'Level up your skills!',
    gradient: 'linear-gradient(145deg, #87CEEB 0%, #5B9BD5 50%, #2E4DA8 100%)',
    glowColor: 'rgba(91,155,213,0.4)',
    borderColor: 'rgba(91,155,213,0.6)',
  },
  {
    id: 'ninjas',
    name: 'Number Ninjas',
    emoji: '⚡',
    ageRange: 'Ages 11+',
    description: 'Advanced equations & multi-step ops',
    tagline: 'For the math masters!',
    gradient: 'linear-gradient(145deg, #FFD700 0%, #FF8C00 50%, #FF4500 100%)',
    glowColor: 'rgba(255,140,0,0.4)',
    borderColor: 'rgba(255,140,0,0.6)',
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
        padding: 'clamp(0.3rem, 1.5vh, 1rem) clamp(0.5rem, 2vw, 1.5rem)',
        gap: 'clamp(0.3rem, 1.2vh, 0.9rem)',
      }}
    >
      {/* Background grid */}
      <svg
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity: 0.04, zIndex: 1 }}
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern id="ageGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0,245,255,0.3)" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#ageGrid)" />
      </svg>

      {/* Top decorative line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
        background: 'linear-gradient(90deg, transparent, var(--cyan), var(--gold), var(--pink), transparent)',
        zIndex: 5, pointerEvents: 'none',
      }} />

      {/* Back button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => navigate('/')}
        style={{
          position: 'absolute',
          top: 'clamp(6px, 1.5vh, 14px)',
          left: 'clamp(8px, 1.5vw, 18px)',
          background: 'rgba(255,255,255,0.06)',
          border: '1.5px solid rgba(255,255,255,0.2)',
          color: 'var(--text-primary)',
          padding: 'clamp(0.18rem, 0.6vh, 0.45rem) clamp(0.4rem, 1.2vw, 0.9rem)',
          borderRadius: '50px',
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(0.5rem, 1.3vh, 0.78rem)',
          cursor: 'pointer',
          zIndex: 100,
          backdropFilter: 'blur(10px)',
        }}
      >
        ← Back
      </motion.button>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center', zIndex: 10, flexShrink: 0 }}
      >
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1rem, 3.5vh, 2.6rem)',
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
          fontSize: 'clamp(0.5rem, 1.3vh, 0.85rem)',
          color: 'var(--text-muted)',
          letterSpacing: '0.07em',
          marginTop: 'clamp(0.1rem, 0.4vh, 0.3rem)',
          margin: 0,
          marginTop: 'clamp(0.1rem, 0.4vh, 0.3rem)',
        }}>
          🎯 Select a difficulty mode to begin your battle
        </p>
      </motion.div>

      {/* Mode Cards — fixed-height row */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.12 }}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 'clamp(0.5rem, 1.8vw, 1.4rem)',
          width: '100%',
          maxWidth: 'clamp(420px, 80vw, 840px)',
          zIndex: 10,
          flexShrink: 0,
        }}
      >
        {AGE_MODES.map((mode, index) => (
          <motion.button
            key={mode.id}
            initial={{ opacity: 0, y: 24, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.18 + index * 0.09, type: 'spring', stiffness: 120 }}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleSelectMode(mode.id)}
            style={{
              background: mode.gradient,
              border: `2px solid ${mode.borderColor}`,
              borderRadius: 'clamp(10px, 2vh, 20px)',
              padding: 'clamp(0.6rem, 1.8vh, 1.8rem) clamp(0.5rem, 1.5vw, 1.2rem)',
              color: '#fff',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
              textAlign: 'center',
              boxShadow: `0 6px 24px rgba(0,0,0,0.35), 0 0 20px ${mode.glowColor}`,
              /* Fixed height driven by viewport height */
              height: 'clamp(130px, 28vh, 260px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'clamp(0.2rem, 0.7vh, 0.55rem)',
            }}
          >
            {/* Shimmer */}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%, rgba(255,255,255,0.05) 100%)', pointerEvents: 'none' }} />
            {/* Top shine */}
            <div style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: '1px', background: 'rgba(255,255,255,0.5)' }} />

            <div style={{ fontSize: 'clamp(1.4rem, 4vh, 3rem)', lineHeight: 1, filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.3))' }}>
              {mode.emoji}
            </div>

            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(0.62rem, 1.9vh, 1.2rem)',
              fontWeight: 900,
              margin: 0,
              textShadow: '0 2px 8px rgba(0,0,0,0.4)',
              lineHeight: 1.2,
            }}>
              {mode.name}
            </h2>

            <div style={{
              fontSize: 'clamp(0.5rem, 1.2vh, 0.8rem)',
              fontWeight: 700,
              opacity: 0.9,
              background: 'rgba(0,0,0,0.2)',
              padding: 'clamp(0.08rem, 0.3vh, 0.2rem) clamp(0.4rem, 0.8vw, 0.7rem)',
              borderRadius: '50px',
              backdropFilter: 'blur(4px)',
            }}>
              {mode.ageRange}
            </div>

            <p style={{
              fontSize: 'clamp(0.46rem, 1.1vh, 0.74rem)',
              fontWeight: 600,
              opacity: 0.9,
              lineHeight: 1.3,
              margin: 0,
              textShadow: '0 1px 4px rgba(0,0,0,0.3)',
            }}>
              {mode.description}
            </p>

            {/* Tagline — hidden on tiny screens */}
            <div className="age-card-tagline" style={{
              fontSize: 'clamp(0.42rem, 1vh, 0.65rem)',
              fontStyle: 'italic',
              opacity: 0.8,
            }}>
              {mode.tagline}
            </div>

            {/* Play indicator */}
            <motion.div
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                position: 'absolute',
                bottom: 'clamp(5px, 1.2vh, 11px)',
                fontSize: 'clamp(0.38rem, 0.85vh, 0.6rem)',
                fontWeight: 700,
                letterSpacing: '0.08em',
                opacity: 0.8,
                fontFamily: 'var(--font-display)',
                background: 'rgba(0,0,0,0.2)',
                padding: '0.1rem clamp(0.3rem, 0.6vw, 0.5rem)',
                borderRadius: '50px',
              }}
            >
              TAP TO SELECT ▶
            </motion.div>
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
          fontSize: 'clamp(0.44rem, 1.1vh, 0.75rem)',
          color: 'var(--text-muted)',
          zIndex: 10,
          flexShrink: 0,
          margin: 0,
          textAlign: 'center',
        }}
      >
        💡 You can change difficulty anytime from settings!
      </motion.p>
    </div>
  );
}
