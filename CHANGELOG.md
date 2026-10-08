# Changelog

## 2026-10-09 — Added admin 2D gaming-world prototype
- **Type:** Added
- **Area/files:** `src/admin/pages/AdminWorldPreviewPage.jsx`, `src/App.jsx`, `src/admin/layouts/AdminLayout.jsx`
- **What:** Added an admin-only 2D top-down gaming-world prototype with original vector mini characters, gaming desks, live/offline states, clickable creator previews, and a community hub.
- **Why:** Provide a visual prototype for a future VALO Community game-like creator experience without changing the public homepage.
- **Technical details:** Added a lazy-loaded protected `/admin/world-preview` route and an Admin Console navigation item. The artwork is self-contained SVG/CSS with no new external dependency.
- **User impact:** Admins can open **Admin → 2D World** to preview the concept. Public routes remain unchanged.
- **Validation:** Source files and protected route/navigation were committed to the `main` branch. Production deployment still depends on the Vercel project being correctly connected to this repository.
- **Deployment status:** Committed to `Parthiv-Binish/valo-community` main; production deployment not independently verified.
- **Rollback:** Remove the 2D World navigation item, route/import, and `AdminWorldPreviewPage.jsx`.
