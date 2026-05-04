import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function QuestionDisplay({ question, phase, roundNumber, totalRounds }) {
  const isNextRound = phase === 'roundResult';
  const showQuestion = phase === 'active' && question;

  return (
    <div className="question-display-container">
      {/* Round counter */}
      <div className="round-counter">
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
            className="next-round-label"
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
            className="question-content"
          >
            {/* Type badge */}
            <motion.span
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 0.6, y: 0 }}
              transition={{ delay: 0.25 }}
              className="question-type-badge"
            >
              {question.type}
            </motion.span>

            {/* Main equation */}
            <div className="question-equation">
              {question.equation}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="waiting"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            className="waiting-label"
          >
            ⏳ Waiting for players...
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
