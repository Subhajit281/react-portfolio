import { useState, useEffect } from "react";

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const LEETCODE_USERNAME = "_vapourX";
const GITHUB_USERNAME   = "Subhajit281";

// ── LeetCode — calls our own Vercel serverless function /api/leetcode ─────────
// The serverless function calls leetcode.com server-to-server (no CORS issue).
// In local dev, Vite proxies /api → the same function via vite.config.js.
async function fetchLeetCode(username) {
  const res = await fetch(`/api/leetcode?username=${username}`);
  if (!res.ok) throw new Error(`LC API ${res.status}`);
  return res.json();
}

// Simple in-memory cache to prevent double-fetches in React StrictMode
const _cache = {};
async function cached(key, fn) {
  if (_cache[key]) return _cache[key];
  const result = await fn();
  _cache[key] = result;
  return result;
}

// ─── UTILITIES ────────────────────────────────────────────────────────────────
function cn(...cls) { return cls.filter(Boolean).join(" "); }

// Build exactly 52 weeks ending today. Each week is Sun→Sat.
function buildWeeksData(map) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  // Start from the Sunday that is (52*7 - 1) days before today, then rewind to Sunday
  const start = new Date(today);
  start.setDate(today.getDate() - 364); // go back 364 days (52 weeks)
  // rewind to the nearest Sunday on or before start
  start.setDate(start.getDate() - start.getDay());

  const weeks  = [];
  const cursor = new Date(start);
  while (cursor <= today) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      const key = cursor.toISOString().slice(0, 10);
      // pad future days (shouldn't happen but just in case)
      week.push({ date: key, count: cursor <= today ? (map[key] || 0) : -1 });
      cursor.setDate(cursor.getDate() + 1);
    }
    weeks.push(week);
  }
  return weeks;
}

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function lcColor(n) {
  if (n <= 0) return "rgba(255,255,255,0.06)";
  if (n <= 2)  return "rgba(248,159,27,0.30)";
  if (n <= 5)  return "rgba(248,159,27,0.55)";
  if (n <= 9)  return "rgba(248,159,27,0.80)";
  return "#f89f1b";
}
function ghColor(n) {
  if (n <= 0) return "rgba(255,255,255,0.05)";
  if (n <= 2) return "rgba(16,185,129,0.25)";
  if (n <= 5) return "rgba(16,185,129,0.50)";
  if (n <= 9) return "rgba(16,185,129,0.75)";
  return "#10b981";
}

// ─── HEATMAP ──────────────────────────────────────────────────────────────────
// Cell + gap size in px — must match the rendered cell
const CELL = 11;
const GAP  = 3;
const COL  = CELL + GAP; // 14px per column

function Heatmap({ weeks, colorFn, loading }) {
  const [tip, setTip] = useState(null);

  if (loading) {
    return <div className="w-full h-[108px] rounded-lg animate-pulse border border-white/5" style={{ background: "rgba(255,255,255,0.03)" }} />;
  }

  // Build month labels: place label at the first week whose Sunday belongs to a new month
  const monthLabels = [];
  let lastMonth = -1;
  weeks.forEach((week, wi) => {
    // Use first day of week (Sunday) for month detection
    const m = new Date(week[0].date).getMonth();
    if (m !== lastMonth) {
      monthLabels.push({ wi, label: MONTHS[m] });
      lastMonth = m;
    }
  });

  const totalW = weeks.length * COL - GAP;

  return (
    <div className="relative select-none" style={{ width: "100%", overflowX: "auto" }}>
      {/* Month labels — absolutely positioned over a fixed-width container */}
      <div className="relative h-5 mb-1" style={{ width: totalW }}>
        {monthLabels.map(({ wi, label }) => (
          <span
            key={wi + label}
            className="absolute text-[11px] text-zinc-400 font-mono"
            style={{ left: wi * COL }}
          >
            {label}
          </span>
        ))}
      </div>

      {/* Grid */}
      <div className="flex" style={{ gap: GAP, width: totalW }}>
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col" style={{ gap: GAP }}>
            {week.map((day) => (
              <div
                key={day.date}
                onMouseEnter={(e) => setTip({ ...day, x: e.clientX, y: e.clientY })}
                onMouseLeave={() => setTip(null)}
                style={{
                  width: CELL,
                  height: CELL,
                  borderRadius: 2,
                  backgroundColor: day.count === -1 ? "transparent" : colorFn(day.count),
                  transition: "transform 0.1s",
                  cursor: "default",
                  flexShrink: 0,
                }}
                className="hover:scale-125"
              />
            ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center mt-2 justify-end" style={{ gap: GAP }}>
        <span className="text-[10px] text-zinc-300 font-mono mr-1">Less</span>
        {[0, 1, 3, 6, 10].map((n) => (
          <div
            key={n}
            style={{ width: CELL, height: CELL, borderRadius: 2, backgroundColor: colorFn(n), flexShrink: 0 }}
          />
        ))}
        <span className="text-[10px] text-zinc-300 font-mono ml-1">More</span>
      </div>

      {/* Tooltip */}
      {tip && tip.count >= 0 && (
        <div
          className="fixed z-50 pointer-events-none bg-[#18181f] border border-white/10 text-white text-xs rounded-lg px-3 py-1.5 shadow-xl font-mono whitespace-nowrap"
          style={{ left: tip.x + 14, top: tip.y - 38 }}
        >
          <span className="text-zinc-400">{tip.date}</span>
          <span className="ml-2 font-semibold">{tip.count} submission{tip.count !== 1 ? "s" : ""}</span>
        </div>
      )}
    </div>
  );
}

// ─── STAT BOX ─────────────────────────────────────────────────────────────────
function StatBox({ label, value, accentBg, accentText }) {
  // value===null means still loading; value===0 is valid and should show
  const display = value === null || value === undefined
    ? <span className="text-zinc-600 animate-pulse text-base">—</span>
    : value;
  return (
    <div className={cn("rounded-xl px-4 py-3 flex flex-col gap-0.5", accentBg)}>
      <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">{label}</span>
      <span className={cn("text-xl font-bold tabular-nums tracking-tight", accentText)}>
        {display}
      </span>
    </div>
  );
}

// ─── SVG DONUT ────────────────────────────────────────────────────────────────
function DonutChart({ easy, medium, hard, total }) {
  const R    = 46;
  const cx   = 60;
  const cy   = 60;
  const circ = 2 * Math.PI * R;

  const easyTotal   = 930;
  const medTotal    = 2022;
  const hardTotal   = 913;
  const grandTotal  = easyTotal + medTotal + hardTotal;

  const segments = [
    { solved: easy   || 0, outOf: easyTotal,  color: "#22c55e" },
    { solved: medium || 0, outOf: medTotal,   color: "#f89f1b" },
    { solved: hard   || 0, outOf: hardTotal,  color: "#ef4444" },
  ];

  let offset = 0;
  const arcs = segments.map((seg) => {
    const len = (seg.solved / grandTotal) * circ;
    const el  = (
      <circle
        key={seg.color}
        cx={cx} cy={cy} r={R}
        fill="none"
        stroke={seg.color}
        strokeWidth="7"
        strokeLinecap="butt"
        strokeDasharray={`${len} ${circ - len}`}
        strokeDashoffset={-offset}
        style={{ transition: "stroke-dasharray 0.7s ease" }}
      />
    );
    offset += len + circ * 0.004;
    return el;
  });

  return (
    <div className="relative flex-shrink-0" style={{ width: 120, height: 120 }}>
      <svg width="120" height="120" style={{ transform: "rotate(-90deg)" }}>
        <circle cx={cx} cy={cy} r={R} fill="none" stroke="#2a2a38" strokeWidth="7" />
        {arcs}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-[26px] font-bold text-white tabular-nums leading-none">
          {total ?? "—"}
        </span>
        <span className="text-[10px] text-zinc-500 font-mono mt-0.5">solved</span>
      </div>
    </div>
  );
}

// ─── DIFFICULTY ROW ───────────────────────────────────────────────────────────
function DiffRow({ label, solved, total, barColor, textColor }) {
  const pct = total && solved != null ? Math.round((solved / total) * 100) : 0;
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className={cn("text-[12px] font-semibold font-mono", textColor)}>{label}</span>
        <span className="text-[11px] font-mono">
          <span className="text-white text-sm font-semibold">{solved ?? "—"}</span>
          <span className="text-zinc-500"> / {total}</span>
        </span>
      </div>
      <div className="h-[5px] w-full rounded-full bg-white/[0.06] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${pct}%`, backgroundColor: barColor }}
        />
      </div>
    </div>
  );
}

// ─── LEETCODE ─────────────────────────────────────────────────────────────────
function LeetCodeSection() {
  const [stats,   setStats]   = useState(null);
  const [heatmap, setHeatmap] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await cached("lc", () => fetchLeetCode(LEETCODE_USERNAME));
        if (!cancelled) {
          setStats(data);
          setHeatmap(buildWeeksData(data.submissionCalendar ?? {}));
        }
      } catch {
        if (!cancelled) {
          setError(true);
          setHeatmap(buildWeeksData({}));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const activeDays = heatmap.flat().filter((d) => d.count > 0).length;
  const easy       = stats?.easySolved   ?? null;
  const medium     = stats?.mediumSolved ?? null;
  const hard       = stats?.hardSolved   ?? null;
  const total      = stats?.totalSolved  ?? null;
  const rank       = stats?.ranking      ?? null;

  return (
    <div className="bg-gray-900/80 transition-all border-b border-[#f89f1b]/40 duration-300 shadow-xl shadow-[#f89f1b]/20 p-8 rounded-lg text-left flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#f89f1b]/10 border border-[#f89f1b]/20 flex items-center justify-center flex-shrink-0">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#f89f1b]">
              <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z"/>
            </svg>
          </div>
          <div>
            <h3 className="text-white font-semibold text-md tracking-wide">LeetCode</h3>
{/* <span className="text-[11px] text-[#f89f1b]/55 font-mono">@{LEETCODE_USERNAME}</span> */}
          </div>
        </div>
        {error && (
          <span className="text-[10px] text-red-400/70 font-mono bg-red-400/10 px-2 py-1 rounded-md border border-red-400/10">
            partial data
          </span>
        )}
      </div>

      {/* Donut + Difficulty bars */}
      <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-center">
        {loading
          ? <div className="w-[120px] h-[120px] rounded-full bg-white/[0.03] animate-pulse border border-white/5 flex-shrink-0" />
          : <DonutChart easy={easy} medium={medium} hard={hard} total={total} />
        }
        <div className="flex-1 flex flex-col gap-3.5 w-full">
          <DiffRow label="Easy"   solved={easy}   total={930}  barColor="#22c55e" textColor="text-green-400" />
          <DiffRow label="Medium" solved={medium} total={2022} barColor="#f89f1b" textColor="text-[#f89f1b]" />
          <DiffRow label="Hard"   solved={hard}   total={913}  barColor="#ef4444" textColor="text-red-400"   />
        </div>
      </div>

      {/* Stat boxes */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        <StatBox
          label="Total Solved"
          value={total}
          accentBg="bg-[#f89f1b]/10 border border-[#f89f1b]/15"
          accentText="text-[#f89f1b]"
        />
        <StatBox
          label="Active Days"
          value={activeDays || null}
          accentBg="bg-amber-500/10 border border-amber-500/15"
          accentText="text-amber-300"
        />
        <StatBox
          label="Global Rank"
          value={rank ? `#${Number(rank).toLocaleString()}` : null}
          accentBg="bg-orange-500/10 border border-orange-500/15 col-span-2 sm:col-span-1"
          accentText="text-orange-300"
        />
      </div>

      {/* Heatmap */}
      <div>
        <p className="text-[10px] text-zinc-200 font-mono mb-2 uppercase tracking-widest">
          Submission Activity · Last 52 Weeks
        </p>
        <Heatmap weeks={heatmap} colorFn={lcColor} loading={loading} />
      </div>
    </div>
  );
}

// ─── GITHUB ───────────────────────────────────────────────────────────────────
function GitHubSection() {
  const [stats,   setStats]   = useState(null);
  const [heatmap, setHeatmap] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        // Both requests go through our own Vercel serverless functions — no rate limits
        const [contribRes, ghStatsRes] = await Promise.all([
          fetch(`https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}?y=last`),
          fetch(`/api/github?username=${GITHUB_USERNAME}`),
        ]);

        // Parse GitHub user stats (server-side fetch, no rate limit)
        let ghStats = {};
        try { if (ghStatsRes.ok) ghStats = await ghStatsRes.json(); } catch { /* empty */ }

        // Build date→count map from contribution data
        const map = {};
        let totalContribs = 0;
        try {
          if (contribRes.ok) {
            const contribData = await contribRes.json();
            const list = contribData.contributions ?? [];
            list.forEach(({ date, count }) => {
              if (count > 0) map[date] = count;
              totalContribs += count;
            });
          }
        } catch { /* empty */ }

        if (!cancelled) {
          setStats({
            followers:   ghStats.followers   ?? null,
            publicRepos: ghStats.publicRepos ?? null,
            totalStars:  ghStats.totalStars  ?? 0,
            activeDays:  Object.keys(map).length,
            totalContribs,
          });
          setHeatmap(buildWeeksData(map));
        }
      } catch {
        if (!cancelled) {
          setError(true);
          setHeatmap(buildWeeksData({}));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="bg-gray-900/80 transition-all border-b border-[#38bdf8]/40 duration-300 shadow-xl shadow-[#38bdf8]/20 p-8 rounded-lg text-left flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#38bdf8]/10 border border-[#38bdf8]/20 flex items-center justify-center flex-shrink-0">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#10b981]">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </div>
          <div>
            <h3 className="text-white font-semibold text-md tracking-wide">GitHub</h3>
<span className="text-[13px] text-[#10b981]/55 font-arial">{GITHUB_USERNAME}</span>
          </div>
        </div>
        {error && (
          <span className="text-[10px] text-red-400/70 font-mono bg-red-400/10 px-2 py-1 rounded-md border border-red-400/10">
            partial data
          </span>
        )}
      </div>

            {/* Stat boxes */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <StatBox
              label="Public Repos"
              value={stats?.publicRepos ?? null}
              accentBg="bg-emerald-500/10 border border-emerald-500/20"
              accentText="text-emerald-400"
            />
            <StatBox
              label="Active Days"
              value={stats?.activeDays || null}
              accentBg="bg-emerald-500/10 border border-emerald-500/20"
              accentText="text-emerald-400"
            />
            <StatBox
              label="Contributions"
              value={stats?.totalContribs ?? null}
              accentBg="bg-emerald-500/10 border border-emerald-500/20"
              accentText="text-emerald-400"
            />
            <StatBox
              label="Followers"
              value={stats?.followers ?? null}
              accentBg="bg-emerald-500/10 border border-emerald-500/20"
              accentText="text-emerald-400"
            />
          </div>

            {/* Heatmap */}
            <div>
              <p className="text-[10px] text-zinc-200 font-mono mb-2 uppercase tracking-widest">
                Commit Activity · Last 52 Weeks
              </p>
              <Heatmap weeks={heatmap} colorFn={ghColor} loading={loading} />
            </div>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function CodingActivity() {
  return (
    <section id="coding" className="bg-transparent text-white py-20 md:py-32">
      <div className="container max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold mb-4 inline-block bg-gray-900/40 px-8 py-1 rounded-lg text-purple-100 [text-shadow:10px_7px_3px_rgba(0,0,0,0.9)]">
          Where I Grind
        </h2>
        <p className="text-lg text-gray-300 mb-12">
          Live stats pulled directly from platforms. Updates daily.
        </p>
        <div className="flex flex-col gap-8">
          <LeetCodeSection />
          <GitHubSection />
        </div>
        <p className="text-[10px] text-zinc-600 font-mono mt-6">
          Data fetched live from LeetCode and GitHub
        </p>
      </div>
    </section>
  );
}