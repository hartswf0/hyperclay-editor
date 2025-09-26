# Blue Foot — Field Reports

Tagline: Blue Foot tracks what others miss.

Blue Foot is a spartan, surgical analysis system for glamping and High Country STR market work. This repository contains single‑file HTML reports and source markdown used to generate briefing‑grade outputs that are mobile‑friendly, print/PDF‑ready, and provenance‑rich.

## Core Brand

- **Identity**
  - Name: Blue Foot
  - Symbol: Orbital blue footprint/track (`#2B4D82`)
  - Voice: Calm authority. Forensic brevity. McKinsey‑style signal density.
- **Palette**
  - Parchment `#F7F3EC` (field report paper)
  - Granite `#5A5A5A` (analytical backbone)
  - Orbital Blue `#2B4D82` (signature)
  - Maple Red `#C32F27` (action flags/risks)
  - Safety Yellow `#FFD447` (warnings/notes)
  - Ink Black `#0E0E10` (baseline text)
- **Typography**
  - System sans for body and headings
  - Monospace for numbers (ratios, ADRs, KPIs)
- **Interaction Grammar**
  - Header strip: Title, timestamp, context line
  - 3‑tile KPI row: instant read of market
  - Deep cards/tables: comps, CAPEX, scenarios
  - Insight panel: verb‑first read‑back
  - Method notes: how to read, caveats
  - Export strip: Print/PDF, download

## Repository Layout

- `index.html` — Consolidated Blue Foot report that merges comps + structure CBA/SWOT into one mobile‑first brief with top quick nav, hamburger menu, natural image zoom, and full provenance.
- `Glamping Comps Analysis — Boone_Watauga_Butler Mar.md` — Source narrative + references for comps.
- `Glamping Structure CBA & SWOT Analysis_ Boone, NC.md` — Source narrative + references for structure recommendations.
- `ai_studio_code - 2025-09-26T094607.661.html` — Interactive comps table with filters/sorts and generated insights (report 661).
- `ai_studio_code - 2025-09-26T094726.487.html` — High Country STR comps scan with advanced controls (report 487).
- `ai_studio_code - 2025-09-26T095445.597.html` — Investment analysis with payoff matrix and CAPEX breakdowns (report 597).
- `brand-command.md` — Brand rules, heuristics, phrasing.

## Quick Start

1. Open `index.html` in a browser.
2. Use the top quick nav for sections. Tap the hamburger to see other reports with loglines.
3. Tap any figure to open the lightbox; pinch‑zoom and pan on mobile.
4. Scroll to “Provenance & Citations” to verify every source link.
5. Export at the bottom: Print/PDF or Download HTML for offline sharing.

## Authoring New Analyses

- Duplicate one of the HTML reports as a starting point or request a fresh “Blue Foot Analysis Template”.
- Keep the Blue Foot grammar:
  - **Compress** into KPIs, tiles, and bullets; avoid dense paragraphs.
  - **Show ratios**: ADR ranges, BFB, review volume distribution.
  - **Compare**: cost/quality deltas across structure types.
  - **Flag thresholds**: minimum viable glamping, premium tier cutoffs.
- Provenance: include a references block or provide inline links. `index.html` consolidates and exposes all URLs for auditability.

## Mobile & Print

- Mobile: responsive cards, sticky header, hamburger quick nav, lightbox with natural zoom for images.
- Print/PDF: simplified palette, hidden navigation and controls, avoid page breaks inside KPIs/charts/tables, underlined links for legibility.

## Reusing the Skeleton

Blueprint sections you can copy into new reports:
- Header strip with timestamp and subtitle (“Public scan / indicative only / timestamped for field use”).
- KPI tiles (monospace numerics).
- Deep cards: Market Overview, Structure Performance, Payoff Matrix, Distance & Amenities, Recommendations, CBA & SWOT, Insights.
- Method Note and Provenance & Citations.
- Footer export strip.

## Conventions

- File names: include date/time granularity if the report is time‑sensitive.
- Cross‑links: at the top menu, label sibling reports with a short logline, not just an ID.
- Microcopy: verb‑first insights (e.g., “Premium domes cluster at $185–$259 ADR.”)

## Roadmap

- Auto‑index `*.html` in this folder and generate titles + loglines automatically.
- Filters/sorts on card mode within `index.html`.
- One‑click PNG export of the current view.
- Parameterized “Blue Foot Analysis Template” (JSON/CSV drop‑in).

## License & Use

Internal analysis materials; not for public redistribution without permission. Check third‑party terms before embedding vendor data or screenshots.

— Blue Foot
