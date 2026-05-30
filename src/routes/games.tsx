import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { useA11ySettings } from "@/lib/a11y";
import { FooterModal, type FooterPanel } from "@/components/FooterModal";
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

export const Route = createFileRoute("/games")({
  head: () => ({ meta: [{ title: "Arcade" }] }),
  component: Games,
});

const games = [
  { name: "Peggle", img: peggle, url: "/games/peggle.html" },
  { name: "Bouncemasters", img: penguin, url: "/games/bouncemasters.html" },
  { name: "Bowmasters", img: bowmasters, url: "/games/bowmasters.html" },
  { name: "Ragdoll Hit", img: knight, url: "/games/ragdoll-hit.html" },
  { name: "Escape Road 3", img: escape, url: "/games/escape-road-3.html" },
  { name: "Geometry Dash", img: geometry, url: "/games/geometry-dash.html" },
  { name: "Your Only Move Is Hustle", img: hustle, url: "/games/yomi-hustle.html" },
  { name: "Ragdoll Archers", img: archer, url: "/games/ragdoll-archers.html" },
  { name: "Escape Road City 2", img: escapeCity, url: "/games/escape-road-city-2.html" },
  { name: "Money Rush", img: moneyRush, url: "/games/money-rush.html" },
  { name: "Escape Road", img: escapeRoad, url: "/games/escape-road.html" },
  { name: "Stickman Hook", img: stickmanHook, url: "/games/stickman-hook.html" },
  { name: "Escape Road 2", img: escapeRoad2, url: "/games/escape-road-2.html" },
  { name: "Jetpack Joyride", img: jetpack, url: "/games/jetpack-joyride.html" },
  { name: "Flappy Bird", img: flappy, url: "/games/flappy-bird.html" },
  { name: "Rich Run 3D", img: richRun, url: "/games/rich-run-3d.html" },
  { name: "Burrito Bison: Launcha Libre", img: burritoBison, url: "/games/burrito-bison.html" },
];

function Games() {
  useA11ySettings();
  const [playing, setPlaying] = useState<typeof games[number] | null>(null);
  const [panel, setPanel] = useState<FooterPanel>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const goFullscreen = () => {
    const el = wrapperRef.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else el.requestFullscreen?.();
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-zinc-950 text-zinc-100">
      {/* Animated background glow */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-fuchsia-600/20 blur-3xl animate-pulse" style={{ animationDuration: "6s" }} />
        <div className="absolute top-1/3 -right-32 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl animate-pulse" style={{ animationDuration: "8s", animationDelay: "1s" }} />
        <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl animate-pulse" style={{ animationDuration: "10s", animationDelay: "2s" }} />
      </div>

      <header className="sticky top-0 z-30 border-b border-zinc-800 bg-zinc-900/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5 transition-transform hover:scale-105">
            <img src="/scholaris-logo.png" alt="Scholaris" className="hidden h-9 w-9 rounded-md shadow-lg shadow-fuchsia-500/20" />
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-fuchsia-400 to-cyan-300 bg-clip-text text-transparent">Arcade</span>
          </div>

          <Link to="/" className="text-sm text-zinc-400 transition-colors hover:text-zinc-100">Exit</Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
          <h1 className="mb-2 text-5xl font-bold tracking-tight bg-gradient-to-r from-fuchsia-300 via-pink-200 to-cyan-300 bg-clip-text text-transparent">Pick a game</h1>
          <p className="text-zinc-400">{games.length} games available · click any title to play.</p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {games.map((g, i) => (
            <button
              key={g.name}
              onClick={() => setPlaying(g)}
              style={{ animationDelay: `${i * 40}ms`, animationFillMode: "backwards" }}
              className="group relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 text-left transition-all duration-300 hover:-translate-y-1.5 hover:border-fuchsia-500/60 hover:shadow-[0_10px_40px_-10px_rgba(217,70,239,0.6)] animate-in fade-in zoom-in-95 duration-500"
            >
              <div className="aspect-square overflow-hidden">
                <img src={g.img} alt={g.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="p-3">
                <h3 className="truncate text-sm font-semibold">{g.name}</h3>
                <p className="text-xs text-zinc-500 transition-colors group-hover:text-fuchsia-400">Play now →</p>
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
        <div ref={wrapperRef} className="fixed inset-0 z-50 flex flex-col bg-zinc-950 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900 px-4 py-2">
            <span className="font-semibold">{playing.name}</span>
            <div className="flex gap-2">
              <button onClick={goFullscreen} className="rounded-md border border-zinc-700 px-3 py-1 text-xs transition hover:bg-zinc-800">Fullscreen</button>
              <a href={playing.url} target="_blank" rel="noreferrer" className="rounded-md border border-zinc-700 px-3 py-1 text-xs transition hover:bg-zinc-800">New tab</a>
              <button
                onClick={() => { if (document.fullscreenElement) document.exitFullscreen(); setPlaying(null); }}
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
    </div>
  );
}
