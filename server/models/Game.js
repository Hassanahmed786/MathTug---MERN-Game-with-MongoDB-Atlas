const { v4: uuidv4 } = require('uuid');

// In-Memory Game Store to bypass MongoDB requirement
class Game {
  static games = new Map();

  constructor(data) {
    Object.assign(this, data);
    if (!this.roundHistory) this.roundHistory = [];
    if (!this.createdAt) this.createdAt = new Date();
    if (!this.player1) this.player1 = { name: 'Player 1', score: 0 };
    if (!this.player2) this.player2 = { name: 'Player 2', score: 0 };
    if (this.currentRound === undefined) this.currentRound = 0;
    if (this.ropePosition === undefined) this.ropePosition = 0;
    if (this.status === undefined) this.status = 'waiting';
    if (!this.gameId) this.gameId = uuidv4();
    if (!this.joinCode) {
      this.joinCode = Math.random().toString(36).substring(2, 6).toUpperCase();
    }
  }

  async save() {
    Game.games.set(this.gameId, this);
    return this;
  }

  static async findOne(query) {
    if (query.gameId) {
      const game = Game.games.get(query.gameId);
      return game || null;
    }
    return null;
  }

  static find(query) {
    // Support the simple query: Game.find({ status: 'finished' }).sort(...).limit(...).select(...)
    let results = Array.from(Game.games.values());
    if (query && query.status) {
      results = results.filter(g => g.status === query.status);
    }
    
    // Mock Mongoose Query Object
    return {
      sort: function(sortOpts) {
        if (sortOpts.finishedAt === -1) {
          results.sort((a, b) => new Date(b.finishedAt) - new Date(a.finishedAt));
        }
        return this;
      },
      limit: function(l) {
        results = results.slice(0, l);
        return this;
      },
      select: function() {
        return Promise.resolve(results);
      }
    };
  }
}

module.exports = Game;
