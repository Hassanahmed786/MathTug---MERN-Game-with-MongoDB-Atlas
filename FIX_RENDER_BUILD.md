# 🔧 URGENT: Fix Render Build Command Manually

Render is not using the updated build command from GitHub. You need to manually update it in the Render dashboard.

---

## ✅ How to Fix (Takes 2 minutes)

### Step 1: Go to Render Dashboard
Open: https://render.com/dashboard

### Step 2: Select Your Service
Click on: `mathtug-server`

### Step 3: Go to Settings
Click: **Settings** tab (top right)

### Step 4: Update Build Command
Find: **Build Command** field

**Replace the current command** with:
```bash
cd client && npm ci --include=dev && npm run build && cd ../server && npm ci
```

**Current (Wrong)**:
```
cd client && npm install && npm run build && cd ../server && npm install
```

**New (Correct)**:
```
cd client && npm ci --include=dev && npm run build && cd ../server && npm ci
```

### Step 5: Save & Redeploy
- Click **Save** button
- Then click **Redeploy latest commit**
- Wait 5-10 minutes

---

## ✨ What This Fixes

- ✅ `npm ci --include=dev` - Installs devDependencies (includes vite!)
- ✅ Vite will now be found
- ✅ Build will complete successfully
- ✅ Backend will deploy ✓

---

## 🎯 After Redeploy Succeeds

Then proceed to Vercel deployment (same steps as before)

**Total time left**: ~20 minutes (mostly waiting)

---

**Do this now and Render should deploy successfully!** 🚀
