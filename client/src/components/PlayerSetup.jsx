import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import useGameStore from '../store/gameStore';
import { resumeAudio } from '../utils/soundEffects';
import BackgroundEffects from './BackgroundEffects';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || (typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'http://localhost:5001' : '');
const DIFFICULTY_OPTIONS = ['easy', 'medium', 'hard'];
const ROUND_OPTIONS = [5, 10, 15];
const DIFFICULTY_LABELS = {
  easy:   { label: 'Easy',   desc: '1–9, +/−',     color: '#00ff88', icon: '🌱' },
  medium: { label: 'Medium', desc: '1–49, all ops', color: '#ffd700', icon: '🔥' },
  hard:   { label: 'Hard',   desc: '1–99, all ops', color: '#ff4444', icon: '⚡' },
};

export default function PlayerSetup() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setGameId, setJoinCode, setPlayerId, setIsLocal, setPlayerNames, setDifficulty, setTotalRounds, setPhase } = useGameStore();
  const initialTab = new URLSearchParams(location.search).get('tab') === 'join' ? 'join' : 'host';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [hostName, setHostName] = useState('');
  const [difficulty, setDifficultyLocal] = useState('medium');
  const [rounds, setRounds] = useState(10);
  const [mode, setMode] = useState('online');
  const [hostP2Name, setHostP2Name] = useState('');
  const [joinName, setJoinName] = useState('');
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleHost() {
    resumeAudio();
    const name1 = hostName.trim() || 'Player 1';
    const isLocalGame = mode === 'local' || mode === 'ai';
    const name2 = mode === 'local' ? (hostP2Name.trim() || 'Player 2') : (mode === 'ai' ? 'AI Bot' : 'Waiting...');
    setLoading(true); setError(null);
    try {
      const { data } = await axios.post(`${SERVER_URL}/api/game/new`, { player1Name: name1, player2Name: name2, totalRounds: rounds, difficulty, isLocal: isLocalGame });
      if (!data.success) throw new Error('Failed');
      setGameId(data.gameId); setJoinCode(data.joinCode); setPlayerId('player1');
      setIsLocal(isLocalGame); setPlayerNames({ player1: name1, player2: name2 });
      setDifficulty(difficulty); setTotalRounds(rounds); setPhase('waiting');
      navigate(`/game/${data.gameId}`);
    } catch (err) { setError('Could not connect to server. Make sure the backend is running.'); }
    finally { setLoading(false); }
  }

  async function handleJoin() {
    resumeAudio();
    const name2 = joinName.trim() || 'Player 2';
    const code = joinCodeInput.trim().toUpperCase();
    if (!code) { setError('Please enter a Game Code.'); return; }
    setLoading(true); setError(null);
    try {
      const { data } = await axios.post(`${SERVER_URL}/api/game/join`, { joinCode: code, player2Name: name2 });
      if (!data.success) throw new Error(data.error || 'Failed');
      setGameId(data.gameId); setJoinCode(code); setPlayerId('player2'); setIsLocal(false); setPhase('waiting');
      navigate(`/game/${data.gameId}`);
    } catch (err) { setError(err.response?.data?.error || 'Game not found or already started.'); }
    finally { setLoading(false); }
  }

  const pill = (active, color) => ({
    fontFamily: 'var(--font-display)', fontSize: 'clamp(0.5rem,1.2vh,0.75rem)',
    padding: 'clamp(0.2rem,0.6vh,0.42rem) clamp(0.5rem,1.1vw,0.85rem)',
    borderRadius: '50px', border: active ? `1.5px solid ${color}` : '1.5px solid rgba(255,255,255,0.15)',
    background: active ? color : 'rgba(255,255,255,0.04)', color: active ? '#0a0a1a' : 'var(--text-muted)',
    cursor: 'pointer', fontWeight: 700, minHeight: 'unset', transition: 'all 0.2s',
  });

  const inputStyle = {
    background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px',
    color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: 'clamp(0.65rem,1.5vh,0.92rem)',
    fontWeight: 600, padding: 'clamp(0.3rem,0.9vh,0.65rem) clamp(0.5rem,1.2vw,0.85rem)', width: '100%', outline: 'none',
    transition: 'border-color 0.2s',
  };

  const labelStyle = {
    fontSize: 'clamp(0.44rem,1vh,0.62rem)', textTransform: 'uppercase', letterSpacing: '0.1em',
    color: 'var(--text-muted)', display: 'block', marginBottom: 'clamp(0.15rem,0.45vh,0.32rem)', fontWeight: 700,
  };

  const sectionGap = { marginTop: 'clamp(0.35rem,1vh,0.75rem)' };

  const modePreviewData = {
    online: { icon: '🌐', title: 'Online Multiplayer', desc: 'Create a room and share the code with a friend. Battle in real-time over the internet!', color: 'var(--cyan)' },
    local:  { icon: '📱', title: 'Local 2-Player',    desc: 'Both players on the same device — take turns answering. Perfect for face-to-face battles!', color: 'var(--pink)' },
    ai:     { icon: '🤖', title: 'vs AI Bot',          desc: 'Challenge our smart AI math bot! Train your skills solo and climb the rankings.', color: 'var(--gold)' },
  };
  const preview = modePreviewData[mode];

  return (
    <div className="stars-bg" style={{ width: '100%', height: '100dvh', overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <BackgroundEffects />

      {/* Faint bg symbols */}
      {[{s:'÷',x:'6%',y:'18%'},{s:'×',x:'88%',y:'22%'},{s:'+',x:'4%',y:'72%'},{s:'=',x:'90%',y:'70%'}].map((b,i) => (
        <div key={i} style={{ position:'absolute', left:b.x, top:b.y, fontSize:'5rem', color:'var(--cyan)', opacity:0.025, fontFamily:'var(--font-display)', fontWeight:900, pointerEvents:'none', zIndex:0, userSelect:'none' }}>{b.s}</div>
      ))}

      {/* Corner glows */}
      <div style={{ position:'absolute', top:0, left:0, width:'30vw', height:'30vh', background:'radial-gradient(ellipse at top left,rgba(0,245,255,0.06) 0%,transparent 70%)', pointerEvents:'none', zIndex:1 }} />
      <div style={{ position:'absolute', bottom:0, right:0, width:'30vw', height:'30vh', background:'radial-gradient(ellipse at bottom right,rgba(255,0,128,0.06) 0%,transparent 70%)', pointerEvents:'none', zIndex:1 }} />

      {/* Top line */}
      <div style={{ position:'absolute', top:0, left:0, right:0, height:'2px', background:'linear-gradient(90deg,transparent,var(--cyan),var(--pink),transparent)', zIndex:5 }} />

      {/* Back */}
      <motion.button whileHover={{ scale:1.08 }} whileTap={{ scale:0.92 }} onClick={() => navigate('/age-select')}
        style={{ position:'absolute', top:'clamp(6px,1.5vh,14px)', left:'clamp(8px,1.5vw,18px)', background:'rgba(255,255,255,0.05)', border:'1.5px solid rgba(255,255,255,0.2)', color:'var(--text-primary)', padding:'clamp(0.18rem,0.6vh,0.45rem) clamp(0.4rem,1.2vw,0.85rem)', borderRadius:'50px', fontFamily:'var(--font-display)', fontSize:'clamp(0.5rem,1.3vh,0.78rem)', cursor:'pointer', zIndex:100 }}
      >← Back</motion.button>

      {/* Two-column layout: form LEFT, preview RIGHT */}
      <div style={{ position:'relative', zIndex:10, width:'100%', maxWidth:'900px', padding:'0 clamp(0.6rem,2vw,2rem)', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'clamp(0.8rem,2.5vw,2rem)', alignItems:'start' }}>

        {/* LEFT: Form */}
        <div style={{ display:'flex', flexDirection:'column', gap:'clamp(0.3rem,0.9vh,0.65rem)' }}>
          <motion.div initial={{ opacity:0,y:-14 }} animate={{ opacity:1,y:0 }} style={{ textAlign:'center' }}>
            <div style={{ fontFamily:'var(--font-display)', fontSize:'clamp(1rem,3vh,2rem)', fontWeight:900, background:'linear-gradient(135deg,var(--cyan),var(--pink))', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
              Player Setup
            </div>
          </motion.div>

          {/* Tabs */}
          <div style={{ display:'flex', gap:'clamp(0.4rem,1vw,0.8rem)', justifyContent:'center' }}>
            {[{id:'host',label:'➕ Host Game',cls:'btn-cyan'},{id:'join',label:'🤝 Join Game',cls:'btn-pink'}].map(t => (
              <motion.button key={t.id} whileTap={{ scale:0.95 }}
                className={`btn ${activeTab===t.id ? t.cls : 'btn-ghost'}`}
                onClick={() => setActiveTab(t.id)}
                style={{ padding:'clamp(0.28rem,0.85vh,0.6rem) clamp(0.8rem,2.2vw,1.8rem)', fontSize:'clamp(0.55rem,1.3vh,0.82rem)', minHeight:'unset' }}
              >{t.label}</motion.button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'host' ? (
              <motion.div key="host" initial={{ opacity:0,x:-14 }} animate={{ opacity:1,x:0 }} exit={{ opacity:0,x:14 }}>
                <div style={{ background:'rgba(0,245,255,0.04)', border:'1px solid rgba(0,245,255,0.15)', borderRadius:'clamp(10px,2vh,16px)', padding:'clamp(0.6rem,1.8vh,1.4rem) clamp(0.7rem,2vw,1.4rem)', display:'flex', flexDirection:'column', gap:'clamp(0.28rem,0.8vh,0.55rem)', position:'relative', overflow:'hidden' }}>
                  <div style={{ position:'absolute', top:0, left:0, right:0, height:'2px', background:'linear-gradient(90deg,var(--cyan),transparent)' }} />
                  <div style={{ fontSize:'clamp(0.65rem,1.6vh,0.95rem)', fontFamily:'var(--font-display)', color:'var(--cyan)', fontWeight:700 }}>⚡ Your Name</div>
                  <div><label style={labelStyle}>Player Name</label><input type="text" placeholder="Enter name..." value={hostName} onChange={e=>setHostName(e.target.value)} maxLength={16} style={{ ...inputStyle, borderColor:'rgba(0,245,255,0.3)' }} className="input-field" /></div>
                  <div style={sectionGap}><label style={labelStyle}>Difficulty</label>
                    <div style={{ display:'flex', gap:'clamp(0.25rem,0.7vw,0.5rem)', flexWrap:'wrap' }}>
                      {DIFFICULTY_OPTIONS.map(d => (
                        <button key={d} style={pill(difficulty===d, DIFFICULTY_LABELS[d].color)} onClick={() => setDifficultyLocal(d)}>
                          {DIFFICULTY_LABELS[d].icon} {DIFFICULTY_LABELS[d].label}
                        </button>
                      ))}
                    </div>
                    <div style={{ fontSize:'clamp(0.44rem,1vh,0.62rem)', color:'var(--text-muted)', marginTop:'0.3rem', opacity:0.7 }}>
                      {DIFFICULTY_LABELS[difficulty].desc}
                    </div>
                  </div>
                  <div style={sectionGap}><label style={labelStyle}>Rounds</label>
                    <div style={{ display:'flex', gap:'clamp(0.25rem,0.7vw,0.5rem)' }}>
                      {ROUND_OPTIONS.map(r => <button key={r} style={pill(rounds===r, 'var(--cyan)')} onClick={() => setRounds(r)}>{r} Rounds</button>)}
                    </div>
                  </div>
                  <div style={sectionGap}><label style={labelStyle}>Game Mode</label>
                    <div style={{ display:'flex', gap:'clamp(0.25rem,0.7vw,0.5rem)', flexWrap:'wrap' }}>
                      <button style={pill(mode==='online','var(--cyan)')} onClick={() => setMode('online')}>🌐 Online</button>
                      <button style={pill(mode==='local','var(--pink)')} onClick={() => setMode('local')}>📱 Local</button>
                      <button style={pill(mode==='ai','#ffd700')} onClick={() => setMode('ai')}>🤖 Vs AI</button>
                    </div>
                  </div>
                  {mode==='local' && (
                    <div style={sectionGap}>
                      <div style={{ fontSize:'clamp(0.6rem,1.4vh,0.85rem)', fontFamily:'var(--font-display)', color:'var(--pink)', fontWeight:700, marginBottom:'clamp(0.2rem,0.5vh,0.35rem)' }}>🔥 Player 2 Name</div>
                      <input type="text" placeholder="Enter Player 2 name..." value={hostP2Name} onChange={e=>setHostP2Name(e.target.value)} maxLength={16} style={{ ...inputStyle, borderColor:'rgba(255,0,128,0.3)' }} className="input-field" />
                    </div>
                  )}
                </div>
                <div style={{ textAlign:'center', marginTop:'clamp(0.4rem,1.2vh,0.9rem)' }}>
                  <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }} className="btn btn-cyan" onClick={handleHost} disabled={loading}
                    style={{ fontSize:'clamp(0.62rem,1.5vh,0.92rem)', padding:'clamp(0.38rem,1.1vh,0.78rem) clamp(1.8rem,5vw,3.5rem)', minHeight:'unset', width:'100%' }}
                  >
                    {loading ? '⏳ Creating...' : (mode==='local' ? '⚡ Start Local Battle!' : mode==='ai' ? '🤖 Start AI Battle!' : '🌐 Create Room')}
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <motion.div key="join" initial={{ opacity:0,x:14 }} animate={{ opacity:1,x:0 }} exit={{ opacity:0,x:-14 }}>
                <div style={{ background:'rgba(255,0,128,0.04)', border:'1px solid rgba(255,0,128,0.15)', borderRadius:'clamp(10px,2vh,16px)', padding:'clamp(0.6rem,1.8vh,1.4rem) clamp(0.7rem,2vw,1.4rem)', display:'flex', flexDirection:'column', gap:'clamp(0.35rem,1vh,0.7rem)', position:'relative', overflow:'hidden' }}>
                  <div style={{ position:'absolute', top:0, left:0, right:0, height:'2px', background:'linear-gradient(90deg,var(--pink),transparent)' }} />
                  <div style={{ fontSize:'clamp(0.65rem,1.6vh,0.95rem)', fontFamily:'var(--font-display)', color:'var(--pink)', fontWeight:700 }}>🤝 Join Room</div>
                  <div><label style={labelStyle}>Your Name</label><input type="text" placeholder="Enter name..." value={joinName} onChange={e=>setJoinName(e.target.value)} maxLength={16} style={{ ...inputStyle, borderColor:'rgba(255,0,128,0.3)' }} className="input-field" /></div>
                  <div><label style={labelStyle}>Game Code</label>
                    <input type="text" placeholder="e.g. ABCD" value={joinCodeInput} onChange={e=>setJoinCodeInput(e.target.value.toUpperCase())} maxLength={4}
                      style={{ ...inputStyle, borderColor:'rgba(255,0,128,0.3)', fontFamily:'var(--font-display)', letterSpacing:'0.25em', textTransform:'uppercase', textAlign:'center', fontSize:'clamp(1rem,2.5vh,1.6rem)' }} className="input-field" />
                  </div>
                  <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }} className="btn btn-pink" onClick={handleJoin} disabled={loading}
                    style={{ fontSize:'clamp(0.62rem,1.5vh,0.92rem)', padding:'clamp(0.38rem,1.1vh,0.78rem)', minHeight:'unset', width:'100%', marginTop:'clamp(0.2rem,0.5vh,0.35rem)' }}
                  >
                    {loading ? '⏳ Joining...' : '🎯 Join Battle!'}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <div style={{ background:'rgba(255,68,68,0.12)', border:'1px solid rgba(255,68,68,0.35)', borderRadius:'8px', padding:'clamp(0.25rem,0.7vh,0.5rem) clamp(0.6rem,1.5vw,1rem)', color:'#ff8888', fontSize:'clamp(0.5rem,1.2vh,0.72rem)', textAlign:'center' }}>
              ⚠️ {error}
            </div>
          )}
        </div>

        {/* RIGHT: Mode preview + tips */}
        <motion.div initial={{ opacity:0,x:20 }} animate={{ opacity:1,x:0 }} transition={{ delay:0.15 }}
          style={{ display:'flex', flexDirection:'column', gap:'clamp(0.5rem,1.5vh,1.1rem)' }}
        >
          {/* Dynamic mode info */}
          <motion.div key={mode} initial={{ opacity:0,y:8 }} animate={{ opacity:1,y:0 }}
            style={{ background:'rgba(255,255,255,0.04)', border:`1px solid ${preview.color}25`, borderRadius:'clamp(12px,2.2vh,18px)', padding:'clamp(0.7rem,2vh,1.5rem) clamp(0.8rem,2vw,1.4rem)', position:'relative', overflow:'hidden' }}
          >
            <div style={{ position:'absolute', top:0, left:0, right:0, height:'2.5px', background:`linear-gradient(90deg,${preview.color},transparent)` }} />
            <div style={{ fontSize:'clamp(1.8rem,4.5vh,3.2rem)', lineHeight:1, marginBottom:'clamp(0.3rem,0.8vh,0.55rem)' }}>{preview.icon}</div>
            <div style={{ fontFamily:'var(--font-display)', fontSize:'clamp(0.75rem,1.9vh,1.2rem)', color:preview.color, fontWeight:700, marginBottom:'clamp(0.2rem,0.5vh,0.35rem)' }}>{preview.title}</div>
            <p style={{ fontSize:'clamp(0.55rem,1.35vh,0.82rem)', color:'var(--text-muted)', lineHeight:1.65, margin:0 }}>{preview.desc}</p>
          </motion.div>

          {/* Quick stats */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'clamp(0.3rem,0.9vh,0.65rem)' }}>
            {[
              { label:'Difficulty', value:DIFFICULTY_LABELS[difficulty].label, icon:DIFFICULTY_LABELS[difficulty].icon, color:DIFFICULTY_LABELS[difficulty].color },
              { label:'Rounds', value:`${rounds} rounds`, icon:'🔄', color:'var(--cyan)' },
              { label:'Mode', value:preview.title.split(' ')[0], icon:preview.icon, color:preview.color },
              { label:'Time', value:'~2 min', icon:'⏱', color:'var(--gold)' },
            ].map((stat,i) => (
              <div key={i} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.09)', borderRadius:'clamp(8px,1.5vh,12px)', padding:'clamp(0.35rem,1vh,0.7rem) clamp(0.4rem,1vw,0.7rem)', textAlign:'center' }}>
                <div style={{ fontSize:'clamp(0.9rem,2vh,1.4rem)' }}>{stat.icon}</div>
                <div style={{ color:stat.color, fontFamily:'var(--font-display)', fontWeight:700, fontSize:'clamp(0.5rem,1.2vh,0.75rem)', marginTop:'2px' }}>{stat.value}</div>
                <div style={{ color:'var(--text-muted)', fontSize:'clamp(0.4rem,0.9vh,0.58rem)', textTransform:'uppercase', letterSpacing:'0.06em', marginTop:'1px' }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Tips box */}
          <div style={{ background:'rgba(255,215,0,0.04)', border:'1px solid rgba(255,215,0,0.12)', borderRadius:'clamp(10px,1.8vh,14px)', padding:'clamp(0.4rem,1.2vh,0.85rem) clamp(0.5rem,1.3vw,0.9rem)' }}>
            <div style={{ fontSize:'clamp(0.5rem,1.2vh,0.72rem)', color:'var(--gold)', fontWeight:700, letterSpacing:'0.08em', marginBottom:'clamp(0.2rem,0.5vh,0.35rem)' }}>💡 PRO TIPS</div>
            {['Answer quickly to pull the rope further!', 'Wrong answers give your opponent a chance.', 'Choose Hard mode to earn bonus XP.'].map((tip,i) => (
              <div key={i} style={{ fontSize:'clamp(0.44rem,1.05vh,0.65rem)', color:'var(--text-muted)', lineHeight:1.5, marginBottom:'0.15rem' }}>• {tip}</div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
