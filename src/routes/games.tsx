import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useA11ySettings } from "@/lib/a11y";
import { FooterModal, type FooterPanel } from "@/components/FooterModal";
import { checkArcadeAuth } from "@/lib/arcade.functions";

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

export const Route = createFileRoute("/games")({
  head: () => ({ meta: [{ title: "Education — Scholaris" }] }),
  beforeLoad: async () => {
    const { authorized } = await checkArcadeAuth();
    if (!authorized) throw redirect({ to: "/" });
  },
  component: Games,
});


type Device = "mobile+pc" | "pc";
type Game = { name: string; img: string; url: string; genre: string; device: Device; added: string };

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
  { name: "Soundboard", img: "/game-soundboard.svg", url: "/games/soundboard.html", genre: "Toy", device: "mobile+pc", added: "2026-05-30" },
];

type SortKey = "az" | "genre" | "device" | "date";
const PANIC_KEY = "arcade.panicUrl";

function Games() {
  useA11ySettings();
  const navigate = useNavigate();
  const [playing, setPlaying] = useState<Game | null>(null);
  const [panel, setPanel] = useState<FooterPanel>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [sort, setSort] = useState<SortKey>("date");
  const [extraGames, setExtraGames] = useState<Game[]>([]);
  const [panicUrl, setPanicUrl] = useState<string>(() => {
    if (typeof window === "undefined") return "https://examrevision.ie";
    return window.localStorage.getItem(PANIC_KEY) || "https://examrevision.ie";
  });
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.localStorage.setItem(PANIC_KEY, panicUrl);
  }, [panicUrl]);

  // Load drop-in games from /public/games/manifest.json
  useEffect(() => {
    fetch("/games/manifest.json")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.games)) setExtraGames(data.games as Game[]);
      })
      .catch(() => {});
  }, []);

  const sorted = useMemo(() => {
    const seen = new Set<string>();
    const arr = [...games, ...extraGames].filter((g) => {
      if (seen.has(g.url)) return false;
      seen.add(g.url);
      return true;
    });
    if (sort === "az") arr.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === "genre") arr.sort((a, b) => a.genre.localeCompare(b.genre) || a.name.localeCompare(b.name));
    else if (sort === "device") arr.sort((a, b) => a.device.localeCompare(b.device) || a.name.localeCompare(b.name));
    else if (sort === "date") arr.sort((a, b) => b.added.localeCompare(a.added));
    return arr;
  }, [sort, extraGames]);

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
    window.location.replace(panicUrl || "https://examrevision.ie");
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-zinc-950 via-zinc-900 to-black text-zinc-100">
      {/* Animated background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-fuchsia-600/20 blur-3xl animate-pulse" style={{ animationDuration: "6s" }} />
        <div className="absolute top-1/3 -right-32 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl animate-pulse" style={{ animationDuration: "8s", animationDelay: "1s" }} />
        <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl animate-pulse" style={{ animationDuration: "10s", animationDelay: "2s" }} />
      </div>

      <header className="sticky top-0 z-30 border-b border-zinc-800/80 bg-zinc-950/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5 transition-transform hover:scale-105">
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-fuchsia-400 via-pink-300 to-cyan-300 bg-clip-text text-transparent">Arcade</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSettingsOpen(true)}
              className="rounded-full border border-zinc-700 bg-zinc-900/70 px-3 py-1.5 text-xs text-zinc-300 transition hover:border-fuchsia-500/60 hover:text-white"
            >
              ⚙ Settings
            </button>
            <Link to="/" className="text-sm text-zinc-400 transition-colors hover:text-zinc-100">Exit</Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between animate-in fade-in slide-in-from-top-4 duration-500">
          <div>
            <h1 className="mb-2 text-5xl font-bold tracking-tight bg-gradient-to-r from-fuchsia-300 via-pink-200 to-cyan-300 bg-clip-text text-transparent">Pick a game</h1>
            <p className="text-zinc-400">{sorted.length} games available · click any title to play.</p>
          </div>
          <label className="flex items-center gap-2 text-xs text-zinc-400">
            Sort by
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none transition hover:border-fuchsia-500/60 focus:border-fuchsia-500"
            >
              <option value="date">Date added (newest)</option>
              <option value="az">A → Z</option>
              <option value="genre">Genre</option>
              <option value="device">Device compatibility</option>
            </select>
          </label>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {sorted.map((g, i) => (
            <button
              key={g.name}
              onClick={() => setPlaying(g)}
              style={{ animationDelay: `${i * 30}ms`, animationFillMode: "backwards" }}
              className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-950 text-left transition-all duration-300 hover:-translate-y-1.5 hover:border-fuchsia-500/60 hover:shadow-[0_15px_50px_-10px_rgba(217,70,239,0.55)] animate-in fade-in zoom-in-95 duration-500"
            >
              <div className="relative aspect-square overflow-hidden">
                <img src={g.img} alt={g.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-90" />
                <span className="absolute top-2 right-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-fuchsia-300 backdrop-blur">
                  {g.genre}
                </span>
              </div>
              <div className="p-3">
                <h3 className="truncate text-sm font-semibold">{g.name}</h3>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-zinc-400">
                    {g.device === "mobile+pc" ? "📱 Mobile + 💻 PC" : "💻 PC only"}
                  </span>
                  <span className="text-[11px] text-fuchsia-400 opacity-0 transition-opacity group-hover:opacity-100">Play →</span>
                </div>
              </div>
            </button>
          ))}
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
        <div ref={wrapperRef} className="fixed inset-0 z-40 flex flex-col bg-zinc-950 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900 px-4 py-2">
            <span className="font-semibold">{playing.name}</span>
            <div className="flex gap-2">
              <button onClick={goFullscreen} className="rounded-md border border-zinc-700 px-3 py-1 text-xs transition hover:bg-zinc-800">Fullscreen</button>
              <a href={playing.url} target="_blank" rel="noreferrer" className="rounded-md border border-zinc-700 px-3 py-1 text-xs transition hover:bg-zinc-800">New tab</a>
              <button
                onClick={goHome}
                className="rounded-md bg-fuchsia-600 px-3 py-1 text-xs font-semibold transition hover:bg-fuchsia-500 hover:shadow-md hover:shadow-fuchsia-500/40"
              >
                Close
              </button>
            </div>
          </div>
          <iframe
            src={playing.url}
            title={playing.name}
            className="h-full w-full flex-1 border-0"
            allow="autoplay; fullscreen; gamepad *; cross-origin-isolated"
            allowFullScreen
          />
        </div>
      )}

      {/* Home button — always visible, even while playing */}
      <button
        onClick={() => { goHome(); navigate({ to: "/games" }); }}
        title="Back to library"
        aria-label="Back to library"
        className="fixed bottom-4 left-4 z-[70] flex h-12 w-12 items-center justify-center rounded-full border border-fuchsia-500/40 bg-zinc-900/90 text-xl shadow-lg shadow-fuchsia-500/30 backdrop-blur-md transition hover:scale-110 hover:border-fuchsia-400 hover:bg-zinc-800"
      >
        🏠
      </button>

      {/* Panic button — small, bottom-right */}
      <button
        onClick={panic}
        title="Panic"
        aria-label="Panic"
        className="fixed bottom-3 right-3 z-[70] h-8 w-8 rounded-full transition hover:scale-125 active:scale-95"
        style={{ filter: "drop-shadow(0 4px 8px rgba(220,0,0,0.6))" }}
      >
        <img src={panicBtn} alt="" className="h-full w-full object-contain" />
      </button>

      {/* Settings modal */}
      {settingsOpen && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSettingsOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-950 p-6 text-zinc-100 shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-1 text-2xl font-bold bg-gradient-to-r from-fuchsia-300 to-cyan-300 bg-clip-text text-transparent">Arcade Settings</h2>
            <p className="mb-5 text-sm text-zinc-400">Configure the panic button destination. The site will jump to this URL instantly when the small red button is pressed.</p>

            <label className="mb-2 block text-sm font-semibold">Panic redirect URL</label>
            <input
              type="url"
              value={panicUrl}
              onChange={(e) => setPanicUrl(e.target.value)}
              placeholder="https://examrevision.ie"
              className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm outline-none transition focus:border-fuchsia-500"
            />
            <div className="mt-2 flex flex-wrap gap-2">
              {["https://examrevision.ie", "https://classroom.google.com", "https://docs.google.com", "https://en.wikipedia.org"].map((u) => (
                <button
                  key={u}
                  onClick={() => setPanicUrl(u)}
                  className="rounded-full border border-zinc-700 px-2.5 py-1 text-[11px] text-zinc-300 transition hover:border-fuchsia-500/60 hover:text-white"
                >
                  {u.replace(/^https?:\/\//, "")}
                </button>
              ))}
            </div>

            <div className="mt-6 flex gap-2">
              <button onClick={() => setSettingsOpen(false)} className="flex-1 rounded-md border border-zinc-700 py-2 text-sm font-semibold transition hover:bg-zinc-800">Done</button>
              <button onClick={panic} className="flex-1 rounded-md bg-red-600 py-2 text-sm font-semibold transition hover:bg-red-500">Test panic</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
