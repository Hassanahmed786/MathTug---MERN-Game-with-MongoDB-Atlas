# 🔧 UPDATE RENDER BUILD COMMAND (2 minutes)

The issue: Render was created with `npm ci --include=dev` which doesn't work.

Solution: Update the build command in Render's dashboard settings.

---

## ✅ Steps to Fix

### 1. Go to Render Dashboard
Open: https://render.com/dashboard

### 2. Select Your Service
Click: `mathtug-server`

### 3. Go to Settings
Click the **Settings** tab (top right)

### 4. Find Build Command
Look for: **Build Command** field

### 5. Update the Command

**Delete the current command** and replace with:

```bash
npm run build-prod
```

Wait, that won't work. Instead, use this approach:

```bash
cd client && NODE_ENV=development npm install && npm run build && cd ../server && npm install
```

**The command should look exactly like above** - this will:
- ✅ Set `NODE_ENV=development` for client install (ensures vite is installed)
- ✅ `npm install` in client (installs vite and all devDependencies)
- ✅ `npm run build` builds the client
- ✅ `npm install` in server (installs server dependencies)

### 6. Save & Redeploy

1. Click **Save** button (bottom right)
2. Click **Redeploy latest commit** button
3. **Wait 5-10 minutes** for the build
4. **Check logs** for success ✓

---

## 🎯 Expected Output

After redeploy starts, in the logs you should see:

```
==> Running build command 'cd client && npm install && npm run build && cd ../server && npm install'...
added 123 packages...
> client@0.0.0 build
> vite build
✓ 1088 modules transformed.
✓ built in 725ms
```

Then at the bottom:
```
✓ Your service is live
```

---

## ⏱️ Timeline

```
Update Render (2 min)
  ↓
Redeploy (5-10 min waiting)
  ↓
Backend deployed ✓
  ↓
Verify it's live ✓
```

---

**Do this now and your backend will deploy successfully!** 🚀

After that, deploy to Vercel with same steps as before.
