import React, { useEffect, useCallback, useRef, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';
import useGameStore from '../store/gameStore';
import useSocket from '../hooks/useSocket';
import useTimer from '../hooks/useTimer';
import RopeCanvas from '../components/RopeCanvas';
import NumberPad from '../components/NumberPad';
import QuestionDisplay from '../components/QuestionDisplay';
import ScoreBoard from '../components/ScoreBoard';
import TimerRing from '../components/TimerRing';
import WinnerScreen from '../components/WinnerScreen';
import EmoteBar from '../components/EmoteBar';
import { playCorrect, playWrong, playRopeSlide, playCriticalHit, startBGM, stopBGM } from '../utils/soundEffects';
import { getFunnyComment } from '../utils/funnyComments';
import { useBot } from '../hooks/useBot';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || (typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'http://localhost:5001' : window.location.origin);

// ── Player 2 local socket hook ─────────────────────────────────────────────
function useP2Socket(gameId, playerName, isLocal) {
  const socketRef = useRef(null);
  const [p2Locked, setP2Locked] = useState(false);
  const [p2Feedback, setP2Feedback] = useState(null);

  useEffect(() => {
    if (!gameId || !isLocal) return;
    console.log('🎮 P2 Socket: Connecting to SERVER_URL:', SERVER_URL);
    const socket = io(SERVER_URL, { transports: ['websocket', 'polling'] });
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('🔌 Player 2 socket connected:', socket.id);
      socket.emit('join:game', { gameId, playerId: 'player2', playerName });
    });

    socket.on('connect_error', (error) => {
      console.error('❌ P2 Socket connect_error:', error);
    });

    socket.on('game:question', () => {
      console.log('❓ P2 received game:question');
      setP2Locked(false);
      setP2Feedback(null);
    });

    socket.on('game:answerFeedback', ({ correct, playerId }) => {
      if (playerId === 'player2') {
        console.log('✅ P2 received answerFeedback:', correct ? 'CORRECT' : 'WRONG');
        setP2Feedback(correct ? 'correct' : 'wrong');
        setP2Locked(true);
      }
    });

    socket.on('game:roundResult', () => {
      console.log('📊 P2 received game:roundResult');
      setP2Locked(false);
      setP2Feedback(null);
    });

    socket.on('error', (error) => {
      console.error('❌ P2 socket error:', error);
    });

    socket.on('disconnect', (reason) => {
      console.warn('⚠️ P2 socket disconnected:', reason);
    });

    return () => { socket.disconnect(); socketRef.current = null; };
  }, [gameId, playerName]); // eslint-disable-line

  const submitP2 = useCallback((answer) => {
    if (!socketRef.current) {
      console.error('❌ P2 socket ref not available');
      return;
    }
    console.log('📤 P2 submitting answer:', answer, 'Socket connected:', socketRef.current?.connected);
    if (socketRef.current?.connected) {
      socketRef.current.emit('game:submitAnswer', { gameId, playerId: 'player2', answer });
    } else {
      console.warn('⚠️ P2 socket not connected, attempting to emit anyway');
      socketRef.current.emit('game:submitAnswer', { gameId, playerId: 'player2', answer });
    }
    setP2Locked(true);
  }, [gameId]);

  return { p2Locked, p2Feedback, submitP2 };
}

// ── Round Dots ─────────────────────────────────────────────────────────────
function RoundDots({ player, roundHistory, totalRounds }) {
  const accent = player === 'player1' ? 'var(--cyan)' : 'var(--pink)';
  const accentGlow = player === 'player1' ? 'var(--cyan-glow)' : 'var(--pink-glow)';

  return (
    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '160px' }}>
      {Array.from({ length: totalRounds }, (_, i) => {
        const entry = roundHistory[i];
        const won = entry?.winner === player;
        const drew = entry && !won && ['draw', 'timeout', 'both_wrong'].includes(entry.winner);
        const lost = entry && !won && !drew;
        return (
          <motion.div
            key={i}
            initial={entry ? { scale: 0 } : {}}
            animate={{ scale: 1 }}
            style={{
              width: '9px', height: '9px', borderRadius: '50%',
              background: won ? accent : drew ? 'var(--gold)' : lost ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${won ? accent : 'rgba(255,255,255,0.12)'}`,
              boxShadow: won ? `0 0 6px ${accentGlow}` : 'none',
            }}
          />
        );
      })}
    </div>
  );
}

// ── Player Column ──────────────────────────────────────────────────────────
function PlayerColumn({ player, score, name, roundHistory, totalRounds, children }) {
  const isCyan = player === 'player1';
  const accent = isCyan ? 'var(--cyan)' : 'var(--pink)';
  const accentGlow = isCyan ? 'var(--cyan-glow)' : 'var(--pink-glow)';
  const icon = isCyan ? '⚡' : '🔥';

  return (
    <motion.div
      className={`player-panel ${player === 'player1' ? 'p1' : 'p2'}`}
      initial={{ x: isCyan ? -60 : 60, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 22 }}
    >
      {/* Name */}
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: '0.65rem',
        letterSpacing: '0.2em',
        color: accent,
        textTransform: 'uppercase',
        marginBottom: '0.3rem',
        opacity: 0.85,
      }}>
        {icon} {name}
      </div>

      {/* Score */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={score}
          initial={{ scale: 1.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 4vw, 3.5rem)',
            fontWeight: '900',
            color: accent,
            textShadow: `0 0 20px ${accentGlow}`,
            lineHeight: 1,
            marginBottom: '0.4rem',
          }}
        >
          {score}
        </motion.div>
      </AnimatePresence>

      {/* Round dots */}
      <RoundDots player={player} roundHistory={roundHistory} totalRounds={totalRounds} />

      {/* Numpad area */}
      <div style={{ flex: 1, width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', marginTop: '0.75rem' }}>
        {children}
      </div>
    </motion.div>
  );
}

// ── Main Game Page ─────────────────────────────────────────────────────────
export default function Game() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    gameId, setGameId, setPlayerId,
    phase, playerNames, totalRounds, difficulty,
    currentQuestion, currentRound,
    ropePosition, scores, roundHistory,
    lastRoundResult, lastFeedback, isLocked, opponentLocked,
    winner, winnerName, isLocal, joinCode, playerId,
    currentEmotes,
    resetForNewRound, setIsLocked,
  } = useGameStore();

  const [isRematchRequested, setIsRematchRequested] = useState(false);

  const { submitAnswer, startSolo, emitEmote, requestRematch } = useSocket();

  // Set gameId from route param
  useEffect(() => {
    if (id && id !== gameId) {
      setGameId(id);
      setPlayerId('player1');
    }
  }, [id]); // eslint-disable-line

  // Player 2 local socket
  const { p2Locked, p2Feedback, submitP2 } = useP2Socket(
    id,
    playerNames.player2,
    isLocal
  );

  // AI Bot Integration
  const isBotMode = isLocal && playerNames.player2 === 'AI Bot';
  if (isBotMode) {
    useBot(id, phase, currentQuestion, submitP2, difficulty);
  }

  // Timer
  const { timeLeft, isUrgent, start: startTimer, stop: stopTimer } = useTimer(15);

  // Start/stop timer based on phase
  useEffect(() => {
    if (phase === 'active' && currentQuestion) startTimer(15);
    if (phase === 'roundResult' || phase === 'finished') stopTimer();
  }, [currentQuestion, phase]); // eslint-disable-line

  // Sound effects & Handle round result feedback
  useEffect(() => {
    if (phase === 'roundResult' && lastRoundResult) {
      if (lastRoundResult.result === 'correct') {
        if (lastRoundResult.isCritical) playCriticalHit();
        else playCorrect();
        playRopeSlide();
      } else if (lastRoundResult.result === 'both_wrong' || lastRoundResult.result === 'timeout') {
        playWrong();
      }
    }
  }, [lastRoundResult, phase]);

  // Sound on p1 feedback
  useEffect(() => {
    if (lastFeedback === 'correct') playCorrect();
    if (lastFeedback === 'wrong') playWrong();
  }, [lastFeedback]);

  const handlePrimarySubmit = useCallback((value) => {
    submitAnswer(value);
    setIsLocked(true);
  }, [submitAnswer, setIsLocked]);

  const p1Submit = isLocal ? handlePrimarySubmit : (playerId === 'player1' ? handlePrimarySubmit : () => {});
  const p2Submit = isLocal ? submitP2 : (playerId === 'player2' ? handlePrimarySubmit : () => {});

  const p1IsLocked = isLocal ? (isLocked || phase !== 'active') : (playerId === 'player1' ? (isLocked || phase !== 'active') : true);
  const p2IsLocked = isLocal ? (p2Locked || phase !== 'active') : (playerId === 'player2' ? (isLocked || phase !== 'active') : true);
  const p1Feedback = isLocal ? lastFeedback : (playerId === 'player1' ? lastFeedback : null);
  const p2FeedbackResult = isLocal ? p2Feedback : (playerId === 'player2' ? lastFeedback : null);

  const funnyComment = useMemo(() => {
    if (!lastRoundResult) return '';
    const name = lastRoundResult.winner === 'player1' ? playerNames.player1 : playerNames.player2;
    return getFunnyComment(lastRoundResult.result, name);
  }, [lastRoundResult, playerNames]);
  
  const isSuddenDeath = phase === 'active' && currentRound === totalRounds - 1 && scores.player1 === scores.player2;

  // BGM
  useEffect(() => {
    if (phase === 'active') {
      startBGM(isSuddenDeath);
    } else {
      stopBGM();
    }
    return () => stopBGM();
  }, [phase, isSuddenDeath]);

  if (phase === 'finished') {
    return (
      <WinnerScreen
        winner={winner}
        winnerName={winnerName}
        scores={scores}
        playerNames={playerNames}
        playerId={playerId}
        onPlayAgain={() => { useGameStore.getState().resetGame(); navigate('/setup'); }}
        onLeaderboard={() => navigate('/leaderboard')}
        onRematchRequest={() => { requestRematch(); setIsRematchRequested(true); }}
        isRematchRequested={isRematchRequested}
      />
    );
  }

  return (
    <div className="game-layout">
      <div className={`bg-stars ${isSuddenDeath ? 'sudden-death-bg' : ''}`} />
      
      {isSuddenDeath && (
        <div style={{ position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%)', color: '#ff4444', fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 'bold', textShadow: '0 0 20px #ff4444', animation: 'glowPulse 1s infinite alternate', zIndex: 10 }}>
          SUDDEN DEATH!
        </div>
      )}

      {/* ── Player 1 (LEFT) ── */}
      <PlayerColumn
        player="player1"
        score={scores.player1}
        name={playerNames.player1}
        roundHistory={roundHistory}
        totalRounds={totalRounds}
      >
        {opponentLocked && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ fontSize: '0.7rem', color: 'var(--pink)', fontFamily: 'var(--font-body)', textAlign: 'center', marginBottom: '0.4rem' }}
          >
            🔒 Opponent locked in
          </motion.div>
        )}
        <NumberPad
          playerId="player1"
          onSubmit={p1Submit}
          isLocked={p1IsLocked}
          lastFeedback={p1Feedback}
        />
        {(isLocal || playerId === 'player1') && (
          <EmoteBar onEmote={(emote) => emitEmote(emote)} disabled={phase !== 'active'} />
        )}
      </PlayerColumn>

      {/* ── Center ── */}
      <div className="center-section">
        {/* Mini scoreboard */}
        <div className="glass" style={{ width: '100%', padding: '0.4rem 1rem' }}>
          <ScoreBoard
            player1={playerNames.player1}
            player2={playerNames.player2}
            scores={scores}
            roundHistory={roundHistory}
            totalRounds={totalRounds}
          />
        </div>

        {/* 3D Rope */}
        <div style={{ flex: 1, width: '100%', maxHeight: '175px', minHeight: '100px' }}>
          <RopeCanvas ropePosition={ropePosition} currentEmotes={currentEmotes} />
        </div>

        {/* Question + Timer */}
        <div className="glass-strong" style={{
          width: '100%',
          padding: '0.9rem 1rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.6rem',
        }}>
          <QuestionDisplay
            question={currentQuestion}
            phase={phase}
            roundNumber={currentRound + 1}
            totalRounds={totalRounds}
          />

          {/* Timer ring */}
          {phase === 'active' && (
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TimerRing timeLeft={timeLeft} totalTime={15} isUrgent={isUrgent} />
            </div>
          )}

          {/* Round result banner */}
          <AnimatePresence>
            {lastRoundResult && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8 }}
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.8rem',
                  letterSpacing: '0.07em',
                  padding: '0.4rem 1.2rem',
                  borderRadius: '50px',
                  background: lastRoundResult.winner === 'player1'
                    ? 'rgba(0,245,255,0.15)'
                    : lastRoundResult.winner === 'player2'
                      ? 'rgba(255,0,128,0.15)'
                      : 'rgba(255,215,0,0.1)',
                  border: `1px solid ${lastRoundResult.winner === 'player1'
                    ? 'rgba(0,245,255,0.4)'
                    : lastRoundResult.winner === 'player2'
                      ? 'rgba(255,0,128,0.4)'
                      : 'rgba(255,215,0,0.3)'}`,
                  color: lastRoundResult.winner === 'player1'
                    ? 'var(--cyan)'
                    : lastRoundResult.winner === 'player2'
                      ? 'var(--pink)'
                      : 'var(--gold)',
                  textAlign: 'center',
                }}
              >
                {lastRoundResult.result === 'timeout' || lastRoundResult.result === 'both_wrong'
                  ? <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                      <span style={{ fontSize: '0.85rem' }}>{funnyComment}</span>
                      <span style={{ fontSize: '0.65rem', opacity: 0.8 }}>The correct answer was: {lastRoundResult.correctAnswer}</span>
                    </div>
                  : funnyComment}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Waiting + solo start */}
          {phase === 'waiting' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontFamily: 'var(--font-body)' }}>
                ⏳ Waiting for 2nd player...
              </div>
              {!isLocal && joinCode && (
                 <div style={{ fontSize: '1.1rem', fontFamily: 'var(--font-display)', color: 'var(--gold)', marginBottom: '0.4rem', border: '1px solid rgba(255,215,0,0.3)', padding: '0.4rem 1rem', borderRadius: '8px', background: 'rgba(255,215,0,0.1)' }}>
                   Game Code: <span style={{ letterSpacing: '0.2em' }}>{joinCode}</span>
                 </div>
              )}
              {isLocal && (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-cyan"
                  onClick={startSolo}
                  style={{ fontSize: '0.82rem', padding: '0.5rem 1.2rem' }}
                >
                  ▶ Start Local Game
                </motion.button>
              )}
            </div>
          )}

          {/* Difficulty badge */}
          <div style={{
            fontSize: '0.62rem',
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-body)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}>
            Difficulty: {useGameStore.getState().difficulty} · {totalRounds} rounds
          </div>
        </div>
      </div>

      {/* ── Player 2 (RIGHT) ── */}
      <PlayerColumn
        player="player2"
        score={scores.player2}
        name={playerNames.player2}
        roundHistory={roundHistory}
        totalRounds={totalRounds}
      >
        {isLocked && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ fontSize: '0.7rem', color: 'var(--cyan)', fontFamily: 'var(--font-body)', textAlign: 'center', marginBottom: '0.4rem' }}
          >
            🔒 Opponent locked in
          </motion.div>
        )}
        <NumberPad
          playerId="player2"
          onSubmit={p2Submit}
          isLocked={p2IsLocked}
          lastFeedback={p2FeedbackResult}
        />
        {(!isBotMode && (isLocal || playerId === 'player2')) && (
          <EmoteBar onEmote={(emote) => emitEmote(emote)} disabled={phase !== 'active'} />
        )}
      </PlayerColumn>
    </div>
  );
}
