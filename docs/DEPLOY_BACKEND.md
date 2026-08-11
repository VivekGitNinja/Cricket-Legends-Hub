# Deploy the backend + database (so the GitHub Pages site is fully live)

GitHub Pages can only serve static files, so the deployed site currently runs
**without a server or database**: every API call falls back to the local data
baked into the frontend bundle (the 22 legends, matches list, records, quiz)
plus `localStorage` for favorites / dream team / photo cache. That is why
live scorecards say "Match not found" on the hosted URL.

To give the hosted site the full experience (real live scores, the 340-player
archive, news, quiz leaderboard, dream-team sync, accounts) you need two free
cloud pieces — a MongoDB database and a host for the Express API. This is a
~15-minute one-time setup, then everything is automatic.

---

## 1. MongoDB Atlas — free M0 cluster (the database)

1. Sign up at https://www.mongodb.com/cloud/atlas/register (Google/GitHub login).
2. **Create a deployment** → choose **M0 (FREE)** → pick any cloud/region → create.
3. **Database Access** → *Add New Database User*:
   - Username + password (write these down — you'll paste the password).
4. **Network Access** → *Add IP Address* → **Allow access from anywhere** (`0.0.0.0/0`).
   Render's servers use changing IPs, so "anywhere" is required for a free tier.
5. **Database Deployments** → *Connect* → *Drivers* → copy the **connection string**,
   which looks like:
   ```
   mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
   Replace `<password>` with your real password.

## 2. Render — free web service (the Express API)

1. Sign up at https://render.com (GitHub login recommended).
2. **New +** → **Blueprint** → pick `VivekGitNinja/Cricket-Legends-Hub`.
   The included `backend/render.yaml` configures the service automatically.
3. When the service is created, open **Environment** and fill:
   - `MONGODB_URI` → the Atlas connection string from step 1
   - `JWT_SECRET` → any long random string (e.g. `openssl rand -hex 32`)
4. Deploy will start automatically. Wait for the green **Live** badge, then visit
   `https://cricket-legends-api.onrender.com/api` — you should see the welcome JSON.

## 3. Point GitHub Pages at the API (one secret)

1. On GitHub → repo → **Settings → Secrets and variables → Actions → New repository secret**.
2. Name: `VITE_API_URL`
3. Value: `https://cricket-legends-api.onrender.com/api`
4. Push any commit (or re-run the "Deploy to GitHub Pages" workflow) — the next
   Pages build bakes the URL in and the hosted site starts using the real API + DB.

## 4. Seed the database

The API connects to an **empty** Atlas cluster. Seed it once from anywhere:

```bash
cd backend
MONGODB_URI="mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority" \
JWT_SECRET="whatever" \
NODE_ENV=production \
npm run seed
```

This loads the 340-player archive, teams, matches, news, quiz, records and
streams (the Wikipedia photo cache makes it fast). Re-run any time after
restarting the local cluster.

---

## What you get after this

| Feature | Static-only (today) | + backend deployed |
|---|---|---|
| Legends / players archive | ✅ baked-in 340 players | ✅ same, via API |
| Live scores & SSE real-time | ❌ | ✅ Cricbuzz → API → Pages |
| Real scorecards | ❌ "Match not found" | ✅ |
| News, quiz leaderboard, records | ❌ local only | ✅ DB-backed |
| Accounts, favorites sync, dream team | ❌ local only | ✅ across devices |

## Free-tier caveats

- **Render free** services sleep after ~15 min without traffic; the first visit
  after idle takes ~30–60s to cold-start. You can upgrade to the $7/mo plan for
  always-on if you want.
- **Atlas M0** gives 512 MB storage and allows one free cluster — plenty here.
- No credit card is required for either.

## Rolling back

Delete the Render service and the `VITE_API_URL` secret (or set it to a bad
value) — the static site falls back to its offline mode automatically.
