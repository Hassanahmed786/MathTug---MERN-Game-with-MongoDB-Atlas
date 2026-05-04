import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { resumeAudio } from '../utils/soundEffects';
import useGameStore from '../store/gameStore';

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

  // Clear value when unlocked
  useEffect(() => {
    if (!isLocked) {
      setValue('');
    }
  }, [isLocked]);

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
      return;
    }
    if (key === '-' && value === '') {
      setValue('-');
      return;
    }
    if (value.length >= 5) return;
    setValue((prev) => prev + key);
  }, [isLocked, value, onSubmit]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Avoid double-typing in local mode where both pads are active
      if (isLocked || useGameStore.getState().isLocal) return;
      
      const key = e.key;
      if (/^[0-9]$/.test(key)) {
        handlePress(key);
      } else if (key === 'Enter') {
        handlePress('✓');
      } else if (key === 'Backspace') {
        setValue(prev => prev.slice(0, -1));
      } else if (key === 'Escape' || key === 'c' || key === 'C') {
        handlePress('C');
      } else if (key === '-') {
        if (value === '') handlePress('-');
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLocked, handlePress, value]);

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
      className="numpad-container"
      style={{
        opacity: isLocked ? 0.45 : 1,
        pointerEvents: isLocked ? 'none' : 'auto',
        transition: 'opacity 0.3s ease',
      }}
    >
      {/* Answer Display */}
      <motion.div
        key={value}
        className="numpad-display"
        style={{
          border: `1.5px solid ${lastFeedback === 'correct' ? '#00ff88' : lastFeedback === 'wrong' ? '#ff4444' : accent}`,
          fontSize: value.length > 3 ? 'var(--numpad-display-font-small)' : 'var(--numpad-display-font)',
          color: lastFeedback === 'correct' ? '#00ff88' : lastFeedback === 'wrong' ? '#ff4444' : accent,
          boxShadow: `0 0 ${lastFeedback ? '20px' : '8px'} ${lastFeedback === 'correct' ? 'rgba(0,255,136,0.4)' : lastFeedback === 'wrong' ? 'rgba(255,68,68,0.4)' : accentGlow}`,
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
            className="numpad-lock"
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
            className="numpad-feedback"
            style={{
              color: lastFeedback === 'correct' ? '#00ff88' : '#ff4444',
            }}
          >
            {lastFeedback === 'correct' ? '✓ CORRECT!' : '✗ WRONG'}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Numpad Grid */}
      <div className="numpad-grid">
        {BUTTONS.map((key) => (
          <motion.button
            key={key}
            id={`numpad-${playerId}-${key}`}
            whileTap={{
              scale: 0.85,
              boxShadow: `0 0 20px ${key === '✓' ? accent : accentGlow}`,
            }}
            className={`numpad-btn ${key === '✓' ? 'btn-submit' : ''}`}
            style={{
              border: `1.5px solid ${key === '✓' ? accent : 'rgba(255,255,255,0.1)'}`,
              background: getBtnColor(key),
              color: getBtnTextColor(key),
              fontFamily: key === '✓' || key === 'C' ? 'var(--font-body)' : 'var(--font-display)',
              boxShadow: key === '✓' ? `0 0 12px ${accentGlow}` : 'none',
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
        className="numpad-toggle"
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
