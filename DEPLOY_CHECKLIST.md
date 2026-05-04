# 📋 Deployment Checklist & Repository Setup

## ✅ Pre-Deployment Requirements

### 🔧 Local Setup
- [x] All dependencies installed (client + server)
- [x] App runs locally: `npm run dev` (both terminals)
- [x] Backend connects to MongoDB
- [x] Socket.io works in-game
- [x] Games save to leaderboard

### 📁 Git & Files
- [x] `.gitignore` configured (root level)
- [x] `.env` files exist locally
- [x] `.env.example` files created (for CI/CD)
- [x] `render.yaml` configured
- [x] `vercel.json` configured
- [x] `DEPLOYMENT.md` guide created
- [x] `QUICK_DEPLOY.md` reference created

### 📋 Documentation
- [x] `README.md` has setup instructions
- [x] `PROJECT_HANDOVER.md` has architecture overview
- [x] Deployment guides in separate files

---

## 🚀 GitHub Setup (Step 1)

### Create Repository

```bash
# Option A: On GitHub.com
1. Go to github.com/new
2. Create repo named: mathtug
3. Description: "A real-time multiplayer math battle game - MERN Stack"
4. Public (for hackathon visibility)
5. Do NOT initialize with README
6. Copy the repository URL

# Option B: Git CLI (if you have gh installed)
gh repo create mathtug --public --source=. --remote=origin --push
```

### Push Local Code

```bash
cd /path/to/vidh_assignment

git init
git add .
git commit -m "🎮 Initial commit: MathTug - Production Ready"
git branch -M main
git remote add origin https://github.com/Hassanahmed786/MathTug---MERN-Game-with-MongoDB-Atlas.git
git push -u origin main
```

✅ **Result**: Your code is now on GitHub with version history

---

## 💾 MongoDB Atlas Setup (Step 2)

### Create Free Cluster

```
1. Go to mongodb.com/cloud/atlas
2. Sign up (free)
3. Create organization "MathTug"
4. Create project "MathTug"
5. Create cluster (M0 free tier)
6. Choose region closest to you
```

### Create Database User

```
Security → Database Access → Add New Database User
- Username: (choose something)
- Password: (generate strong password)
- Built-in Role: Atlas admin
- Click "Add User"
```

### Get Connection String

```
Clusters → Connect → Drivers → Node.js
Copy: mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/mathtug?...

IMPORTANT: Replace <username> and <password> with actual credentials
```

### Whitelist IP

```
Security → Network Access → Add IP Address
- Allow Access From: 0.0.0.0/0 (allows all IPs, fine for free tier)
- Click "Confirm"
```

✅ **Result**: You have a MongoDB connection string ready

---

## 🎯 Render Backend Deployment (Step 3)

### Connect to GitHub

```
1. Go to render.com
2. Sign up with GitHub
3. Grant permission to access your repositories
```

### Create Web Service

```
1. Dashboard → New + → Web Service
2. Select your mathtug repository
3. Fill in:
   - Name: mathtug-server
   - Environment: Node
   - Region: (closest to you)
   - Branch: main
```

### Configure Build & Start

```
Build Command:
cd client && npm install && npm run build && cd ../server && npm install

Start Command:
cd server && NODE_ENV=production node server.js
```

### Add Environment Variables

```
In Render dashboard → Environment:

MONGO_URI: mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/mathtug?retryWrites=true&w=majority
CLIENT_URL: https://mathtug.vercel.app (deploy frontend first or use placeholder)
PORT: 5001
NODE_ENV: production
NODE_VERSION: 20
```

### Deploy

```
Click "Create Web Service"
Wait 5-10 minutes for deployment
Check "Logs" tab for errors
Success = "✓ Your service is live"
```

✅ **Result**: Backend running at `https://mathtug-server.onrender.com`

---

## 🌐 Vercel Frontend Deployment (Step 4)

### Connect to GitHub

```
1. Go to vercel.com
2. Sign up with GitHub
3. Grant permission to access your repositories
```

### Create Project

```
1. Dashboard → Add New → Project
2. Select mathtug repository
3. Vercel auto-detects settings
4. Verify Root Directory: ./client
```

### Add Environment Variable

```
In Project Settings → Environment Variables:

VITE_SERVER_URL: https://mathtug-server.onrender.com
```

### Deploy

```
Click "Deploy"
Wait 2-5 minutes
Success = "Deployed" badge
Note your URL: https://mathtug.vercel.app (or custom domain)
```

✅ **Result**: Frontend deployed at `https://mathtug.vercel.app`

---

## 🔄 Final Configuration (Step 5)

### Update Render with Vercel URL

```
Render Dashboard → mathtug-server → Settings → Environment

UPDATE:
CLIENT_URL: https://mathtug.vercel.app

SAVE (auto-redeploy)
```

### Test Socket.io Connection

```
1. Open https://mathtug.vercel.app
2. Click "Start New Game"
3. Open browser DevTools Console (F12)
4. Should see: "🔌 Socket connected: [socket-id]"
5. Start a game and verify it works
```

✅ **Result**: Everything connected and working!

---

## 🎮 Test Checklist

After deployment, verify these work:

- [ ] Homepage loads at `https://mathtug.vercel.app`
- [ ] Can start a new game
- [ ] Player names input works
- [ ] Difficulty & rounds selection works
- [ ] Game page loads with rope animation
- [ ] Can input numbers and submit answers
- [ ] Score updates in real-time
- [ ] Rope moves based on correct answers
- [ ] Game ends after all rounds
- [ ] Winner screen displays correctly
- [ ] Leaderboard page works
- [ ] Browser console shows NO errors

---

## 📊 Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    GitHub Repository                        │
│          (mathtug - All code with git history)              │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
   ┌────▼──────┐        ┌────────▼────────┐
   │  Vercel   │        │    Render       │
   │ Frontend  │        │   Backend       │
   │(React/    │        │  (Express/      │
   │Vite)      │        │  Socket.io)     │
   └────┬──────┘        └────────┬────────┘
        │                        │
        └────────────┬───────────┘
                     │
           ┌─────────▼──────────┐
           │  MongoDB Atlas     │
           │   (Cloud DB)       │
           │ (Game History &    │
           │  Leaderboard)      │
           └────────────────────┘
```

---

## 🚨 Common Issues & Fixes

### Frontend won't load
**Cause**: Backend URL misconfigured
**Fix**: Verify `VITE_SERVER_URL` env var is correct in Vercel

### Socket.io connection fails
**Cause**: CORS or wrong backend URL
**Fix**: 
1. Check `CLIENT_URL` in Render matches Vercel URL exactly
2. Check browser DevTools → Network → WebSocket
3. Verify Render backend is running (check logs)

### Games not saving to leaderboard
**Cause**: MongoDB connection failed
**Fix**:
1. Verify connection string in Render env
2. Check IP whitelist in MongoDB Atlas (allow 0.0.0.0/0)
3. Check Render logs for MongoDB errors

### Builds fail on Render
**Cause**: Dependencies not installing
**Fix**:
1. Test locally: `npm install && npm run build`
2. Check Node version: should be 20
3. Check Render build logs for specific errors

### Vercel shows 404
**Cause**: Client build not deployed correctly
**Fix**:
1. Check Vercel build logs
2. Verify Root Directory: `./client`
3. Verify Build Command: `npm run build`

---

## 📝 File Structure for Deployment

```
vidh_assignment/
├── .git/                       (git history after init)
├── .gitignore                  ✅ (blocks .env, node_modules)
├── render.yaml                 ✅ (Render config)
├── DEPLOYMENT.md               ✅ (Full guide)
├── QUICK_DEPLOY.md             ✅ (Quick reference)
├── PROJECT_HANDOVER.md         ✅ (Architecture)
├── README.md                   ✅ (Setup guide)
├── client/
│   ├── .env                    ✅ (local - not committed)
│   ├── .env.example            ✅ (template for CI/CD)
│   ├── vercel.json             ✅ (Vercel config)
│   ├── vite.config.js          ✅ (build config)
│   ├── package.json            ✅ (dependencies)
│   └── src/                    (React code)
└── server/
    ├── .env                    ✅ (local - not committed)
    ├── .env.example            ✅ (template for CI/CD)
    ├── package.json            ✅ (dependencies)
    └── server.js               ✅ (entry point)
```

---

## 🎯 Deploy Sequence

Follow this order:

1. ✅ **Push to GitHub** (this makes it easy to deploy)
2. ✅ **Setup MongoDB Atlas** (needed for backend)
3. ✅ **Deploy to Render** (backend needs to be up first)
4. ✅ **Deploy to Vercel** (frontend needs backend URL)
5. ✅ **Update Render CLIENT_URL** (final connection)
6. ✅ **Test Everything** (verify all features work)

---

## 📦 What Gets Deployed

### To Render (Backend)
- `server/` folder with all code
- `server/package.json` dependencies
- Built client (in `client/dist/`)
- Environment variables from Render dashboard

### To Vercel (Frontend)
- `client/dist/` folder (compiled React/Vite)
- NOT: `node_modules`, source code, `.env`
- Environment variables from Vercel dashboard

### To GitHub
- ALL code (client + server)
- NOT: `node_modules`, `.env`, `dist/`
- `.gitignore` ensures sensitive files aren't tracked

---

## ✨ Success Indicators

You'll know everything works when:

- [x] Git: Can view history on GitHub
- [x] GitHub: Repository is public and has all commits
- [x] Render: Web service shows "✓ Your service is live"
- [x] Vercel: Shows "Deployed" in dashboard
- [x] Frontend: Loads without errors
- [x] Socket.io: Connects in browser console
- [x] MongoDB: Games save to database
- [x] Leaderboard: Shows past games

---

## 🎉 Congratulations!

Your MathTug game is now **LIVE** and ready for:
- Sharing with friends
- Submitting to hackathon
- Scaling to more players
- Adding more features

Share these URLs:
```
🎮 Play: https://mathtug.vercel.app
📚 Code: https://github.com/Hassanahmed786/MathTug---MERN-Game-with-MongoDB-Atlas
```

---

## 📚 Additional Help

- Vercel Docs: vercel.com/docs
- Render Docs: render.com/docs
- MongoDB Docs: docs.atlas.mongodb.com
- Socket.io: socket.io/docs
