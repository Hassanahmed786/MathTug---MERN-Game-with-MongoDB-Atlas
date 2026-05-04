# 🚀 MathTug — Deployment Guide

This guide covers deploying MathTug to GitHub, Vercel (Frontend), Render (Backend), and MongoDB Atlas.

---

## 📋 Prerequisites

- GitHub account
- Vercel account (free)
- Render account (free)
- MongoDB Atlas account (free cluster available)

---

## 1️⃣ Setup GitHub Repository

### Step 1: Create a new repository on GitHub

1. Go to [github.com/new](https://github.com/new)
2. Name: `mathtug` (or your preferred name)
3. Description: `A real-time two-player math battle game built with MERN stack`
4. Choose Public (for hackathon visibility)
5. **Don't** initialize with README (we already have one)
6. Click **Create repository**

### Step 2: Initialize and push to GitHub

In your project root:

```bash
git init
git add .
git commit -m "🎮 Initial MathTug commit - production ready"
git branch -M main
git remote add origin https://github.com/Hassanahmed786/MathTug---MERN-Game-with-MongoDB-Atlas.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

---

## 2️⃣ Setup MongoDB Atlas (Cloud Database)

### Step 1: Create MongoDB Atlas Account

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up (free tier available)
3. Create a project named "MathTug"
4. Create a cluster (M0 free tier is fine)

### Step 2: Get Connection String

1. In Atlas, go to **Clusters** → **Connect**
2. Choose **Drivers** → **Node.js**
3. Copy the connection string (looks like):
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/mathtug?retryWrites=true&w=majority
   ```
4. Replace `<username>` and `<password>` with your Atlas credentials
5. Save this for later (needed for Render)

### Step 3: Create Database User

In MongoDB Atlas:
1. Go to **Security** → **Database Access**
2. Create a new database user
3. Save the username and password

---

## 3️⃣ Deploy Backend to Render

### Step 1: Connect GitHub to Render

1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Click **New +** → **Web Service**
4. Connect your GitHub repository

### Step 2: Configure Render Deployment

Fill in these fields:

- **Name**: `mathtug-server`
- **Environment**: `Node`
- **Build Command**: 
  ```bash
  cd client && npm install && npm run build && cd ../server && npm install
  ```
- **Start Command**: 
  ```bash
  cd server && NODE_ENV=production node server.js
  ```
- **Node Version**: `20`

### Step 3: Add Environment Variables

In Render settings, add:

```env
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/mathtug?retryWrites=true&w=majority
CLIENT_URL=https://mathtug.vercel.app
NODE_ENV=production
PORT=5001
```

Replace:
- `mongodb+srv://...` with your MongoDB Atlas connection string
- `https://mathtug.vercel.app` with your Vercel frontend URL (after deployment)

### Step 4: Deploy

Click **Create Web Service** and wait for deployment (5-10 minutes).

After successful deployment, you'll get a URL like: `https://mathtug-server.onrender.com`

---

## 4️⃣ Deploy Frontend to Vercel

### Step 1: Connect GitHub to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click **Add New...** → **Project**
4. Select your `mathtug` repository
5. Click **Import**

### Step 2: Configure Build Settings

Vercel auto-detects. Verify:

- **Framework**: `Vite`
- **Build Command**: `npm run build`
- **Output Directory**: `client/dist`
- **Root Directory**: `./client`

### Step 3: Add Environment Variables

In Vercel project settings:

```env
VITE_SERVER_URL=https://mathtug-server.onrender.com
```

Replace with your actual Render backend URL.

### Step 4: Deploy

Click **Deploy** and wait (2-5 minutes).

After deployment, Vercel provides your public URL: `https://mathtug.vercel.app`

---

## 5️⃣ Final Configuration

### Update Render with Vercel URL

1. Go back to [Render Dashboard](https://dashboard.render.com)
2. Select `mathtug-server`
3. Go to **Settings** → **Environment**
4. Update `CLIENT_URL`:
   ```env
   CLIENT_URL=https://mathtug.vercel.app
   ```
5. Click **Save Changes** (automatic redeployment)

### Test the Live App

1. Open `https://mathtug.vercel.app`
2. Start a game
3. Verify Socket.io connects to backend
4. Verify MongoDB stores game history

---

## 📊 Deployment Architecture

```
┌─────────────────────────────────────────┐
│   GitHub Repository                     │
│   (mathtug - all code)                  │
└────────────┬──────────────────────────┬─┘
             │                          │
    ┌────────▼────────┐     ┌──────────▼──────────┐
    │  Vercel         │     │  Render             │
    │  Frontend       │     │  Backend + Client   │
    │  (Vite build)   │     │  (Node.js + Socket) │
    └────────┬────────┘     └──────────┬──────────┘
             │                          │
             └──────────────┬───────────┘
                            │
                    ┌───────▼──────────┐
                    │  MongoDB Atlas   │
                    │  (Cloud DB)      │
                    └──────────────────┘
```

---

## 🔄 Continuous Deployment

- **Vercel**: Auto-deploys on every `push` to `main` branch
- **Render**: Auto-deploys on every `push` to `main` branch
- **No manual steps needed** — just push to GitHub!

---

## 🚨 Troubleshooting

### Socket.io Connection Issues

If the frontend can't connect to the backend:

1. **Check Render URL**: Verify backend is running at `https://mathtug-server.onrender.com/health`
2. **Update CLIENT_URL**: Ensure Render has the correct frontend URL
3. **CORS**: If still failing, add frontend URL to `server.js` CORS allowedOrigins

### MongoDB Connection Fails

1. **Check connection string**: Verify it's correct in Render environment
2. **IP Whitelist**: In MongoDB Atlas, allow all IPs (0.0.0.0/0) for free tier
3. **Network**: Restart Render web service

### Build Fails on Vercel

1. Check build logs in Vercel dashboard
2. Ensure `VITE_SERVER_URL` is set
3. Verify `npm run build` works locally first

---

## 📝 Environment Variables Checklist

### Local Development (.env files)

```
server/.env:
- PORT=5001
- MONGO_URI=mongodb://localhost:27017/mathtug
- CLIENT_URL=http://localhost:5173

client/.env:
- VITE_SERVER_URL=http://localhost:5001
```

### Render Production

```
- MONGO_URI=mongodb+srv://...@cluster0.xxxxx.mongodb.net/mathtug
- CLIENT_URL=https://mathtug.vercel.app
- NODE_ENV=production
- PORT=5001
```

### Vercel Production

```
- VITE_SERVER_URL=https://mathtug-server.onrender.com
```

---

## ✅ Deployment Checklist

- [ ] GitHub repository created
- [ ] Code pushed to GitHub
- [ ] MongoDB Atlas cluster created
- [ ] Render backend deployed
- [ ] Vercel frontend deployed
- [ ] Environment variables configured on both platforms
- [ ] Socket.io connection verified
- [ ] Game playable on live URLs
- [ ] Leaderboard saves to MongoDB

---

## 🎉 Done!

Your MathTug game is now live! Share these URLs:

- **Play**: `https://mathtug.vercel.app` 🎮
- **Repository**: `https://github.com/Hassanahmed786/MathTug---MERN-Game-with-MongoDB-Atlas` 📚

---

## 📚 Additional Resources

- [Vercel Docs](https://vercel.com/docs)
- [Render Docs](https://render.com/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [Socket.io Production](https://socket.io/docs/v4/socket-io-protocol/)
