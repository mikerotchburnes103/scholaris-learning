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

const PASSWORDS = ["nofemboys", "femboy", "8008"];

function Index() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (PASSWORDS.includes(pw)) {
      navigate({ to: "/games" });
    } else {
      setErr("Incorrect password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f6f0] text-slate-800 font-serif">
      {/* Top utility bar */}
      <div className="bg-emerald-900 text-emerald-50 text-xs">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-1.5">
          <span>Accredited · ISO 21001:2018 Certified Education Provider</span>
          <span className="hidden md:inline">Support: help@scholaris-learning.org · +1 (800) 555-0199</span>
        </div>
      </div>

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-emerald-700 text-white font-bold">S</div>
            <div className="leading-tight">
              <div className="text-xl font-bold tracking-tight">Scholaris</div>
              <div className="text-[10px] uppercase tracking-widest text-slate-500">Learning Institute</div>
            </div>
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
              Scholaris brings free, high-quality lessons in math, science, history, and the arts to your fingertips. Learn at your own pace, from expert educators with decades of classroom experience.
            </p>
            <div className="flex gap-3">
              <button className="rounded-md bg-emerald-700 px-6 py-3 font-semibold text-white hover:bg-emerald-800">Browse Courses</button>
              <button className="rounded-md border border-slate-300 px-6 py-3 font-semibold hover:bg-slate-100">Watch Demo</button>
            </div>
            <div className="mt-8 flex flex-wrap gap-6 text-xs text-slate-500">
              <span>★★★★★ 4.9/5 — 28,401 reviews</span>
              <span>Featured in EdWeek &amp; The Atlantic</span>
            </div>
          </div>
          <div className="rounded-lg bg-white p-8 shadow-lg">
            <div className="mb-4 h-40 rounded bg-gradient-to-br from-emerald-100 to-amber-50" />
            <h3 className="font-bold">Featured: Introduction to Algebra</h3>
            <p className="text-sm text-slate-500">12 lessons · Beginner · Mr. Henderson</p>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-y border-slate-200 bg-white py-10">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-6 text-center md:grid-cols-4">
          {[
            ["2.4M+", "Active learners"],
            ["1,200+", "Expert instructors"],
            ["18,000", "Free lessons"],
            ["96%", "Completion rate"],
          ].map(([n, l]) => (
            <div key={l}>
              <div className="text-3xl font-bold text-emerald-800">{n}</div>
              <div className="mt-1 text-xs uppercase tracking-widest text-slate-500">{l}</div>
            </div>
          ))}
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

      {/* Reviews */}
      <section className="bg-[#f8f6f0] py-16">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-2 text-center text-3xl font-bold">What our learners say</h2>
          <p className="mb-10 text-center text-sm text-slate-500">Real feedback from verified Scholaris students</p>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { n: "Sarah M.", r: "High school senior", q: "Scholaris helped me raise my AP Calculus score from a 3 to a 5. The instructors actually care." },
              { n: "David O.", r: "Adult learner", q: "I went back to school at 42. Without these free history courses, I never would've finished my GED." },
              { n: "Priya K.", r: "Parent &amp; tutor", q: "My daughter struggled with reading comprehension. Six weeks here and she's reading above grade level." },
              { n: "Marcus T.", r: "Undergraduate", q: "Better than half my actual lectures. The chemistry breakdowns are unreal." },
              { n: "Elena R.", r: "Homeschool mom", q: "I use Scholaris as the backbone of our whole curriculum. Lessons are structured and rigorous." },
              { n: "James W.", r: "Retired engineer", q: "Picked up Latin and astronomy in retirement. Lovely community of curious people." },
            ].map((t) => (
              <figure key={t.n} className="rounded-lg border border-slate-200 bg-white p-6">
                <div className="mb-2 text-amber-500">★★★★★</div>
                <blockquote className="text-sm text-slate-700" dangerouslySetInnerHTML={{ __html: `&ldquo;${t.q}&rdquo;` }} />
                <figcaption className="mt-4 text-xs">
                  <div className="font-semibold text-slate-900">{t.n}</div>
                  <div className="text-slate-500" dangerouslySetInnerHTML={{ __html: t.r }} />
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="border-t border-slate-200 bg-white py-10">
        <div className="mx-auto max-w-6xl px-6">
          <p className="mb-6 text-center text-xs uppercase tracking-widest text-slate-500">As featured in</p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-sm font-semibold text-slate-400">
            <span>EdWeek</span>
            <span>The Atlantic</span>
            <span>NPR Education</span>
            <span>UNESCO</span>
            <span>PBS Learning</span>
            <span>Khan Foundation</span>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 py-8 text-center text-sm text-slate-500">
        <div>© 2026 Scholaris Learning Institute. Empowering education worldwide.</div>
        <div className="mt-2 space-x-4 text-xs">
          <a href="#" className="hover:text-emerald-700">Privacy</a>
          <a href="#" className="hover:text-emerald-700">Terms</a>
          <a href="#" className="hover:text-emerald-700">Accessibility</a>
          <a href="#" className="hover:text-emerald-700">Contact</a>
        </div>
        <p className="mx-auto mt-6 max-w-3xl px-6 text-[8px] leading-tight text-slate-300">
          Disclaimer: This is not an educational website. All courses, statistics, instructor names, accreditations, partner logos, and reviews shown on this page are fictional and presented for entertainment purposes only. No actual instruction is provided.
        </p>
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
