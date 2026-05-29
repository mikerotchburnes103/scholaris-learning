import { createFileRoute, Link } from "@tanstack/react-router";
import peggle from "@/assets/game-peggle.png";
import penguin from "@/assets/game-penguin.png";
import bowmasters from "@/assets/game-bowmasters.png";
import knight from "@/assets/game-knight.png";
import escape from "@/assets/game-escape.png";
import geometry from "@/assets/game-geometry.png";
import hustle from "@/assets/game-hustle.png";
import archer from "@/assets/game-archer.png";

export const Route = createFileRoute("/games")({
  head: () => ({ meta: [{ title: "Arcade" }] }),
  component: Games,
});

const games = [
  { name: "Peggle", img: peggle },
  { name: "Penguin Dash", img: penguin },
  { name: "Bowmasters", img: bowmasters },
  { name: "Knight's Fall", img: knight },
  { name: "Escape Road 3", img: escape },
  { name: "Geometry Dash", img: geometry },
  { name: "Your Only Move Is Hustle", img: hustle },
  { name: "The Archers", img: archer },
];

function Games() {
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
        <p className="mb-8 text-zinc-400">Welcome back. Choose something to play.</p>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {games.map((g) => (
            <button
              key={g.name}
              className="group overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 transition hover:-translate-y-1 hover:border-fuchsia-500/50 hover:shadow-[0_0_30px_-5px_rgba(217,70,239,0.4)]"
            >
              <div className="aspect-square overflow-hidden">
                <img src={g.img} alt={g.name} className="h-full w-full object-cover transition group-hover:scale-105" />
              </div>
              <div className="p-3 text-left">
                <h3 className="truncate text-sm font-semibold">{g.name}</h3>
                <p className="text-xs text-zinc-500">Play now</p>
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
