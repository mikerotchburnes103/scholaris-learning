import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useA11ySettings } from "@/lib/a11y";
import { FooterModal, type FooterPanel } from "@/components/FooterModal";
import { verifyArcadePassword } from "@/lib/arcade.functions";
import { ArcadeApp } from "@/components/ArcadeApp";
import logo from "@/assets/scholaris-logo.png";



export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Scholaris Learning — Online Education Platform" },
      { name: "description", content: "Scholaris offers free courses in mathematics, science, literature, and history for learners of all ages." },
    ],
  }),
  component: Index,
});



type Lesson = { title: string; instructor: string; duration: string; level: string; summary: string; outline: string[] };

const LESSONS: Record<string, Lesson> = {
  "Browse Courses": { title: "Course Catalog — Fall Term", instructor: "Scholaris Faculty", duration: "Self-paced", level: "All levels", summary: "Explore over 18,000 free lessons across mathematics, science, literature, and history. New modules are added every Monday.", outline: ["Introduction to Algebra (12 lessons)", "Cellular Biology Foundations (9 lessons)", "American Literature: 1850-1925 (15 lessons)", "World History: Bronze Age to Renaissance (22 lessons)", "Intro to Python for Learners (18 lessons)"] },
  "Watch Demo": { title: "How Scholaris Works — A 4 Minute Tour", instructor: "Dr. Helena Park", duration: "4 min", level: "Intro", summary: "See how lessons, quizzes, and instructor feedback come together in a typical Scholaris learning week.", outline: ["Meeting your instructor", "Daily lesson structure", "Practice problems & feedback", "Tracking your progress", "Joining study groups"] },
  Mathematics: { title: "Mathematics Track", instructor: "Mr. Henderson", duration: "180 lessons", level: "Beginner → Advanced", summary: "Build a rock-solid foundation from arithmetic through multivariable calculus with guided practice every step of the way.", outline: ["Number sense & arithmetic", "Pre-algebra & algebra I", "Geometry & trigonometry", "Algebra II & precalculus", "Calculus I, II, III", "Linear algebra primer"] },
  Science: { title: "Science Track", instructor: "Dr. Amelia Cho", duration: "142 lessons", level: "Beginner → Intermediate", summary: "Hands-on experiments and clear explanations across the three core sciences.", outline: ["Biology: cells, genetics, ecosystems", "Chemistry: atoms, bonds, reactions", "Physics: mechanics, waves, electricity", "Lab notebook fundamentals", "Scientific writing"] },
  Literature: { title: "Literature Track", instructor: "Prof. Daniel Rourke", duration: "96 lessons", level: "All levels", summary: "Close reading of classic and contemporary works, with essay-writing workshops every two weeks.", outline: ["The short story tradition", "Shakespeare for modern readers", "19th-century novels", "20th-century American voices", "Contemporary essay writing"] },
  History: { title: "History Track", instructor: "Dr. Yuki Tanaka", duration: "118 lessons", level: "Beginner → Advanced", summary: "A sweeping survey from ancient Mesopotamia through the 21st century, with primary-source analysis.", outline: ["The ancient world", "Classical empires", "The medieval period", "The early modern era", "The long 19th century", "Modern world history"] },
  Courses: { title: "Featured Courses This Week", instructor: "Various", duration: "Varies", level: "All levels", summary: "A curated selection of the most-loved courses from our community.", outline: ["Introduction to Algebra — Mr. Henderson", "The Periodic Table Made Simple — Dr. Cho", "Reading Hemingway — Prof. Rourke", "Rome: Rise & Fall — Dr. Tanaka", "Beginner Python — Ms. Alvarez"] },
  Subjects: { title: "All Subjects", instructor: "Scholaris Faculty", duration: "—", level: "All", summary: "Browse every subject area on the Scholaris platform.", outline: ["Mathematics", "Science", "Literature", "History", "Languages", "Computer Science", "The Arts", "Civics & Economics"] },
  Teachers: { title: "Meet Our Instructors", instructor: "1,200+ educators", duration: "—", level: "—", summary: "Every Scholaris instructor brings at least a decade of classroom experience.", outline: ["Mr. Henderson — Mathematics", "Dr. Amelia Cho — Chemistry", "Prof. Daniel Rourke — Literature", "Dr. Yuki Tanaka — History", "Ms. Alvarez — Computer Science", "Dr. Helena Park — Onboarding"] },
  Resources: { title: "Learning Resources", instructor: "—", duration: "—", level: "All", summary: "Free worksheets, lesson plans, and printable study guides to accompany every course.", outline: ["Printable worksheets", "Lesson plans for teachers", "Parent guides", "Study schedules", "Flashcard decks"] },
  About: { title: "About Scholaris", instructor: "—", duration: "—", level: "—", summary: "Scholaris Learning Institute was founded in 2014 to bring high-quality lessons to every learner, free of charge.", outline: ["Our mission", "Our faculty", "Accreditation", "Annual impact report", "Careers at Scholaris"] },
};

const REVIEWERS = [
  { n: "Sarah M.", r: "High school senior", q: "Scholaris helped me raise my AP Calculus score from a 3 to a 5. The instructors actually care.", img: "https://i.pravatar.cc/96?img=47" },
  { n: "David O.", r: "Adult learner", q: "I went back to school at 42. Without these free history courses, I never would've finished my GED.", img: "https://i.pravatar.cc/96?img=12" },
  { n: "Priya K.", r: "Parent & tutor", q: "My daughter struggled with reading comprehension. Six weeks here and she's reading above grade level.", img: "https://i.pravatar.cc/96?img=45" },
  { n: "Marcus T.", r: "Undergraduate", q: "Better than half my actual lectures. The chemistry breakdowns are unreal.", img: "https://i.pravatar.cc/96?img=33" },
  { n: "Elena R.", r: "Homeschool mom", q: "I use Scholaris as the backbone of our whole curriculum. Lessons are structured and rigorous.", img: "https://i.pravatar.cc/96?img=49" },
  { n: "James W.", r: "Retired engineer", q: "Picked up Latin and astronomy in retirement. Lovely community of curious people.", img: "https://i.pravatar.cc/96?img=15" },
];

const IRISH_SCHOOLS = ["St Brigid's College", "Cork North Learning Hub", "Galway Grammar", "Liffey Valley Academy", "Donegal STEM School", "Waterford Scholars" ];

const FAQS = [
  ["I didn't get a reply back.", "This means that your form was reviewed but wasn't found to be eligible."],
  ["Is Scholaris available in Ireland?", "Yes. We support Irish learners, schools, and study groups, including Junior Cycle and Leaving Certificate revision paths."],
  ["Do I need a school email?", "No. You can apply with any email, but school emails are reviewed faster."],
  ["How long does enrolment review take?", "Expect a reply within 1–3 weeks after sending the form."],
  ["Can teachers use Scholaris with a class?", "Yes. Teachers can request class packs, shared practice sets, and printable lesson materials."],
  ["Are the courses actually free?", "The core library and practice questions are free; some premium tutoring and school tools are optional."],
];

function Index() {
  useA11ySettings(); // bootstrap saved preferences
  const [open, setOpen] = useState(false);
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [panel, setPanel] = useState<FooterPanel>(null);
  const [arcadeOpen, setArcadeOpen] = useState(false);
  const [enrollOpen, setEnrollOpen] = useState(false);
  const [enrollSent, setEnrollSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await verifyArcadePassword({ data: { password: pw } });
      if (res.ok) {
        setOpen(false);
        setPw("");
        setErr("");
        setArcadeOpen(true);
      } else setErr("Incorrect password. Please try again.");
    } catch {
      setErr("Could not verify password. Please try again.");
    }
  };



  const openLesson = (key: string) => setLesson(LESSONS[key] ?? LESSONS.Courses);

  const openEnroll = () => {
    setEnrollOpen(true);
    setEnrollSent(false);
  };

  const jumpToNoReplyFaq = () => {
    setEnrollOpen(false);
    requestAnimationFrame(() => document.getElementById("faq-no-reply")?.scrollIntoView({ behavior: "smooth", block: "center" }));
  };

  if (arcadeOpen) {
    return (
      <div className="fixed inset-0 z-[100] overflow-auto bg-zinc-950">
        <ArcadeApp onExit={() => setArcadeOpen(false)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f0e0] text-[#0f1b3d] font-serif transition-colors duration-500 dark:bg-[#071026] dark:text-amber-50">
      <div className="bg-[#10183a] text-amber-50 text-xs dark:bg-[#0a1029]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-1.5">
          <span>Accredited · ISO 21001:2018 Certified Education Provider</span>

          <span className="hidden md:inline">Support: help@scholaris-learning.org · +1 (800) 555-0199</span>
        </div>
      </div>

      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur-md transition-colors dark:border-zinc-800 dark:bg-zinc-900/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5 transition-transform duration-300 hover:scale-105">
            <img src={logo} alt="Scholaris" className="h-10 w-10 rounded-lg shadow-md ring-1 ring-black/5 animate-in fade-in zoom-in-90 duration-700" />

            <div className="leading-tight">
              <div className="text-xl font-bold tracking-tight">Scholaris</div>
              <div className="text-[10px] uppercase tracking-widest text-slate-500 dark:text-zinc-400">Learning Institute</div>
            </div>
          </div>
          <nav className="hidden gap-6 text-sm md:flex">
            {["Courses", "Subjects", "Teachers", "Resources", "About"].map((l) => (
              <button key={l} onClick={() => openLesson(l)} className="relative transition-colors hover:text-[#1e2a52] dark:hover:text-amber-300 after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-full after:scale-x-0 after:bg-[#1e2a52] after:origin-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-left">{l}</button>
            ))}
            <Link to="/practice" className="relative transition-colors hover:text-[#1e2a52] dark:hover:text-amber-300">Practice</Link>
            <Link to="/pricing" className="relative transition-colors hover:text-[#1e2a52] dark:hover:text-amber-300">Pricing</Link>
          </nav>

          <button
            onClick={openEnroll}
            className="rounded-md bg-[#c9a84c] px-4 py-2 text-sm font-semibold text-[#0f1b3d] shadow-sm transition-all hover:bg-[#f0d78c] hover:shadow-md hover:-translate-y-0.5"
          >
            Enrol
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div className="animate-in fade-in slide-in-from-left-8 duration-700">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#1e2a52] dark:text-amber-300">Trusted by 2M+ learners</p>
            <h1 className="mb-6 text-5xl font-bold leading-tight text-slate-900 dark:text-zinc-50">
              Expand your mind,<br />
              <span className="bg-gradient-to-r from-[#1e2a52] via-[#2d3f7a] to-amber-500 bg-clip-text text-transparent">one lesson at a time.</span>
            </h1>

            <p className="mb-8 text-lg text-slate-600 dark:text-zinc-300">
              Scholaris brings free, high-quality lessons in math, science, history, and the arts to your fingertips. Learn at your own pace, from expert educators with decades of classroom experience.
            </p>
            <div className="flex gap-3">
              <button onClick={() => openLesson("Browse Courses")} className="rounded-md bg-[#0f1b3d] px-6 py-3 font-semibold text-white shadow-md transition-all hover:bg-[#1e3a5f] hover:shadow-lg hover:-translate-y-0.5">Browse Courses</button>
              <button onClick={() => openLesson("Watch Demo")} className="rounded-md border border-slate-300 dark:border-zinc-700 px-6 py-3 font-semibold transition-all hover:bg-slate-100 dark:hover:bg-zinc-800 hover:-translate-y-0.5">Watch Demo</button>
              <button onClick={openEnroll} className="rounded-md bg-[#c9a84c] px-6 py-3 font-semibold text-[#0f1b3d] shadow-md transition-all hover:bg-[#f0d78c] hover:shadow-lg hover:-translate-y-0.5">Apply</button>
            </div>
            <div className="mt-8 flex flex-wrap gap-6 text-xs text-slate-500 dark:text-zinc-400">
              <span>★★★★★ 4.9/5 — 28,401 reviews</span>
              <span>Featured in EdWeek &amp; The Atlantic</span>
            </div>
          </div>
          <div className="rounded-lg bg-white dark:bg-zinc-900 p-8 shadow-xl transition-all hover:shadow-2xl animate-in fade-in slide-in-from-right-8 duration-700">
            <div className="mb-4 overflow-hidden rounded" style={{ padding: "75% 0 0 0", position: "relative" }}>
              <iframe
                src="https://player.vimeo.com/video/490422623?badge=0&autopause=0&player_id=0&app_id=58479"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
                title="Spr8.1.1 - Form algebraic expressions"
              />
            </div>
            <h3 className="font-bold">Featured: Introduction to Algebra</h3>
            <p className="text-sm text-slate-500 dark:text-zinc-400">12 lessons · Beginner · Mr. Henderson</p>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white py-10 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-6 text-center md:grid-cols-4">
          {[["2.4M+", "Active learners"], ["1,200+", "Expert instructors"], ["18,000", "Free lessons"], ["96%", "Completion rate"]].map(([n, l], i) => (
            <div key={l} className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${i * 80}ms`, animationFillMode: "backwards" }}>
              <div className="text-3xl font-bold text-[#162247] dark:text-amber-300">{n}</div>
              <div className="mt-1 text-xs uppercase tracking-widest text-slate-500 dark:text-zinc-400">{l}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white py-16 dark:bg-zinc-900">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-10 text-center text-3xl font-bold">Popular Subjects</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { t: "Mathematics", d: "From arithmetic to calculus" },
              { t: "Science", d: "Biology, chemistry, physics" },
              { t: "Literature", d: "Classics and modern essays" },
              { t: "History", d: "Ancient to contemporary" },
            ].map((s, i) => (
              <button
                key={s.t}
                onClick={() => openLesson(s.t)}
                style={{ animationDelay: `${i * 100}ms`, animationFillMode: "backwards" }}
                className="rounded-lg border border-slate-200 dark:border-zinc-800 p-6 text-left transition-all hover:-translate-y-1 hover:border-[#1e2a52] hover:shadow-lg dark:hover:border-amber-400 dark:hover:shadow-amber-400/10 animate-in fade-in slide-in-from-bottom-4 duration-500"
              >
                <h3 className="mb-2 font-bold text-slate-900 dark:text-zinc-100">{s.t}</h3>
                <p className="text-sm text-slate-600 dark:text-zinc-400">{s.d}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f8f6f0] py-16 dark:bg-zinc-950">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-2 text-center text-3xl font-bold">What our learners say</h2>
          <p className="mb-10 text-center text-sm text-slate-500 dark:text-zinc-400">Real feedback from verified Scholaris students</p>
          <div className="grid gap-6 md:grid-cols-3">
            {REVIEWERS.map((t, i) => (
              <figure
                key={t.n}
                style={{ animationDelay: `${i * 80}ms`, animationFillMode: "backwards" }}
                className="rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 transition-all hover:-translate-y-1 hover:shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-500"
              >
                <div className="mb-3 flex items-center gap-3">
                  <img src={t.img} alt={t.n} className="h-12 w-12 rounded-full object-cover ring-2 ring-amber-100 dark:ring-[#10183a]" loading="lazy" />
                  <div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-zinc-100">{t.n}</div>
                    <div className="text-xs text-slate-500 dark:text-zinc-400">{t.r}</div>
                  </div>
                </div>
                <div className="mb-2 text-amber-500">★★★★★</div>
                <blockquote className="text-sm text-slate-700 dark:text-zinc-300">&ldquo;{t.q}&rdquo;</blockquote>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white py-12 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto max-w-6xl px-6">
          <p className="mb-6 text-center text-xs uppercase tracking-widest text-slate-500 dark:text-zinc-400">Used by schools and study clubs across Ireland</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {IRISH_SCHOOLS.map((p) => (
              <button key={p} onClick={() => openLesson("About")} className="rounded-lg border border-[#c9a84c]/30 bg-[#f5f0e0] px-4 py-4 text-sm font-bold text-[#0f1b3d] shadow-sm transition hover:-translate-y-1 hover:border-[#c9a84c] hover:bg-[#f0d78c] dark:bg-[#0f1b3d] dark:text-amber-100">
                {p}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="border-t border-slate-200 bg-[#f5f0e0] py-16 dark:border-zinc-800 dark:bg-[#071026]">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="mb-8 text-center text-3xl font-bold">Frequently asked questions</h2>
          <div className="grid gap-4">
            {FAQS.map(([q, a], i) => (
              <details id={i === 0 ? "faq-no-reply" : undefined} key={q} className="group rounded-lg border border-[#c9a84c]/30 bg-white p-5 transition open:border-[#c9a84c] dark:bg-zinc-900">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                  {q}
                  <span className="text-[#c9a84c] transition group-open:rotate-180">▾</span>
                </summary>
                <p className="mt-3 text-sm text-slate-600 dark:text-zinc-300">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 dark:border-zinc-800 py-8 text-center text-sm text-slate-500 dark:text-zinc-400">
        <div>© 2026 Scholaris Learning Institute. Empowering education worldwide.</div>
        <div className="mt-2 space-x-4 text-xs">
          <button onClick={() => setPanel("privacy")} className="transition-colors hover:text-[#1e2a52] dark:hover:text-amber-300">Privacy</button>
          <button onClick={() => setPanel("terms")} className="transition-colors hover:text-[#1e2a52] dark:hover:text-amber-300">Terms</button>
          <button onClick={() => setPanel("accessibility")} className="transition-colors hover:text-[#1e2a52] dark:hover:text-amber-300">Accessibility</button>
          <button onClick={() => setPanel("contact")} className="transition-colors hover:text-[#1e2a52] dark:hover:text-amber-300">Contact</button>
        </div>
      </footer>


      <FooterModal panel={panel} onClose={() => setPanel(null)} />

      {lesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 animate-in fade-in duration-200" onClick={() => setLesson(null)}>
          <div className="w-full max-w-lg rounded-lg bg-white dark:bg-zinc-900 dark:text-zinc-100 p-6 shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300" onClick={(e) => e.stopPropagation()}>
            <h2 className="mb-1 text-2xl font-bold text-slate-900 dark:text-zinc-100">{lesson.title}</h2>
            <p className="mb-4 text-xs uppercase tracking-widest text-[#1e2a52] dark:text-amber-300">{lesson.instructor} · {lesson.duration} · {lesson.level}</p>
            <p className="mb-4 text-sm text-slate-600 dark:text-zinc-300">{lesson.summary}</p>
            <ul className="mb-5 space-y-2 text-sm text-slate-700 dark:text-zinc-200">
              {lesson.outline.map((o, i) => (
                <li key={i} className="flex gap-2 animate-in fade-in slide-in-from-left-2" style={{ animationDelay: `${i * 50}ms`, animationFillMode: "backwards" }}><span className="text-[#1e2a52] dark:text-amber-300">{i + 1}.</span>{o}</li>
              ))}
            </ul>
            <div className="flex gap-2">
              <button onClick={() => { setLesson(null); setOpen(true); }} className="flex-1 rounded-md bg-[#1e2a52] py-2 text-sm font-semibold text-white transition-all hover:bg-[#162247] hover:shadow-md">Enroll Now</button>
              <button onClick={() => setLesson(null)} className="rounded-md border border-slate-300 dark:border-zinc-700 px-4 py-2 text-sm font-semibold transition hover:bg-slate-100 dark:hover:bg-zinc-800">Close</button>
            </div>
          </div>
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 animate-in fade-in duration-200" onClick={() => setOpen(false)}>
          <div className="w-full max-w-sm rounded-lg bg-white dark:bg-zinc-900 dark:text-zinc-100 p-6 shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300" onClick={(e) => e.stopPropagation()}>
            <h2 className="mb-1 text-xl font-bold">Sign in to Scholaris</h2>
            <p className="mb-4 text-sm text-slate-500 dark:text-zinc-400">Access your courses and progress.</p>
            <form onSubmit={submit} className="space-y-3">
              <input
                type="email"
                placeholder="Email"
                className="w-full rounded-md border border-slate-300 dark:border-zinc-700 dark:bg-zinc-800 px-3 py-2 text-sm transition focus:border-[#1e2a52] focus:outline-none focus:ring-2 focus:ring-[#1e2a52]/20"
              />
              <input
                type="password"
                placeholder="Password"
                value={pw}
                onChange={(e) => { setPw(e.target.value); setErr(""); }}
                className="w-full rounded-md border border-slate-300 dark:border-zinc-700 dark:bg-zinc-800 px-3 py-2 text-sm transition focus:border-[#1e2a52] focus:outline-none focus:ring-2 focus:ring-[#1e2a52]/20"
              />
              {err && <p className="text-xs text-red-600 animate-in fade-in slide-in-from-top-1">{err}</p>}
              <button type="submit" className="w-full rounded-md bg-[#1e2a52] py-2 font-semibold text-white transition-all hover:bg-[#162247] hover:shadow-md">
                Sign In
              </button>
            </form>
          </div>
        </div>
      )}


    </div>
  );
}
