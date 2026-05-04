# 🪢 MathTug — Tug-of-War Number Battle

A real-time **two-player math battle game** built with the **MERN stack** (MongoDB, Express, React, Node.js). Players race to answer arithmetic equations — the first correct answer pulls the rope to their side!

## ✨ Features

- 🎮 **Real-time multiplayer** via Socket.io (cross-device play with 4-letter join codes)
- 🤖 **Single-Player AI Mode** with human-like reaction times and difficulty scaling
- 🎭 **Social Emote System**: Express yourself with floating 😂, 😡, 🥶, 🤯 reactions
- 📈 **Progression System**: Persistent XP and Leveling (Rank up through play!)
- 💥 **Critical Hits**: High-speed correct answers trigger extra rope pull force
- 🪢 **3D rope animation** built with Three.js / @react-three/fiber
- 🧮 **3 difficulty levels**: Easy (1–9), Medium (1–49), Hard (1–99)
- ⏱ **15-second round timer** with visual countdown ring
- 🔊 **Web Audio API sound effects** (BGM + high-tension Sudden Death audio)
- 🏆 **Leaderboard** persisted in MongoDB
- 🎉 **Canvas-confetti** winner celebration
- 📱 Optimized for **landscape tablet/phone** displays

---

## 🔧 Prerequisites

- **Node.js** v18+
- **MongoDB** (local install or [MongoDB Atlas](https://www.mongodb.com/atlas/database))

---

## 🚀 Installation & Setup

### 1. Clone / Navigate to project

```bash
cd "vidh_assignment"
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create your `.env` file (copy from example):
```bash
copy .env.example .env
```

Edit `server/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/mathtug
CLIENT_URL=http://localhost:5173
```

Start the backend:
```bash
node server.js
# or: npm start
```

You should see:
```
✅ MongoDB connected
🚀 MathTug server running on http://localhost:5000
```

### 3. Frontend Setup

```bash
cd ../client
npm install
npm run dev
```

Frontend runs at: **http://localhost:5173**

---

## 🎮 How to Play

1. Open **http://localhost:5173**
2. Click **Start New Game**
3. Enter names for Player 1 and Player 2
4. Choose **Difficulty** and **Number of Rounds**
5. Click **Start Battle!**
6. Both players see the same equation in the center
7. Use the **number pad** on your side to type and submit the answer
8. First correct answer wins the round and **pulls the rope** to their side
9. After all rounds, the player with more points wins!

### Controls
| Player 1 (Left) | Player 2 (Right) |
|----------------|-----------------|
| Left numpad | Right numpad |
| Tap digits → ✓ to submit | Tap digits → ✓ to submit |

---

## 📁 Project Structure

```
vidh_assignment/
├── server/
│   ├── models/
│   │   └── Game.js              # Mongoose schema
│   ├── routes/
│   │   └── game.js              # REST API endpoints
│   ├── socket/
│   │   └── gameSocket.js        # Socket.io event handlers
│   ├── utils/
│   │   └── questionGenerator.js # Math question generator
│   ├── server.js                # Express + Socket.io entry point
│   └── .env                     # Environment variables
│
└── client/
    └── src/
        ├── components/
        │   ├── RopeCanvas.jsx   # 3D Three.js rope
        │   ├── NumberPad.jsx    # Touch numpad
        │   ├── QuestionDisplay.jsx
        │   ├── ScoreBoard.jsx
        │   ├── TimerRing.jsx
        │   ├── WinnerScreen.jsx
        │   └── PlayerSetup.jsx
        ├── pages/
        │   ├── Home.jsx
        │   ├── Game.jsx
        │   └── Leaderboard.jsx
        ├── store/
        │   └── gameStore.js     # Zustand global state
        ├── hooks/
        │   ├── useSocket.js     # Socket.io hook
        │   └── useTimer.js      # Countdown timer
        └── utils/
            ├── soundEffects.js  # Web Audio API
            └── questionGenerator.js
```

---

## 🔌 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/game/new` | Create new game session |
| GET | `/api/game/:id` | Get game state |
| GET | `/api/game/history` | Get all finished games |
| POST | `/api/game/:id/answer` | Submit answer (REST fallback) |

### Socket.io Events

**Client → Server:**
- `join:game` — Join a game room
- `game:submitAnswer` — Submit an answer
- `game:startSolo` — Start game with 1 connection (local play)

**Server → Client:**
- `game:started` — Game has begun
- `game:question` — New question data
- `game:answerFeedback` — Correct/wrong feedback
- `game:wrongAnswer` — Other player got it wrong
- `game:roundResult` — Round ended with results
- `game:ropeUpdate` — Updated rope position
- `game:ended` — Game over with final scores

---

## 🎨 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| State | Zustand |
| Animations | Framer Motion |
| 3D | Three.js + @react-three/fiber |
| Routing | React Router v6 |
| Real-time | Socket.io client |
| HTTP | Axios |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Real-time | Socket.io |
| Confetti | canvas-confetti |
| Sound | Web Audio API |

---

## 🐛 Troubleshooting

**"Could not connect to server"**
- Ensure the backend is running: `cd server && node server.js`
- Check MongoDB is running locally or your Atlas URI is correct

**"Game not found"**
- The game session may have expired. Start a new game.

**No sound effects**
- Click anywhere on the page first (browsers require user interaction before audio)

**Rope not animating**
- WebGL must be enabled in your browser. Try Chrome or Firefox.
