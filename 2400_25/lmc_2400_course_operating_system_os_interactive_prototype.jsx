import React, { useMemo, useState, useEffect } from "react";

/**
 * LMC 2400 • Course Operating System (OS)
 * Single-file React prototype (uses Tailwind for styling)
 *
 * What it includes:
 * - Dashboard with progress + quick actions
 * - Day-by-day Tile Board (glyphs) with Bateson level filters (L1/L2/L3)
 * - Calendar (T/Th) with details panel
 * - Assignments with milestones + local progress
 * - Readings index (quick-copy to Perusall / Canvas placeholders)
 * - Studio (final project) milestones + group tracker
 * - Basic analytics (habit streaks, level mix)
 *
 * Notes:
 * - All data is local to this component; progress persists to localStorage
 * - Feel free to replace placeholder links with Perusall/Canvas/Teams URLs
 */

// ====== Types ======
/** @typedef {"L1" | "L2" | "L3"} Bateson */

// ====== Demo Data (32 meetings; Spring-style T/Th) ======
const SESSIONS = [
  // Week 1
  s(1, "Tue", "2025-01-10", "Course Intro · Frames & Norms", "L1", "𓉗░⿰", {
    readings: ["Shadow Syllabus", "Reading Tips for History Class"],
    activities: ["Intro lightning shares", "OS account setup: Canvas, Teams, Perusall"],
  }),
  s(1, "Thu", "2025-01-12", "Tools & Metacommunication", "L1", "𓉗░❏", {
    readings: ["Syllabus walk-through (policies, rubrics, due dates)"],
    activities: ["Perusall annotation warm-up (claim/evidence/frame)"],
  }),

  // Week 2
  s(2, "Tue", "2025-01-17", "Why Media History? · Ethics of Joy", "L1", "𓃑░⿱", {
    readings: ["Why Study the History of Digital Media and How?", "Braidotti & Hlavajova — Ethics of Joy"],
    activities: ["App timeline sketch: what differences made a difference?"],
  }),
  s(2, "Thu", "2025-01-19", "McLuhan — The Medium is the Message", "L1", "𓃑░⿰", {
    readings: ["McLuhan — The Medium is the Message"],
    activities: ["NYT vs. IG Explore: message-as-medium compare"],
  }),

  // Week 3
  s(3, "Tue", "2025-01-24", "Higgins — Intermedia", "L1", "𓈌░⿴", {
    readings: ["Higgins — Intermedia"],
    activities: ["Intermedia triptych: meme+clip+caption"],
  }),
  s(3, "Thu", "2025-01-26", "Ong — Orality of Language (Ch.1)", "L1", "𓈋░⿷", {
    readings: ["Ong — The Orality of Language (Ch.1)"],
    activities: ["Read aloud vs silent: attention & memory anchors"],
  }),

  // Week 4 (transitional L1→L2)
  s(4, "Tue", "2025-01-31", "Bazin — Ontology of the Photographic Image", "L2", "𓉖▒⿸", {
    readings: ["Bazin — Ontology of the Photographic Image"],
    activities: ["Staged vs candid: rate indexicality + defend"],
    tags: ["transition"],
  }),
  s(4, "Thu", "2025-02-02", "Making the Medieval Book · Forgery 101", "L2", "𓉖▒⿹", {
    readings: ["Getty — Making of the Medieval Book (video)", "Forgery 101 (video)"],
    activities: ["Materiality walk: when constraint becomes meaning"],
    tags: ["field"],
  }),

  // Week 5
  s(5, "Tue", "2025-02-07", "Gitelman — New Media Publics", "L2", "𓃐▒⿺", {
    readings: ["Gitelman — New Media Publics (pp.25–44)", "What is the History of Recorded Sound?"],
    activities: ["YouTube thread graph: publics/counterpublics"],
  }),
  s(5, "Thu", "2025-02-09", "Noise, Health, Culture · Midterm topic due", "L2", "𓃐▒❏", {
    readings: ["Dutchen — Effects of Noise on Health", "Enright — The War Against Noise"],
    activities: ["Design a 20s noise-ecology for a campus space"],
    due: [{ title: "Submit Midterm Topic", when: "2025-02-09T23:59:00" }],
  }),

  // Week 6
  s(6, "Tue", "2025-02-14", "Auslander — Liveness", "L2", "𓆝▒⿻", {
    readings: ["Auslander — Liveness: Performance in a Mediatized Culture"],
    activities: ["Twitch stream vs VOD: co-presence claims"],
  }),
  s(6, "Thu", "2025-02-16", "Bazin — Myth of Total Cinema", "L2", "𓆝▒⿻", {
    readings: ["Bazin — The Myth of Total Cinema"],
    activities: ["Debate: does VR fulfill or reinstall the myth?"],
  }),

  // Week 7
  s(7, "Tue", "2025-02-21", "Turing — Computing Machinery & Intelligence", "L2", "𓅭▒⟤", {
    readings: ["Turing — Computing Machinery and Intelligence (Ch.3)"],
    activities: ["1:1 chatbot interviews: criteria for sufficiency"],
  }),
  s(7, "Thu", "2025-02-23", "Coded Bias, Buolamwini, FRT Politics", "L2", "𓅮▒⟥", {
    readings: ["Coded Bias (interview)", "Buolamwini — AI, Ain't I a Woman?", "What Facial Recognition Steals from Us", "Case studies: China/US FRT"],
    activities: ["Frame audit: where does accuracy mask power?"],
  }),

  // Week 8
  s(8, "Tue", "2025-02-28", "Montfort & Bogost — Stella", "L2", "𓇼▒⟦", {
    readings: ["Racing the Beam — Stella (pp.1–15)", "(Optional) Boellstorff — Second Life"],
    activities: ["Classic Atari clone: affordances → cultural effects"],
  }),
  s(8, "Thu", "2025-03-02", "Virtual Field Trip · Midterm due Fri 3/3", "L2", "𓇼▒❏", {
    readings: ["No added reading (workshop)"],
    activities: ["Peer review: top claims & evidence chains"],
    due: [{ title: "Midterm — Media Analysis", when: "2025-03-03T23:59:00" }],
  }),

  // Week 9
  s(9, "Tue", "2025-03-07", "VR Empathy? · Milk vs Rouse", "L2", "𓊍▒⧮", {
    readings: ["Milk — TED: VR as Empathy Machine", "Rouse — Against the Instrumentalization of Empathy"],
    activities: ["360° short evaluation: empathy as rhetoric vs instrument"],
  }),
  s(9, "Thu", "2025-03-09", "Presence & Reality Media", "L2", "𓊎▒⧯", {
    readings: ["Bolter, Engberg, MacIntyre — Reality Media (Presence)"],
    activities: ["Form final project groups; draft 2 speculative premises"],
  }),

  // Week 10
  s(10, "Tue", "2025-03-14", "Brock — Twitter as Cultural Conversation", "L2", "⌸▒⧰", {
    readings: ["Brock — On the Black Hand Side"],
    activities: ["Reconstruct a hashtag event as ritual (roles, norms, sanctions)"],
    notes: ["Withdrawal deadline Wed 3/15, 4:00 PM"],
  }),
  s(10, "Thu", "2025-03-16", "Maguire · Viral Economies & TikTok Governance", "L2", "⌹▒⧱", {
    readings: ["Maguire — Eyebrows on What? Girls and Viral Economies", "TikTok ban — governance readings"],
    activities: ["FYP traces → labor + platform governance"],
  }),

  // Week 11 — Break
  s(11, "Tue", "2025-03-21", "Spring Break (no class)", "L1", "▜░", { readings: [], activities: [] }),
  s(11, "Thu", "2025-03-23", "Spring Break (no class)", "L1", "▙░", { readings: [], activities: [] }),

  // Week 12 (L2→L3 surface premises)
  s(12, "Tue", "2025-03-28", "Lovelock — Queerness as Authenticity (TV)", "L3", "⍁▓⧲", {
    readings: ["Lovelock — Queerness as Authenticity in Reality TV (pp.1–15)"],
    activities: ["45s authenticity-flip cut; name challenged premise"],
    tags: ["transition"],
  }),
  s(12, "Thu", "2025-03-30", "Ruha Benjamin — Race After Technology", "L3", "⍂▓⧳", {
    readings: ["Benjamin — Race After Technology"],
    activities: ["Team ontology statement: 'media is… / audience is…'"],
    due: [{ title: "Submit Final Project Topic", when: "2025-03-30T23:59:00" }],
  }),

  // Week 13 — L3
  s(13, "Tue", "2025-04-04", "Emerging Metaverse · Topic Share", "L3", "⍃▓❏", {
    readings: ["The Emerging Metaverse (packet)"],
    activities: ["Speculative institution: who legitimates what?"],
  }),
  s(13, "Thu", "2025-04-06", "Studio — Milestone A", "L3", "⍄▓⟤", {
    readings: ["Studio: no new reading"],
    activities: ["Interaction sketch + harm model + counter-measure"],
  }),

  // Week 14 — L3
  s(14, "Tue", "2025-04-11", "Studio — Milestone B", "L3", "ᕰ▓⟥", {
    readings: ["Studio: no new reading"],
    activities: ["Prototype + self-eval rubric"],
  }),
  s(14, "Thu", "2025-04-13", "Studio — Milestone C (Failure rehearsal)", "L3", "ᕱ▓⟦", {
    readings: ["Studio: no new reading"],
    activities: ["Design a failure scenario + repair ritual"],
  }),

  // Week 15 — L3
  s(15, "Tue", "2025-04-18", "Studio — Milestone D (Integrate theories)", "L3", "ᕲ▓⧮", {
    readings: ["Studio: no new reading"],
    activities: ["Integrate McLuhan + Benjamin into one guideline"],
  }),
  s(15, "Thu", "2025-04-20", "Dress Rehearsal", "L3", "ᕳ▓⧯", {
    readings: ["Studio: no new reading"],
    activities: ["6-min run-through + 2-min Q&A"],
  }),

  // Week 16 — Presentations
  s(16, "Tue", "2025-04-25", "Final Presentations (Day 1)", "L3", "𓉗▓❏", {
    readings: [],
    activities: ["Presentations + feedback"],
  }),
  s(16, "Thu", "2025-04-27", "Final Presentations (Day 2)", "L3", "𓃑▓❏", {
    readings: [],
    activities: ["Presentations + feedback"],
    due: [{ title: "Alternative Media Assignment", when: "2025-04-30T23:59:00" }],
  }),
];

function s(week, day, dateISO, title, level /** @type {Bateson} */, glyph, extra = {}) {
  return {
    id: `${week}-${day}`,
    week,
    day,
    dateISO,
    title,
    level,
    glyph,
    readings: extra.readings || [],
    activities: extra.activities || [],
    notes: extra.notes || [],
    tags: extra.tags || [],
    due: extra.due || [],
  };
}

// Assignments (mirrors syllabus structure)
const ASSIGNMENTS = [
  {
    key: "participation",
    title: "Participation (in-class)",
    weight: 10,
    type: "ongoing",
    milestones: [
      { key: "speak1", label: "Speak up with evidence (wk1)", done: false },
      { key: "buildOnPeer", label: "Build on a peer's point (wk2)", done: false },
      { key: "diagram", label: "Share 1 analytic diagram (wk4)", done: false },
    ],
  },
  {
    key: "reflections",
    title: "Reading Reflections",
    weight: 20,
    type: "weekly",
    notes: "Due Fridays; skip any 2 weeks",
  },
  {
    key: "discussionLeader",
    title: "Discussion Leader",
    weight: 10,
    type: "single",
    milestones: [
      { key: "postBio", label: "Post author bio + 1 key quote", done: false },
      { key: "frameQs", label: "Post framing question(s)", done: false },
      { key: "facilitate", label: "Facilitate 10–12 min", done: false },
    ],
  },
  {
    key: "midterm",
    title: "Midterm — Media Analysis",
    weight: 25,
    type: "paper",
    due: "2025-03-03T23:59:00",
    rubric: ["Clarity", "Theoretical precision", "Evidence", "Counter-argument", "Mechanics"],
    links: { submit: "#", brief: "#" },
  },
  {
    key: "final",
    title: "Final — Speculative Media Analysis (group)",
    weight: 35,
    type: "project",
    due: "2025-04-27T23:59:00",
    rubric: [
      "Premise clarity (L3)",
      "Integrate ≥2 conflicting theories",
      "Ethical risk model",
      "Feasible social rituals",
      "Communication quality",
    ],
    links: { submit: "#", brief: "#" },
  },
];

// ====== Local Storage helpers ======
const KEY = "lmc2400-os-progress";
function loadProgress() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : { checked: {}, tabs: {}, streak: 0 };
  } catch {
    return { checked: {}, tabs: {}, streak: 0 };
  }
}
function saveProgress(p) {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {}
}

// ====== Utility ======
function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}
function levelTone(level) {
  return level === "L1" ? "bg-gradient-to-br from-stone-100 to-stone-200 text-stone-900" :
         level === "L2" ? "bg-gradient-to-br from-sky-50 to-sky-200 text-sky-950" :
                           "bg-gradient-to-br from-violet-50 to-violet-200 text-violet-950";
}
function levelChip(level) {
  return level === "L1" ? "░" : level === "L2" ? "▒" : "▓";
}

// ====== Small UI Bits ======
const Chip = ({ children, tone = "stone" }) => (
  <span className={`inline-flex items-center px-2 py-0.5 text-xs rounded-full border ${tone === "blue" ? "border-sky-300 text-sky-700 bg-sky-50" : tone === "violet" ? "border-violet-300 text-violet-700 bg-violet-50" : "border-stone-300 text-stone-700 bg-stone-50"}`}>{children}</span>
);

const Tab = ({ id, active, onClick, children }) => (
  <button onClick={() => onClick(id)}
    className={`px-3 py-2 rounded-xl border text-sm transition-all ${active ? "bg-stone-900 text-stone-100 border-stone-900 shadow" : "bg-white text-stone-700 border-stone-300 hover:bg-stone-50"}`}>
    {children}
  </button>
);

const SectionCard = ({ title, children, actions }) => (
  <div className="bg-white/80 backdrop-blur rounded-2xl p-4 border border-stone-200 shadow-sm">
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-sm font-semibold text-stone-800">{title}</h3>
      <div className="flex gap-2">{actions}</div>
    </div>
    {children}
  </div>
);

// ====== Main Component ======
export default function CourseOS() {
  const [tab, setTab] = useState("dashboard");
  const [filterLevel, setFilterLevel] = useState(/** @type {Bateson | "ALL"} */ ("ALL"));
  const [selected, setSelected] = useState(null);
  const [progress, setProgress] = useState(loadProgress());

  useEffect(() => saveProgress(progress), [progress]);

  const sessions = useMemo(() => {
    return filterLevel === "ALL" ? SESSIONS : SESSIONS.filter(s => s.level === filterLevel);
  }, [filterLevel]);

  const levelCounts = useMemo(() => {
    const c = { L1: 0, L2: 0, L3: 0 };
    SESSIONS.forEach(s => (c[s.level]++));
    return c;
  }, []);

  const completeCount = useMemo(() => Object.values(progress.checked).filter(Boolean).length, [progress]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-stone-100 via-stone-50 to-stone-200 text-stone-900">
      <header className="sticky top-0 z-20 border-b border-stone-200 bg-white/70 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-2xl bg-stone-900 text-white grid place-items-center text-lg">OS</div>
            <div>
              <h1 className="text-base font-semibold">LMC 2400 · Course OS</h1>
              <p className="text-xs text-stone-600">Bateson-aware learning environment · L1 habit → L2 reframing → L3 premise</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Tab id="dashboard" active={tab === "dashboard"} onClick={setTab}>Dashboard</Tab>
            <Tab id="tiles" active={tab === "tiles"} onClick={setTab}>Tiles</Tab>
            <Tab id="calendar" active={tab === "calendar"} onClick={setTab}>Calendar</Tab>
            <Tab id="assignments" active={tab === "assignments"} onClick={setTab}>Assignments</Tab>
            <Tab id="readings" active={tab === "readings"} onClick={setTab}>Readings</Tab>
            <Tab id="studio" active={tab === "studio"} onClick={setTab}>Studio</Tab>
            <Tab id="analytics" active={tab === "analytics"} onClick={setTab}>Analytics</Tab>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 gap-6">
        {tab === "dashboard" && (
          <Dashboard levelCounts={levelCounts} completeCount={completeCount} setTab={setTab} />
        )}

        {tab === "tiles" && (
          <SectionCard title="OS Tile Board" actions={
            <div className="flex items-center gap-2">
              <FilterBar filterLevel={filterLevel} setFilterLevel={setFilterLevel} />
            </div>
          }>
            <TileGrid sessions={sessions} onSelect={setSelected} progress={progress} setProgress={setProgress} />
          </SectionCard>
        )}

        {tab === "calendar" && (
          <SectionCard title="Calendar (T/Th)" actions={<FilterBar filterLevel={filterLevel} setFilterLevel={setFilterLevel} />}>
            <CalendarList sessions={sessions} onSelect={setSelected} progress={progress} setProgress={setProgress} />
          </SectionCard>
        )}

        {tab === "assignments" && (
          <Assignments progress={progress} setProgress={setProgress} />
        )}

        {tab === "readings" && (
          <ReadingsIndex sessions={SESSIONS} />
        )}

        {tab === "studio" && (
          <StudioBoard progress={progress} setProgress={setProgress} />
        )}

        {tab === "analytics" && (
          <AnalyticsPanel progress={progress} sessions={SESSIONS} />
        )}
      </main>

      {selected && (
        <DetailDrawer session={selected} onClose={() => setSelected(null)} progress={progress} setProgress={setProgress} />
      )}

      <footer className="max-w-7xl mx-auto px-4 py-6 text-xs text-stone-600">
        <div className="flex flex-wrap items-center gap-2">
          <span>Legend:</span>
          <Chip tone="stone">L1 = Habit ░</Chip>
          <Chip tone="blue">L2 = Reframing ▒</Chip>
          <Chip tone="violet">L3 = Premise ▓</Chip>
          <span className="ml-2">· Glyph sets indicate mode families (reading, framing lab, assignment, studio).</span>
        </div>
      </footer>
    </div>
  );
}

function Dashboard({ levelCounts, completeCount, setTab }) {
  const total = SESSIONS.length;
  return (
    <div className="grid md:grid-cols-3 gap-6">
      <SectionCard title="Progress Overview" actions={
        <button onClick={() => window.print()} className="px-3 py-1.5 text-xs rounded-lg border border-stone-300 hover:bg-stone-50">Print</button>
      }>
        <div className="grid grid-cols-3 gap-3">
          <Metric label="Meetings" value={total} sub="total" />
          <Metric label="Completed checks" value={completeCount} sub="personal" />
          <Metric label="Assignments" value={ASSIGNMENTS.length} sub="this term" />
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3">
          <BarStat label="L1" count={levelCounts.L1} tone="bg-stone-800" />
          <BarStat label="L2" count={levelCounts.L2} tone="bg-sky-700" />
          <BarStat label="L3" count={levelCounts.L3} tone="bg-violet-700" />
        </div>
        <div className="mt-4">
          <button onClick={() => setTab("tiles")} className="mr-2 px-3 py-1.5 text-xs rounded-lg bg-stone-900 text-white">Go to Tiles</button>
          <button onClick={() => setTab("calendar")} className="px-3 py-1.5 text-xs rounded-lg border border-stone-300 hover:bg-stone-50">Open Calendar</button>
        </div>
      </SectionCard>

      <SectionCard title="This Week" actions={<></>}>
        <WeekPeek />
      </SectionCard>

      <SectionCard title="Quick Actions" actions={<></>}>
        <div className="grid grid-cols-2 gap-3">
          <QuickAction label="Mark today done" onClick={() => markToday()} />
          <QuickAction label="Export .ICS (sessions)" onClick={() => exportICS(SESSIONS)} />
          <QuickAction label="Copy reading list" onClick={() => copyReadings()} />
          <QuickAction label="Reset progress" onClick={() => { localStorage.removeItem(KEY); location.reload(); }} />
        </div>
      </SectionCard>
    </div>
  );
}

function Metric({ label, value, sub }) {
  return (
    <div className="p-4 bg-white border border-stone-200 rounded-xl">
      <div className="text-xs text-stone-500">{label}</div>
      <div className="text-2xl font-semibold">{value}</div>
      <div className="text-[11px] text-stone-500">{sub}</div>
    </div>
  );
}

function BarStat({ label, count, tone }) {
  const pct = Math.round((count / SESSIONS.length) * 100);
  return (
    <div>
      <div className="flex items-center justify-between text-xs text-stone-600"><span>{label}</span><span>{pct}%</span></div>
      <div className="h-2 bg-stone-200 rounded-full mt-1">
        <div className={`h-full ${tone} rounded-full`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function WeekPeek() {
  // Show the next two upcoming sessions
  const now = new Date();
  const upcoming = SESSIONS.filter(s => new Date(s.dateISO) >= now).slice(0, 2);
  if (!upcoming.length) return <div className="text-sm text-stone-600">No upcoming sessions (demo dates have likely passed).
  </div>;
  return (
    <div className="flex flex-col gap-3">
      {upcoming.map((s) => (
        <div key={s.id} className={`p-3 rounded-xl border ${s.level === "L3" ? "border-violet-300 bg-violet-50" : s.level === "L2" ? "border-sky-300 bg-sky-50" : "border-stone-300 bg-stone-50"}`}>
          <div className="text-xs text-stone-500">{formatDate(s.dateISO)} · {s.day} · Week {s.week} · <span className="font-mono">{s.glyph}</span></div>
          <div className="font-medium">{s.title}</div>
          <div className="text-xs text-stone-600 line-clamp-2">{s.readings.join(" · ")}</div>
        </div>
      ))}
    </div>
  );
}

function FilterBar({ filterLevel, setFilterLevel }) {
  const btn = (id, label, tone) => (
    <button key={id}
      onClick={() => setFilterLevel(id)}
      className={`px-2 py-1 text-xs rounded-lg border transition ${filterLevel === id ? "bg-stone-900 text-white border-stone-900" : "bg-white text-stone-700 border-stone-300 hover:bg-stone-50"}`}>
      {label}
    </button>
  );
  return (
    <div className="flex gap-2">
      {btn("ALL", "All", "stone")}
      {btn("L1", "L1 ░", "stone")}
      {btn("L2", "L2 ▒", "sky")}
      {btn("L3", "L3 ▓", "violet")}
    </div>
  );
}

function TileGrid({ sessions, onSelect, progress, setProgress }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
      {sessions.map((s) => (
        <button key={s.id}
          onClick={() => onSelect(s)}
          className={`group relative p-4 rounded-2xl border hover:shadow ${s.level === "L3" ? "border-violet-300 bg-violet-50" : s.level === "L2" ? "border-sky-300 bg-sky-50" : "border-stone-300 bg-stone-50"}`}>
          <div className="flex items-start justify-between">
            <div className="text-[11px] text-stone-600">W{s.week} {s.day}<br/>{formatDate(s.dateISO)}</div>
            <div className="text-lg font-mono">{levelChip(s.level)}</div>
          </div>
          <div className="mt-2 font-semibold text-sm line-clamp-2">{s.title}</div>
          <div className="mt-1 font-mono text-xl">{s.glyph}</div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-stone-600">
            <div>{s.readings.length} readings · {s.activities.length} acts</div>
            <label className="inline-flex items-center gap-1 cursor-pointer select-none">
              <input type="checkbox" className="accent-stone-900"
                checked={!!progress.checked[s.id]}
                onChange={(e) => setProgress({ ...progress, checked: { ...progress.checked, [s.id]: e.target.checked } })}
              /> done
            </label>
          </div>
        </button>
      ))}
    </div>
  );
}

function CalendarList({ sessions, onSelect, progress, setProgress }) {
  return (
    <div className="divide-y divide-stone-200">
      {sessions.map((s) => (
        <div key={s.id} className="py-3 flex items-start gap-3">
          <div className={`shrink-0 w-28 grid place-items-center h-16 rounded-xl border ${s.level === "L3" ? "border-violet-300 bg-violet-50" : s.level === "L2" ? "border-sky-300 bg-sky-50" : "border-stone-300 bg-stone-50"}`}>
            <div className="text-xs text-stone-600">{s.day} · Week {s.week}</div>
            <div className="text-sm font-medium">{formatDate(s.dateISO)}</div>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold">{s.title} <span className="ml-2 font-mono text-xs">{s.glyph}</span></div>
                <div className="text-xs text-stone-600">Level: {s.level} {levelChip(s.level)}</div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => onSelect(s)} className="px-2 py-1 text-xs rounded-lg border border-stone-300 hover:bg-stone-50">Open</button>
                <label className="inline-flex items-center gap-1 text-xs">
                  <input type="checkbox" className="accent-stone-900" checked={!!progress.checked[s.id]} onChange={(e) => setProgress({ ...progress, checked: { ...progress.checked, [s.id]: e.target.checked } })} /> done
                </label>
              </div>
            </div>
            {s.readings?.length > 0 && (
              <div className="mt-1 text-xs"><span className="font-medium">Readings:</span> {s.readings.join(" · ")}</div>
            )}
            {s.activities?.length > 0 && (
              <div className="mt-1 text-xs"><span className="font-medium">Activities:</span> {s.activities.join(" · ")}</div>
            )}
            {s.due?.length > 0 && (
              <div className="mt-1 text-xs text-rose-700"><span className="font-medium">Due:</span> {s.due.map(d => `${d.title} (${formatDate(d.when)})`).join(" · ")}</div>
            )}
            {s.notes?.length > 0 && (
              <div className="mt-1 text-xs text-stone-600">{s.notes.join(" · ")}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function DetailDrawer({ session, onClose, progress, setProgress }) {
  return (
    <div className="fixed inset-0 z-30">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full sm:w-[520px] bg-white shadow-2xl border-l border-stone-200 p-6 overflow-y-auto">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs text-stone-500">{session.day} · Week {session.week} · {formatDate(session.dateISO)}</div>
            <h2 className="text-lg font-semibold">{session.title}</h2>
            <div className="mt-1 text-xs text-stone-600">Level: {session.level} {levelChip(session.level)} · <span className="font-mono">{session.glyph}</span></div>
          </div>
          <button onClick={onClose} className="px-2 py-1 text-xs rounded-lg border border-stone-300">Close</button>
        </div>

        <div className="mt-4 grid gap-3">
          <SectionCard title="Readings" actions={<></>}>
            {session.readings?.length ? (
              <ul className="list-disc ml-5 text-sm text-stone-800">
                {session.readings.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            ) : <div className="text-sm text-stone-600">No added reading</div>}
          </SectionCard>

          <SectionCard title="In-class Activities" actions={<></>}>
            {session.activities?.length ? (
              <ul className="list-disc ml-5 text-sm text-stone-800">
                {session.activities.map((a, i) => <li key={i}>{a}</li>)}
              </ul>
            ) : <div className="text-sm text-stone-600">None listed</div>}
          </SectionCard>

          {session.due?.length > 0 && (
            <SectionCard title="Due" actions={<></>}>
              <ul className="list-disc ml-5 text-sm text-stone-800">
                {session.due.map((d, i) => <li key={i}>{d.title} — {formatDate(d.when)}</li>)}
              </ul>
            </SectionCard>
          )}

          <SectionCard title="Mark Complete" actions={<></>}>
            <label className="inline-flex items-center gap-2 text-sm">
              <input type="checkbox" className="accent-stone-900" checked={!!progress.checked[session.id]} onChange={(e) => setProgress({ ...progress, checked: { ...progress.checked, [session.id]: e.target.checked } })} /> I completed this meeting’s checklist
            </label>
          </SectionCard>

          <SectionCard title="Bateson Loop Runner" actions={<></>}>
            <div className="text-xs text-stone-600 mb-2">This day executes these morphisms:</div>
            <FlowLine items={["Annotate", "Frame", "ApplyTheory", session.level !== "L1" ? "Reframe" : null, session.level === "L3" ? "IntegratePremises" : null].filter(Boolean)} />
          </SectionCard>
        </div>
      </div>
    </div>
  );
}

function FlowLine({ items }) {
  return (
    <div className="flex items-center flex-wrap gap-2">
      {items.map((x, i) => (
        <React.Fragment key={i}>
          <span className="px-2 py-1 text-xs rounded-lg bg-stone-900 text-stone-50">{x}</span>
          {i < items.length - 1 && <span className="text-stone-400">→</span>}
        </React.Fragment>
      ))}
    </div>
  );
}

function Assignments({ progress, setProgress }) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {ASSIGNMENTS.map((a) => (
        <SectionCard key={a.key} title={`${a.title} · ${a.weight}%`} actions={<></>}>
          {a.type === "weekly" && (
            <div className="text-sm text-stone-700">Submit each Friday (skip any 2). Track your own streak.
              <div className="mt-2 flex items-center gap-2 text-xs">
                <button className="px-2 py-1 border rounded-lg" onClick={() => nudgeStreak(1)}>+ streak</button>
                <button className="px-2 py-1 border rounded-lg" onClick={() => nudgeStreak(-1)}>− streak</button>
              </div>
            </div>
          )}

          {Array.isArray(a.milestones) && (
            <ul className="mt-2 text-sm">
              {a.milestones.map((m) => (
                <li key={m.key} className="flex items-center justify-between py-1">
                  <span>{m.label}</span>
                  <input type="checkbox" className="accent-stone-900"
                    checked={!!progress.checked[`as:${a.key}:${m.key}`]}
                    onChange={(e) => setProgress({ ...progress, checked: { ...progress.checked, [`as:${a.key}:${m.key}`]: e.target.checked } })} />
                </li>
              ))}
            </ul>
          )}

          {a.rubric && (
            <div className="mt-3">
              <div className="text-xs text-stone-500 mb-1">Rubric</div>
              <ul className="list-disc ml-5 text-sm">
                {a.rubric.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </div>
          )}

          {a.due && (
            <div className="mt-3 text-sm"><span className="font-medium">Due:</span> {formatDate(a.due)}</div>
          )}

          {a.links && (
            <div className="mt-3 flex gap-2">
              <a href={a.links.brief} className="px-2 py-1 text-xs rounded-lg border border-stone-300">Brief</a>
              <a href={a.links.submit} className="px-2 py-1 text-xs rounded-lg bg-stone-900 text-white">Submit</a>
            </div>
          )}
        </SectionCard>
      ))}
    </div>
  );
}

function ReadingsIndex({ sessions }) {
  const readings = useMemo(() => {
    const map = new Map();
    sessions.forEach(s => s.readings.forEach(r => map.set(r, true)));
    return Array.from(map.keys());
  }, [sessions]);

  return (
    <SectionCard title={`Readings (${readings.length})`} actions={<button className="px-2 py-1 text-xs rounded-lg border border-stone-300" onClick={() => copyReadings()}>Copy all</button>}>
      <ul className="grid sm:grid-cols-2 gap-2 text-sm">
        {readings.map((r, i) => (
          <li key={i} className="p-2 rounded-lg border border-stone-200 bg-white">{r}</li>
        ))}
      </ul>
      <div className="text-[11px] text-stone-500 mt-2">Replace with Perusall/Canvas links as needed.</div>
    </SectionCard>
  );
}

function StudioBoard({ progress, setProgress }) {
  const steps = [
    { k: "A", label: "Milestone A · Interaction sketch + harm model" },
    { k: "B", label: "Milestone B · Prototype + self-eval rubric" },
    { k: "C", label: "Milestone C · Failure rehearsal + repair ritual" },
    { k: "D", label: "Milestone D · Integrate ≥2 conflicting theories" },
  ];
  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <SectionCard title="Team Tracker" actions={<></>}>
        <div className="text-sm text-stone-700">Add your team name and mark milestones complete.</div>
        <div className="mt-3 grid gap-2">
          {steps.map(s => (
            <label key={s.k} className="flex items-center justify-between text-sm p-2 rounded-lg border border-stone-200 bg-white">
              <span>{s.label}</span>
              <input type="checkbox" className="accent-stone-900" checked={!!progress.checked[`studio:${s.k}`]} onChange={(e) => setProgress({ ...progress, checked: { ...progress.checked, [`studio:${s.k}`]: e.target.checked } })} />
            </label>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Premise Builder (L3)" actions={<></>}>
        <div className="text-xs text-stone-600 mb-2">Draft and iterate your ontology.</div>
        <PremiseEditor />
      </SectionCard>
    </div>
  );
}

function PremiseEditor() {
  const [text, setText] = useState("media is…\n audience is…\n platform is…\n ritual is…");
  const [history, setHistory] = useState(["Start: seed statements"]);
  return (
    <div>
      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={8} className="w-full p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-400" />
      <div className="mt-2 flex gap-2">
        <button className="px-2 py-1 text-xs rounded-lg border border-stone-300" onClick={() => setHistory(h => ["Saved @ " + new Date().toLocaleTimeString(), ...h])}>Save version</button>
        <button className="px-2 py-1 text-xs rounded-lg bg-stone-900 text-white" onClick={() => navigator.clipboard.writeText(text)}>Copy</button>
      </div>
      <div className="mt-3 text-xs text-stone-600">History</div>
      <ul className="mt-1 text-xs list-disc ml-5">
        {history.map((h, i) => <li key={i}>{h}</li>)}
      </ul>
    </div>
  );
}

function AnalyticsPanel({ progress, sessions }) {
  const done = sessions.filter(s => progress.checked[s.id]).length;
  const total = sessions.length;
  const byLevel = sessions.reduce((acc, s) => { acc[s.level] = (acc[s.level] || 0) + (progress.checked[s.id] ? 1 : 0); return acc; }, { L1: 0, L2: 0, L3: 0 });
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <SectionCard title="Completion by Level" actions={<></>}>
        <div className="grid grid-cols-3 gap-3">
          <Meter label="L1" value={byLevel.L1} max={SESSIONS.filter(s => s.level === "L1").length} tone="stone" />
          <Meter label="L2" value={byLevel.L2} max={SESSIONS.filter(s => s.level === "L2").length} tone="sky" />
          <Meter label="L3" value={byLevel.L3} max={SESSIONS.filter(s => s.level === "L3").length} tone="violet" />
        </div>
        <div className="mt-3 text-xs text-stone-600">Total done: {done}/{total}</div>
      </SectionCard>

      <SectionCard title="Bateson Loop Coverage" actions={<></>}>
        <LoopCoverage sessions={sessions} progress={progress} />
      </SectionCard>
    </div>
  );
}

function Meter({ label, value, max, tone }) {
  const pct = Math.round((value / Math.max(1, max)) * 100);
  const color = tone === "sky" ? "bg-sky-600" : tone === "violet" ? "bg-violet-600" : "bg-stone-800";
  return (
    <div className="p-3 rounded-xl border border-stone-200 bg-white">
      <div className="text-xs text-stone-600 mb-1">{label}</div>
      <div className="h-2 bg-stone-200 rounded-full">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
      </div>
      <div className="mt-1 text-[11px] text-stone-600">{value} / {max}</div>
    </div>
  );
}

function LoopCoverage({ sessions, progress }) {
  const loops = ["Annotate", "Frame", "ApplyTheory", "Reframe", "IntegratePremises", "Prototype", "Present"];
  const coverage = Object.fromEntries(loops.map(l => [l, 0]));
  sessions.forEach(s => {
    const active = ["Annotate", "Frame", "ApplyTheory", s.level !== "L1" ? "Reframe" : null, s.level === "L3" ? "IntegratePremises" : null, s.week >= 13 ? "Prototype" : null, s.week >= 16 ? "Present" : null].filter(Boolean);
    active.forEach(a => coverage[a]++);
  });
  return (
    <ul className="grid grid-cols-2 gap-2 text-sm">
      {loops.map((l) => (
        <li key={l} className="p-2 rounded-lg border border-stone-200 bg-white flex items-center justify-between">
          <span>{l}</span>
          <span className="text-xs text-stone-600">{coverage[l]}</span>
        </li>
      ))}
    </ul>
  );
}

// ====== Misc UI helpers ======
function QuickAction({ label, onClick }) {
  return (
    <button onClick={onClick} className="w-full p-3 rounded-xl border border-stone-300 hover:bg-stone-50 text-sm text-left">{label}</button>
  );
}

function markToday() {
  alert("Demo: mark today's session complete (hook to date-aware logic in production).");
}

function copyReadings() {
  const list = Array.from(new Set(SESSIONS.flatMap(s => s.readings))).join("\n");
  navigator.clipboard.writeText(list);
  alert("Reading list copied to clipboard.");
}

function exportICS(sessions) {
  const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//LMC2400-OS//EN"]; 
  sessions.forEach(s => {
    const dt = new Date(s.dateISO);
    const dtStart = toICSDateTime(dt, 15, 30); // default 3:30 PM start
    const dtEnd = toICSDateTime(dt, 16, 45); // default 4:45 PM end
    const uid = `${s.id}-${Date.now()}@lmc2400-os`;
    lines.push(
      "BEGIN:VEVENT",
      `UID:${uid}`,
      `DTSTAMP:${toICSDateTime(new Date())}`,
      `DTSTART:${dtStart}`,
      `DTEND:${dtEnd}`,
      `SUMMARY:${escapeICS(s.title)} (Week ${s.week} ${s.day})`,
      `DESCRIPTION:Level ${s.level} ${s.glyph}`,
      "END:VEVENT"
    );
  });
  lines.push("END:VCALENDAR");
  const blob = new Blob([lines.join("\n")], { type: "text/calendar" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "LMC2400-sessions.ics"; a.click();
  URL.revokeObjectURL(url);
}

function toICSDateTime(d, hour = d.getHours(), minute = d.getMinutes()) {
  const pad = (n) => String(n).padStart(2, "0");
  const dt = new Date(d);
  dt.setHours(hour, minute, 0, 0);
  return `${dt.getUTCFullYear()}${pad(dt.getUTCMonth()+1)}${pad(dt.getUTCDate())}T${pad(dt.getUTCHours())}${pad(dt.getUTCMinutes())}00Z`;
}

function escapeICS(s) { return String(s).replace(/[,;]/g, " "); }

function nudgeStreak(n) {
  const raw = loadProgress();
  const next = { ...raw, streak: Math.max(0, (raw.streak || 0) + n) };
  saveProgress(next);
  alert(`Streak: ${next.streak}`);
}
