import { useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import useGameStore from '../store/gameStore';

const SOCKET_URL = import.meta.env.VITE_SERVER_URL || (typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'http://localhost:5001' : window.location.origin);

let socketInstance = null;

export default function useSocket() {
  const socketRef = useRef(null);
  const reconnectAttempts = useRef(0);
  const reconnectTimer = useRef(null);

  const {
    gameId,
    playerId,
    playerNames,
    setPhase,
    setCurrentQuestion,
    setCurrentRound,
    setRopePosition,
    setScores,
    setLastRoundResult,
    addRoundHistory,
    setWinner,
    setTimerRunning,
    resetForNewRound,
    setIsLocked,
    setOpponentLocked,
    setLastFeedback,
    setEmote,
  } = useGameStore();

  const connect = useCallback(() => {
    if (!gameId) return;
    if (socketRef.current?.connected) return;

    const socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: false, // manual reconnection below
    });

    socketRef.current = socket;
    socketInstance = socket;

    socket.on('connect', () => {
      console.log('🔌 Socket connected:', socket.id);
      reconnectAttempts.current = 0;

      // Join game room
      socket.emit('join:game', {
        gameId,
        playerId,
        playerName: playerNames[playerId] || playerId,
      });
    });

    socket.on('joined:game', ({ gameState }) => {
      if (gameState.status === 'waiting') setPhase('waiting');
      else if (gameState.status === 'active') setPhase('active');
      setScores({
        player1: gameState.player1?.score || 0,
        player2: gameState.player2?.score || 0,
      });
      setRopePosition(gameState.ropePosition || 0);
    });

    socket.on('game:started', ({ player1, player2, totalRounds, difficulty }) => {
      useGameStore.setState({ playerNames: { player1: player1.name, player2: player2.name } });
      setPhase('active');
      console.log('Game started!', totalRounds, difficulty);
    });

    socket.on('game:question', ({ round, question, ropePosition, scores }) => {
      setCurrentRound(round - 1);
      setCurrentQuestion(question);
      setRopePosition(ropePosition);
      setScores(scores);
      resetForNewRound();
      setPhase('active');
    });

    socket.on('game:answerFeedback', ({ correct, playerId: pid }) => {
      if (pid === playerId) {
        setLastFeedback(correct ? 'correct' : 'wrong');
        if (!correct) setIsLocked(false); // unlock on wrong so player can rethink? No — lock on wrong too
        setIsLocked(true);
      }
    });

    socket.on('game:wrongAnswer', ({ playerId: pid }) => {
      if (pid !== playerId) {
        setOpponentLocked(true);
        // Opponent got it wrong — our lock is released if we haven't answered
        const store = useGameStore.getState();
        if (!store.isLocked) {
          // player is still free to answer
        }
      }
    });

    socket.on('game:roundResult', ({ result, winner, correctAnswer, scores, ropePosition, round, isCritical }) => {
      setLastRoundResult({ result, winner, correctAnswer, isCritical });
      setScores(scores);
      setRopePosition(ropePosition);
      setPhase('roundResult');
      setTimerRunning(false);
      addRoundHistory({ round, result, winner, correctAnswer, isCritical });
    });

    socket.on('game:ropeUpdate', ({ ropePosition }) => {
      setRopePosition(ropePosition);
    });

    socket.on('game:ended', ({ winner, winnerName, scores, roundHistory }) => {
      setWinner(winner, winnerName);
      setScores(scores);
      setPhase('finished');
      setTimerRunning(false);
    });

    socket.on('game:emote', ({ playerId: pid, emote }) => {
      if (setEmote) {
        setEmote(pid, emote);
        setTimeout(() => setEmote(pid, null), 3000);
      }
    });

    socket.on('game:rematchRequested', ({ playerId: pid }) => {
      // Handled by local component state usually, but could be stored if needed.
    });

    socket.on('game:rematchAccepted', () => {
      // Re-init game state locally
      useGameStore.setState({ 
        phase: 'waiting',
        scores: { player1: 0, player2: 0 },
        ropePosition: 0,
        currentRound: 0,
        roundHistory: [],
        lastRoundResult: null,
        isLocked: false,
        myAnswer: ''
      });
    });

    socket.on('error', ({ message }) => {
      console.error('Socket error:', message);
    });

    socket.on('disconnect', (reason) => {
      console.warn('Socket disconnected:', reason);
      if (reason !== 'io client disconnect') {
        scheduleReconnect();
      }
    });

    socket.on('connect_error', (err) => {
      console.error('Connection error:', err.message);
      scheduleReconnect();
    });
  }, [gameId, playerId, playerNames]); // eslint-disable-line

  const scheduleReconnect = useCallback(() => {
    if (reconnectTimer.current) return;
    const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
    reconnectAttempts.current++;
    console.log(`⏳ Reconnecting in ${delay}ms (attempt ${reconnectAttempts.current})`);
    reconnectTimer.current = setTimeout(() => {
      reconnectTimer.current = null;
      connect();
    }, delay);
  }, [connect]);

  useEffect(() => {
    if (gameId) connect();
    return () => {
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        socketInstance = null;
      }
    };
  }, [gameId]); // eslint-disable-line

  const submitAnswer = useCallback((answer) => {
    if (socketRef.current?.connected && gameId && playerId) {
      socketRef.current.emit('game:submitAnswer', { gameId, playerId, answer });
    }
  }, [gameId, playerId]);

  const startSolo = useCallback(() => {
    if (socketRef.current?.connected && gameId) {
      socketRef.current.emit('game:startSolo', { gameId });
    }
  }, [gameId]);

  const emitEmote = useCallback((emote, pid = null) => {
    const targetPid = pid || playerId;
    if (socketRef.current?.connected && gameId && targetPid) {
      socketRef.current.emit('game:emote', { gameId, playerId: targetPid, emote });
    }
  }, [gameId, playerId]);

  const requestRematch = useCallback(() => {
    if (socketRef.current?.connected && gameId && playerId) {
      socketRef.current.emit('game:rematchRequest', { gameId, playerId });
    }
  }, [gameId, playerId]);

  return { submitAnswer, startSolo, emitEmote, requestRematch, socket: socketRef.current };
}

export { socketInstance };
