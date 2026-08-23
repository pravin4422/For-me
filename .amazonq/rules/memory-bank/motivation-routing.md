# Motivation — Sidebar & Routing

## Sidebar (Sidebar.jsx)
- "Motivation" parent item has `path: '/dashboard/motivation/quotes'`
- Clicking the parent label/icon navigates to `/dashboard/motivation/quotes`
- Children:
  - Quotes       → `/dashboard/motivation/quotes`
  - Images       → `/dashboard/motivation/images`
  - Goals        → `/dashboard/motivation/goals`
  - Vision Board → `/dashboard/motivation/vision-board`

## Routes (App.jsx)
```
<Route path="motivation"              element={<MotivationPage />} />
<Route path="motivation/quotes"       element={<MotivationPage tab="quotes" />} />
<Route path="motivation/images"       element={<MotivationPage tab="images" />} />
<Route path="motivation/goals"        element={<MotivationPage tab="goals" />} />
<Route path="motivation/vision-board" element={<MotivationPage tab="board" />} />
```

## MotivationPage.jsx
- Accepts `tab` prop (default: `'quotes'`)
- `useEffect` syncs tab state when prop changes
- `switchTab(key)` updates state + calls `navigate(TAB_PATHS[key])`
- TAB_PATHS map: quotes / images / goals / board → their respective URLs
