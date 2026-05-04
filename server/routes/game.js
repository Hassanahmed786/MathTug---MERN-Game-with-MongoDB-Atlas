const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const Game = require('../models/Game');
const { generateQuestions } = require('../utils/questionGenerator');

// POST /api/game/new — Create a new game session
router.post('/new', async (req, res) => {
  try {
    const {
      player1Name = 'Player 1',
      player2Name = 'Player 2',
      totalRounds = 10,
      difficulty = 'medium',
      isLocal = false,
    } = req.body;

    const gameId = uuidv4();
    const questions = generateQuestions(totalRounds, difficulty);

    const game = new Game({
      gameId,
      player1: { name: player1Name, score: 0 },
      player2: { name: isLocal ? player2Name : 'Waiting...', score: 0 },
      questions,
      totalRounds,
      difficulty,
      currentRound: 0,
      ropePosition: 0,
      status: 'waiting',
    });

    await game.save();

    res.status(201).json({
      success: true,
      gameId,
      joinCode: game.joinCode,
      message: 'Game created successfully',
    });
  } catch (error) {
    console.error('Error creating game:', error);
    res.status(500).json({ success: false, error: 'Failed to create game' });
  }
});

// POST /api/game/join — Join game via Code
router.post('/join', async (req, res) => {
  try {
    const { joinCode, player2Name } = req.body;
    if (!joinCode || !player2Name) {
      return res.status(400).json({ success: false, error: 'Missing code or name' });
    }

    const code = joinCode.toUpperCase();
    const games = Array.from(Game.games.values());
    const game = games.find(g => g.joinCode === code && g.status === 'waiting');

    if (!game) {
      return res.status(404).json({ success: false, error: 'Game not found or already started' });
    }

    game.player2.name = player2Name;
    await game.save();

    res.json({
      success: true,
      gameId: game.gameId,
      message: 'Joined successfully',
    });
  } catch (error) {
    console.error('Error joining game:', error);
    res.status(500).json({ success: false, error: 'Failed to join game' });
  }
});

// GET /api/game/history — All finished games (leaderboard)
// IMPORTANT: This must be defined BEFORE /api/game/:id to avoid route conflict
router.get('/history', async (req, res) => {
  try {
    const games = await Game.find({ status: 'finished' })
      .sort({ finishedAt: -1 })
      .limit(50)
      .select('-questions -__v');

    res.json({ success: true, games });
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch history' });
  }
});

// GET /api/game/:id — Fetch full game state
router.get('/:id', async (req, res) => {
  try {
    const game = await Game.findOne({ gameId: req.params.id });
    if (!game) {
      return res.status(404).json({ success: false, error: 'Game not found' });
    }
    res.json({ success: true, game });
  } catch (error) {
    console.error('Error fetching game:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch game' });
  }
});

// POST /api/game/:id/answer — Submit an answer (REST fallback; primary flow via socket)
router.post('/:id/answer', async (req, res) => {
  try {
    const { playerId, answer } = req.body;
    const game = await Game.findOne({ gameId: req.params.id });

    if (!game) {
      return res.status(404).json({ success: false, error: 'Game not found' });
    }
    if (game.status !== 'active') {
      return res.status(400).json({ success: false, error: 'Game is not active' });
    }

    const currentQ = game.questions[game.currentRound];
    const isCorrect = Number(answer) === currentQ.answer;

    res.json({
      success: true,
      correct: isCorrect,
      correctAnswer: currentQ.answer,
    });
  } catch (error) {
    console.error('Error submitting answer:', error);
    res.status(500).json({ success: false, error: 'Failed to submit answer' });
  }
});

module.exports = router;
