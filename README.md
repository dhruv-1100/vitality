# Vitality

A lean-bulk transformation tracker — workouts, meals, supplements, and Apple Watch
biometrics for a 21-week training block (August–December 2026).

Vitality is a single-page React app with **no backend**. Everything you log lives in
your browser's `localStorage`, and the app ships as static files.

---

## Quick start

```bash
npm install
npm run dev        # http://127.0.0.1:3000
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Vite dev server on port 3000 |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the built `dist/` locally |

Requires Node 20 (the version CI builds with).

---

## What's in it

Seven tabs, all client-side:

| Tab | Purpose |
| --- | --- |
| **Dashboard** | Today at a glance — calorie/protein rings, per-slot meal logging with swaps, supplements, water, Apple Watch strip, Sunday weigh-in |
| **Next Steps** | A date-driven action plan: what to train, eat, and log today |
| **Workout** | Set-by-set logging for the six PPL routines, with a rest timer |
| **Schedule** | The August training calendar; tick sessions off as you complete them |
| **Nutrition** | Weekly meal timetable, grocery checklist, batch-prep recipes, protein rotation, emergency meals |
| **Analytics** | Weight and waist curves, gain velocity, adherence, Apple Watch burn, macro split |
| **Roadmap** | The four-phase periodization plan through December |

### The six routines

`Push A` · `Pull A` · `Legs A` · `Push B` · `Pull B` · `Legs B`

Each carries its own exercises, set/rep targets, rest intervals, RPE targets, and
coaching notes — see `src/utils/transformationData.js`.

---

## How it works

```
index.html  →  src/main.jsx  →  src/App.jsx
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
              src/components/                  src/utils/
              (one file per tab,          storage.js  — localStorage layer
               plus modals)               transformationData.js — the plan
                                          foodDatabase.js — searchable foods
                                          theme.js — colours for canvas/SVG
```

`App.jsx` holds two pieces of state — the active tab and the selected routine — and
swaps components in. There is no router; navigation is state, so the URL never changes.
Analytics is lazy-loaded, because Chart.js is most of the bundle and is only needed on
that one tab.

Every component reads and writes through `src/utils/storage.js`. Nothing else touches
`localStorage` directly.

### The program engine

The 21-week block is **generated**, not hand-written. `transformationData.js` derives
`TRAINING_CALENDAR` from a weekly template — Push A / Pull A / Legs A midweek, two
B-block sessions at the end of the week, Thursday and Sunday off — with the Friday and
Saturday pair alternating on week parity. Week 1 is a bespoke Wednesday-to-Sunday
lead-in, since the block starts mid-week.

Two helpers turn a date into a position in the block, and the whole UI reads from them:

| Helper | Returns |
| --- | --- |
| `getProgramWeek(date)` | Week 1–21. Weeks are Monday-anchored from 2026-08-03. |
| `getPhaseForWeek(week)` | The phase whose `startWeek`/`endWeek` span that week |

Nothing stores "which week is it" or "which phase is active" — both are computed from
today's date, so the app cannot drift out of date. To change the split, edit
`weeklyTemplate`; to change intensity, edit `rpeForWeek`.

The August sessions were written by hand, and that copy is preserved verbatim in
`CURATED_SESSIONS`, keyed by date. Those entries override the generated session, RPE,
and notes — but the week number always comes from `getProgramWeek`, so the sequence
stays internally consistent.

### Data model

Eleven keys, all prefixed `transformation_`:

| Key | Holds |
| --- | --- |
| `..._weekly_weight_logs_v2` | Sunday weigh-ins (weight, waist, note) |
| `..._workout_logs_v1` | Per-date set logs, including in-progress drafts |
| `..._completed_calendar_v1` | Dates ticked off on the schedule |
| `..._meal_checks_v1` | Which meal slots were eaten, per date |
| `..._slot_swaps_v1` | Per-date meal substitutions |
| `..._daily_checklist_v1` | Supplements and water, per date |
| `..._apple_watch_v1` | Per-date biometrics |
| `..._grocery_checks_v1` | Ticked grocery items |
| `..._grocery_custom_items_v1` | User-added grocery items |
| `..._protein_rotation_v1` | Active protein rotation week |
| `..._meal_scenario_v1` | Active meal scenario |

Reads go through a guarded JSON parser, so a corrupt entry falls back to a default
rather than throwing during render.

**Workout sets autosave as you type.** Leaving the tab mid-session does not lose
anything; "Finish Workout" only marks the session complete and ticks the calendar.

### Backup and restore

`localStorage` is per-browser and per-device. Nothing syncs. The database icon in the
top-right of the header exports everything as JSON and restores from a pasted backup —
that file is the only way to move data between browsers, and worth taking before
clearing site data. `vitality_backup_2026-07-31.json` in the repo root is an example
export; imports stay backward-compatible with older backups that predate newer keys.

---

## Design system

The UI follows **Claude's design language**: a warm paper canvas, a clay accent, an
editorial serif for display type, and flat surfaces separated by hairline warm borders.
Tokens live in `src/index.css`.

### Two things that will surprise you

**1. The Tailwind palette is remapped.** The app addresses colour through utilities like
`text-emerald-600` in over 500 places. Rather than rewrite every class, the palette
*scales* are redefined in `@theme` to warm equivalents. So a class named `emerald`
renders clay, not green:

| Class name | Actually renders | Role |
| --- | --- | --- |
| `emerald` / `green` | clay `#d97757` | primary brand |
| `orange` / `amber` | ochre | training, warnings |
| `sky` / `blue` | dusk | hydration, info |
| `purple` | plum | secondary data |
| `rose` / `pink` / `red` | brick | alerts, heart rate |
| `slate` / `gray` | warm stone | neutrals |

Treat the names as stable *roles*, not colour descriptions. Changing a swatch means
editing the ramp in `src/index.css`, not the JSX.

**2. Component classes must stay in `@layer components`.** `.card`, `.pill`, and the
`.btn-*` classes are wrapped in that layer deliberately. Unlayered CSS outranks *every*
Tailwind utility regardless of specificity — if you move them out, `bg-emerald-500/10`
and `border-l-4` on a `.card` will silently stop working.

Canvas-rendered surfaces (Chart.js) and inline SVG can't read Tailwind utilities, so
they pull from `src/utils/theme.js`. Keep that file in step with the CSS ramps.

### Accessibility

Foreground/background pairs are checked against WCAG AA at body size. Two consequences
worth knowing before you retune anything: the muted stone tones are darker than a
literal brand transcription would be, and solid fills that carry white text use a deeper
clay (`--clay-solid`) than the `#d97757` accent, which only clears AA at large sizes.

The app also ships visible keyboard focus rings and honours `prefers-reduced-motion`.

---

## Project layout

```
index.html                  entry, font links, theme-color
src/
  main.jsx                  React root
  App.jsx                   tab state + layout shell
  index.css                 design tokens, palette remap, component layer
  components/
    Navbar.jsx              header, tabs, backup/restore modal
    Dashboard.jsx           today's rings, meals, supplements, water
    NextStepsView.jsx       date-driven action plan
    WorkoutTracker.jsx      set logging + autosave
    RestTimerModal.jsx      rest timer (also exports parseRestToSeconds)
    WorkoutCalendar.jsx     training schedule
    DietHub.jsx             nutrition sections
    MealSlotEditor.jsx      per-slot swap / search / custom food
    GroceryList.jsx         checklist + custom items
    Analytics.jsx           charts and derived stats
    RoadmapView.jsx         phase timeline
    AppleWatchModal.jsx     biometrics entry
  utils/
    storage.js              localStorage layer, date helpers, export/import
    transformationData.js   program engine, routines, meal plans, groceries
    foodDatabase.js         searchable food macros
    theme.js                colours for Chart.js and SVG
```

The three PDFs in the repo root are the source plan documents the app was built from.

---

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds and publishes
`dist/` to GitHub Pages. Vite is configured with `base: './'` so the bundle works from a
project subpath.

---

## Notes

- **The plan is personal.** Targets (59 → 66 kg, 2,800 kcal, 150 g protein,
  lacto-vegetarian, 5×/week PPL) and the schedule are hardcoded in
  `transformationData.js`. Adapting the app for someone else means editing that file.
- **The block runs 2026-07-29 → 2026-12-20** (21 weeks). The calendar is generated, not
  hand-written: see the program engine below.
- **Fonts load from Google Fonts.** Offline or on a restricted network, the app falls
  back to system serif/sans and stays fully usable.
- **Apple Watch data is entered by hand.** There is no HealthKit integration; days with
  no entry show a prompt rather than placeholder numbers.
