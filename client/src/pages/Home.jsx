import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { usePlayerStore } from '../store/usePlayerStore';
import BackgroundEffects from '../components/BackgroundEffects';

const STATS = [
  { value: '10K+', label: 'Students', icon: '👥' },
  { value: '3',    label: 'Age Modes', icon: '🎯' },
  { value: '∞',    label: 'Questions', icon: '🧮' },
  { value: '#1',   label: 'Math Game', icon: '🏆' },
];

const FEATURES = [
  { icon: '⚡', label: 'Multiplayer' },
  { icon: '🤖', label: 'AI Mode' },
  { icon: '🏆', label: 'Ranks' },
  { icon: '🎵', label: 'Sound' },
  { icon: '📊', label: 'Stats' },
  { icon: '🔥', label: 'Streaks' },
];

/* Floating math symbols — large and dramatic on desktop */
const BG_SYMBOLS = [
  { sym: '+', x: '6%',  y: '12%', size: 'clamp(3rem,8vw,9rem)',  opacity: 0.055, color: 'var(--cyan)' },
  { sym: '×', x: '85%', y: '10%', size: 'clamp(2.5rem,7vw,8rem)', opacity: 0.055, color: 'var(--pink)' },
  { sym: '÷', x: '10%', y: '68%', size: 'clamp(3.5rem,9vw,10rem)',opacity: 0.05,  color: 'var(--gold)' },
  { sym: '=', x: '80%', y: '70%', size: 'clamp(3rem,8vw,9rem)',   opacity: 0.05,  color: 'var(--cyan)' },
  { sym: '−', x: '3%',  y: '42%', size: 'clamp(4rem,10vw,12rem)', opacity: 0.04,  color: 'var(--pink)' },
  { sym: '∑', x: '90%', y: '40%', size: 'clamp(3rem,8vw,9rem)',   opacity: 0.055, color: 'var(--gold)' },
  { sym: 'π', x: '45%', y: '5%',  size: 'clamp(2.5rem,6vw,7rem)', opacity: 0.04,  color: 'var(--cyan)' },
  { sym: '∞', x: '48%', y: '84%', size: 'clamp(3rem,7vw,8rem)',   opacity: 0.04,  color: 'var(--pink)' },
  { sym: '√', x: '28%', y: '80%', size: 'clamp(2.8rem,7vw,8rem)', opacity: 0.055, color: 'var(--gold)' },
  { sym: '²', x: '68%', y: '78%', size: 'clamp(2rem,5vw,6rem)',   opacity: 0.055, color: 'var(--cyan)' },
];

export default function Home() {
  const navigate = useNavigate();
  const { level, xp } = usePlayerStore();

  const BUTTONS = [
    { id: 'home-start-btn',       label: '⚡ Start Game',   onClick: () => navigate('/age-select'), color: 'btn-cyan' },
    { id: 'home-join-btn',        label: '🤝 Join Room',    onClick: () => navigate('/setup?tab=join'), color: 'btn-join' },
    { id: 'home-leaderboard-btn', label: '📊 Leaderboard', onClick: () => navigate('/leaderboard'), color: 'btn-ghost' },
    { id: 'home-about-btn',       label: 'ℹ️ About',        onClick: () => navigate('/about'), color: 'btn-ghost' },
  ];

  return (
    <div
      className="stars-bg home-root"
      style={{
        width: '100%', height: '100dvh',
        position: 'relative', overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <BackgroundEffects />

      {/* ── Large background math symbols ── */}
      {BG_SYMBOLS.map((s, i) => (
        <motion.div
          key={i}
          animate={{ y: [0, -12, 0], opacity: [s.opacity * 0.6, s.opacity, s.opacity * 0.6] }}
          transition={{ duration: 5 + i * 0.7, repeat: Infinity, delay: i * 0.5, ease: 'easeInOut' }}
          style={{
            position: 'absolute', left: s.x, top: s.y,
            fontSize: s.size, color: s.color, opacity: s.opacity,
            fontFamily: 'var(--font-display)', fontWeight: 900,
            pointerEvents: 'none', zIndex: 1, userSelect: 'none',
            filter: `blur(0.5px) drop-shadow(0 0 12px ${s.color})`,
          }}
        >{s.sym}</motion.div>
      ))}

      {/* ── Corner gradient accents (larger on desktop) ── */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '40vw', height: '40vh', background: 'radial-gradient(ellipse at top left, rgba(0,245,255,0.07) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 1 }} />
      <div style={{ position: 'absolute', bottom: 0, right: 0, width: '40vw', height: '40vh', background: 'radial-gradient(ellipse at bottom right, rgba(255,0,128,0.07) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 1 }} />
      <div style={{ position: 'absolute', top: 0, right: 0, width: '25vw', height: '30vh', background: 'radial-gradient(ellipse at top right, rgba(255,215,0,0.04) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 1 }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, width: '25vw', height: '30vh', background: 'radial-gradient(ellipse at bottom left, rgba(0,255,136,0.04) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 1 }} />

      {/* ── Decorative side strips ── */}
      <div className="home-deco-strip home-deco-left">
        {['➕','✖️','➗','🟰','➖'].map((sym, i) => (
          <motion.div key={i} animate={{ opacity: [0.3,0.7,0.3], y: [0,-5,0] }}
            transition={{ duration: 3+i*0.5, repeat: Infinity, delay: i*0.4 }}
            style={{ fontSize: 'clamp(0.9rem, 2.2vw, 1.8rem)', color: i%2===0?'var(--cyan)':'var(--pink)', fontFamily: 'var(--font-display)' }}
          >{sym}</motion.div>
        ))}
      </div>
      <div className="home-deco-strip home-deco-right">
        {['🎯','⚡','🏆','🧮','🤖'].map((sym, i) => (
          <motion.div key={i} animate={{ opacity: [0.3,0.7,0.3], y: [0,-5,0] }}
            transition={{ duration: 3+i*0.5, repeat: Infinity, delay: i*0.3+1 }}
            style={{ fontSize: 'clamp(0.9rem, 2vw, 1.6rem)' }}
          >{sym}</motion.div>
        ))}
      </div>

      {/* ── Top / Bottom gradient lines ── */}
      <motion.div initial={{ scaleX:0 }} animate={{ scaleX:1 }} transition={{ duration:1.2, ease:'easeOut' }}
        style={{ position:'absolute', top:0, left:0, right:0, height:'2px', background:'linear-gradient(90deg, transparent, var(--cyan), var(--pink), transparent)', transformOrigin:'left', zIndex:5 }}
      />
      <motion.div initial={{ scaleX:0 }} animate={{ scaleX:1 }} transition={{ duration:1.2, delay:0.3, ease:'easeOut' }}
        style={{ position:'absolute', bottom:0, left:0, right:0, height:'2px', background:'linear-gradient(90deg, transparent, var(--pink), var(--gold), transparent)', transformOrigin:'right', zIndex:5 }}
      />

      {/* ── Level badge ── */}
      <motion.div initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }}
        style={{ position:'absolute', top:'clamp(8px,1.5vh,18px)', right:'clamp(8px,1.5vw,20px)', zIndex:100, background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.12)', padding:'clamp(0.2rem,0.6vh,0.5rem) clamp(0.4rem,1vw,0.8rem)', borderRadius:'10px', display:'flex', alignItems:'center', gap:'clamp(0.3rem,0.7vw,0.6rem)', backdropFilter:'blur(10px)' }}
      >
        <div style={{ width:'clamp(22px,4vh,36px)', height:'clamp(22px,4vh,36px)', borderRadius:'50%', background:'linear-gradient(135deg,var(--gold),#aa8800)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, color:'#0a0a1a', fontSize:'clamp(0.6rem,1.5vh,0.9rem)', boxShadow:'0 0 12px rgba(255,215,0,0.5)' }}>{level}</div>
        <div>
          <div style={{ fontSize:'clamp(0.45rem,1vh,0.6rem)', color:'var(--text-muted)', fontWeight:700, letterSpacing:'0.04em' }}>LVL {level}</div>
          <div style={{ fontSize:'clamp(0.55rem,1.3vh,0.8rem)', color:'var(--gold)', fontWeight:700 }}>{xp} XP</div>
        </div>
      </motion.div>

      {/* ── Main layout ── */}
      <div style={{ display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'center', gap:'clamp(2rem,5vw,6rem)', width:'100%', maxWidth:'1200px', padding:'0 clamp(0.6rem,3vw,3rem)', zIndex:10 }}>

        {/* LEFT: Logo + avatars + stats */}
        <motion.div
          initial={{ opacity:0, x:-40 }} animate={{ opacity:1, x:0 }}
          transition={{ type:'spring', stiffness:100, damping:15 }}
          style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'clamp(0.5rem,1.8vh,1.5rem)', flex:'0 0 auto' }}
        >
          <motion.div animate={{ rotate:[-5,5,-5], y:[0,-6,0] }} transition={{ duration:3, repeat:Infinity, ease:'easeInOut' }}
            style={{ fontSize:'clamp(2rem,7vh,6.5rem)', filter:'drop-shadow(0 0 30px rgba(0,245,255,0.6))', lineHeight:1 }}
          >🪢</motion.div>

          <h1 className="home-logo">MathTug</h1>
          <p className="home-subtitle">⚔️ Tug-of-War Number Battle ⚔️</p>

          <motion.div initial={{ width:0 }} animate={{ width:'clamp(100px,20vw,260px)' }} transition={{ delay:0.4, duration:0.8, type:'spring' }}
            style={{ height:'2px', background:'linear-gradient(90deg,var(--cyan),var(--gold),var(--pink))', borderRadius:'2px', boxShadow:'0 0 12px rgba(255,215,0,0.4)' }}
          />

          {/* Avatars */}
          <div style={{ display:'flex', alignItems:'center', gap:'clamp(0.8rem,2.5vw,2.5rem)' }}>
            <motion.div animate={{ x:[-4,0,-4], y:[0,-4,0] }} transition={{ duration:2.5, repeat:Infinity }}
              style={{ width:'clamp(50px,9vh,110px)', height:'clamp(50px,9vh,110px)', borderRadius:'50%', background:'linear-gradient(135deg,var(--cyan),#004466)', border:'3px solid var(--cyan)', boxShadow:'0 0 32px var(--cyan-glow)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'clamp(1.4rem,4.5vh,3.2rem)' }}
            >🧠</motion.div>

            <motion.div animate={{ scale:[1,1.2,1] }} transition={{ duration:1.4, repeat:Infinity }}
              className="home-vs" style={{ fontSize:'clamp(1rem,3.2vh,2.4rem)', margin:0 }}
            >VS</motion.div>

            <motion.div animate={{ x:[4,0,4], y:[0,-4,0] }} transition={{ duration:2.5, repeat:Infinity }}
              style={{ width:'clamp(50px,9vh,110px)', height:'clamp(50px,9vh,110px)', borderRadius:'50%', background:'linear-gradient(135deg,var(--pink),#440022)', border:'3px solid var(--pink)', boxShadow:'0 0 32px var(--pink-glow)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'clamp(1.4rem,4.5vh,3.2rem)' }}
            >🎯</motion.div>
          </div>

          {/* Stats */}
          <motion.div initial={{ opacity:0,y:10 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.55 }}
            style={{ display:'flex', gap:'clamp(0.5rem,1.5vw,1.2rem)' }}
          >
            {STATS.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity:0, scale:0.8 }} animate={{ opacity:1, scale:1 }} transition={{ delay:0.6+i*0.07 }}
                whileHover={{ scale:1.08, y:-2 }}
                style={{ textAlign:'center', padding:'clamp(0.3rem,1.2vh,1rem) clamp(0.5rem,1.2vw,1.2rem)', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'12px', backdropFilter:'blur(8px)', cursor:'default' }}
              >
                <div style={{ fontSize:'clamp(0.9rem,2.2vh,1.5rem)', marginBottom:'3px' }}>{s.icon}</div>
                <div style={{ fontFamily:'var(--font-display)', fontSize:'clamp(0.8rem,2.2vh,1.4rem)', fontWeight:900, background:'linear-gradient(135deg,var(--cyan),var(--gold))', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>{s.value}</div>
                <div style={{ fontSize:'clamp(0.44rem,1vh,0.65rem)', color:'var(--text-muted)', fontWeight:600, letterSpacing:'0.05em', textTransform:'uppercase', marginTop:'2px' }}>{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* RIGHT: Buttons + features */}
        <motion.div
          initial={{ opacity:0, x:40 }} animate={{ opacity:1, x:0 }}
          transition={{ type:'spring', stiffness:100, damping:15, delay:0.15 }}
          style={{ display:'flex', flexDirection:'column', gap:'clamp(0.4rem,1.3vh,1rem)', alignItems:'stretch', flex:'0 0 auto', minWidth:'clamp(220px,32vw,380px)' }}
        >
          {/* Tagline box */}
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.1 }}
            style={{ padding:'clamp(0.3rem,0.9vh,0.7rem) clamp(0.6rem,1.5vw,1.1rem)', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'12px', textAlign:'center', position:'relative', overflow:'hidden' }}
          >
            <div style={{ position:'absolute', top:0, left:0, right:0, height:'1.5px', background:'linear-gradient(90deg,var(--cyan),var(--pink))' }} />
            <p style={{ fontSize:'clamp(0.55rem,1.3vh,0.82rem)', color:'var(--text-muted)', letterSpacing:'0.03em', lineHeight:1.6, margin:0 }}>
              🧮 Solve math faster than your opponent.<br/>Pull the rope. Win the match!
            </p>
          </motion.div>

          {BUTTONS.map((btn, i) => (
            <motion.button
              key={btn.id} id={btn.id}
              initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }}
              transition={{ delay:0.2+i*0.08, type:'spring' }}
              whileHover={{ scale:1.04, x:5 }} whileTap={{ scale:0.96 }}
              onClick={btn.onClick}
              className={`btn ${btn.color==='btn-join'?'':btn.color}`}
              style={{ width:'100%', textAlign:'left', padding:'clamp(0.35rem,1.2vh,0.9rem) clamp(0.8rem,2vw,1.6rem)', fontSize:'clamp(0.6rem,1.6vh,0.95rem)', fontWeight:800, letterSpacing:'0.05em', minHeight:'unset',
                ...(btn.color==='btn-join'?{ background:'rgba(0,255,136,0.1)', border:'2px solid rgba(0,255,136,0.4)', color:'#00ff88', boxShadow:'0 0 18px rgba(0,255,136,0.12)', borderRadius:'50px' }:{}) }}
            >
              {btn.label}
            </motion.button>
          ))}

          {/* Feature pills — 2 rows */}
          <div style={{ display:'flex', flexWrap:'wrap', gap:'clamp(0.2rem,0.5vh,0.4rem)', marginTop:'clamp(0.1rem,0.3vh,0.2rem)' }}>
            {FEATURES.map((feat, i) => (
              <motion.span key={feat.label} initial={{ opacity:0, scale:0.8 }} animate={{ opacity:1, scale:1 }} transition={{ delay:0.55+i*0.06 }}
                style={{ fontSize:'clamp(0.45rem,1.1vh,0.7rem)', padding:'clamp(0.15rem,0.45vh,0.35rem) clamp(0.4rem,0.9vw,0.7rem)', borderRadius:'50px', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.12)', color:'var(--text-muted)', fontWeight:600, whiteSpace:'nowrap', display:'flex', alignItems:'center', gap:'3px' }}
              >{feat.icon} {feat.label}</motion.span>
            ))}
          </div>

          {/* Quick-play prompt */}
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.8 }}
            style={{ textAlign:'center', marginTop:'clamp(0.1rem,0.4vh,0.3rem)' }}
          >
            <motion.div animate={{ opacity:[0.5,1,0.5] }} transition={{ duration:2, repeat:Infinity }}
              style={{ fontSize:'clamp(0.42rem,0.95vh,0.62rem)', color:'var(--cyan)', fontFamily:'var(--font-display)', letterSpacing:'0.12em' }}
            >
              ▶ PRESS START TO PLAY
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
