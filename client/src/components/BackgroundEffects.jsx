import React from 'react';
import { motion } from 'framer-motion';

// Grid pattern background
export function GridPattern() {
  return (
    <svg 
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        opacity: 0.04,
        zIndex: 1,
      }} 
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
          <path d="M 50 0 L 0 0 0 50" fill="none" stroke="var(--cyan)" strokeWidth="0.5"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  );
}

// Glowing particle
export function Particle({ x, y, delay, size, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, y: 0 }}
      animate={{
        opacity: [0, 0.9, 0.4, 0],
        scale: [0, 1, 0.8, 0.5],
        y: [0, -60, -120],
        x: [0, (Math.random() - 0.5) * 40, (Math.random() - 0.5) * 80],
      }}
      transition={{ 
        duration: 4 + Math.random() * 3, 
        delay, 
        repeat: Infinity, 
        ease: 'easeOut'
      }}
      style={{
        position: 'absolute',
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        borderRadius: '50%',
        background: color,
        boxShadow: `0 0 ${size * 3}px ${color}, 0 0 ${size * 6}px ${color}60`,
        pointerEvents: 'none',
        filter: 'blur(0.5px)',
      }}
    />
  );
}

// Floating Math Symbol
export function MathSymbol({ x, y, delay, symbol, color, size }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, rotate: 0 }}
      animate={{
        opacity: [0, 0.6, 0.6, 0],
        scale: [0, 1, 1, 0],
        y: [0, -30, -60],
        rotate: [0, Math.random() * 180 - 90, Math.random() * 360 - 180],
      }}
      transition={{ 
        duration: 8 + Math.random() * 4, 
        delay, 
        repeat: Infinity, 
        ease: 'easeInOut'
      }}
      style={{
        position: 'absolute',
        left: `${x}%`,
        top: `${y}%`,
        fontSize: size,
        color: color,
        fontWeight: '900',
        fontFamily: 'var(--font-display)',
        pointerEvents: 'none',
        textShadow: `0 0 15px ${color}`,
        zIndex: 1,
      }}
    >
      {symbol}
    </motion.div>
  );
}

// Container for all background effects
export default function BackgroundEffects() {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: 10 + Math.random() * 90,
    delay: Math.random() * 8,
    size: 2 + Math.random() * 10,
    color: i % 3 === 0 ? 'rgba(0,245,255,0.7)' : i % 3 === 1 ? 'rgba(255,0,128,0.7)' : 'rgba(255,215,0,0.5)',
  }));

  const symbols = ['+', '−', '×', '÷', '=', '≠', '>', '<', '±'];
  const mathSymbols = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 10,
    symbol: symbols[Math.floor(Math.random() * symbols.length)],
    size: `${1 + Math.random() * 2}rem`,
    color: i % 2 === 0 ? 'rgba(0,245,255,0.2)' : 'rgba(255,0,128,0.2)',
  }));

  return (
    <>
      <GridPattern />
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2 }}>
        {particles.map((p) => (
          <Particle key={p.id} {...p} />
        ))}
        {mathSymbols.map((m) => (
          <MathSymbol key={m.id} {...m} />
        ))}
      </div>
      {/* Animated glow orbs */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.08, 0.15, 0.08] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', left: '5%', top: '15%',
          width: '400px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,245,255,0.15) 0%, transparent 60%)',
          pointerEvents: 'none', zIndex: 0,
        }} 
      />
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.08, 0.12, 0.08] }}
        transition={{ duration: 10, repeat: Infinity, delay: 2, ease: 'easeInOut' }}
        style={{
          position: 'absolute', right: '5%', bottom: '10%',
          width: '400px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,0,128,0.15) 0%, transparent 60%)',
          pointerEvents: 'none', zIndex: 0,
        }} 
      />
    </>
  );
}
