import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import BackgroundEffects from '../components/BackgroundEffects';

export default function About() {
  const navigate = useNavigate();

  const features = [
    {
      icon: '🎯',
      title: 'Real-time Multiplayer',
      desc: 'Compete with friends or AI opponents in live matches with instant feedback'
    },
    {
      icon: '🧮',
      title: '3 Difficulty Modes',
      desc: 'Age-appropriate levels: Little Ones (4-6), Math Explorers (7-10), Number Ninjas (11+)'
    },
    {
      icon: '🎮',
      title: 'Interactive Gameplay',
      desc: 'Visualize tug-of-war battles with animated rope and humanoid characters'
    },
    {
      icon: '🏆',
      title: 'Leaderboard Rankings',
      desc: 'Track your progress, earn XP, level up, and compete globally'
    },
    {
      icon: '🤖',
      title: 'AI Bot Mode',
      desc: 'Train solo against intelligent AI opponents with adaptive difficulty'
    },
    {
      icon: '🎵',
      title: 'Sound Effects',
      desc: 'Immersive audio feedback for correct answers, wins, and celebrations'
    },
  ];

  return (
    <div className="home-page stars-bg" style={{ display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
      <BackgroundEffects />

      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ scale: 1.05 }}
        onClick={() => navigate('/')}
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          zIndex: 100,
          background: 'rgba(0,245,255,0.1)',
          border: '2px solid rgba(0,245,255,0.3)',
          color: 'var(--cyan)',
          padding: '0.8rem 1.5rem',
          borderRadius: '50px',
          fontSize: '1rem',
          fontWeight: '700',
          cursor: 'pointer',
          letterSpacing: '0.05em',
          transition: 'all 0.3s ease',
        }}
        className="btn"
      >
        ← Back
      </motion.button>

      {/* Main Content - Centered */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: '100px 20px 40px',
        zIndex: 10,
      }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ textAlign: 'center', marginBottom: '3rem', maxWidth: '800px' }}
        >
          <motion.div
            animate={{ rotate: [-5, 5, -5], y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            style={{
              fontSize: '3.5rem',
              marginBottom: '1rem',
              filter: 'drop-shadow(0 0 20px rgba(0,245,255,0.4))',
            }}
          >
            🪢
          </motion.div>

          <h1 className="home-logo" style={{ marginBottom: '0.5rem' }}>About MathTug</h1>
          <p className="home-subtitle">⚔️ Making Math Fun Through Competition ⚔️</p>
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            maxWidth: '700px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px',
            padding: '2rem',
            marginBottom: '3rem',
            textAlign: 'center',
            lineHeight: 1.8,
            color: 'var(--text-muted)',
            fontSize: '1.05rem',
          }}
        >
          <p style={{ marginBottom: '1rem' }}>
            🧮 <strong>MathTug</strong> is an interactive, educational game platform that transforms math learning into an exciting, competitive experience.
          </p>
          <p>
            🚀 Built with cutting-edge MERN stack technology, we combine real-time multiplayer gameplay, AI opponents, multiple difficulty levels, and live leaderboard rankings to help students of all ages master mathematics through engaging tug-of-war battles.
          </p>
        </motion.div>

        {/* How it Helps */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{
            maxWidth: '800px',
            marginBottom: '3rem',
            width: '100%',
          }}
        >
          <h2 style={{
            fontSize: '1.8rem',
            fontFamily: 'var(--font-display)',
            textAlign: 'center',
            marginBottom: '2rem',
            background: 'linear-gradient(90deg, var(--cyan), var(--pink))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            How MathTug Helps Students
          </h2>

          <motion.ul style={{
            listStyle: 'none',
            padding: 0,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
          }}>
            {[
              '✨ Builds confidence through immediate feedback',
              '🚀 Accelerates mental math fluency and speed',
              '🏆 Motivates learning with competitive rewards',
              '🎮 Makes practice fun with engaging gameplay',
              '👥 Enables social learning and peer competition',
              '📊 Tracks progress with detailed statistics',
            ].map((benefit, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.05 }}
                style={{
                  background: 'rgba(0,245,255,0.08)',
                  border: '1px solid rgba(0,245,255,0.2)',
                  padding: '1rem',
                  borderRadius: '12px',
                  color: 'var(--text-muted)',
                  fontSize: '0.95rem',
                  lineHeight: 1.6,
                }}
              >
                {benefit}
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{
            maxWidth: '900px',
            marginBottom: '3rem',
            width: '100%',
          }}
        >
          <h2 style={{
            fontSize: '1.8rem',
            fontFamily: 'var(--font-display)',
            textAlign: 'center',
            marginBottom: '2rem',
            background: 'linear-gradient(90deg, var(--pink), var(--gold))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Key Features
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.5rem',
          }}>
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.08 }}
                whileHover={{ scale: 1.05, borderColor: 'rgba(255,255,255,0.3)' }}
                style={{
                  background: 'linear-gradient(135deg, rgba(0,245,255,0.08), rgba(255,0,128,0.08))',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  transition: 'all 0.3s ease',
                }}
              >
                <div style={{
                  fontSize: '2rem',
                  marginBottom: '0.8rem',
                }}>
                  {feature.icon}
                </div>
                <h3 style={{
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  marginBottom: '0.5rem',
                  color: 'var(--text-primary)',
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  fontSize: '0.9rem',
                  color: 'var(--text-muted)',
                  lineHeight: 1.5,
                  margin: 0,
                }}>
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* How to Play */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          style={{
            maxWidth: '800px',
            marginBottom: '3rem',
            width: '100%',
          }}
        >
          <h2 style={{
            fontSize: '1.8rem',
            fontFamily: 'var(--font-display)',
            textAlign: 'center',
            marginBottom: '2rem',
            background: 'linear-gradient(90deg, var(--gold), var(--cyan))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            How to Play
          </h2>

          <ol style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px',
            padding: '2rem',
            lineHeight: 2,
            color: 'var(--text-muted)',
            fontSize: '1rem',
          }}>
            <li style={{ marginBottom: '1rem' }}>
              <strong style={{ color: 'var(--cyan)' }}>🎯 Select Your Level:</strong> Choose from 3 age-appropriate difficulty modes
            </li>
            <li style={{ marginBottom: '1rem' }}>
              <strong style={{ color: 'var(--pink)' }}>🤝 Pick Your Mode:</strong> Play against a friend (Local), online opponent, or AI Bot
            </li>
            <li style={{ marginBottom: '1rem' }}>
              <strong style={{ color: 'var(--gold)' }}>⚡ Solve Problems:</strong> Answer math questions faster than your opponent
            </li>
            <li style={{ marginBottom: '1rem' }}>
              <strong style={{ color: 'var(--cyan)' }}>🏆 Win Rounds:</strong> Correct answers pull the rope toward you
            </li>
            <li>
              <strong style={{ color: 'var(--pink)' }}>🎊 Earn Rewards:</strong> Gain XP, level up, and climb the global leaderboard
            </li>
          </ol>
        </motion.div>

        {/* CTA Button */}
        <motion.button
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          whileHover={{ scale: 1.08, boxShadow: '0 0 50px rgba(0,245,255,0.6)' }}
          whileTap={{ scale: 0.92 }}
          onClick={() => navigate('/age-select')}
          style={{
            fontSize: '1.2rem',
            padding: '1.2rem 3rem',
            fontWeight: '800',
            letterSpacing: '0.1em',
            marginBottom: '3rem',
            cursor: 'pointer',
          }}
          className="btn btn-cyan"
        >
          ⚡ Start Playing Now
        </motion.button>

      </div>
    </div>
  );
}
