import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import BackgroundEffects from '../components/BackgroundEffects';

const features = [
  { icon: '⚡', title: 'Real-time Multiplayer', desc: 'Battle friends live over the network', color: 'var(--cyan)' },
  { icon: '🤖', title: 'AI Bot Mode',           desc: 'Challenge our smart math AI solo',    color: 'var(--pink)' },
  { icon: '🏆', title: 'Leaderboard & XP',      desc: 'Rank up, earn XP, dominate the board', color: 'var(--gold)' },
  { icon: '🎓', title: '3 Difficulty Tiers',    desc: 'From kindergarten basics to algebra', color: 'var(--cyan)' },
  { icon: '🎮', title: 'Rope Battle Visuals',   desc: 'Animated tug-of-war reactions',       color: 'var(--pink)' },
  { icon: '🎵', title: 'Sound & Haptics',        desc: 'Immersive audio feedback system',     color: 'var(--gold)' },
];

const steps = [
  { num: '01', label: 'Select Level',  desc: 'Pick an age-appropriate difficulty mode', color: 'var(--cyan)' },
  { num: '02', label: 'Set Up Game',   desc: 'Choose Online, Local co-op, or vs AI',    color: 'var(--pink)' },
  { num: '03', label: 'Solve Faster',  desc: 'Answer math questions before your rival', color: 'var(--gold)' },
  { num: '04', label: 'Pull & Win',    desc: 'Each correct answer pulls the rope!',     color: 'var(--cyan)' },
];

const ageModes = [
  { emoji: '🧸', name: 'Little Ones',   age: '4–6',  sub: 'Numbers 1–10\nBasic +/−',         color: '#FF69B4', bg: 'linear-gradient(145deg,#FFB6C1,#FF69B4,#FF1493)' },
  { emoji: '🎓', name: 'Explorers',     age: '7–10', sub: 'Tables & Division\nSums to 100',    color: '#5B9BD5', bg: 'linear-gradient(145deg,#87CEEB,#5B9BD5,#2E4DA8)' },
  { emoji: '⚡', name: 'Ninjas',        age: '11+',  sub: 'Advanced Equations\nMulti-step ops', color: '#FF8C00', bg: 'linear-gradient(145deg,#FFD700,#FF8C00,#FF4500)' },
];

const benefits = [
  { icon: '✨', text: 'Builds math confidence through immediate feedback' },
  { icon: '🚀', text: 'Accelerates mental math fluency and speed' },
  { icon: '🎯', text: 'Motivates learning with competitive rewards' },
  { icon: '👥', text: 'Enables social learning and peer competition' },
  { icon: '📊', text: 'Tracks progress with detailed statistics' },
  { icon: '🔥', text: 'Makes practice fun with engaging gameplay' },
];

const techStack = ['MongoDB', 'Express.js', 'React', 'Node.js', 'Socket.io', 'Framer Motion', 'JWT Auth'];

export default function About() {
  const navigate = useNavigate();

  return (
    <div
      className="stars-bg"
      style={{ width:'100%', height:'100dvh', overflow:'hidden', position:'relative', display:'flex', flexDirection:'column' }}
    >
      <BackgroundEffects />

      {/* Faint background math symbols */}
      {[
        { sym:'∑', x:'4%',  y:'25%', size:'8rem', color:'var(--cyan)' },
        { sym:'π', x:'88%', y:'15%', size:'6rem', color:'var(--pink)' },
        { sym:'√', x:'92%', y:'65%', size:'7rem', color:'var(--gold)' },
        { sym:'∞', x:'3%',  y:'70%', size:'6rem', color:'var(--pink)' },
      ].map((s,i) => (
        <div key={i} style={{ position:'absolute', left:s.x, top:s.y, fontSize:s.size, color:s.color, opacity:0.03, fontFamily:'var(--font-display)', fontWeight:900, pointerEvents:'none', zIndex:0, userSelect:'none' }}>{s.sym}</div>
      ))}

      {/* Corner glow patches */}
      <div style={{ position:'absolute', top:0, left:0, width:'35vw', height:'35vh', background:'radial-gradient(ellipse at top left,rgba(0,245,255,0.07) 0%,transparent 70%)', pointerEvents:'none', zIndex:1 }} />
      <div style={{ position:'absolute', bottom:0, right:0, width:'35vw', height:'35vh', background:'radial-gradient(ellipse at bottom right,rgba(255,0,128,0.07) 0%,transparent 70%)', pointerEvents:'none', zIndex:1 }} />

      {/* ── TOP BAR ── */}
      <div style={{
        position:'relative', zIndex:20, flexShrink:0,
        display:'flex', alignItems:'center', gap:'clamp(0.5rem,2vw,1.5rem)',
        padding:'clamp(0.4rem,1.2vh,0.9rem) clamp(0.8rem,2vw,1.8rem)',
        borderBottom:'1px solid rgba(255,255,255,0.07)',
        background:'rgba(10,10,26,0.5)', backdropFilter:'blur(12px)',
      }}>
        <div style={{ position:'absolute', top:0, left:0, right:0, height:'2px', background:'linear-gradient(90deg,transparent,var(--cyan),var(--pink),transparent)' }} />

        <motion.button initial={{ opacity:0,x:-16 }} animate={{ opacity:1,x:0 }} whileHover={{ scale:1.06 }} whileTap={{ scale:0.94 }}
          onClick={() => navigate('/')}
          style={{ background:'rgba(0,245,255,0.1)', border:'1.5px solid rgba(0,245,255,0.3)', color:'var(--cyan)', padding:'clamp(0.2rem,0.7vh,0.5rem) clamp(0.5rem,1.3vw,1.2rem)', borderRadius:'50px', fontSize:'clamp(0.55rem,1.4vh,0.85rem)', fontWeight:700, cursor:'pointer', fontFamily:'var(--font-display)', letterSpacing:'0.04em', whiteSpace:'nowrap', flexShrink:0 }}
        >← Back</motion.button>

        {/* Centred title */}
        <div style={{ flex:1, textAlign:'center' }}>
          <span style={{ fontFamily:'var(--font-display)', fontSize:'clamp(0.9rem,2.8vh,1.8rem)', fontWeight:900, background:'linear-gradient(135deg,var(--cyan),var(--gold),var(--pink))', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
            About MathTug
          </span>
          <div style={{ fontSize:'clamp(0.42rem,1vh,0.65rem)', color:'var(--text-muted)', letterSpacing:'0.14em', textTransform:'uppercase', marginTop:'2px' }}>
            MAKING MATH FUN THROUGH COMPETITION
          </div>
        </div>

        <motion.button whileHover={{ scale:1.06 }} whileTap={{ scale:0.94 }} onClick={() => navigate('/age-select')}
          className="btn btn-cyan"
          style={{ fontSize:'clamp(0.52rem,1.3vh,0.8rem)', padding:'clamp(0.2rem,0.7vh,0.5rem) clamp(0.6rem,1.5vw,1.2rem)', whiteSpace:'nowrap', flexShrink:0, minHeight:'unset' }}
        >⚡ Play Now</motion.button>
      </div>

      {/* ── BODY: 3-column grid ── */}
      <div style={{
        flex:1, minHeight:0, overflow:'hidden',
        display:'grid',
        gridTemplateColumns: '1fr 1.1fr 1fr',
        gridTemplateRows: '1fr',
        gap:'clamp(0.5rem,1.2vw,1rem)',
        padding:'clamp(0.5rem,1.5vh,1rem) clamp(0.8rem,2vw,1.8rem)',
        position:'relative', zIndex:10,
      }}>

        {/* ══ COLUMN 1: About + Benefits ══ */}
        <div style={{ display:'flex', flexDirection:'column', gap:'clamp(0.4rem,1.2vh,0.8rem)', minHeight:0, overflow:'hidden' }}>

          {/* Hero description */}
          <motion.div initial={{ opacity:0,y:16 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.08 }}
            style={{ background:'rgba(0,245,255,0.05)', border:'1px solid rgba(0,245,255,0.15)', borderRadius:'clamp(10px,2vh,16px)', padding:'clamp(0.5rem,1.5vh,1rem) clamp(0.7rem,1.8vw,1.2rem)', position:'relative', overflow:'hidden', flexShrink:0 }}
          >
            <div style={{ position:'absolute', top:0, left:0, right:0, height:'2.5px', background:'linear-gradient(90deg,var(--cyan),var(--pink))' }} />
            <div style={{ fontSize:'clamp(0.7rem,1.8vh,1rem)', fontFamily:'var(--font-display)', color:'var(--cyan)', fontWeight:700, marginBottom:'clamp(0.3rem,0.8vh,0.5rem)', display:'flex', alignItems:'center', gap:'0.4rem' }}>
              🪢 What is MathTug?
            </div>
            <p style={{ fontSize:'clamp(0.55rem,1.4vh,0.85rem)', color:'var(--text-muted)', lineHeight:1.65, margin:0 }}>
              <strong style={{ color:'var(--text-primary)' }}>MathTug</strong> is an interactive, educational battle platform that transforms math practice into a live tug-of-war competition.
            </p>
            <p style={{ fontSize:'clamp(0.52rem,1.3vh,0.78rem)', color:'var(--text-muted)', lineHeight:1.6, margin:'clamp(0.3rem,0.7vh,0.5rem) 0 0' }}>
              🚀 Built with the MERN stack, Socket.io real-time engine, AI opponents, and live leaderboards to help students of <em>all ages</em> master mathematics through engaging head-to-head battles.
            </p>
          </motion.div>

          {/* Why MathTug benefits */}
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.15 }} style={{ flexShrink:0 }}>
            <div style={{ fontSize:'clamp(0.6rem,1.5vh,0.88rem)', fontFamily:'var(--font-display)', fontWeight:700, background:'linear-gradient(90deg,var(--cyan),var(--pink))', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', letterSpacing:'0.06em', marginBottom:'clamp(0.25rem,0.7vh,0.45rem)' }}>WHY MATHTUG?</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'clamp(0.2rem,0.6vh,0.4rem)' }}>
              {benefits.map((b, i) => (
                <motion.div key={i} initial={{ opacity:0,x:-10 }} animate={{ opacity:1,x:0 }} transition={{ delay:0.2+i*0.05 }}
                  style={{ background:'rgba(0,245,255,0.04)', border:'1px solid rgba(0,245,255,0.1)', borderRadius:'clamp(6px,1.2vh,10px)', padding:'clamp(0.25rem,0.7vh,0.5rem) clamp(0.4rem,0.9vw,0.6rem)', fontSize:'clamp(0.47rem,1.1vh,0.68rem)', color:'var(--text-muted)', lineHeight:1.4, display:'flex', alignItems:'flex-start', gap:'0.3rem' }}
                >
                  <span style={{ flexShrink:0 }}>{b.icon}</span>
                  <span>{b.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Tech stack */}
          <motion.div initial={{ opacity:0,y:10 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.45 }}
            style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'clamp(8px,1.5vh,14px)', padding:'clamp(0.3rem,0.9vh,0.6rem) clamp(0.5rem,1.2vw,0.8rem)', flexShrink:0 }}
          >
            <div style={{ fontSize:'clamp(0.48rem,1.1vh,0.68rem)', color:'var(--text-muted)', fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:'clamp(0.2rem,0.5vh,0.35rem)' }}>🛠 Tech Stack</div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:'clamp(0.15rem,0.45vh,0.3rem)' }}>
              {techStack.map((t,i) => (
                <span key={i} style={{ fontSize:'clamp(0.44rem,1vh,0.64rem)', padding:'clamp(0.08rem,0.3vh,0.2rem) clamp(0.3rem,0.7vw,0.5rem)', borderRadius:'50px', background:'rgba(0,245,255,0.08)', border:'1px solid rgba(0,245,255,0.18)', color:'var(--cyan)', fontWeight:600 }}>{t}</span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ══ COLUMN 2: Features grid + How to Play ══ */}
        <div style={{ display:'flex', flexDirection:'column', gap:'clamp(0.4rem,1.2vh,0.8rem)', minHeight:0, overflow:'hidden' }}>

          {/* Key features 3×2 grid */}
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.12 }} style={{ flexShrink:0 }}>
            <div style={{ fontSize:'clamp(0.6rem,1.5vh,0.88rem)', fontFamily:'var(--font-display)', fontWeight:700, background:'linear-gradient(90deg,var(--pink),var(--gold))', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', letterSpacing:'0.06em', marginBottom:'clamp(0.25rem,0.7vh,0.45rem)' }}>KEY FEATURES</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'clamp(0.25rem,0.7vh,0.5rem)' }}>
              {features.map((f, i) => (
                <motion.div key={i} initial={{ opacity:0,scale:0.88 }} animate={{ opacity:1,scale:1 }} transition={{ delay:0.18+i*0.06 }}
                  whileHover={{ scale:1.04, y:-2 }}
                  style={{ background:'linear-gradient(135deg,rgba(0,245,255,0.05),rgba(255,0,128,0.05))', border:`1px solid ${f.color}25`, borderRadius:'clamp(7px,1.4vh,12px)', padding:'clamp(0.35rem,1vh,0.7rem) clamp(0.4rem,0.9vw,0.6rem)', position:'relative', overflow:'hidden', cursor:'default', textAlign:'center' }}
                >
                  <div style={{ position:'absolute', top:0, left:0, right:0, height:'2px', background:`linear-gradient(90deg,${f.color},transparent)` }} />
                  <div style={{ fontSize:'clamp(1.2rem,2.8vh,2rem)', lineHeight:1, marginBottom:'clamp(0.2rem,0.5vh,0.35rem)' }}>{f.icon}</div>
                  <div style={{ color:f.color, fontSize:'clamp(0.46rem,1.1vh,0.68rem)', fontWeight:700, fontFamily:'var(--font-display)', letterSpacing:'0.02em', lineHeight:1.3 }}>{f.title}</div>
                  <div style={{ color:'var(--text-muted)', fontSize:'clamp(0.4rem,0.95vh,0.6rem)', marginTop:'clamp(0.1rem,0.3vh,0.2rem)', lineHeight:1.35, opacity:0.8 }}>{f.desc}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* How to Play steps */}
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.3 }} style={{ flex:1, minHeight:0 }}>
            <div style={{ fontSize:'clamp(0.6rem,1.5vh,0.88rem)', fontFamily:'var(--font-display)', fontWeight:700, background:'linear-gradient(90deg,var(--gold),var(--cyan))', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', letterSpacing:'0.06em', marginBottom:'clamp(0.25rem,0.7vh,0.45rem)' }}>HOW TO PLAY</div>
            <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'clamp(10px,2vh,16px)', padding:'clamp(0.4rem,1.2vh,0.8rem) clamp(0.5rem,1.3vw,0.9rem)', display:'flex', flexDirection:'column', gap:'clamp(0.3rem,0.8vh,0.55rem)' }}>
              {steps.map((step, i) => (
                <motion.div key={i} initial={{ opacity:0,x:-14 }} animate={{ opacity:1,x:0 }} transition={{ delay:0.35+i*0.07 }}
                  style={{ display:'flex', alignItems:'center', gap:'clamp(0.5rem,1.2vw,0.9rem)', padding:'clamp(0.2rem,0.6vh,0.4rem) clamp(0.3rem,0.8vw,0.5rem)', borderRadius:'clamp(6px,1.2vh,10px)', background:`${step.color}08`, border:`1px solid ${step.color}18` }}
                >
                  <div style={{ width:'clamp(28px,4.5vh,40px)', height:'clamp(28px,4.5vh,40px)', minWidth:'clamp(28px,4.5vh,40px)', borderRadius:'50%', background:`${step.color}18`, border:`2px solid ${step.color}50`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'clamp(0.52rem,1.3vh,0.75rem)', fontWeight:900, color:step.color, fontFamily:'var(--font-display)' }}>{step.num}</div>
                  <div>
                    <div style={{ color:step.color, fontSize:'clamp(0.56rem,1.4vh,0.82rem)', fontWeight:700, fontFamily:'var(--font-display)' }}>{step.label}</div>
                    <div style={{ color:'var(--text-muted)', fontSize:'clamp(0.46rem,1.1vh,0.68rem)', lineHeight:1.35 }}>{step.desc}</div>
                  </div>
                  <div style={{ marginLeft:'auto', fontSize:'clamp(0.55rem,1.3vh,0.78rem)', opacity:0.4, color:step.color }}>→</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ══ COLUMN 3: Age Modes (fixed height cards) ══ */}
        <div style={{ display:'flex', flexDirection:'column', gap:'clamp(0.4rem,1.2vh,0.8rem)', minHeight:0, overflow:'hidden' }}>
          <div style={{ fontSize:'clamp(0.6rem,1.5vh,0.88rem)', fontFamily:'var(--font-display)', fontWeight:700, background:'linear-gradient(90deg,var(--gold),var(--pink))', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', letterSpacing:'0.06em', flexShrink:0 }}>AGE MODES</div>

          {/* 3 cards stacked vertically — each takes 1/3 of remaining space */}
          <div style={{ flex:1, minHeight:0, display:'grid', gridTemplateRows:'1fr 1fr 1fr', gap:'clamp(0.4rem,1.2vh,0.8rem)' }}>
            {ageModes.map((m, i) => (
              <motion.button
                key={i}
                initial={{ opacity:0,x:20 }} animate={{ opacity:1,x:0 }} transition={{ delay:0.2+i*0.1, type:'spring', stiffness:120 }}
                whileHover={{ scale:1.03, x:-3 }} whileTap={{ scale:0.97 }}
                onClick={() => navigate('/age-select')}
                style={{
                  background:m.bg, border:`2px solid ${m.color}80`, borderRadius:'clamp(10px,2vh,18px)',
                  color:'#fff', cursor:'pointer', position:'relative', overflow:'hidden',
                  display:'flex', alignItems:'center', padding:'0 clamp(0.8rem,2vw,1.5rem)',
                  gap:'clamp(0.6rem,1.5vw,1.2rem)',
                  boxShadow:`0 6px 24px rgba(0,0,0,0.3), 0 0 20px ${m.color}30`,
                  textAlign:'left', minHeight:0,
                }}
              >
                {/* Shimmer overlay */}
                <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg,rgba(255,255,255,0.15) 0%,transparent 50%,rgba(255,255,255,0.05) 100%)', pointerEvents:'none' }} />
                {/* Top shine line */}
                <div style={{ position:'absolute', top:0, left:'5%', right:'5%', height:'1px', background:'rgba(255,255,255,0.6)' }} />
                {/* Right arrow */}
                <div style={{ position:'absolute', right:'clamp(0.5rem,1.2vw,1rem)', opacity:0.5, fontSize:'clamp(0.8rem,1.8vh,1.2rem)' }}>→</div>

                <div style={{ fontSize:'clamp(1.8rem,4.5vh,3.5rem)', lineHeight:1, filter:'drop-shadow(0 3px 8px rgba(0,0,0,0.35))', flexShrink:0 }}>{m.emoji}</div>
                <div>
                  <div style={{ fontFamily:'var(--font-display)', fontSize:'clamp(0.75rem,2vh,1.3rem)', fontWeight:900, textShadow:'0 2px 8px rgba(0,0,0,0.4)', lineHeight:1.2 }}>{m.name}</div>
                  <div style={{ fontSize:'clamp(0.5rem,1.2vh,0.78rem)', fontWeight:700, opacity:0.9, background:'rgba(0,0,0,0.2)', display:'inline-block', padding:'0.08rem 0.5rem', borderRadius:'50px', marginTop:'0.25rem' }}>Ages {m.age}</div>
                  <div style={{ fontSize:'clamp(0.44rem,1.1vh,0.68rem)', opacity:0.85, marginTop:'0.3rem', whiteSpace:'pre-line', lineHeight:1.4 }}>{m.sub}</div>
                </div>
              </motion.button>
            ))}
          </div>

          {/* CTA at bottom */}
          <motion.button
            initial={{ opacity:0,y:10 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.55 }}
            whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }}
            onClick={() => navigate('/age-select')}
            className="btn btn-cyan"
            style={{ width:'100%', textAlign:'center', fontSize:'clamp(0.58rem,1.4vh,0.85rem)', padding:'clamp(0.3rem,0.9vh,0.65rem) 1rem', minHeight:'unset', flexShrink:0 }}
          >
            🎮 Choose Your Mode →
          </motion.button>
        </div>
      </div>
    </div>
  );
}
