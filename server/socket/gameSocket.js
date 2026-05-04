const Game = require('../models/Game');

// Track active game rooms: gameId -> { roundTimer, answers: { player1: null|num, player2: null|num } }
const activeRooms = new Map();

const ROUND_TIMEOUT_MS = 15000;

function emitQuestion(io, gameId, game) {
  const q = game.questions[game.currentRound];
  io.to(gameId).emit('game:question', {
    round: game.currentRound + 1,
    totalRounds: game.totalRounds,
    question: q,
    ropePosition: game.ropePosition,
    scores: {
      player1: game.player1.score,
      player2: game.player2.score,
    },
  });

  // Start round timer
  const roomData = activeRooms.get(gameId) || { answers: {} };
  roomData.answers = { player1: null, player2: null };
  roomData.questionStartTime = Date.now();
  roomData.rematchRequests = roomData.rematchRequests || new Set();

  if (roomData.roundTimer) clearTimeout(roomData.roundTimer);

  roomData.roundTimer = setTimeout(async () => {
    await handleRoundEnd(io, gameId, 'timeout', null);
  }, ROUND_TIMEOUT_MS);

  activeRooms.set(gameId, roomData);
}

async function handleRoundEnd(io, gameId, result, winnerId, isCritical = false) {
  const roomData = activeRooms.get(gameId);
  if (roomData?.roundTimer) {
    clearTimeout(roomData.roundTimer);
    roomData.roundTimer = null;
  }

  try {
    const game = await Game.findOne({ gameId });
    if (!game || game.status !== 'active') return;

    const currentQ = game.questions[game.currentRound];
    let ropeShift = 0;
    const shiftMagnitude = isCritical ? 1.5 : 1;

    if (winnerId === 'player1') {
      game.player1.score += 1;
      ropeShift = -shiftMagnitude; // rope moves toward player1 (left)
    } else if (winnerId === 'player2') {
      game.player2.score += 1;
      ropeShift = shiftMagnitude; // rope moves toward player2 (right)
    }

    const newRopePosition = Math.max(-5, Math.min(5, game.ropePosition + ropeShift));
    game.ropePosition = newRopePosition;

    // Record round history
    const roomAnswers = roomData?.answers || {};
    game.roundHistory.push({
      round: game.currentRound + 1,
      equation: currentQ.equation,
      answer: currentQ.answer,
      winner: result === 'timeout' ? 'timeout' : (winnerId || 'draw'),
      p1Answer: roomAnswers.player1 ?? null,
      p2Answer: roomAnswers.player2 ?? null,
      timeTaken: null,
    });

    // Emit round result
    io.to(gameId).emit('game:roundResult', {
      result,
      winner: winnerId,
      isCritical,
      correctAnswer: currentQ.answer,
      scores: {
        player1: game.player1.score,
        player2: game.player2.score,
      },
      ropePosition: newRopePosition,
      round: game.currentRound + 1,
    });

    io.to(gameId).emit('game:ropeUpdate', { ropePosition: newRopePosition });

    game.currentRound += 1;

    // Check if game is over
    if (game.currentRound >= game.totalRounds) {
      let winner = null;
      if (game.player1.score > game.player2.score) winner = 'player1';
      else if (game.player2.score > game.player1.score) winner = 'player2';
      else winner = 'draw';

      game.winner = winner;
      game.status = 'finished';
      game.finishedAt = new Date();
      await game.save();

      setTimeout(() => {
        io.to(gameId).emit('game:ended', {
          winner,
          winnerName: winner === 'player1' ? game.player1.name
            : winner === 'player2' ? game.player2.name : 'Nobody',
          scores: {
            player1: game.player1.score,
            player2: game.player2.score,
          },
          playerNames: {
            player1: game.player1.name,
            player2: game.player2.name,
          },
          totalRounds: game.totalRounds,
          roundHistory: game.roundHistory,
        });
      }, 2500); // brief pause so clients can see the round result

      activeRooms.delete(gameId);
    } else {
      await game.save();
      // Emit next question after short delay
      setTimeout(async () => {
        const updatedGame = await Game.findOne({ gameId });
        if (updatedGame && updatedGame.status === 'active') {
          emitQuestion(io, gameId, updatedGame);
        }
      }, 2500);
    }
  } catch (err) {
    console.error('Error in handleRoundEnd:', err);
  }
}

module.exports = function initGameSocket(io) {
  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // Join a game room
    socket.on('join:game', async ({ gameId, playerName, playerId }) => {
      try {
        const game = await Game.findOne({ gameId });
        if (!game) {
          socket.emit('error', { message: 'Game not found' });
          return;
        }

        socket.join(gameId);
        socket.data.gameId = gameId;
        socket.data.playerId = playerId;
        console.log(`${playerName} (${playerId}) joined room ${gameId}`);

        // Count connected clients in room
        const room = io.sockets.adapter.rooms.get(gameId);
        const clientCount = room ? room.size : 0;

        socket.emit('joined:game', {
          gameId,
          playerId,
          gameState: {
            status: game.status,
            player1: game.player1,
            player2: game.player2,
            ropePosition: game.ropePosition,
            currentRound: game.currentRound,
            totalRounds: game.totalRounds,
            difficulty: game.difficulty,
          },
        });

        // Start game when 2 players have joined (first connection triggers waiting)
        if (clientCount >= 2 && game.status === 'waiting') {
          game.status = 'active';
          await game.save();

          io.to(gameId).emit('game:started', {
            player1: game.player1,
            player2: game.player2,
            totalRounds: game.totalRounds,
            difficulty: game.difficulty,
          });

          setTimeout(() => emitQuestion(io, gameId, game), 1000);
        } else if (game.status === 'active') {
          // Reconnection: resend current question
          const q = game.questions[game.currentRound];
          socket.emit('game:question', {
            round: game.currentRound + 1,
            totalRounds: game.totalRounds,
            question: q,
            ropePosition: game.ropePosition,
            scores: {
              player1: game.player1.score,
              player2: game.player2.score,
            },
          });
        }
      } catch (err) {
        console.error('join:game error:', err);
        socket.emit('error', { message: 'Failed to join game' });
      }
    });

    // Player submits an answer
    socket.on('game:submitAnswer', async ({ gameId, playerId, answer }) => {
      try {
        const game = await Game.findOne({ gameId });
        if (!game || game.status !== 'active') return;

        const roomData = activeRooms.get(gameId);
        if (!roomData) return;

        const currentQ = game.questions[game.currentRound];
        const numAnswer = Number(answer);
        const isCorrect = numAnswer === currentQ.answer;

        const timeTaken = Date.now() - (roomData.questionStartTime || Date.now());
        const isCritical = isCorrect && timeTaken < 2500;

        // Record this player's answer
        if (playerId === 'player1') roomData.answers.player1 = numAnswer;
        if (playerId === 'player2') roomData.answers.player2 = numAnswer;

        // Emit feedback to the answering player
        socket.emit('game:answerFeedback', {
          correct: isCorrect,
          playerId,
          answer: numAnswer,
        });

        if (isCorrect) {
          // First correct answer wins the round
          await handleRoundEnd(io, gameId, 'correct', playerId, isCritical);
        } else {
          // Wrong answer — notify the room so other player sees the miss
          io.to(gameId).emit('game:wrongAnswer', { playerId });
          // Check if both players have answered incorrectly
          const bothAnswered =
            roomData.answers.player1 !== null &&
            roomData.answers.player2 !== null;
          if (bothAnswered) {
            await handleRoundEnd(io, gameId, 'both_wrong', null);
          }
        }
      } catch (err) {
        console.error('game:submitAnswer error:', err);
      }
    });

    // Single player mode: start game with 1 player
    socket.on('game:startSolo', async ({ gameId }) => {
      try {
        const game = await Game.findOne({ gameId });
        if (!game || game.status !== 'waiting') return;

        game.status = 'active';
        await game.save();

        io.to(gameId).emit('game:started', {
          player1: game.player1,
          player2: game.player2,
          totalRounds: game.totalRounds,
          difficulty: game.difficulty,
        });

        setTimeout(() => emitQuestion(io, gameId, game), 1000);
      } catch (err) {
        console.error('game:startSolo error:', err);
      }
    });

    // Emotes
    socket.on('game:emote', ({ gameId, playerId, emote }) => {
      io.to(gameId).emit('game:emote', { playerId, emote });
    });

    // Rematch Request
    socket.on('game:rematchRequest', async ({ gameId, playerId }) => {
      let roomData = activeRooms.get(gameId);
      if (!roomData) {
        roomData = { answers: {}, rematchRequests: new Set() };
        activeRooms.set(gameId, roomData);
      }
      
      roomData.rematchRequests.add(playerId);
      
      io.to(gameId).emit('game:rematchRequested', { playerId });

      try {
        const game = await Game.findOne({ gameId });
        if (!game) return;

        // If it's a local game (shared screen or vs AI), only 1 player needs to request rematch
        const requiredPlayers = game.isLocal ? 1 : 2;

        if (roomData.rematchRequests.size >= requiredPlayers) {
          game.status = 'active';
          game.currentRound = 0;
          game.ropePosition = 0;
          game.player1.score = 0;
          game.player2.score = 0;
          game.winner = null;
          game.roundHistory = [];
          await game.save();

          roomData.rematchRequests.clear();
          
          io.to(gameId).emit('game:rematchAccepted', {
            totalRounds: game.totalRounds
          });
          
          setTimeout(() => emitQuestion(io, gameId, game), 1500);
        }
      } catch (err) {
        console.error('game:rematchRequest error:', err);
      }
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
};
