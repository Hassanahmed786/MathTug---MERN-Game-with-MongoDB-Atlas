import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import BackgroundEffects from '../components/BackgroundEffects';

export default function About() {
  const navigate = useNavigate();

  const features = [
    { icon: '🎯', title: 'Real-time Multiplayer', color: 'var(--cyan)' },
    { icon: '🧮', title: '3 Difficulty Modes', color: 'var(--pink)' },
    { icon: '🏆', title: 'Leaderboard & XP', color: 'var(--gold)' },
    { icon: '🤖', title: 'AI Bot Mode', color: 'var(--cyan)' },
    { icon: '🎮', title: 'Interactive Rope Battle', color: 'var(--pink)' },
    { icon: '🎵', title: 'Sound Effects', color: 'var(--gold)' },
  ];

  const steps = [
    { num: '1', label: 'Select Level', desc: 'Choose age-appropriate difficulty', color: 'var(--cyan)' },
    { num: '2', label: 'Pick Mode', desc: 'Local, Online, or AI opponent', color: 'var(--pink)' },
    { num: '3', label: 'Solve Math', desc: 'Answer faster than your rival', color: 'var(--gold)' },
    { num: '4', label: 'Win!', desc: 'Pull the rope — earn XP & rank up', color: 'var(--cyan)' },
  ];

  const benefits = [
    '✨ Builds math confidence fast',
    '🚀 Accelerates mental fluency',
    '👥 Social peer competition',
    '📊 Tracks your progress',
  ];

  return (
    <div
      className="stars-bg"
      style={{
        width: '100%',
        height: '100dvh',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <BackgroundEffects />

      {/* Top bar: Back + Title */}
      <div style={{
        position: 'relative',
        zIndex: 20,
        display: 'flex',
        alignItems: 'center',
        gap: 'clamp(0.5rem, 2vw, 1.5rem)',
        padding: 'clamp(0.3rem, 1vh, 0.8rem) clamp(0.5rem, 1.5vw, 1.2rem)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        flexShrink: 0,
        background: 'rgba(10,10,26,0.4)',
        backdropFilter: 'blur(10px)',
      }}>
        {/* Top gradient line */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
          background: 'linear-gradient(90deg, transparent, var(--cyan), var(--pink), transparent)',
          pointerEvents: 'none',
        }} />

        <motion.button
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => navigate('/')}
          style={{
            background: 'rgba(0,245,255,0.1)',
            border: '1.5px solid rgba(0,245,255,0.3)',
            color: 'var(--cyan)',
            padding: 'clamp(0.2rem, 0.6vh, 0.45rem) clamp(0.5rem, 1.2vw, 1rem)',
            borderRadius: '50px',
            fontSize: 'clamp(0.55rem, 1.4vh, 0.8rem)',
            fontWeight: '700',
            cursor: 'pointer',
            fontFamily: 'var(--font-display)',
            letterSpacing: '0.04em',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
        >
          ← Back
        </motion.button>

        <div style={{ flex: 1, textAlign: 'center' }}>
          <motion.div
            animate={{ rotate: [-4, 4, -4], y: [0, -3, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            style={{
              display: 'inline-block',
              fontSize: 'clamp(1rem, 2.5vh, 1.8rem)',
              marginRight: 'clamp(0.3rem, 0.8vw, 0.6rem)',
              filter: 'drop-shadow(0 0 10px rgba(0,245,255,0.4))',
            }}
          >🪢</motion.div>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(0.8rem, 2.5vh, 1.5rem)',
            fontWeight: 900,
            background: 'linear-gradient(135deg, var(--cyan), var(--gold), var(--pink))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>About MathTug</span>
        </div>

        {/* Play now button */}
        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => navigate('/age-select')}
          className="btn btn-cyan"
          style={{
            fontSize: 'clamp(0.52rem, 1.3vh, 0.75rem)',
            padding: 'clamp(0.2rem, 0.6vh, 0.4rem) clamp(0.5rem, 1.2vw, 1rem)',
            whiteSpace: 'nowrap',
            flexShrink: 0,
            minHeight: 'unset',
          }}
        >
          ⚡ Play Now
        </motion.button>
      </div>

      {/* Two-column body */}
      <div style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 'clamp(0.4rem, 1.5vw, 1.2rem)',
        padding: 'clamp(0.4rem, 1.2vh, 0.9rem) clamp(0.5rem, 1.5vw, 1.2rem)',
        overflow: 'hidden',
        position: 'relative',
        zIndex: 10,
        minHeight: 0,
      }}>

        {/* ── LEFT COLUMN ── */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(0.3rem, 1vh, 0.7rem)',
          overflow: 'hidden',
          minHeight: 0,
        }}>
          {/* Description card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.09)',
              borderRadius: 'clamp(8px, 1.5vh, 14px)',
              padding: 'clamp(0.4rem, 1.2vh, 0.8rem) clamp(0.5rem, 1.5vw, 1rem)',
              position: 'relative',
              overflow: 'hidden',
              flexShrink: 0,
            }}
          >
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
              background: 'linear-gradient(90deg, var(--cyan), var(--pink))',
            }} />
            <p style={{
              fontSize: 'clamp(0.55rem, 1.4vh, 0.82rem)',
              color: 'var(--text-muted)',
              lineHeight: 1.6,
              margin: 0,
            }}>
              🧮 <strong style={{ color: 'var(--text-primary)' }}>MathTug</strong> transforms math learning into exciting tug-of-war battles. Answer faster, pull harder, win!
            </p>
            <p style={{
              fontSize: 'clamp(0.52rem, 1.3vh, 0.75rem)',
              color: 'var(--text-muted)',
              lineHeight: 1.5,
              margin: 'clamp(0.3rem, 0.8vh, 0.5rem) 0 0',
            }}>
              🚀 Built with MERN stack — real-time multiplayer, AI opponents, live leaderboards, and 3 age-appropriate difficulty modes.
            </p>
          </motion.div>

          {/* Benefits */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{ flexShrink: 0 }}
          >
            <div style={{
              fontSize: 'clamp(0.55rem, 1.4vh, 0.8rem)',
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              background: 'linear-gradient(90deg, var(--cyan), var(--pink))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '0.06em',
              marginBottom: 'clamp(0.2rem, 0.6vh, 0.4rem)',
            }}>Why MathTug?</div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 'clamp(0.2rem, 0.6vh, 0.4rem)',
            }}>
              {benefits.map((b, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + i * 0.05 }}
                  style={{
                    background: 'rgba(0,245,255,0.05)',
                    border: '1px solid rgba(0,245,255,0.12)',
                    borderRadius: 'clamp(5px, 1vh, 9px)',
                    padding: 'clamp(0.2rem, 0.7vh, 0.45rem) clamp(0.3rem, 0.8vw, 0.5rem)',
                    fontSize: 'clamp(0.48rem, 1.2vh, 0.72rem)',
                    color: 'var(--text-muted)',
                    lineHeight: 1.4,
                  }}
                >{b}</motion.div>
              ))}
            </div>
          </motion.div>

          {/* How to Play */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{ flex: 1, minHeight: 0 }}
          >
            <div style={{
              fontSize: 'clamp(0.55rem, 1.4vh, 0.8rem)',
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              background: 'linear-gradient(90deg, var(--gold), var(--cyan))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '0.06em',
              marginBottom: 'clamp(0.2rem, 0.6vh, 0.4rem)',
            }}>How to Play</div>
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 'clamp(8px, 1.5vh, 14px)',
              padding: 'clamp(0.3rem, 0.9vh, 0.6rem) clamp(0.4rem, 1vw, 0.7rem)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'clamp(0.2rem, 0.7vh, 0.45rem)',
            }}>
              {steps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + i * 0.06 }}
                  style={{ display: 'flex', alignItems: 'center', gap: 'clamp(0.3rem, 0.8vw, 0.6rem)' }}
                >
                  <div style={{
                    width: 'clamp(16px, 3vh, 22px)',
                    height: 'clamp(16px, 3vh, 22px)',
                    minWidth: 'clamp(16px, 3vh, 22px)',
                    borderRadius: '50%',
                    background: `${step.color}20`,
                    border: `1.5px solid ${step.color}60`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 'clamp(0.45rem, 1.1vh, 0.65rem)',
                    fontWeight: 900,
                    color: step.color,
                    fontFamily: 'var(--font-display)',
                  }}>{step.num}</div>
                  <div>
                    <div style={{ color: step.color, fontSize: 'clamp(0.5rem, 1.2vh, 0.72rem)', fontWeight: 700 }}>
                      {step.label}
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: 'clamp(0.44rem, 1vh, 0.62rem)', lineHeight: 1.3 }}>
                      {step.desc}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(0.3rem, 1vh, 0.7rem)',
          overflow: 'hidden',
          minHeight: 0,
        }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            style={{ flexShrink: 0 }}
          >
            <div style={{
              fontSize: 'clamp(0.55rem, 1.4vh, 0.8rem)',
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              background: 'linear-gradient(90deg, var(--pink), var(--gold))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '0.06em',
              marginBottom: 'clamp(0.2rem, 0.6vh, 0.4rem)',
            }}>Key Features</div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 'clamp(0.2rem, 0.6vh, 0.4rem)',
            }}>
              {features.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.88 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + i * 0.06 }}
                  whileHover={{ scale: 1.03 }}
                  style={{
                    background: 'linear-gradient(135deg, rgba(0,245,255,0.05), rgba(255,0,128,0.05))',
                    border: `1px solid ${f.color}25`,
                    borderRadius: 'clamp(6px, 1.2vh, 12px)',
                    padding: 'clamp(0.25rem, 0.8vh, 0.5rem) clamp(0.3rem, 0.8vw, 0.5rem)',
                    position: 'relative',
                    overflow: 'hidden',
                    cursor: 'default',
                  }}
                >
                  <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
                    background: `linear-gradient(90deg, ${f.color}, transparent)`,
                  }} />
                  <div style={{ fontSize: 'clamp(0.85rem, 2vh, 1.3rem)', lineHeight: 1 }}>{f.icon}</div>
                  <div style={{
                    color: f.color,
                    fontSize: 'clamp(0.46rem, 1.1vh, 0.66rem)',
                    fontWeight: 700,
                    fontFamily: 'var(--font-display)',
                    letterSpacing: '0.03em',
                    marginTop: 'clamp(0.15rem, 0.4vh, 0.25rem)',
                    lineHeight: 1.3,
                  }}>{f.title}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Tech stack */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 'clamp(8px, 1.5vh, 14px)',
              padding: 'clamp(0.3rem, 0.9vh, 0.6rem) clamp(0.4rem, 1vw, 0.7rem)',
              flexShrink: 0,
            }}
          >
            <div style={{
              fontSize: 'clamp(0.48rem, 1.1vh, 0.68rem)',
              color: 'var(--text-muted)',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: 'clamp(0.15rem, 0.5vh, 0.3rem)',
            }}>🛠 Built With</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(0.15rem, 0.5vh, 0.3rem)' }}>
              {['MongoDB', 'Express', 'React', 'Node.js', 'Socket.io', 'Framer Motion'].map((tech, i) => (
                <span key={i} style={{
                  fontSize: 'clamp(0.44rem, 1vh, 0.62rem)',
                  padding: 'clamp(0.1rem, 0.35vh, 0.2rem) clamp(0.3rem, 0.7vw, 0.45rem)',
                  borderRadius: '50px',
                  background: 'rgba(0,245,255,0.08)',
                  border: '1px solid rgba(0,245,255,0.15)',
                  color: 'var(--cyan)',
                  fontWeight: 600,
                }}>{tech}</span>
              ))}
            </div>
          </motion.div>

          {/* Age modes visual */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            style={{ flex: 1, minHeight: 0 }}
          >
            <div style={{
              fontSize: 'clamp(0.55rem, 1.4vh, 0.8rem)',
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              background: 'linear-gradient(90deg, var(--gold), var(--pink))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '0.06em',
              marginBottom: 'clamp(0.2rem, 0.5vh, 0.35rem)',
            }}>Age Modes</div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: 'clamp(0.2rem, 0.6vh, 0.4rem)',
              height: '100%',
            }}>
              {[
                { emoji: '🧸', name: 'Little Ones', age: '4–6', color: '#FF69B4', bg: 'linear-gradient(135deg, #FFB6C1, #FF69B4)' },
                { emoji: '🎓', name: 'Explorers', age: '7–10', color: '#5B9BD5', bg: 'linear-gradient(135deg, #87CEEB, #4169E1)' },
                { emoji: '⚡', name: 'Ninjas', age: '11+', color: '#FF8C00', bg: 'linear-gradient(135deg, #FFD700, #FF6B35)' },
              ].map((m, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate('/age-select')}
                  style={{
                    background: m.bg,
                    border: `1.5px solid ${m.color}80`,
                    borderRadius: 'clamp(7px, 1.4vh, 12px)',
                    color: '#fff',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 'clamp(0.1rem, 0.4vh, 0.25rem)',
                    padding: 'clamp(0.2rem, 0.7vh, 0.45rem) clamp(0.2rem, 0.5vw, 0.35rem)',
                    boxShadow: `0 4px 12px rgba(0,0,0,0.25), 0 0 10px ${m.color}30`,
                    textShadow: '0 1px 4px rgba(0,0,0,0.4)',
                    minHeight: 0,
                  }}
                >
                  <div style={{ fontSize: 'clamp(0.9rem, 2vh, 1.4rem)', lineHeight: 1 }}>{m.emoji}</div>
                  <div style={{ fontSize: 'clamp(0.44rem, 1vh, 0.62rem)', fontWeight: 800, fontFamily: 'var(--font-display)', lineHeight: 1.2, textAlign: 'center' }}>{m.name}</div>
                  <div style={{ fontSize: 'clamp(0.4rem, 0.9vh, 0.56rem)', opacity: 0.9, fontWeight: 600 }}>Ages {m.age}</div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
