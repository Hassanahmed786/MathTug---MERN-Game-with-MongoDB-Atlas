const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

// ── Mongoose Schema ──────────────────────────────────────────────────────────
const playerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  score: { type: Number, default: 0 },
}, { _id: false });

const questionSchema = new mongoose.Schema({
  equation: String,
  answer: Number,
  type: String,
}, { _id: false });

const roundHistorySchema = new mongoose.Schema({
  round: Number,
  result: String,
  winner: String,
  correctAnswer: Number,
  isCritical: Boolean,
}, { _id: false });

const gameSchema = new mongoose.Schema({
  gameId:      { type: String, default: uuidv4, unique: true, index: true },
  joinCode:    { type: String, default: () => Math.random().toString(36).substring(2, 6).toUpperCase() },
  player1:     playerSchema,
  player2:     playerSchema,
  questions:   [questionSchema],
  totalRounds: { type: Number, default: 10 },
  difficulty:  { type: String, enum: ['easy', 'medium', 'hard', 'insane'], default: 'medium' },
  currentRound:{ type: Number, default: 0 },
  ropePosition:{ type: Number, default: 0 },
  status:      { type: String, enum: ['waiting', 'active', 'finished'], default: 'waiting' },
  winner:      { type: String, default: null },
  winnerName:  { type: String, default: null },
  roundHistory:[roundHistorySchema],
  isLocal:     { type: Boolean, default: false },
  finishedAt:  { type: Date, default: null },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Game', gameSchema);
