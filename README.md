# Let's Build VALO Community

A VALORANT live streamer community platform that tracks YouTube and Kick live streams in real-time.

![Tech Stack](https://img.shields.io/badge/React-18-blue) ![Vite](https://img.shields.io/badge/Vite-5-purple) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-teal) ![Supabase](https://img.shields.io/badge/Supabase-backend-green)

---

## Features

- **Live stream grid** — only shows currently-live streamers, auto-refreshes every 60s
- **YouTube + Kick integration** — real-time API calls, no cached data
- **Search & filter** — by streamer name, title, or platform
- **Submit streamer** — public form with pending/approved/rejected workflow
- **Admin panel** — add/edit/delete/enable streamers, manage submissions
- **No login for public users** — only admin requires authentication (Supabase Auth)

---

## Tech Stack

| Layer       | Tech                        |
|-------------|-----------------------------|
| Frontend    | React 18 + Vite             |
| Styling     | TailwindCSS 3               |
| Backend/DB  | Supabase (Postgres + Auth)  |
| YouTube API | YouTube Data API v3         |
| Kick API    | kick.com/api/v2/channels    |

---

## Quick Start

### 1. Clone and install

```bash
git clone <your-repo>
cd lets-build-valo-community
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_YOUTUBE_API_KEY=your-youtube-api-key
```

### 3. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Open the **SQL Editor** and run the full contents of `supabase-schema.sql`
3. In **Authentication → Users**, create your admin user
4. Copy the **Project URL** and **anon key** into `.env`

### 4. Get a YouTube API key

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a project → Enable **YouTube Data API v3**
3. Create an API key (restrict to YouTube Data API)
4. Paste into `VITE_YOUTUBE_API_KEY`

### 5. Run locally

```bash
npm run dev
```

Visit `http://localhost:5173`

---

## Project Structure

```
src/
├── components/
│   ├── common/          # ProtectedRoute, Toast, LoadingScreen
│   ├── layout/          # Navbar, Sidebar
│   └── stream/          # StreamCard, StreamGrid, FilterBar, Skeleton
├── hooks/
│   ├── useAuth.js       # Supabase auth state
│   ├── useLiveStreams.js # Aggregates YouTube + Kick live data
│   └── useStreamers.js  # Admin CRUD operations
├── layouts/
│   ├── MainLayout.jsx   # Public layout (navbar + sidebar)
│   └── AdminLayout.jsx  # Admin layout
├── lib/
│   └── supabase.js      # Supabase client
├── pages/
│   ├── HomePage.jsx
│   ├── SubmitPage.jsx
│   ├── AdminLoginPage.jsx
│   ├── AdminStreamersPage.jsx
│   └── AdminSubmissionsPage.jsx
├── services/
│   ├── youtubeService.js   # YouTube Data API v3
│   ├── kickService.js      # Kick API
│   ├── streamerService.js  # Supabase queries
│   └── authService.js      # Supabase auth
└── utils/
    └── format.js           # Formatters (viewer count, truncate, etc.)
```

---

## How Live Fetching Works

### YouTube

```
Admin adds Channel ID → Stored in Supabase
↓
useLiveStreams hook loads Channel IDs from Supabase
↓
youtubeService.getYouTubeLiveStream(channelId) called
↓
GET https://www.googleapis.com/youtube/v3/search
  ?part=snippet
  &channelId=CHANNEL_ID
  &eventType=live
  &type=video
  &key=API_KEY
↓
data.items.length > 0 → LIVE → render StreamCard
data.items.length === 0 → OFFLINE → hidden from grid
```

### Kick

```
Admin adds username → Stored in Supabase
↓
useLiveStreams hook loads usernames from Supabase
↓
kickService.getKickLiveStream(username) called
↓
GET https://kick.com/api/v2/channels/USERNAME
↓
data.livestream !== null → LIVE → render StreamCard
data.livestream === null → OFFLINE → hidden from grid
```

### Auto-refresh

The `useLiveStreams` hook sets a `setInterval` for 60 seconds. No websockets, no cron jobs — pure `fetch` calls from the browser.

---

## Database Schema

Only static identifiers are stored — **no thumbnails, titles, or viewer counts**.

```sql
-- streamers: YouTube channel IDs and Kick usernames
streamers (id, platform, youtube_channel_id, kick_username, enabled, created_at)

-- submissions: public user link submissions
submissions (id, platform, url, status, created_at)
```

---

## Admin Panel

Access at `/admin/login`. Requires Supabase Auth credentials.

- **Streamers tab** — Add, edit, delete, enable/disable streamers
- **Submissions tab** — Review pending links, approve or reject

---

## Kick API Note

Kick does not have an official public API. The `kick.com/api/v2/channels` endpoint works client-side but may require a CORS proxy in production. In development, configure Vite's proxy in `vite.config.js`. For production, set up a lightweight serverless function or proxy.

---

## Deploy

```bash
npm run build
# Upload dist/ to any static host: Vercel, Netlify, Cloudflare Pages, etc.
```

Set environment variables in your hosting platform's dashboard.
