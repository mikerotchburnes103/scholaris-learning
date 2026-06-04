import { useEffect, useMemo, useRef, useState } from "react";
import { useA11ySettings } from "@/lib/a11y";
import { FooterModal, type FooterPanel } from "@/components/FooterModal";
import { CountUp } from "@/components/CountUp";
import { useGameStats, bumpPlay, castVote, readVotes, type VoteState } from "@/lib/useGameStats";
import { useAdminGames } from "@/lib/useAdminGames";

import peggle from "@/assets/game-peggle.png";
import penguin from "@/assets/game-penguin.png";
import bowmasters from "@/assets/game-bowmasters.png";
import knight from "@/assets/game-knight.png";
import escape from "@/assets/game-escape.png";
import geometry from "@/assets/game-geometry.png";
import hustle from "@/assets/game-hustle.png";
import archer from "@/assets/game-archer.png";
import escapeCity from "@/assets/game-escape-city.png";
import moneyRush from "@/assets/game-money-rush.png";
import escapeRoad from "@/assets/game-escape-road.png";
import stickmanHook from "@/assets/game-stickman-hook.png";
import escapeRoad2 from "@/assets/game-escape-road-2.png";
import jetpack from "@/assets/game-jetpack.png";
import flappy from "@/assets/game-flappy.png";
import richRun from "@/assets/game-rich-run.png";
import burritoBison from "@/assets/game-burrito-bison.png";
import bloons from "@/assets/game-bloons.png";
import bitlife from "@/assets/game-bitlife.png";
import subway from "@/assets/game-subway.webp";
import doki from "@/assets/game-doki.webp";
import panicBtn from "@/assets/panic-button.png";
import homeIcon from "@/assets/home-icon.png";

type Device = "mobile+pc" | "pc";
type Game = { name: string; img: string; url: string; genre: string; device: Device; added: string; custom?: boolean };
type CustomGame = { name: string; img: string; html: string; genre: string; device: Device; added: string; id: string };

const games: Game[] = [
  { name: "Peggle", img: peggle, url: "/games/peggle.html", genre: "Arcade", device: "mobile+pc", added: "2026-01-10" },
  { name: "Bouncemasters", img: penguin, url: "/games/bouncemasters.html", genre: "Arcade", device: "mobile+pc", added: "2026-01-12" },
  { name: "Bowmasters", img: bowmasters, url: "/games/bowmasters.html", genre: "Action", device: "mobile+pc", added: "2026-01-15" },
  { name: "Ragdoll Hit", img: knight, url: "/games/ragdoll-hit.html", genre: "Action", device: "mobile+pc", added: "2026-01-18" },
  { name: "Escape Road 3", img: escape, url: "/games/escape-road-3.html", genre: "Racing", device: "mobile+pc", added: "2026-02-01" },
  { name: "Geometry Dash", img: geometry, url: "/games/geometry-dash.html", genre: "Rhythm", device: "mobile+pc", added: "2026-02-05" },
  { name: "Your Only Move Is Hustle", img: hustle, url: "/games/yomi-hustle.html", genre: "Fighting", device: "mobile+pc", added: "2026-02-10" },
  { name: "Ragdoll Archers", img: archer, url: "/games/ragdoll-archers.html", genre: "Action", device: "mobile+pc", added: "2026-02-14" },
  { name: "Escape Road City 2", img: escapeCity, url: "/games/escape-road-city-2.html", genre: "Racing", device: "mobile+pc", added: "2026-02-20" },
  { name: "Money Rush", img: moneyRush, url: "/games/money-rush.html", genre: "Casual", device: "mobile+pc", added: "2026-03-01" },
  { name: "Escape Road", img: escapeRoad, url: "/games/escape-road.html", genre: "Racing", device: "mobile+pc", added: "2026-03-05" },
  { name: "Stickman Hook", img: stickmanHook, url: "/games/stickman-hook.html", genre: "Arcade", device: "mobile+pc", added: "2026-03-10" },
  { name: "Escape Road 2", img: escapeRoad2, url: "/games/escape-road-2.html", genre: "Racing", device: "mobile+pc", added: "2026-03-12" },
  { name: "Jetpack Joyride", img: jetpack, url: "/games/jetpack-joyride.html", genre: "Arcade", device: "mobile+pc", added: "2026-03-18" },
  { name: "Flappy Bird", img: flappy, url: "/games/flappy-bird.html", genre: "Arcade", device: "mobile+pc", added: "2026-03-20" },
  { name: "Rich Run 3D", img: richRun, url: "/games/rich-run-3d.html", genre: "Casual", device: "mobile+pc", added: "2026-04-01" },
  { name: "Burrito Bison: Launcha Libre", img: burritoBison, url: "/games/burrito-bison.html", genre: "Arcade", device: "mobile+pc", added: "2026-04-08" },
  { name: "Bloons TD 5", img: bloons, url: "/games/bloons-td-5.html", genre: "Strategy", device: "mobile+pc", added: "2026-05-20" },
  { name: "BitLife", img: bitlife, url: "/games/bitlife.html", genre: "Simulation", device: "mobile+pc", added: "2026-05-22" },
  { name: "Subway Surfers: Beijing", img: subway, url: "/games/subway-surfers-beijing.html", genre: "Arcade", device: "mobile+pc", added: "2026-05-25" },
  { name: "Doki Doki Literature Club", img: doki, url: "/games/doki-doki.html", genre: "Visual Novel", device: "mobile+pc", added: "2026-05-28" },
  { name: "Soundboard", img: "/games/thumbs/soundboard.webp", url: "/games/soundboard.html", genre: "Toy", device: "mobile+pc", added: "2026-05-30" },
];

type SortKey = "pinned" | "az" | "genre" | "device" | "date" | "plays" | "likes";
const PANIC_KEY = "arcade.panicUrl";
const PLAYS_KEY = "arcade.plays";
const BLANK_KEY = "arcade.openInBlank";
const PIN_KEY = "arcade.pinned";
const THEME_KEY = "arcade.theme";
const CUSTOM_KEY = "arcade.customGames";

type Theme = {
  accent: "fuchsia" | "cyan" | "emerald" | "amber" | "rose" | "violet";
  bg: "aurora" | "midnight" | "sunset" | "mono";
  density: "comfy" | "compact";
  cardStyle: "glow" | "flat" | "neon";
};
const DEFAULT_THEME: Theme = { accent: "fuchsia", bg: "aurora", density: "comfy", cardStyle: "glow" };

const ACCENTS: Record<Theme["accent"], { from: string; to: string; ring: string; text: string }> = {
  fuchsia: { from: "#e879f9", to: "#22d3ee", ring: "#d946ef", text: "#f0abfc" },
  cyan:    { from: "#22d3ee", to: "#3b82f6", ring: "#06b6d4", text: "#67e8f9" },
  emerald: { from: "#34d399", to: "#22d3ee", ring: "#10b981", text: "#6ee7b7" },
  amber:   { from: "#fbbf24", to: "#fb7185", ring: "#f59e0b", text: "#fcd34d" },
  rose:    { from: "#fb7185", to: "#e879f9", ring: "#f43f5e", text: "#fda4af" },
  violet:  { from: "#a78bfa", to: "#22d3ee", ring: "#8b5cf6", text: "#c4b5fd" },
};

const readPlays = (): Record<string, number> => {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(window.localStorage.getItem(PLAYS_KEY) || "{}"); } catch { return {}; }
};
const readPinned = (): string[] => {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(window.localStorage.getItem(PIN_KEY) || "[]"); } catch { return []; }
};
const readTheme = (): Theme => {
  if (typeof window === "undefined") return DEFAULT_THEME;
  try { return { ...DEFAULT_THEME, ...JSON.parse(window.localStorage.getItem(THEME_KEY) || "{}") }; } catch { return DEFAULT_THEME; }
};
const readCustom = (): CustomGame[] => {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(window.localStorage.getItem(CUSTOM_KEY) || "[]"); } catch { return []; }
};


export function ArcadeApp({ onExit }: { onExit: () => void }) {
  useA11ySettings();
  const [playing, setPlaying] = useState<Game | null>(null);
  const [panel, setPanel] = useState<FooterPanel>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [sort, setSort] = useState<SortKey>("pinned");
  const [query, setQuery] = useState("");
  const [extraGames, setExtraGames] = useState<Game[]>([]);
  const [plays, setPlays] = useState<Record<string, number>>(() => readPlays());
  const [pinned, setPinned] = useState<string[]>(() => readPinned());
  const stats = useGameStats();
  const [votes, setVotes] = useState<VoteState>(() => readVotes());
  const [panicUrl, setPanicUrl] = useState<string>(() => {
    if (typeof window === "undefined") return "https://examrevision.ie";
    return window.localStorage.getItem(PANIC_KEY) || "https://examrevision.ie";
  });
  const [openInBlank, setOpenInBlank] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(BLANK_KEY) === "1";
  });
  const [theme, setTheme] = useState<Theme>(() => readTheme());
  const [customGames, setCustomGames] = useState<CustomGame[]>(() => readCustom());
  const wrapperRef = useRef<HTMLDivElement>(null);
  const panicUrlRef = useRef(panicUrl);
  const accent = ACCENTS[theme.accent];

  useEffect(() => { panicUrlRef.current = panicUrl; window.localStorage.setItem(PANIC_KEY, panicUrl); }, [panicUrl]);
  useEffect(() => { window.localStorage.setItem(BLANK_KEY, openInBlank ? "1" : "0"); }, [openInBlank]);
  useEffect(() => { try { window.localStorage.setItem(THEME_KEY, JSON.stringify(theme)); } catch { /* ignore */ } }, [theme]);
  useEffect(() => { try { window.localStorage.setItem(CUSTOM_KEY, JSON.stringify(customGames)); } catch { /* ignore */ } }, [customGames]);


  const openInNewTab = (g: Game) => {
    if (g.custom) {
      const c = customGames.find((x) => `custom:${x.id}` === g.url);
      if (!c) return;
      const w = window.open("about:blank", "_blank");
      if (!w) return;
      w.document.open();
      w.document.write(c.html);
      w.document.close();
      return;
    }
    if (!openInBlank) { window.open(g.url, "_blank", "noopener,noreferrer"); return; }
    const w = window.open("about:blank", "_blank");
    if (!w) return;
    const src = new URL(g.url, window.location.origin).href;
    w.document.open();
    w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${g.name}</title><style>html,body{margin:0;padding:0;height:100%;background:#000;overflow:hidden}iframe{border:0;width:100vw;height:100vh;display:block}</style></head><body><iframe src="${src}" allow="autoplay; fullscreen; gamepad *; cross-origin-isolated" allowfullscreen></iframe></body></html>`);
    w.document.close();
  };


  // Lock body scroll while playing
  useEffect(() => {
    if (!playing) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [playing]);

  // Preconnect to panic URL for instant navigation
  useEffect(() => {
    try {
      const u = new URL(panicUrl);
      const link = document.createElement("link");
      link.rel = "preconnect";
      link.href = u.origin;
      document.head.appendChild(link);
      return () => { document.head.removeChild(link); };
    } catch { /* ignore */ }
  }, [panicUrl]);

  useEffect(() => {
    fetch("/games/manifest.json")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => { if (data && Array.isArray(data.games)) setExtraGames(data.games as Game[]); })
      .catch(() => {});
  }, []);

  const pinnedSet = useMemo(() => new Set(pinned), [pinned]);

  // Materialize custom games into Game shape (HTML stored as data URL)
  const customAsGames = useMemo<Game[]>(() => customGames.map((c) => ({
    name: c.name,
    img: c.img || "/game-soundboard.svg",
    url: `custom:${c.id}`,
    genre: c.genre,
    device: c.device,
    added: c.added,
    custom: true,
  })), [customGames]);

  const sorted = useMemo(() => {
    const seen = new Set<string>();
    let arr = [...customAsGames, ...games, ...extraGames].filter((g) => {
      if (seen.has(g.url)) return false;
      seen.add(g.url);
      return true;
    });
    const q = query.trim().toLowerCase();
    if (q) arr = arr.filter((g) => g.name.toLowerCase().includes(q) || g.genre.toLowerCase().includes(q));

    if (sort === "az") arr.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === "genre") arr.sort((a, b) => a.genre.localeCompare(b.genre) || a.name.localeCompare(b.name));
    else if (sort === "device") arr.sort((a, b) => a.device.localeCompare(b.device) || a.name.localeCompare(b.name));
    else if (sort === "date") arr.sort((a, b) => b.added.localeCompare(a.added));
    else if (sort === "plays") arr.sort((a, b) => ((stats[b.url]?.plays || 0) - (stats[a.url]?.plays || 0)) || a.name.localeCompare(b.name));
    else if (sort === "likes") arr.sort((a, b) => ((stats[b.url]?.likes || 0) - (stats[a.url]?.likes || 0)) || a.name.localeCompare(b.name));
    // Always float pinned games to the top
    arr.sort((a, b) => Number(pinnedSet.has(b.url)) - Number(pinnedSet.has(a.url)));
    return arr;
  }, [sort, query, extraGames, stats, pinnedSet, customAsGames]);


  const togglePin = (url: string) => {
    setPinned((prev) => {
      const next = prev.includes(url) ? prev.filter((u) => u !== url) : [...prev, url];
      try { window.localStorage.setItem(PIN_KEY, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  };

  const vote = async (url: string, target: "like" | "dislike") => {
    const next = await castVote(url, target);
    setVotes({ ...next });
  };

  const playingSrc = useMemo(() => {
    if (!playing) return "";
    if (playing.custom) {
      const c = customGames.find((x) => `custom:${x.id}` === playing.url);
      if (!c) return "";
      const blob = new Blob([c.html], { type: "text/html" });
      return URL.createObjectURL(blob);
    }
    return playing.url;
  }, [playing, customGames]);

  useEffect(() => {
    if (playingSrc.startsWith("blob:")) {
      return () => URL.revokeObjectURL(playingSrc);
    }
  }, [playingSrc]);

  const startGame = (g: Game) => {
    setPlays((prev) => {
      const next = { ...prev, [g.url]: (prev[g.url] || 0) + 1 };
      try { window.localStorage.setItem(PLAYS_KEY, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
    if (!g.custom) bumpPlay(g.url);
    setPlaying(g);
  };


  const goFullscreen = () => {
    const el = wrapperRef.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else el.requestFullscreen?.();
  };

  const goHome = () => {
    if (document.fullscreenElement) document.exitFullscreen();
    setPlaying(null);
  };

  const panic = () => {
    // Synchronous, minimal work for fastest possible navigation
    window.location.replace(panicUrlRef.current || "https://examrevision.ie");
  };

  return (
    <div
      className={`relative min-h-screen overflow-hidden text-zinc-100 ${
        theme.bg === "mono" ? "bg-zinc-950" :
        theme.bg === "midnight" ? "bg-gradient-to-br from-slate-950 via-slate-900 to-black" :
        theme.bg === "sunset" ? "bg-gradient-to-br from-zinc-950 via-rose-950 to-black" :
        "bg-gradient-to-br from-zinc-950 via-zinc-900 to-black"
      }`}
      style={{ ["--accent-from" as any]: accent.from, ["--accent-to" as any]: accent.to, ["--accent-ring" as any]: accent.ring }}
    >
      {theme.bg !== "mono" && (
        <div className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full blur-3xl opacity-20" style={{ background: accent.from }} />
          <div className="absolute top-1/3 -right-32 h-96 w-96 rounded-full blur-3xl opacity-20" style={{ background: accent.to }} />
          <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />
        </div>
      )}


      <header className="sticky top-0 z-30 border-b border-zinc-800/80 bg-zinc-950/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(90deg, ${accent.from}, ${accent.to})` }}>Arcade</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSettingsOpen(true)}
              className="rounded-full border border-zinc-700 bg-zinc-900/70 px-3 py-1.5 text-xs text-zinc-300 transition hover:border-fuchsia-500/60 hover:text-white"
            >
              ⚙ Settings
            </button>
            <button onClick={onExit} className="text-sm text-zinc-400 transition-colors hover:text-zinc-100">Exit</button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="mb-2 text-5xl font-bold tracking-tight bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(90deg, ${accent.from}, ${accent.to})` }}>Pick a game</h1>
            <p className="text-zinc-400">{sorted.length} games available · click any title to play.</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
            <label className="flex flex-col gap-1 text-xs text-zinc-400">
              Search
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search games or genres…"
                className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none transition hover:border-fuchsia-500/60 focus:border-fuchsia-500 min-w-[200px]"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs text-zinc-400">
              Sort by
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none transition hover:border-fuchsia-500/60 focus:border-fuchsia-500"
              >
                <option value="pinned">Pinned first</option>
                <option value="date">Date added (newest)</option>
                <option value="plays">Most played (global)</option>
                <option value="likes">Most liked (global)</option>
                <option value="az">A → Z</option>
                <option value="genre">Genre</option>
                <option value="device">Device compatibility</option>
              </select>
            </label>
          </div>
        </div>

        <div className={`grid ${theme.density === "compact" ? "grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6" : "grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"}`}>
          {sorted.map((g) => {
            const s = stats[g.url];
            const plays = s?.plays ?? 0;
            const likes = s?.likes ?? 0;
            const dislikes = s?.dislikes ?? 0;
            const myVote = votes[g.url];
            const isPinned = pinnedSet.has(g.url);
            return (
              <div
                key={g.name}
                className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-950 transition-all duration-200 hover:-translate-y-1 hover:border-fuchsia-500/60 hover:shadow-[0_15px_50px_-10px_rgba(217,70,239,0.55)]"
              >
                <button onClick={() => startGame(g)} className="block w-full text-left">
                  <div className="relative aspect-square overflow-hidden">
                    <img src={g.img} alt={g.name} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                    <span className="absolute top-2 right-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-fuchsia-300 backdrop-blur">
                      {g.genre}
                    </span>
                    <span className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-semibold text-cyan-300 backdrop-blur">
                      ▶ <CountUp value={plays} />
                    </span>
                  </div>
                  <div className="p-3 pb-1">
                    <h3 className="truncate text-sm font-semibold">{g.name}</h3>
                    <div className="mt-1 text-[11px] font-medium text-zinc-400">
                      {g.device === "mobile+pc" ? "📱 Mobile + 💻 PC" : "💻 PC only"}
                    </div>
                  </div>
                </button>
                <div className="flex items-center justify-between gap-1 px-3 pb-3 pt-1 text-[11px]">
                  <button
                    onClick={(e) => { e.stopPropagation(); togglePin(g.url); }}
                    title={isPinned ? "Unpin" : "Pin to top"}
                    className={`rounded-md border px-1.5 py-0.5 transition ${isPinned ? "border-amber-400 bg-amber-400/20 text-amber-300" : "border-zinc-700 text-zinc-400 hover:border-amber-400 hover:text-amber-300"}`}
                  >
                    {isPinned ? "★" : "☆"}
                  </button>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); vote(g.url, "like"); }}
                      className={`flex items-center gap-1 rounded-md border px-1.5 py-0.5 transition ${myVote === "like" ? "border-emerald-400 bg-emerald-400/20 text-emerald-300" : "border-zinc-700 text-zinc-400 hover:border-emerald-400 hover:text-emerald-300"}`}
                    >
                      👍 <CountUp value={likes} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); vote(g.url, "dislike"); }}
                      className={`flex items-center gap-1 rounded-md border px-1.5 py-0.5 transition ${myVote === "dislike" ? "border-rose-400 bg-rose-400/20 text-rose-300" : "border-zinc-700 text-zinc-400 hover:border-rose-400 hover:text-rose-300"}`}
                    >
                      👎 <CountUp value={dislikes} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>


      <footer className="border-t border-zinc-800 py-8 text-center text-sm text-zinc-500">
        <div>© 2026 Arcade · A Scholaris side project</div>
        <div className="mt-2 space-x-4 text-xs">
          <button onClick={() => setPanel("privacy")} className="transition-colors hover:text-fuchsia-400">Privacy</button>
          <button onClick={() => setPanel("terms")} className="transition-colors hover:text-fuchsia-400">Terms</button>
          <button onClick={() => setPanel("accessibility")} className="transition-colors hover:text-fuchsia-400">Accessibility</button>
          <button onClick={() => setPanel("contact")} className="transition-colors hover:text-fuchsia-400">Contact</button>
        </div>
      </footer>

      <FooterModal panel={panel} onClose={() => setPanel(null)} />

      {playing && (
        <div ref={wrapperRef} className="fixed inset-0 z-40 flex flex-col bg-zinc-950">
          <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900 px-4 py-2">
            <span className="font-semibold">{playing.name}</span>
            <div className="flex gap-2">
              <button onClick={goFullscreen} className="rounded-md border border-zinc-700 px-3 py-1 text-xs transition hover:bg-zinc-800">Fullscreen</button>
              <button onClick={() => openInNewTab(playing)} className="rounded-md border border-zinc-700 px-3 py-1 text-xs transition hover:bg-zinc-800">New tab</button>
              <button
                onClick={goHome}
                className="rounded-md bg-fuchsia-600 px-3 py-1 text-xs font-semibold transition hover:bg-fuchsia-500"
              >
                Close
              </button>
            </div>
          </div>
          <iframe
            src={playingSrc}
            title={playing.name}
            className="h-full w-full flex-1 border-0"
            allow="autoplay; fullscreen; gamepad *; cross-origin-isolated"
            allowFullScreen
          />
        </div>
      )}

      <button
        onClick={goHome}
        title="Back to library"
        aria-label="Back to library"
        className="fixed bottom-4 left-4 z-[70] flex h-12 w-12 items-center justify-center rounded-full border border-fuchsia-500/40 bg-zinc-900/90 shadow-lg shadow-fuchsia-500/30 backdrop-blur-md transition hover:scale-110 hover:border-fuchsia-400 hover:bg-zinc-800"
      >
        <img src={homeIcon} alt="" className="h-5 w-5 object-contain invert" />
      </button>

      {/* Panic button — raised above the Lovable badge */}
      <button
        onMouseDown={panic}
        onTouchStart={panic}
        onClick={panic}
        title="Panic"
        aria-label="Panic"
        className="fixed bottom-16 right-3 z-[70] h-8 w-8 rounded-full transition-transform duration-75 hover:scale-125 active:scale-95"
        style={{ filter: "drop-shadow(0 4px 8px rgba(220,0,0,0.6))" }}
      >
        <img src={panicBtn} alt="" className="h-full w-full object-contain" />
      </button>

      {settingsOpen && (
        <SettingsModal
          onClose={() => setSettingsOpen(false)}
          panicUrl={panicUrl}
          setPanicUrl={setPanicUrl}
          openInBlank={openInBlank}
          setOpenInBlank={setOpenInBlank}
          theme={theme}
          setTheme={setTheme}
          customGames={customGames}
          setCustomGames={setCustomGames}
          panic={panic}
          accent={accent}
        />
      )}

    </div>
  );
}

const ACCENT_KEYS: Theme["accent"][] = ["fuchsia", "cyan", "emerald", "amber", "rose", "violet"];
const BG_KEYS: Theme["bg"][] = ["aurora", "midnight", "sunset", "mono"];

function SettingsModal({
  onClose, panicUrl, setPanicUrl, openInBlank, setOpenInBlank,
  theme, setTheme, customGames, setCustomGames, panic, accent,
}: {
  onClose: () => void;
  panicUrl: string; setPanicUrl: (v: string) => void;
  openInBlank: boolean; setOpenInBlank: (v: boolean) => void;
  theme: Theme; setTheme: (t: Theme) => void;
  customGames: CustomGame[]; setCustomGames: (v: CustomGame[]) => void;
  panic: () => void;
  accent: { from: string; to: string; ring: string; text: string };
}) {
  const [tab, setTab] = useState<"general" | "theme" | "mine">("general");
  // Add-game form state
  const [name, setName] = useState("");
  const [genre, setGenre] = useState("Custom");
  const [device, setDevice] = useState<Device>("mobile+pc");
  const [img, setImg] = useState("");
  const [html, setHtml] = useState("");

  const readFileAs = (file: File, as: "text" | "dataURL"): Promise<string> =>
    new Promise((res, rej) => {
      const r = new FileReader();
      r.onload = () => res(String(r.result));
      r.onerror = () => rej(r.error);
      if (as === "text") r.readAsText(file); else r.readAsDataURL(file);
    });

  const addGame = () => {
    if (!name.trim() || !html.trim()) return;
    const today = new Date().toISOString().slice(0, 10);
    const id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
    const next: CustomGame = {
      id, name: name.trim(), genre: genre.trim() || "Custom", device,
      img: img || "/game-soundboard.svg", html, added: today,
    };
    setCustomGames([next, ...customGames]);
    setName(""); setGenre("Custom"); setDevice("mobile+pc"); setImg(""); setHtml("");
  };

  const removeGame = (id: string) => setCustomGames(customGames.filter((g) => g.id !== id));

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm" onClick={onClose}>
      <div
        className="flex max-h-full w-full max-w-lg flex-col rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-950 text-zinc-100 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
          <h2 className="text-xl font-bold bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(90deg, ${accent.from}, ${accent.to})` }}>Settings</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white">✕</button>
        </div>

        <div className="flex border-b border-zinc-800 px-3 text-sm">
          {(["general", "theme", "mine"] as const).map((k) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={`px-4 py-2 transition ${tab === k ? "border-b-2 text-white" : "text-zinc-400 hover:text-zinc-200"}`}
              style={tab === k ? { borderColor: accent.ring } : undefined}
            >
              {k === "general" ? "General" : k === "theme" ? "Theme" : "My Games"}
            </button>
          ))}
        </div>

        <div className="overflow-y-auto px-6 py-5">
          {tab === "general" && (
            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold">Panic redirect URL</label>
                <input
                  type="url" value={panicUrl} onChange={(e) => setPanicUrl(e.target.value)}
                  placeholder="https://examrevision.ie"
                  className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm outline-none transition focus:border-white/60"
                />
                <div className="mt-2 flex flex-wrap gap-2">
                  {["https://examrevision.ie", "https://classroom.google.com", "https://docs.google.com", "https://en.wikipedia.org"].map((u) => (
                    <button key={u} onClick={() => setPanicUrl(u)} className="rounded-full border border-zinc-700 px-2.5 py-1 text-[11px] text-zinc-300 transition hover:border-white/60 hover:text-white">
                      {u.replace(/^https?:\/\//, "")}
                    </button>
                  ))}
                </div>
              </div>

              <label className="flex cursor-pointer items-start gap-3 rounded-md border border-zinc-800 bg-zinc-900/60 p-3 transition hover:border-white/40">
                <input type="checkbox" checked={openInBlank} onChange={(e) => setOpenInBlank(e.target.checked)} className="mt-1 h-4 w-4" />
                <span className="flex-1 text-sm">
                  <span className="block font-semibold">Stealth new tab</span>
                  <span className="text-xs text-zinc-400">Open games in an <code className="text-zinc-300">about:blank</code> tab with no visible URL.</span>
                </span>
              </label>

              <button onClick={panic} className="w-full rounded-md bg-red-600 py-2 text-sm font-semibold transition hover:bg-red-500">Test panic</button>
            </div>
          )}

          {tab === "theme" && (
            <div className="space-y-6">
              <div>
                <div className="mb-2 text-sm font-semibold">Accent color</div>
                <div className="flex flex-wrap gap-2">
                  {ACCENT_KEYS.map((k) => {
                    const a = ACCENTS[k];
                    const active = theme.accent === k;
                    return (
                      <button
                        key={k}
                        onClick={() => setTheme({ ...theme, accent: k })}
                        title={k}
                        className={`h-9 w-9 rounded-full border-2 transition ${active ? "scale-110" : "border-zinc-700 hover:scale-105"}`}
                        style={{ background: `linear-gradient(135deg, ${a.from}, ${a.to})`, borderColor: active ? a.ring : undefined }}
                      />
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="mb-2 text-sm font-semibold">Background</div>
                <div className="grid grid-cols-2 gap-2">
                  {BG_KEYS.map((k) => (
                    <button
                      key={k}
                      onClick={() => setTheme({ ...theme, bg: k })}
                      className={`rounded-md border px-3 py-2 text-sm capitalize transition ${theme.bg === k ? "border-white text-white" : "border-zinc-700 text-zinc-400 hover:border-zinc-500"}`}
                    >
                      {k}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-2 text-sm font-semibold">Grid density</div>
                <div className="flex gap-2">
                  {(["comfy", "compact"] as const).map((k) => (
                    <button key={k} onClick={() => setTheme({ ...theme, density: k })}
                      className={`flex-1 rounded-md border px-3 py-2 text-sm capitalize transition ${theme.density === k ? "border-white text-white" : "border-zinc-700 text-zinc-400 hover:border-zinc-500"}`}>
                      {k}
                    </button>
                  ))}
                </div>
              </div>

              <button onClick={() => setTheme(DEFAULT_THEME)} className="w-full rounded-md border border-zinc-700 py-2 text-xs text-zinc-400 transition hover:border-zinc-500 hover:text-white">
                Reset theme
              </button>
            </div>
          )}

          {tab === "mine" && (
            <div className="space-y-5">
              <div className="rounded-md border border-zinc-800 bg-zinc-900/40 p-4">
                <div className="mb-3 text-sm font-semibold">Add a custom game</div>
                <p className="mb-3 text-xs text-zinc-500">Saved only on this device — nothing is uploaded. Today's date is recorded automatically.</p>

                <div className="space-y-3">
                  <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Game name" maxLength={80}
                    className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-white/60" />

                  <div className="grid grid-cols-2 gap-2">
                    <input value={genre} onChange={(e) => setGenre(e.target.value)} placeholder="Genre" maxLength={30}
                      className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-white/60" />
                    <select value={device} onChange={(e) => setDevice(e.target.value as Device)}
                      className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-white/60">
                      <option value="mobile+pc">Mobile + PC</option>
                      <option value="pc">PC only</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs text-zinc-400">Image (URL or upload)</label>
                    <div className="flex gap-2">
                      <input value={img.startsWith("data:") ? "" : img} onChange={(e) => setImg(e.target.value)} placeholder="https://… (optional)"
                        className="flex-1 rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-white/60" />
                      <label className="cursor-pointer rounded-md border border-zinc-700 px-3 py-2 text-xs text-zinc-300 hover:border-white/60 hover:text-white">
                        Upload
                        <input type="file" accept="image/*" className="hidden"
                          onChange={async (e) => { const f = e.target.files?.[0]; if (f) setImg(await readFileAs(f, "dataURL")); }} />
                      </label>
                    </div>
                    {img && <img src={img} alt="" className="mt-2 h-16 w-16 rounded object-cover" />}
                  </div>

                  <div>
                    <label className="mb-1 block text-xs text-zinc-400">HTML (paste or upload .html/.txt)</label>
                    <textarea value={html} onChange={(e) => setHtml(e.target.value)} placeholder="<!doctype html>…"
                      rows={6} className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 font-mono text-xs outline-none focus:border-white/60" />
                    <label className="mt-1 inline-block cursor-pointer text-xs text-zinc-400 underline hover:text-white">
                      Or upload a file
                      <input type="file" accept=".html,.htm,.txt,text/html,text/plain" className="hidden"
                        onChange={async (e) => { const f = e.target.files?.[0]; if (f) setHtml(await readFileAs(f, "text")); }} />
                    </label>
                  </div>

                  <button onClick={addGame} disabled={!name.trim() || !html.trim()}
                    className="w-full rounded-md py-2 text-sm font-semibold text-black transition disabled:cursor-not-allowed disabled:opacity-40"
                    style={{ background: `linear-gradient(90deg, ${accent.from}, ${accent.to})` }}>
                    Add game
                  </button>
                </div>
              </div>

              <div>
                <div className="mb-2 text-sm font-semibold">Your games ({customGames.length})</div>
                {customGames.length === 0 ? (
                  <p className="rounded-md border border-dashed border-zinc-800 p-4 text-center text-xs text-zinc-500">None yet. Add one above.</p>
                ) : (
                  <ul className="space-y-2">
                    {customGames.map((g) => (
                      <li key={g.id} className="flex items-center gap-3 rounded-md border border-zinc-800 bg-zinc-900/40 p-2">
                        <img src={g.img} alt="" className="h-10 w-10 rounded object-cover" />
                        <div className="flex-1 min-w-0">
                          <div className="truncate text-sm font-medium">{g.name}</div>
                          <div className="truncate text-[11px] text-zinc-500">{g.genre} · {g.device} · added {g.added}</div>
                        </div>
                        <button onClick={() => removeGame(g.id)} className="rounded-md border border-zinc-700 px-2 py-1 text-xs text-rose-400 transition hover:border-rose-500 hover:bg-rose-500/10">Delete</button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-zinc-800 px-6 py-3">
          <button onClick={onClose} className="w-full rounded-md border border-zinc-700 py-2 text-sm font-semibold transition hover:bg-zinc-800">Done</button>
        </div>
      </div>
    </div>
  );
}

