# Let's Build VALO Community

**Let's Build VALO Community** is a VALORANT-focused community platform for discovering live streamers, following people, subscribing to streamers for live alerts, and participating in community posts.

The platform currently supports **YouTube and Kick** live-stream discovery and uses **React + Vite** on the frontend with **Supabase** for authentication, data, realtime features, and supporting backend workflows.

**Production:** https://letsbuildvalocommunity.vercel.app/

---

## ✨ Current Features

### 🔴 Live Stream Discovery

- Live-first homepage focused on currently active streamers.
- YouTube and Kick support.
- Live/offline state tracking.
- Stream title, thumbnail, platform and viewer information where available.
- Search streamers by name/title.
- Platform filtering.
- Automatic live-data refresh.
- Streamer profile pages with live status and stream information.
- Direct **Watch Stream** / platform links.
- Stream history and streaming statistics on supported profiles.
- Live-stream history and analytics data stored in Supabase.

### 🔔 Streamer Subscriptions

Streamer subscriptions are specifically for **live-stream notifications**.

- Subscribe to individual streamers.
- Unsubscribe at any time.
- Dedicated **Streamer Subscriptions** page.
- See subscribed streamers and which subscribed streamers are currently live.
- Live notification workflow.
- Email notifications for supported live events.
- Push-notification infrastructure for supported devices.

> **Important:** Streamer Subscriptions are different from Following. Subscriptions are for streamers/live alerts; Following is the social relationship between users.

### 👥 Following

Following is the platform's **social graph**.

- Follow other community users/creators.
- View people you follow.
- Dedicated Following page.
- Following data is stored separately from streamer subscriptions.

Database relationship:

`user_follows` → people/users you follow  
`stream_subscriptions` → streamers you subscribe to

### 💬 Community

- Community posts.
- Create posts.
- View post details.
- Likes and comments.
- User profiles.
- Public user profile pages.
- Reporting tools.
- Community moderation workflows.

### 🔖 Personal Features

Authenticated users can access:

- Saved/bookmarked content.
- Notifications.
- Following.
- Streamer subscriptions.
- Profile and account settings.
- Account deletion request/workflow.
- Forecast/prediction features where enabled.

### 📊 Rankings & Streamer Insights

- Streamer rankings.
- Viewer-based discovery.
- Streamer profiles.
- Historical streaming information.
- Stream-duration/statistics support.
- Historical stream insights and prediction data where available.

### 📣 Platform Communication

The platform supports:

- Announcements.
- Promotional/platform banners.
- In-app notifications.
- Email notifications.
- Live-stream notification processing.
- Admin-controlled platform settings.

### 🛡️ Safety, Legal & Privacy

Dedicated pages and workflows for:

- Privacy Policy.
- Terms & Conditions.
- Cookie Policy.
- Community Guidelines.
- Content Policy.
- Contact / grievance support.
- Content reporting.
- Account deletion.
- Moderation and report handling.

---

## 🧑‍💻 Admin Console

The admin system is separated from the public application under `src/admin/`.

Available administration areas include:

- **Streamers** — manage registered streamers.
- **Submissions** — review submitted streamer links.
- **Announcements** — manage announcements.
- **Banners** — manage platform banners.
- **Users** — user administration and user creation.
- **Reports** — review and manage community reports.
- **Posts** — community-post moderation.
- **Analytics** — platform statistics and operational metrics.
- **Settings** — platform configuration and feature/page gates.
- **API Status** — service/API monitoring.
- **Audit logging** for important administrative actions.
- Role-protected admin access through Supabase authentication.

Admin routes are protected by both authentication and the user's admin role.

---

## 🏗️ Architecture

```
                           ┌──────────────────────┐
                           │       Vercel         │
                           │   React + Vite App   │
                           └──────────┬───────────┘
                                      │
                       ┌──────────────┼──────────────┐
                       │              │              │
                       ▼              ▼              ▼
                 ┌──────────┐   ┌──────────┐   ┌──────────┐
                 │ YouTube  │   │   Kick   │   │ Supabase │
                 │  Data    │   │  Proxy   │   │ Auth/DB  │
                 └──────────┘   └──────────┘   └────┬─────┘
                                                    │
                                                    ▼
                                             ┌─────────────┐
                                             │ Realtime /  │
                                             │ DB Triggers │
                                             └──────┬──────┘
                                                    │
                           ┌────────────────────────┼────────────────────┐
                           ▼                        ▼                    ▼
                     Notifications             History              Analytics
                           │
                           ▼
                    Email / Push flows
```

### Backend / Worker Flow

Live-stream data is processed through the backend/worker infrastructure where required. Kick requests use the configured proxy, while YouTube live verification is handled through the application's backend integration.

The backend also handles:

- Streamer live-state updates.
- Stream history processing.
- Notification queue processing.
- Worker-authenticated Supabase writes.
- Email notification orchestration.
- Supporting API endpoints.

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 |
| Build | Vite |
| Routing | React Router |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| Database | Supabase PostgreSQL |
| Authentication | Supabase Auth |
| Realtime | Supabase Realtime |
| Live Platform | YouTube + Kick |
| Backend | FastAPI / Python |
| Backend Hosting | Render |
| Frontend Hosting | Vercel |
| Email | Gmail + Supabase Edge Functions |
| Database Automation | PostgreSQL functions/triggers |
| Source Control | GitHub |

---

## 📁 Project Structure

```
src/
├── admin/
│   ├── layouts/
│   │   └── AdminLayout.jsx
│   └── pages/
│       ├── AdminAnalyticsPage.jsx
│       ├── AdminAnnouncements.jsx
│       ├── AdminApiStatusPage.jsx
│       ├── AdminBannersPage.jsx
│       ├── AdminLoginPage.jsx
│       ├── AdminPostsPage.jsx
│       ├── AdminReportsPage.jsx
│       ├── AdminSettingsPage.jsx
│       ├── AdminStreamersPage.jsx
│       ├── AdminSubmissionsPage.jsx
│       └── AdminUsersPage.jsx
│
├── components/
│   ├── auth/
│   ├── common/
│   ├── layout/
│   ├── posts/
│   ├── stream/
│   └── ui/
│
├── context/
│   └── AuthContext.jsx
│
├── hooks/
│   ├── useAllStreamers.js
│   ├── useAuth.js
│   ├── useStreamHistory.js
│   ├── useStreamerInsights.js
│   └── useStreamerStats.js
│
├── layouts/
│   └── MainLayout.jsx
│
├── lib/
│   ├── api.js
│   └── supabase.js
│
├── pages/
│   ├── AllStreamersPage.jsx
│   ├── FollowingPage.jsx
│   ├── MySubscriptionsPage.jsx
│   ├── NotificationsPage.jsx
│   ├── PostsPage.jsx
│   ├── PostDetailPage.jsx
│   ├── StreamerProfilePage.jsx
│   ├── SubmitPage.jsx
│   ├── SettingsPage.jsx
│   ├── ProfilePage.jsx
│   ├── UserProfilePage.jsx
│   └── legal/support pages
│
├── services/
│   ├── kickService.js
│   ├── youtubeService.js
│   ├── streamerService.js
│   ├── languageService.js
│   └── authService.js
│
└── utils/
    ├── format.js
    ├── profile.js
    └── timezone.js
```

The `trash/` directory is used for intentionally removed legacy files that may be useful for reference during cleanup.

---

## 🔄 Live Stream Flow

### YouTube

```
Streamer registered
       ↓
YouTube channel information
       ↓
Backend live verification
       ↓
Current live video detected?
       ↓
   ┌───┴────┐
  YES      NO
   ↓        ↓
Live data  Offline
   ↓
Supabase streamer_data
   ↓
React live discovery
```

### Kick

```
Streamer registered
       ↓
Kick username
       ↓
Kick proxy/backend request
       ↓
Current livestream detected?
       ↓
   ┌───┴────┐
  YES      NO
   ↓        ↓
Live data  Offline
   ↓
Supabase streamer_data
   ↓
React live discovery
```

Only verified current live streams should appear in the live discovery experience; scheduled/future streams are not treated as currently live.

---

## 🔔 Notification Flow

```
Streamer becomes LIVE
        ↓
Live-state / database processing
        ↓
Notification queue
        ↓
 ┌──────┴────────┐
 ▼               ▼
Email           Push
 ▼               ▼
Gmail /        Device
Edge Function  notification
```

The email workflow uses a branded VALO COMMUNITY live notification template containing the streamer, stream information, viewer information where available, thumbnail where available, and a direct watch link.

---

## 🗄️ Core Data Model

The application uses Supabase PostgreSQL. Major areas include:

```
streamers
streamer_data
stream_subscriptions
user_follows
user_profiles

posts
comments
post_likes
bookmarks

notifications
user_devices
push_notification_queue
email_queue

stream_history_logs
platform_banners
app_settings

submissions
reports
admin_audit_logs
```

Exact schema can evolve with migrations.

### Relationship distinction

```
USER
 ├── follows ───────────────► USER
 │       user_follows
 │
 └── subscribes ────────────► STREAMER
         stream_subscriptions
```

These relationships must remain separate throughout the application.

---

## 🔐 Security

- Supabase authentication for authenticated users/admins.
- Admin routes protected by role checks.
- Database Row Level Security where configured.
- Worker-authenticated backend writes.
- Sensitive service credentials remain server-side.
- Public frontend uses the Supabase client with its public configuration only.
- Administrative actions are audit logged.
- User-generated content is subject to reporting/moderation workflows.

**Never commit service-role keys, API secrets, worker keys, Gmail app passwords, or other private credentials to Git.**

---

## ⚙️ Local Development

### Requirements

- Node.js 20+
- npm
- Supabase project
- Required public frontend environment variables.
- Backend environment variables when running the backend locally.

### Install

```bash
npm install
```

### Environment

Create a local `.env` file using the project's current environment-variable requirements.

Do not copy production secrets into source control.

### Start frontend

```bash
npm run dev
```

### Production build

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

---

## 🚀 Deployment

### Frontend

The frontend is deployed through **Vercel** from the GitHub repository.

Production domain:

`https://letsbuildvalocommunity.vercel.app/`

Production deployments are generated from the repository's `main` branch.

### Backend

The FastAPI backend is deployed through **Render**.

The frontend and backend communicate through configured environment variables/API endpoints. Backend-only secrets must never be exposed to the frontend.

---

## 🧪 Build Validation

GitHub Actions runs a production frontend build on pushes and pull requests targeting `main`.

The build pipeline:

```
Checkout
   ↓
Node.js 20
   ↓
npm ci
   ↓
npm run build
```

---

## 🛠️ Development Guidelines

When modifying the application:

1. Keep **Following** and **Streamer Subscriptions** separate.
2. Prefer existing hooks/services over duplicating API logic.
3. Keep platform-specific logic inside the appropriate service.
4. Keep secrets out of frontend code.
5. Verify route imports before removing or moving files.
6. Remove unused legacy code only after checking references.
7. Run `npm run build` after significant frontend changes.
8. Keep admin functionality inside `src/admin/` where practical.
9. Use database migrations for schema changes.
10. Do not overwrite valid live-stream data when an upstream platform request fails.

---

## 📄 Legal & Support

The application includes dedicated pages for privacy, terms, cookies, community guidelines, content policy, reporting, account deletion, and contact/grievance support.

For platform support, use the in-app contact/reporting workflows.

---

## 📌 Project Status

VALO Community is an actively developed project focused on:

- Live VALORANT streamer discovery.
- YouTube + Kick integration.
- Streamer subscriptions and live notifications.
- User following and community profiles.
- Community posts and moderation.
- Stream history and analytics.
- Administrative management tools.

