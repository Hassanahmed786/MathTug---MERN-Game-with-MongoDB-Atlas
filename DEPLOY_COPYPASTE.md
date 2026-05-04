# ⚡ Copy-Paste Deployment Commands

## 1️⃣ Push to GitHub (5 min)

```bash
cd "e:\hackathon stuff\vidh_assignment"
git init
git add .
git commit -m "🎮 MathTug - MERN Game with MongoDB Atlas"
git branch -M main
git remote add origin https://github.com/Hassanahmed786/MathTug---MERN-Game-with-MongoDB-Atlas.git
git push -u origin main
```

**Change**: Already configured ✅

---

## 2️⃣ Render Backend Config

**Go to**: https://render.com → New → Web Service → Select mathtug repo

### Build Command
```bash
cd client && NODE_ENV=development npm install && npm run build && cd ../server && npm install
```

### Start Command
```bash
cd server && NODE_ENV=production node server.js
```

### Environment Variables (Copy Exactly)
```
MONGO_URI=mongodb+srv://ahmedshaikhassan_db_user:xtdw3fCQMAmtYw8a@cluster0.h5prwwe.mongodb.net/mathtug?retryWrites=true&w=majority
CLIENT_URL=https://mathtug.vercel.app
PORT=5001
NODE_ENV=production
```

**Then**: Click "Create Web Service" → Wait 5-10 min → Done ✅

**Save**: Your backend URL (looks like: `https://mathtug-server.onrender.com`)

---

## 3️⃣ Vercel Frontend Config

**Go to**: https://vercel.com → Add New → Project → Select mathtug repo

### Environment Variables
```
VITE_SERVER_URL=https://mathtug-server.onrender.com
```

**Change**: Replace `https://mathtug-server.onrender.com` with your actual Render backend URL

**Then**: Click "Deploy" → Wait 2-5 min → Done ✅

**Get**: Your frontend URL (looks like: `https://mathtug.vercel.app`)

---

## ✅ Test It

Open: `https://mathtug.vercel.app`

Play a game → See Socket connection in DevTools (F12) → Check Leaderboard saved game

---

## 🎯 Final URLs

```
Play:     https://mathtug.vercel.app
Code:     https://github.com/Hassanahmed786/MathTug---MERN-Game-with-MongoDB-Atlas
Backend:  https://mathtug-server.onrender.com
Database: MongoDB Atlas (cluster0.h5prwwe)
```

---

## 📱 Share Your Game

Tell friends/judges:
```
🎮 Play my MathTug game: https://mathtug.vercel.app
📚 GitHub: https://github.com/Hassanahmed786/MathTug---MERN-Game-with-MongoDB-Atlas
```

---

## ⏱️ Total Time: ~25 minutes

- Git: 5 min
- Render: 10-15 min (mostly waiting)
- Vercel: 5 min (mostly waiting)

---

**Status**: Everything ready! Just copy-paste above. 🚀
