import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import peggle from "@/assets/game-peggle.png";
import penguin from "@/assets/game-penguin.png";
import bowmasters from "@/assets/game-bowmasters.png";
import knight from "@/assets/game-knight.png";
import escape from "@/assets/game-escape.png";
import geometry from "@/assets/game-geometry.png";
import hustle from "@/assets/game-hustle.png";
import archer from "@/assets/game-archer.png";
import escapeCity from "@/assets/game-escape-city.jpg";
import moneyRush from "@/assets/game-money-rush.jpg";
import escapeRoad from "@/assets/game-escape-road.jpg";
import stickmanHook from "@/assets/game-stickman-hook.jpg";
import escapeRoad2 from "@/assets/game-escape-road-2.jpg";
import jetpack from "@/assets/game-jetpack.jpg";

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
];

function Games() {
  const [playing, setPlaying] = useState<typeof games[number] | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const goFullscreen = () => {
    const el = wrapperRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      el.requestFullscreen?.();
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800 bg-zinc-900/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-gradient-to-br from-fuchsia-500 to-cyan-400 font-black text-zinc-950">A</div>
            <span className="text-xl font-bold tracking-tight">Arcade</span>
          </div>
          <Link to="/" className="text-sm text-zinc-400 hover:text-zinc-100">Exit</Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="mb-2 text-4xl font-bold">Pick a game</h1>
        <p className="mb-8 text-zinc-400">{games.length} games available.</p>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {games.map((g) => (
            <button
              key={g.name}
              onClick={() => setPlaying(g)}
              className="group overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 text-left transition hover:-translate-y-1 hover:border-fuchsia-500/50 hover:shadow-[0_0_30px_-5px_rgba(217,70,239,0.4)]"
            >
              <div className="aspect-square overflow-hidden">
                <img src={g.img} alt={g.name} loading="lazy" className="h-full w-full object-cover transition group-hover:scale-105" />
              </div>
              <div className="p-3">
                <h3 className="truncate text-sm font-semibold">{g.name}</h3>
                <p className="text-xs text-zinc-500">Play now</p>
              </div>
            </button>
          ))}
        </div>
      </main>

      {playing && (
        <div ref={wrapperRef} className="fixed inset-0 z-50 flex flex-col bg-zinc-950">
          <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900 px-4 py-2">
            <span className="font-semibold">{playing.name}</span>
            <div className="flex gap-2">
              <button
                onClick={goFullscreen}
                className="rounded-md border border-zinc-700 px-3 py-1 text-xs hover:bg-zinc-800"
              >
                Fullscreen
              </button>
              <a
                href={playing.url}
                target="_blank"
                rel="noreferrer"
                className="rounded-md border border-zinc-700 px-3 py-1 text-xs hover:bg-zinc-800"
              >
                New tab
              </a>
              <button
                onClick={() => { if (document.fullscreenElement) document.exitFullscreen(); setPlaying(null); }}
                className="rounded-md bg-fuchsia-600 px-3 py-1 text-xs font-semibold hover:bg-fuchsia-500"
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
