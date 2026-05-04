import { create } from 'zustand';

const useGameStore = create((set, get) => ({
  // ── Identity ──────────────────────────────────────────────────────
  gameId: null,
  joinCode: null,
  playerId: null, // 'player1' or 'player2'
  isLocal: false,

  // ── Game Meta ─────────────────────────────────────────────────────
  playerNames: { player1: 'Player 1', player2: 'Player 2' },
  difficulty: 'medium',
  totalRounds: 10,
  phase: 'setup', // 'setup' | 'waiting' | 'active' | 'roundResult' | 'finished'

  // ── Live State ────────────────────────────────────────────────────
  currentQuestion: null,
  currentRound: 0,
  ropePosition: 0,          // -5 to +5
  scores: { player1: 0, player2: 0 },
  roundHistory: [],
  lastRoundResult: null,    // { result, winner, correctAnswer }

  // ── Timer ─────────────────────────────────────────────────────────
  timerSeconds: 15,
  timerRunning: false,

  // ── Submission State ──────────────────────────────────────────────
  myAnswer: '',
  isLocked: false,        // true after this player submits
  lastFeedback: null,     // 'correct' | 'wrong' | null
  opponentLocked: false,

  // ── Winner ────────────────────────────────────────────────────────
  winner: null,
  winnerName: null,

  // ── Emotes ────────────────────────────────────────────────────────
  currentEmotes: { player1: null, player2: null },

  // ── Actions ───────────────────────────────────────────────────────
  setGameId: (id) => set({ gameId: id }),
  setJoinCode: (code) => set({ joinCode: code }),
  setPlayerId: (id) => set({ playerId: id }),
  setIsLocal: (local) => set({ isLocal: local }),

  setPlayerNames: (names) => set({ playerNames: names }),
  setDifficulty: (d) => set({ difficulty: d }),
  setTotalRounds: (n) => set({ totalRounds: n }),
  setPhase: (phase) => set({ phase }),

  setCurrentQuestion: (q) => set({ currentQuestion: q }),
  setCurrentRound: (r) => set({ currentRound: r }),

  setRopePosition: (pos) => set({ ropePosition: pos }),

  setScores: (scores) => set({ scores }),
  incrementScore: (player) => {
    const scores = { ...get().scores };
    scores[player] = (scores[player] || 0) + 1;
    set({ scores });
  },

  setLastRoundResult: (result) => set({ lastRoundResult: result }),
  addRoundHistory: (entry) => set((s) => ({
    roundHistory: [...s.roundHistory, entry],
  })),

  setTimerSeconds: (n) => set({ timerSeconds: n }),
  setTimerRunning: (b) => set({ timerRunning: b }),

  appendAnswer: (digit) => {
    const cur = get().myAnswer;
    if (cur.length >= 5) return; // max 5 digits
    set({ myAnswer: cur + String(digit) });
  },
  clearAnswer: () => set({ myAnswer: '' }),
  setIsLocked: (b) => set({ isLocked: b }),
  setLastFeedback: (f) => set({ lastFeedback: f }),
  setOpponentLocked: (b) => set({ opponentLocked: b }),

  setWinner: (w, name) => set({ winner: w, winnerName: name }),

  setEmote: (player, emote) => set((state) => ({
    currentEmotes: { ...state.currentEmotes, [player]: emote }
  })),

  resetForNewRound: () => set({
    myAnswer: '',
    isLocked: false,
    lastFeedback: null,
    opponentLocked: false,
    lastRoundResult: null,
    timerRunning: true,
    currentEmotes: { player1: null, player2: null },
  }),

  resetGame: () => set({
    gameId: null,
    playerId: null,
    phase: 'home',
    currentQuestion: null,
    currentRound: 0,
    ropePosition: 0,
    scores: { player1: 0, player2: 0 },
    roundHistory: [],
    lastRoundResult: null,
    myAnswer: '',
    isLocked: false,
    lastFeedback: null,
    opponentLocked: false,
    winner: null,
    winnerName: null,
    timerRunning: false,
  }),
}));

export default useGameStore;
