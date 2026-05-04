# MathTug — Project Handover & Context

This document provides a comprehensive overview of the MathTug project's development history, current architecture, and the steps required to take it to the finish line.

---

## 🏗️ 1. Work Completed (What We Built)

We successfully evolved MathTug from a basic concept into a highly polished, production-ready, multiplayer MERN stack game optimized for hackathons.

### Core Architecture
* **Frontend**: React.js powered by Vite. Utilizes `framer-motion` for sleek UI animations and `react-three-fiber` for the 3D rope/physics environment.
* **Backend**: Node.js & Express server equipped with Socket.io for ultra-low latency real-time multiplayer synchronization.
* **Database**: Integrated **MongoDB** (via Mongoose) to persist game history and leaderboards, complete with a smart fallback mechanism that uses an in-memory store if the database goes offline.

### Gameplay Features Implemented
* **Real-time Multiplayer & Single Player AI**: Play against human opponents via join codes, or battle an AI bot that simulates human reaction times across 4 difficulty tiers (Easy, Medium, Hard, Insane).
* **Dynamic Progression System**: Players earn XP and level up based on their game performance (saved locally via Zustand).
* **Interactive Social Elements**: An immersive 3D emote system allows players to spam emojis during a match without breaking focus.
* **Advanced Game Mechanics**:
  * **Critical Hits**: Answering correctly in under 2.5 seconds triggers a 1.5x pull multiplier, along with custom visual effects and sounds.
  * **Sudden Death**: When tied on the final round, the screen pulses red, the music intensifies, and it becomes a "next point wins" scenario.
* **Audio Engine**: A custom Web Audio API synthesizer (`soundEffects.js`) generates background music loops and SFX dynamically, avoiding heavy `.mp3` file downloads.

### UI & UX Polish
* **Glassmorphism & Neon Design**: Built a cohesive cyberpunk/arcade aesthetic using high-quality custom CSS.
* **True Responsive Design**: Converted layouts to use modern `dvh` units and flexible grid/flexbox fallbacks to ensure the UI perfectly fits both wide desktop monitors and narrow mobile phone screens.
* **Deployment Ready**: Configured `vite.config.js` for aggressive chunk-splitting (to guarantee fast load times) and updated `server.js` to serve static production files natively.

---

## 🧠 2. Context Required (How It Works)

If you or a teammate need to run this code locally or modify it, here is what you need to know:

### Running the App Locally
You need two terminal windows:
1. **Backend**: 
   ```bash
   cd server
   npm install
   # Create a .env file here and add your MONGO_URI (optional)
   npm run dev  # (Starts nodemon on port 5001)
   ```
2. **Frontend**: 
   ```bash
   cd client
   npm install
   npm run dev  # (Starts Vite on port 5173)
   ```

### Important Files
* `client/src/store/gameStore.js` - The master state manager for the game. Controls the UI flow (Setup -> Game -> Winner Screen).
* `client/src/hooks/useSocket.js` - Connects the frontend to the backend. All game logic events (`submitAnswer`, `rematchAccepted`) pass through here.
* `server/socket/gameSocket.js` - The brain of the server. Matches players, handles math generation, calculates round winners, and pushes state to clients.
* `server/models/GameMongo.js` - The database schema for storing finished games.

---

## 🚀 3. Next Steps (What to do before/after Hackathon)

1. **Deploy the Database**: 
   * You currently have MongoDB running locally. Before deploying, create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register).
   * Get the connection string and put it in your backend's `.env` variables as `MONGO_URI`.
2. **Deploy the App**: 
   * Follow the "Split Hosting" guide (deploy the `client/` folder to Vercel, and the `server/` folder to Render).
   * Ensure `VITE_SERVER_URL` in Vercel points to Render, and `CLIENT_URL` in Render points to Vercel.
3. **Future Feature Ideas (Post-Hackathon)**:
   * **Global User Accounts**: Add Firebase Auth or JWT login so the XP and levels sync across devices, rather than relying on `localStorage`.
   * **Global Leaderboard**: The current leaderboard pulls recent games. Update the schema to aggregate total wins per user across all time.
   * **Custom Avatars**: Let players spend their XP to unlock new 3D avatars instead of the default 🧠 and 🎯 emojis.
