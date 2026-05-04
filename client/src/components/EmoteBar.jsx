import React from 'react';
import { motion } from 'framer-motion';

const EMOTES = ['😂', '😡', '🥶', '🤯'];

export default function EmoteBar({ onEmote, disabled }) {
  return (
    <div style={{
      display: 'flex',
      gap: '0.5rem',
      justifyContent: 'center',
      marginTop: '1rem',
      opacity: disabled ? 0.5 : 1,
      pointerEvents: disabled ? 'none' : 'auto',
    }}>
      {EMOTES.map((emote) => (
        <motion.button
          key={emote}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.85 }}
          onClick={() => onEmote(emote)}
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            fontSize: '1.2rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {emote}
        </motion.button>
      ))}
    </div>
  );
}
