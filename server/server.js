require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const gameRoutes = require('./routes/game');
const initGameSocket = require('./socket/gameSocket');

const app = express();
const server = http.createServer(app);

// ── CORS ─────────────────────────────────────────────────────────────────────
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:4173',
  'http://localhost:5001'
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin or from allowed origins
    if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV === 'production') {
      return callback(null, true);
    }
    callback(null, false);
  },
  credentials: true,
}));

// ── Socket.io ────────────────────────────────────────────────────────────────
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  },
  pingTimeout: 60000,
  pingInterval: 25000,
});

initGameSocket(io);

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/game', gameRoutes);

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    db: mongoose.connection.readyState === 1 ? 'mongodb' : 'in-memory',
  });
});

// ── Production Frontend Serving ───────────────────────────────────────────────
if (process.env.NODE_ENV === 'production') {
  const clientBuildPath = path.join(__dirname, '../client/dist');
  app.use(express.static(clientBuildPath));
  
  app.get(/(.*)/, (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(clientBuildPath, 'index.html'));
    }
  });
}

// ── Database Connection ───────────────────────────────────────────────────────
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5001;

async function startServer() {
  if (MONGO_URI) {
    try {
      await mongoose.connect(MONGO_URI, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log('✅ MongoDB connected:', MONGO_URI);
      // Switch game routes to use Mongoose model
      process.env.USE_MONGO = 'true';
    } catch (err) {
      console.warn('⚠️  MongoDB unavailable, falling back to In-Memory store:', err.message);
      console.log('💡 Game data will not persist across server restarts.');
    }
  } else {
    console.log('ℹ️  No MONGO_URI set — using In-Memory store.');
  }

  server.listen(PORT, () => {
    console.log(`🚀 MathTug server running on http://localhost:${PORT}`);
  });
}

startServer();

module.exports = { app, io };
