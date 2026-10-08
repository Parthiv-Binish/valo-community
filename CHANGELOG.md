# Changelog

## 2026-10-09 — Rebuilt admin 2D world as a COC-style creator village
- **Type:** Changed
- **Area/files:** `src/admin/pages/AdminWorldPreviewPage.jsx`
- **What:** Replaced the previous dashboard-like room prototype with a complete top-down/isometric-style village world: terrain texture, roads, water landmark, trees, rocks, creator houses, town hall, characters, live beacons, labels, camera pan/zoom, and interactive creator-house details.
- **Why:** The previous prototype looked like a dated dashboard/90s mockup rather than a game world. The new direction is intentionally closer to a polished mobile strategy-game village while keeping VALO Community branding.
- **Technical details:** Self-contained SVG scene and CSS animation; no new external dependencies. Creator houses are interactive and expose live/offline state. Pointer drag pans the map and wheel/buttons control zoom.
- **User impact:** Admins can explore a real game-like village from **Admin → 2D World** and inspect creator houses without affecting public routes.
- **Validation:** Component rebuilt against the existing React/Vite admin route; no new packages introduced.
- **Deployment status:** Committed to `Parthiv-Binish/valo-community` main. Production deployment still requires the Vercel project to be correctly linked to this repository.
- **Rollback:** Restore the previous `AdminWorldPreviewPage.jsx` revision.

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

