import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { resumeAudio } from '../utils/soundEffects';

const BUTTONS = [
  '7', '8', '9',
  '4', '5', '6',
  '1', '2', '3',
  'C', '0', '✓',
];

export default function NumberPad({ playerId, onSubmit, isLocked, lastFeedback }) {
  const [value, setValue] = useState('');
  const isCyan = playerId === 'player1';
  const accent = isCyan ? 'var(--cyan)' : 'var(--pink)';
  const accentGlow = isCyan ? 'var(--cyan-glow)' : 'var(--pink-glow)';
  const accentDim = isCyan ? 'var(--cyan-dim)' : 'var(--pink-dim)';

  const handlePress = useCallback((key) => {
    resumeAudio();
    if (isLocked) return;
    if (key === 'C') {
      setValue('');
      return;
    }
    if (key === '✓') {
      if (value === '' || value === '-') return;
      onSubmit?.(value);
      // Don't clear — the lock will dim the panel
      return;
    }
    if (key === '-' && value === '') {
      setValue('-');
      return;
    }
    if (value.length >= 5) return;
    setValue((prev) => prev + key);
  }, [isLocked, value, onSubmit]);

  const getBtnColor = (key) => {
    if (key === '✓') return accent;
    if (key === 'C') return 'rgba(255,255,255,0.12)';
    return 'rgba(255,255,255,0.07)';
  };

  const getBtnTextColor = (key) => {
    if (key === '✓') return isCyan ? '#0a0a1a' : '#fff';
    return 'var(--text-primary)';
  };

  return (
    <motion.div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.6rem',
        width: '100%',
        opacity: isLocked ? 0.45 : 1,
        pointerEvents: isLocked ? 'none' : 'auto',
        transition: 'opacity 0.3s ease',
      }}
    >
      {/* Answer Display */}
      <motion.div
        key={value}
        style={{
          width: '100%',
          minHeight: '64px',
          background: 'rgba(0,0,0,0.3)',
          border: `1.5px solid ${lastFeedback === 'correct' ? '#00ff88' : lastFeedback === 'wrong' ? '#ff4444' : accent}`,
          borderRadius: '14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--font-display)',
          fontSize: value.length > 3 ? '1.5rem' : '2rem',
          fontWeight: '700',
          color: lastFeedback === 'correct' ? '#00ff88' : lastFeedback === 'wrong' ? '#ff4444' : accent,
          boxShadow: `0 0 ${lastFeedback ? '20px' : '8px'} ${lastFeedback === 'correct' ? 'rgba(0,255,136,0.4)' : lastFeedback === 'wrong' ? 'rgba(255,68,68,0.4)' : accentGlow}`,
          letterSpacing: '0.1em',
          position: 'relative',
          overflow: 'hidden',
        }}
        animate={{
          scale: lastFeedback ? [1, 1.05, 1] : 1,
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Cursor blink */}
        {!value && !isLocked && (
          <span style={{ opacity: 0.4, animation: 'glowPulse 1.2s ease-in-out infinite' }}>_</span>
        )}
        {value || ''}
        {isLocked && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            style={{
              position: 'absolute', right: '12px',
              fontSize: '1.2rem',
            }}
          >
            🔒
          </motion.div>
        )}
      </motion.div>

      {/* Feedback label */}
      <AnimatePresence>
        {lastFeedback && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '0.75rem',
              letterSpacing: '0.12em',
              color: lastFeedback === 'correct' ? '#00ff88' : '#ff4444',
            }}
          >
            {lastFeedback === 'correct' ? '✓ CORRECT!' : '✗ WRONG'}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Numpad Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '0.45rem',
        width: '100%',
      }}>
        {BUTTONS.map((key) => (
          <motion.button
            key={key}
            id={`numpad-${playerId}-${key}`}
            whileTap={{
              scale: 0.85,
              boxShadow: `0 0 20px ${key === '✓' ? accent : accentGlow}`,
            }}
            style={{
              height: '64px',
              borderRadius: '14px',
              border: `1.5px solid ${key === '✓' ? accent : 'rgba(255,255,255,0.1)'}`,
              background: getBtnColor(key),
              color: getBtnTextColor(key),
              fontFamily: key === '✓' || key === 'C' ? 'var(--font-body)' : 'var(--font-display)',
              fontSize: key === '✓' ? '1.3rem' : '1.2rem',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              boxShadow: key === '✓' ? `0 0 12px ${accentGlow}` : 'none',
              touchAction: 'manipulation',
              userSelect: 'none',
            }}
            onPointerDown={() => handlePress(key)}
            onMouseEnter={(e) => {
              if (key !== 'C') {
                e.currentTarget.style.borderColor = accent;
                e.currentTarget.style.boxShadow = `0 0 14px ${accentGlow}`;
              }
            }}
            onMouseLeave={(e) => {
              if (key !== '✓') {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                e.currentTarget.style.boxShadow = 'none';
              } else {
                e.currentTarget.style.boxShadow = `0 0 12px ${accentGlow}`;
              }
            }}
          >
            {key}
          </motion.button>
        ))}
      </div>

      {/* Negative toggle */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        style={{
          width: '100%',
          height: '40px',
          borderRadius: '10px',
          border: '1px solid rgba(255,255,255,0.1)',
          background: 'rgba(255,255,255,0.04)',
          color: 'var(--text-muted)',
          fontFamily: 'var(--font-body)',
          fontSize: '0.8rem',
          cursor: 'pointer',
          letterSpacing: '0.08em',
          touchAction: 'manipulation',
        }}
        onPointerDown={() => {
          if (isLocked) return;
          setValue((prev) => {
            if (prev.startsWith('-')) return prev.slice(1);
            return '-' + prev;
          });
        }}
      >
        +/− toggle
      </motion.button>
    </motion.div>
  );
}
