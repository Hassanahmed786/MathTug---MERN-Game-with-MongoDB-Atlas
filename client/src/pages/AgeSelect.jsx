import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { usePlayerStore } from '../store/usePlayerStore';

const AGE_MODES = [
  {
    id: 'little-ones',
    name: 'Little Ones',
    emoji: '🧸',
    ageRange: 'Ages 4–6',
    description: 'Numbers 1–10, Basic +/−',
    tagline: 'Perfect for beginners!',
    detail: 'Simple addition & subtraction with numbers up to 10. Fun and confidence-building!',
    gradient: 'linear-gradient(145deg,#FFB6C1 0%,#FF69B4 50%,#FF1493 100%)',
    glowColor: 'rgba(255,105,180,0.45)',
    borderColor: 'rgba(255,105,180,0.65)',
    accent: '#FF69B4',
  },
  {
    id: 'explorers',
    name: 'Math Explorers',
    emoji: '🎓',
    ageRange: 'Ages 7–10',
    description: 'Tables, Division & sums to 100',
    tagline: 'Level up your skills!',
    detail: 'Multiplication tables, long division, and two-digit arithmetic up to 100.',
    gradient: 'linear-gradient(145deg,#87CEEB 0%,#5B9BD5 50%,#2E4DA8 100%)',
    glowColor: 'rgba(91,155,213,0.45)',
    borderColor: 'rgba(91,155,213,0.65)',
    accent: '#5B9BD5',
  },
  {
    id: 'ninjas',
    name: 'Number Ninjas',
    emoji: '⚡',
    ageRange: 'Ages 11+',
    description: 'Advanced equations & multi-step ops',
    tagline: 'For the math masters!',
    detail: 'Algebra-style equations, multi-step operations, and rapid calculation challenges.',
    gradient: 'linear-gradient(145deg,#FFD700 0%,#FF8C00 50%,#FF4500 100%)',
    glowColor: 'rgba(255,140,0,0.45)',
    borderColor: 'rgba(255,140,0,0.65)',
    accent: '#FF8C00',
  },
];

const BG_SYMBOLS = [
  { sym:'÷', x:'5%',  y:'20%', size:'6rem' },
  { sym:'+', x:'88%', y:'15%', size:'5rem' },
  { sym:'×', x:'92%', y:'70%', size:'6rem' },
  { sym:'=', x:'4%',  y:'72%', size:'5rem' },
  { sym:'√', x:'45%', y:'5%',  size:'4rem' },
];

export default function AgeSelect() {
  const navigate = useNavigate();
  const { setAgeMode } = usePlayerStore();

  const handleSelectMode = (modeId) => {
    setAgeMode(modeId);
    navigate('/setup');
  };

  return (
    <div
      className="stars-bg"
      style={{ width:'100%', height:'100dvh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', position:'relative', overflow:'hidden', padding:'clamp(0.4rem,1.5vh,1.2rem) clamp(0.5rem,2vw,1.5rem)', gap:'clamp(0.5rem,1.5vh,1.2rem)' }}
    >
      {/* Background math symbols */}
      {BG_SYMBOLS.map((s,i) => (
        <motion.div key={i} animate={{ y:[0,-14,0], opacity:[0.03,0.05,0.03] }} transition={{ duration:6+i*0.8, repeat:Infinity, delay:i*0.6, ease:'easeInOut' }}
          style={{ position:'absolute', left:s.x, top:s.y, fontSize:s.size, color:'var(--cyan)', fontFamily:'var(--font-display)', fontWeight:900, pointerEvents:'none', zIndex:0, userSelect:'none' }}
        >{s.sym}</motion.div>
      ))}

      {/* Corner glows */}
      <div style={{ position:'absolute', top:0, left:0, width:'30vw', height:'30vh', background:'radial-gradient(ellipse at top left,rgba(0,245,255,0.07) 0%,transparent 70%)', pointerEvents:'none', zIndex:1 }} />
      <div style={{ position:'absolute', bottom:0, right:0, width:'30vw', height:'30vh', background:'radial-gradient(ellipse at bottom right,rgba(255,0,128,0.07) 0%,transparent 70%)', pointerEvents:'none', zIndex:1 }} />

      {/* Background hex grid SVG */}
      <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none', opacity:0.035, zIndex:1 }} preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id="ageGrid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="rgba(0,245,255,0.4)" strokeWidth="0.6"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#ageGrid)" />
      </svg>

      {/* Top/bottom lines */}
      <div style={{ position:'absolute', top:0, left:0, right:0, height:'2px', background:'linear-gradient(90deg,transparent,var(--cyan),var(--gold),var(--pink),transparent)', zIndex:5, pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'2px', background:'linear-gradient(90deg,transparent,var(--pink),var(--gold),transparent)', zIndex:5, pointerEvents:'none' }} />

      {/* Back button */}
      <motion.button whileHover={{ scale:1.08 }} whileTap={{ scale:0.92 }} onClick={() => navigate('/')}
        style={{ position:'absolute', top:'clamp(6px,1.5vh,14px)', left:'clamp(8px,1.5vw,18px)', background:'rgba(255,255,255,0.06)', border:'1.5px solid rgba(255,255,255,0.2)', color:'var(--text-primary)', padding:'clamp(0.18rem,0.6vh,0.45rem) clamp(0.4rem,1.2vw,0.9rem)', borderRadius:'50px', fontFamily:'var(--font-display)', fontSize:'clamp(0.5rem,1.3vh,0.78rem)', cursor:'pointer', zIndex:100, backdropFilter:'blur(10px)' }}
      >← Back</motion.button>

      {/* Title section */}
      <motion.div initial={{ opacity:0,y:-18 }} animate={{ opacity:1,y:0 }} style={{ textAlign:'center', zIndex:10, flexShrink:0 }}>
        <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(1.2rem,4vh,3.2rem)', fontWeight:900, background:'linear-gradient(135deg,var(--cyan) 0%,var(--gold) 50%,var(--pink) 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', lineHeight:1.1, margin:0 }}>
          Choose Your Level
        </h1>
        <p style={{ fontFamily:'var(--font-body)', fontSize:'clamp(0.52rem,1.4vh,0.9rem)', color:'var(--text-muted)', letterSpacing:'0.08em', margin:'clamp(0.15rem,0.5vh,0.35rem) 0 0' }}>
          🎯 Select a difficulty mode to begin your battle
        </p>
      </motion.div>

      {/* Mode cards — 3 side-by-side, sized to fill available space */}
      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.1 }}
        style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'clamp(0.8rem,2.5vw,2.5rem)', width:'100%', maxWidth:'clamp(600px,90vw,1240px)', zIndex:10, flexShrink:0 }}
      >
        {AGE_MODES.map((mode, index) => (
          <motion.button
            key={mode.id}
            initial={{ opacity:0,y:28,scale:0.9 }} animate={{ opacity:1,y:0,scale:1 }}
            transition={{ delay:0.18+index*0.1, type:'spring', stiffness:110 }}
            whileHover={{ scale:1.05,y:-8 }} whileTap={{ scale:0.97 }}
            onClick={() => handleSelectMode(mode.id)}
            style={{
              background:mode.gradient,
              border:`2px solid ${mode.borderColor}`,
              borderRadius:'clamp(12px,2.5vh,24px)',
              padding:'clamp(1rem,3vh,2.5rem) clamp(0.8rem,2vw,1.5rem)',
              color:'#fff', cursor:'pointer',
              position:'relative', overflow:'hidden',
              textAlign:'center',
              boxShadow:`0 8px 32px rgba(0,0,0,0.4), 0 0 30px ${mode.glowColor}`,
              height:'clamp(180px,32vh,320px)',
              display:'flex', flexDirection:'column',
              alignItems:'center', justifyContent:'center',
              gap:'clamp(0.4rem,1vh,0.9rem)',
            }}
          >
            {/* Inner shimmer */}
            <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg,rgba(255,255,255,0.18) 0%,transparent 50%,rgba(255,255,255,0.06) 100%)', pointerEvents:'none' }} />
            {/* Top shine */}
            <div style={{ position:'absolute', top:0, left:'8%', right:'8%', height:'1px', background:'rgba(255,255,255,0.65)' }} />
            {/* Bottom glow strip */}
            <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'3px', background:`rgba(255,255,255,0.25)` }} />

            <div style={{ fontSize:'clamp(2.5rem,7vh,5.5rem)', lineHeight:1, filter:`drop-shadow(0 4px 12px rgba(0,0,0,0.35)) drop-shadow(0 0 20px ${mode.accent}60)` }}>
              {mode.emoji}
            </div>

            <h2 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(0.8rem,2.2vh,1.5rem)', fontWeight:900, margin:0, textShadow:'0 2px 8px rgba(0,0,0,0.4)', lineHeight:1.2 }}>
              {mode.name}
            </h2>

            <div style={{ fontSize:'clamp(0.52rem,1.3vh,0.85rem)', fontWeight:700, opacity:0.95, background:'rgba(0,0,0,0.22)', padding:'clamp(0.1rem,0.35vh,0.25rem) clamp(0.5rem,1vw,0.8rem)', borderRadius:'50px', backdropFilter:'blur(4px)' }}>
              {mode.ageRange}
            </div>

            <p style={{ fontSize:'clamp(0.5rem,1.2vh,0.78rem)', fontWeight:600, opacity:0.92, lineHeight:1.4, margin:0, textShadow:'0 1px 4px rgba(0,0,0,0.3)' }}>
              {mode.description}
            </p>

            <div className="age-card-tagline" style={{ fontSize:'clamp(0.44rem,1.1vh,0.7rem)', fontStyle:'italic', opacity:0.8, lineHeight:1.4 }}>
              {mode.detail}
            </div>

            {/* Play button indicator */}
            <motion.div animate={{ opacity:[0.65,1,0.65] }} transition={{ duration:2, repeat:Infinity }}
              style={{ fontSize:'clamp(0.42rem,1vh,0.65rem)', fontWeight:700, letterSpacing:'0.1em', background:'rgba(0,0,0,0.25)', padding:'clamp(0.12rem,0.4vh,0.28rem) clamp(0.5rem,1.2vw,0.8rem)', borderRadius:'50px', fontFamily:'var(--font-display)', marginTop:'auto' }}
            >
              TAP TO SELECT ▶
            </motion.div>
          </motion.button>
        ))}
      </motion.div>

      {/* Tip */}
      <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.55 }}
        style={{ fontFamily:'var(--font-body)', fontSize:'clamp(0.44rem,1.1vh,0.75rem)', color:'var(--text-muted)', zIndex:10, flexShrink:0, margin:0, textAlign:'center' }}
      >
        💡 You can change difficulty anytime from settings!
      </motion.p>
    </div>
  );
}
