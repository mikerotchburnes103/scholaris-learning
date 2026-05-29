import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Scholaris Learning — Online Education Platform" },
      { name: "description", content: "Scholaris offers free courses in mathematics, science, literature, and history for learners of all ages." },
    ],
  }),
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw === "nofemboys") {
      navigate({ to: "/games" });
    } else {
      setErr("Incorrect password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f6f0] text-slate-800 font-serif">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-emerald-700 text-white font-bold">S</div>
            <span className="text-xl font-bold tracking-tight">Scholaris</span>
          </div>
          <nav className="hidden gap-6 text-sm md:flex">
            <a href="#" className="hover:text-emerald-700">Courses</a>
            <a href="#" className="hover:text-emerald-700">Subjects</a>
            <a href="#" className="hover:text-emerald-700">Teachers</a>
            <a href="#" className="hover:text-emerald-700">Resources</a>
            <a href="#" className="hover:text-emerald-700">About</a>
          </nav>
          <button
            onClick={() => setOpen(true)}
            className="rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
          >
            Sign In
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-emerald-700">Trusted by 2M+ learners</p>
            <h1 className="mb-6 text-5xl font-bold leading-tight text-slate-900">
              Expand your mind, one lesson at a time.
            </h1>
            <p className="mb-8 text-lg text-slate-600">
              Scholaris brings free, high-quality lessons in math, science, history, and the arts to your fingertips. Learn at your own pace, from expert educators.
            </p>
            <div className="flex gap-3">
              <button className="rounded-md bg-emerald-700 px-6 py-3 font-semibold text-white hover:bg-emerald-800">Browse Courses</button>
              <button className="rounded-md border border-slate-300 px-6 py-3 font-semibold hover:bg-slate-100">Watch Demo</button>
            </div>
          </div>
          <div className="rounded-lg bg-white p-8 shadow-lg">
            <div className="mb-4 h-40 rounded bg-gradient-to-br from-emerald-100 to-amber-50" />
            <h3 className="font-bold">Featured: Introduction to Algebra</h3>
            <p className="text-sm text-slate-500">12 lessons · Beginner · Mr. Henderson</p>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-10 text-center text-3xl font-bold">Popular Subjects</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { t: "Mathematics", d: "From arithmetic to calculus" },
              { t: "Science", d: "Biology, chemistry, physics" },
              { t: "Literature", d: "Classics and modern essays" },
              { t: "History", d: "Ancient to contemporary" },
            ].map((s) => (
              <div key={s.t} className="rounded-lg border border-slate-200 p-6 hover:border-emerald-700">
                <h3 className="mb-2 font-bold text-slate-900">{s.t}</h3>
                <p className="text-sm text-slate-600">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 py-8 text-center text-sm text-slate-500">
        © 2026 Scholaris Learning. Empowering education worldwide.
      </footer>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4" onClick={() => setOpen(false)}>
          <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="mb-1 text-xl font-bold">Sign in to Scholaris</h2>
            <p className="mb-4 text-sm text-slate-500">Access your courses and progress.</p>
            <form onSubmit={submit} className="space-y-3">
              <input
                type="email"
                placeholder="Email"
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-700 focus:outline-none"
              />
              <input
                type="password"
                placeholder="Password"
                value={pw}
                onChange={(e) => { setPw(e.target.value); setErr(""); }}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-700 focus:outline-none"
              />
              {err && <p className="text-xs text-red-600">{err}</p>}
              <button type="submit" className="w-full rounded-md bg-emerald-700 py-2 font-semibold text-white hover:bg-emerald-800">
                Sign In
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
