import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useA11ySettings } from "@/lib/a11y";
import { ScientificMethodVideo } from "@/components/ScientificMethodVideo";
import logo from "@/assets/scholaris-logo.png";

export const Route = createFileRoute("/practice")({
  head: () => ({
    meta: [
      { title: "Practice — Adaptive Skill Practice | Scholaris" },
      { name: "description", content: "Sharpen your skills with adaptive questions in math, science, and English. Instant feedback, streaks, and mastery tracking." },
      { property: "og:title", content: "Practice — Adaptive Skill Practice | Scholaris" },
      { property: "og:description", content: "IXL-style adaptive practice across math, science, and English with instant feedback and streak tracking." },
    ],
  }),
  component: PracticePage,
});

type Question = {
  prompt: string;
  choices: string[];
  answer: number; // index
  explain: string;
};
type Skill = { id: string; subject: "Math" | "Science" | "English"; title: string; level: string; questions: Question[] };

const SKILLS: Skill[] = [
  {
    id: "math-fractions",
    subject: "Math",
    title: "Adding fractions with unlike denominators",
    level: "Grade 5",
    questions: [
      { prompt: "What is 1/3 + 1/4 ?", choices: ["2/7", "7/12", "1/12", "5/12"], answer: 1, explain: "Common denominator is 12. 1/3 = 4/12 and 1/4 = 3/12, so 4/12 + 3/12 = 7/12." },
      { prompt: "What is 2/5 + 1/2 ?", choices: ["9/10", "3/7", "3/10", "4/7"], answer: 0, explain: "Common denominator is 10. 2/5 = 4/10 and 1/2 = 5/10, so the sum is 9/10." },
      { prompt: "What is 3/4 + 1/6 ?", choices: ["4/10", "10/12", "11/12", "1"], answer: 2, explain: "Common denominator is 12. 3/4 = 9/12 and 1/6 = 2/12, so the sum is 11/12." },
      { prompt: "What is 5/8 + 1/4 ?", choices: ["6/8", "6/12", "7/8", "9/8"], answer: 2, explain: "1/4 = 2/8, so 5/8 + 2/8 = 7/8." },
    ],
  },
  {
    id: "math-equations",
    subject: "Math",
    title: "Solve one-step linear equations",
    level: "Grade 7",
    questions: [
      { prompt: "Solve for x: x + 7 = 12", choices: ["4", "5", "19", "−5"], answer: 1, explain: "Subtract 7 from both sides: x = 12 − 7 = 5." },
      { prompt: "Solve for x: 3x = 21", choices: ["7", "18", "24", "63"], answer: 0, explain: "Divide both sides by 3: x = 21 ÷ 3 = 7." },
      { prompt: "Solve for x: x − 9 = −2", choices: ["−11", "7", "11", "−7"], answer: 1, explain: "Add 9 to both sides: x = −2 + 9 = 7." },
      { prompt: "Solve for x: x/4 = 5", choices: ["1.25", "9", "20", "−20"], answer: 2, explain: "Multiply both sides by 4: x = 5 × 4 = 20." },
    ],
  },
  {
    id: "sci-method",
    subject: "Science",
    title: "The Scientific Method",
    level: "Middle school",
    questions: [
      { prompt: "What is the first step of the scientific method?", choices: ["Form a hypothesis", "Ask a question / make an observation", "Run an experiment", "Publish results"], answer: 1, explain: "It begins with observing the world and asking a specific question." },
      { prompt: "A hypothesis is best described as…", choices: ["A proven fact", "A testable prediction", "A final conclusion", "A random guess"], answer: 1, explain: "A hypothesis is a testable, falsifiable prediction — not a proven fact or a wild guess." },
      { prompt: "Which is the *independent* variable in an experiment?", choices: ["What you measure", "What you change", "What you keep constant", "The control group"], answer: 1, explain: "Independent = what the scientist deliberately changes. Dependent = what they measure." },
      { prompt: "Why do scientists repeat experiments?", choices: ["To waste time", "Because computers are slow", "To confirm reliability of results", "To use up materials"], answer: 2, explain: "Repetition confirms the result is reliable and not due to chance." },
    ],
  },
  {
    id: "sci-cells",
    subject: "Science",
    title: "Cell biology basics",
    level: "Grade 8",
    questions: [
      { prompt: "Which organelle produces most of a cell's ATP?", choices: ["Nucleus", "Ribosome", "Mitochondrion", "Golgi body"], answer: 2, explain: "Mitochondria are the cell's powerhouses — they generate most ATP via cellular respiration." },
      { prompt: "Plant cells have a structure animal cells lack:", choices: ["Cell membrane", "Cell wall", "Nucleus", "Cytoplasm"], answer: 1, explain: "Cell walls (made of cellulose) provide structural support in plant cells." },
      { prompt: "DNA is found primarily in the…", choices: ["Cytoplasm", "Nucleus", "Mitochondrial matrix only", "Cell membrane"], answer: 1, explain: "The nucleus houses the cell's chromosomes; small amounts of DNA also live in mitochondria." },
    ],
  },
  {
    id: "eng-grammar",
    subject: "English",
    title: "Subject-verb agreement",
    level: "Grade 6",
    questions: [
      { prompt: "Choose the correct verb: \"The team ___ practicing.\"", choices: ["are", "is", "be", "were"], answer: 1, explain: "\"Team\" is a collective noun treated as singular in American English: \"is practicing\"." },
      { prompt: "Choose the correct verb: \"Neither of the answers ___ right.\"", choices: ["is", "are", "be", "were"], answer: 0, explain: "\"Neither\" is singular, so the verb takes the singular form \"is\"." },
      { prompt: "Choose the correct verb: \"The books on the shelf ___ dusty.\"", choices: ["is", "was", "are", "be"], answer: 2, explain: "The subject is \"books\" (plural). The phrase \"on the shelf\" doesn't change it." },
    ],
  },
];

function PracticePage() {
  useA11ySettings();
  const [activeId, setActiveId] = useState<string>(SKILLS[0].id);
  const skill = useMemo(() => SKILLS.find((s) => s.id === activeId)!, [activeId]);
  const [qIndex, setQIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [streak, setStreak] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [attempted, setAttempted] = useState(0);

  const question = skill.questions[qIndex];

  const choose = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    setAttempted((n) => n + 1);
    if (i === question.answer) {
      setCorrect((n) => n + 1);
      setStreak((n) => n + 1);
    } else {
      setStreak(0);
    }
  };

  const next = () => {
    setPicked(null);
    setQIndex((i) => (i + 1) % skill.questions.length);
  };

  const switchSkill = (id: string) => {
    setActiveId(id);
    setQIndex(0);
    setPicked(null);
    setStreak(0);
    setCorrect(0);
    setAttempted(0);
  };

  const pct = attempted === 0 ? 0 : Math.round((correct / attempted) * 100);

  return (
    <div className="min-h-screen bg-[#f8f6f0] font-serif text-slate-800 dark:bg-zinc-950 dark:text-zinc-100">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2.5">
            <img src={logo} alt="Scholaris" className="h-10 w-10 rounded-lg shadow-md ring-1 ring-black/5" />
            <div className="leading-tight">
              <div className="text-xl font-bold tracking-tight">Scholaris</div>
              <div className="text-[10px] uppercase tracking-widest text-slate-500 dark:text-zinc-400">Learning Institute</div>
            </div>
          </Link>
          <nav className="hidden gap-6 text-sm md:flex">
            <Link to="/" className="hover:text-[#1e2a52] dark:hover:text-amber-300">Home</Link>
            <Link to="/practice" className="font-semibold text-[#1e2a52] dark:text-amber-300">Practice</Link>
            <Link to="/pricing" className="hover:text-[#1e2a52] dark:hover:text-amber-300">Pricing</Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#1e2a52] dark:text-amber-300">Adaptive Practice</p>
          <h1 className="text-4xl font-bold">Master one skill at a time.</h1>
          <p className="mt-2 max-w-2xl text-slate-600 dark:text-zinc-300">
            Pick a skill, answer questions, build a streak. Instant feedback shows you exactly why each answer is right or wrong — IXL-style learning in your browser.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-[260px_1fr]">
          {/* Skill list */}
          <aside className="space-y-4">
            {(["Math", "Science", "English"] as const).map((subj) => (
              <div key={subj}>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-zinc-400">{subj}</h3>
                <ul className="space-y-1">
                  {SKILLS.filter((s) => s.subject === subj).map((s) => (
                    <li key={s.id}>
                      <button
                        onClick={() => switchSkill(s.id)}
                        className={`block w-full rounded-md border px-3 py-2 text-left text-sm transition ${
                          s.id === activeId
                            ? "border-[#1e2a52] bg-[#1e2a52] text-white dark:border-amber-400 dark:bg-amber-400 dark:text-[#10183a]"
                            : "border-slate-200 bg-white hover:border-[#1e2a52] dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-amber-400"
                        }`}
                      >
                        <div className="font-semibold">{s.title}</div>
                        <div className="text-xs opacity-70">{s.level}</div>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </aside>

          {/* Question card */}
          <section className="space-y-6">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="text-xs uppercase tracking-widest text-slate-500 dark:text-zinc-400">Streak</div>
                <div className="text-2xl font-bold text-amber-500">🔥 {streak}</div>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="text-xs uppercase tracking-widest text-slate-500 dark:text-zinc-400">Accuracy</div>
                <div className="text-2xl font-bold text-emerald-500">{pct}%</div>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="text-xs uppercase tracking-widest text-slate-500 dark:text-zinc-400">Answered</div>
                <div className="text-2xl font-bold">{attempted}</div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
              <div className="mb-1 text-xs font-semibold uppercase tracking-widest text-[#1e2a52] dark:text-amber-300">
                {skill.subject} · {skill.level}
              </div>
              <h2 className="mb-6 text-2xl font-semibold">{question.prompt}</h2>
              <div className="grid gap-3">
                {question.choices.map((c, i) => {
                  const isCorrect = picked !== null && i === question.answer;
                  const isWrong = picked === i && i !== question.answer;
                  return (
                    <button
                      key={c}
                      onClick={() => choose(i)}
                      disabled={picked !== null}
                      className={`rounded-lg border px-4 py-3 text-left transition ${
                        isCorrect
                          ? "border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200"
                          : isWrong
                          ? "border-rose-500 bg-rose-50 text-rose-900 dark:bg-rose-950/30 dark:text-rose-200"
                          : picked !== null
                          ? "border-slate-200 opacity-60 dark:border-zinc-800"
                          : "border-slate-300 hover:border-[#1e2a52] hover:bg-slate-50 dark:border-zinc-700 dark:hover:border-amber-400 dark:hover:bg-zinc-800"
                      }`}
                    >
                      <span className="mr-2 font-semibold">{String.fromCharCode(65 + i)}.</span>
                      {c}
                    </button>
                  );
                })}
              </div>

              {picked !== null && (
                <div className="mt-6 rounded-lg bg-slate-50 p-4 text-sm dark:bg-zinc-800">
                  <div className="mb-1 font-semibold">
                    {picked === question.answer ? "✅ Correct!" : "❌ Not quite."}
                  </div>
                  <p className="text-slate-700 dark:text-zinc-300">{question.explain}</p>
                  <button
                    onClick={next}
                    className="mt-4 rounded-md bg-[#1e2a52] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#162247] dark:bg-amber-400 dark:text-[#10183a] dark:hover:bg-amber-300"
                  >
                    Next question →
                  </button>
                </div>
              )}
            </div>

            {/* Science section: Scientific Method video embed */}
            {skill.subject === "Science" && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <h3 className="mb-1 text-lg font-bold">📺 Watch & Learn — The Scientific Method</h3>
                <p className="mb-4 text-sm text-slate-600 dark:text-zinc-400">
                  Before you answer, watch this short lesson on how scientists actually investigate the world.
                </p>
                <ScientificMethodVideo className="overflow-hidden rounded-lg" />
              </div>
            )}
          </section>
        </div>
      </main>

      <footer className="border-t border-slate-200 py-8 text-center text-xs text-slate-500 dark:border-zinc-800 dark:text-zinc-400">
        © 2026 Scholaris Learning Institute · <Link to="/" className="hover:underline">Home</Link> · <Link to="/pricing" className="hover:underline">Pricing</Link>
      </footer>
    </div>
  );
}
