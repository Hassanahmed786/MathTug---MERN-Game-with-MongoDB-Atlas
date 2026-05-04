import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function QuestionDisplay({ question, phase, roundNumber, totalRounds }) {
  const isNextRound = phase === 'roundResult';
  const showQuestion = phase === 'active' && question;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      minHeight: '130px',
      position: 'relative',
    }}>
      {/* Round counter */}
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: '0.65rem',
        letterSpacing: '0.2em',
        color: 'var(--text-muted)',
        marginBottom: '0.5rem',
        textTransform: 'uppercase',
      }}>
        Round {roundNumber} / {totalRounds}
      </div>

      <AnimatePresence mode="wait">
        {isNextRound ? (
          <motion.div
            key="next-round"
            initial={{ scale: 0.5, opacity: 0, rotate: -8 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 1.3, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.4rem, 3vw, 2rem)',
              fontWeight: '700',
              color: 'var(--gold)',
              textShadow: '0 0 20px rgba(255,215,0,0.6)',
              letterSpacing: '0.08em',
            }}
          >
            ⚡ Next Round!
          </motion.div>
        ) : showQuestion ? (
          <motion.div
            key={question.equation}
            initial={{ scale: 0, rotate: -10, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0, y: -20 }}
            transition={{ type: 'spring', stiffness: 280, damping: 18 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.25rem',
            }}
          >
            {/* Type badge */}
            <motion.span
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 0.6, y: 0 }}
              transition={{ delay: 0.25 }}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.65rem',
                letterSpacing: '0.2em',
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '50px',
                padding: '0.15rem 0.6rem',
              }}
            >
              {question.type}
            </motion.span>

            {/* Main equation */}
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 4.5vw, 3.5rem)',
              fontWeight: '900',
              color: 'var(--text-primary)',
              textShadow: '0 0 30px rgba(255,255,255,0.15)',
              letterSpacing: '0.04em',
              lineHeight: 1.1,
            }}>
              {question.equation}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="waiting"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1rem',
              color: 'var(--text-muted)',
              letterSpacing: '0.15em',
            }}
          >
            ⏳ Waiting for players...
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
