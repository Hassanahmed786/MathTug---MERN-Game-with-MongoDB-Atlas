import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { usePlayerStore } from '../store/usePlayerStore';

import BackgroundEffects from '../components/BackgroundEffects';

export default function Home() {
  const navigate = useNavigate();
  const { level, xp } = usePlayerStore();

  return (
    <div className="home-page stars-bg">
      <BackgroundEffects />

      {/* Profile Widget - Enhanced */}
      <motion.div
        initial={{ opacity: 0, x: 20, y: -20 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        whileHover={{ scale: 1.05 }}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          zIndex: 100,
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.1)',
          padding: '0.8rem 1.2rem',
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.8rem',
          boxShadow: '0 8px 32px rgba(0,245,255,0.1)',
        }}
      >
        <div style={{
          width: '40px', height: '40px', borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--gold), #aa8800)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: '900', color: '#0a0a1a', fontSize: '1.1rem',
          boxShadow: '0 0 20px rgba(255,215,0,0.6)',
        }}>
          {level}
        </div>
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '700' }}>LVL {level}</div>
          <div style={{ fontSize: '0.9rem', color: 'var(--gold)', fontWeight: '700' }}>{xp} XP</div>
        </div>
      </motion.div>

      {/* Logo Section - Enhanced with more animation */}
      <motion.div
        initial={{ opacity: 0, y: -50, scale: 0.7 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 120, damping: 15, delay: 0.1 }}
        style={{ textAlign: 'center', zIndex: 10 }}
      >
        {/* Enhanced Rope icon with rotation */}
        <motion.div
          animate={{ 
            rotate: [-5, 5, -5],
            y: [0, -8, 0],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          style={{ 
            fontSize: '4.5rem', 
            marginBottom: '1rem',
            filter: 'drop-shadow(0 0 20px rgba(0,245,255,0.4)) drop-shadow(0 0 10px rgba(255,0,128,0.2))',
          }}
        >
          🪢
        </motion.div>

        <h1 className="home-logo">MathTug</h1>
        <p className="home-subtitle">⚔️ Tug-of-War Number Battle ⚔️</p>
        
        {/* Animated underline */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: 200 }}
          transition={{ delay: 0.5, duration: 1, type: 'spring' }}
          style={{
            height: '3px',
            background: 'linear-gradient(90deg, var(--cyan), var(--gold), var(--pink))',
            borderRadius: '2px',
            margin: '1.5rem auto 0',
            boxShadow: '0 0 20px rgba(255,215,0,0.6)',
          }} 
        />
      </motion.div>

      {/* Player preview - Enhanced */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 100 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2.5rem',
          zIndex: 10,
          marginTop: '2rem',
        }}
      >
        {/* P1 avatar - Enhanced */}
        <motion.div
          animate={{ 
            x: [-6, 0, -6],
            y: [0, -4, 0],
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            width: '85px', height: '85px', borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--cyan), #004466)',
            border: '3px solid var(--cyan)',
            boxShadow: '0 0 30px var(--cyan-glow), inset 0 0 20px rgba(0,245,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2.5rem',
            fontWeight: 'bold',
          }}
        >🧠</motion.div>

        {/* Rope visual - Enhanced */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
          <motion.div 
            animate={{ 
              scale: [1, 1.15, 1],
              textShadow: [
                '0 0 10px rgba(255,215,0,0.5)',
                '0 0 30px rgba(255,215,0,0.8)',
                '0 0 10px rgba(255,215,0,0.5)',
              ],
            }} 
            transition={{ duration: 1.5, repeat: Infinity }}
            className="home-vs"
            style={{ margin: '0.5rem 0', fontSize: '1.3rem' }}
          >VS</motion.div>
          
          {/* Animated rope */}
          <motion.div 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 140, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            style={{
              height: '5px',
              background: 'linear-gradient(90deg, var(--cyan), #00ff88, var(--gold), #ff6600, var(--pink))',
              borderRadius: '3px',
              boxShadow: '0 0 15px rgba(255,215,0,0.8), 0 0 30px rgba(0,245,255,0.4)',
            }} 
          />
          
          {/* Rope glow effect */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ delay: 1, duration: 2, repeat: Infinity }}
            style={{
              width: '140px',
              height: '5px',
              background: 'rgba(255,215,0,0.3)',
              borderRadius: '3px',
              filter: 'blur(4px)',
              marginTop: '-5px',
            }} 
          />
        </div>

        {/* P2 avatar - Enhanced */}
        <motion.div
          animate={{ 
            x: [6, 0, 6],
            y: [0, -4, 0],
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            width: '85px', height: '85px', borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--pink), #440022)',
            border: '3px solid var(--pink)',
            boxShadow: '0 0 30px var(--pink-glow), inset 0 0 20px rgba(255,0,128,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2.5rem',
            fontWeight: 'bold',
          }}
        >🎯</motion.div>
      </motion.div>

      {/* Feature pills - Enhanced */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, staggerChildren: 0.1 }}
        style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', zIndex: 10, margin: '2rem 0' }}
      >
        {[
          { icon: '⚡', text: 'Real-time Multiplayer' },
          { icon: '🎯', text: '3 Difficulty Levels' },
          { icon: '🏆', text: 'Leaderboard' },
          { icon: '🎵', text: 'Sound Effects' },
        ].map((feat, index) => (
          <motion.div 
            key={feat.text} 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 + index * 0.15, type: 'spring' }}
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.15)' }}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.85rem',
              padding: '0.6rem 1.2rem',
              borderRadius: '50px',
              background: 'rgba(255,255,255,0.07)',
              border: '1.5px solid rgba(255,255,255,0.15)',
              color: 'var(--text-primary)',
              letterSpacing: '0.05em',
              cursor: 'default',
              fontWeight: '600',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
              transition: 'all 0.3s ease',
            }}>
            <span style={{ marginRight: '0.5rem', fontSize: '1.1rem' }}>{feat.icon}</span>
            {feat.text}
          </motion.div>
        ))}
      </motion.div>

      {/* CTA Buttons - Enhanced */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center', zIndex: 10, marginTop: '2.5rem' }}
      >
        <motion.button
          id="home-start-btn"
          whileHover={{ scale: 1.08, boxShadow: '0 0 50px rgba(0,245,255,0.6)' }}
          whileTap={{ scale: 0.92 }}
          className="btn btn-cyan"
          onClick={() => navigate('/age-select')}
          style={{ 
            fontSize: '1.1rem', 
            padding: '1rem 2.8rem',
            fontWeight: '800',
            letterSpacing: '0.1em',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          ⚡ Start New Game
        </motion.button>
        
        <motion.button
          id="home-join-btn"
          whileHover={{ scale: 1.08, boxShadow: '0 0 40px rgba(0,255,136,0.5)' }}
          whileTap={{ scale: 0.92 }}
          className="btn btn-ghost"
          onClick={() => navigate('/setup?tab=join')}
          style={{ 
            fontSize: '1.1rem', 
            padding: '1rem 2.3rem',
            fontWeight: '800',
            letterSpacing: '0.1em',
            border: '2px solid rgba(0,255,136,0.4)',
            color: '#00ff88',
          }}
        >
          🤝 Join Room
        </motion.button>

        <motion.button
          id="home-leaderboard-btn"
          whileHover={{ scale: 1.08, boxShadow: '0 0 40px rgba(255,0,128,0.5)' }}
          whileTap={{ scale: 0.92 }}
          className="btn btn-ghost"
          onClick={() => navigate('/leaderboard')}
          style={{ 
            fontSize: '1.1rem', 
            padding: '1rem 2.3rem',
            fontWeight: '800',
            letterSpacing: '0.1em',
          }}
        >
          📊 Leaderboard
        </motion.button>

        <motion.button
          id="home-about-btn"
          whileHover={{ scale: 1.08, boxShadow: '0 0 40px rgba(255,215,0,0.5)' }}
          whileTap={{ scale: 0.92 }}
          className="btn btn-ghost"
          onClick={() => navigate('/about')}
          style={{ 
            fontSize: '1.1rem', 
            padding: '1rem 2.3rem',
            fontWeight: '800',
            letterSpacing: '0.1em',
          }}
        >
          ℹ️ About & How to Play
        </motion.button>
      </motion.div>

    </div>
  );
}
