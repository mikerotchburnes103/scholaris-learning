import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useA11ySettings } from "@/lib/a11y";
import logo from "@/assets/scholaris-logo.png";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — Scholaris Learning" },
      { name: "description", content: "Simple, transparent pricing for individuals, families, and organizations. Free tier available." },
      { property: "og:title", content: "Pricing — Scholaris Learning" },
      { property: "og:description", content: "Plans for every learner — from free to enterprise bulk seats for schools and businesses." },
    ],
  }),
  component: PricingPage,
});

type Plan = {
  name: string;
  tagline: string;
  priceMonthly: number;
  priceYearly: number;
  badge?: string;
  highlight?: boolean;
  cta: string;
  features: string[];
};

const PLANS: Plan[] = [
  {
    name: "Curious",
    tagline: "For casual learners exploring a subject.",
    priceMonthly: 0,
    priceYearly: 0,
    cta: "Start free",
    features: ["18,000+ free lessons", "Community forums", "Daily practice problems", "Progress tracking", "Ad-supported"],
  },
  {
    name: "Scholar",
    tagline: "For students serious about mastery.",
    priceMonthly: 12,
    priceYearly: 108,
    badge: "Most popular",
    highlight: true,
    cta: "Start 14-day trial",
    features: [
      "Everything in Curious",
      "Unlimited adaptive quizzes",
      "Personalized study plans",
      "Live office hours (4/mo)",
      "Downloadable worksheets",
      "Ad-free experience",
    ],
  },
  {
    name: "Family",
    tagline: "Up to 5 learners under one roof.",
    priceMonthly: 24,
    priceYearly: 228,
    cta: "Try Family",
    features: [
      "5 individual profiles",
      "Parent dashboard",
      "Homeschool curriculum maps",
      "Weekly progress reports",
      "All Scholar features",
    ],
  },
];

const BUSINESS_TIERS = [
  { seats: "10–49", price: "$9/seat/mo", note: "Small teams, departments, after-school programs." },
  { seats: "50–499", price: "$7/seat/mo", note: "Schools, districts, mid-size businesses." },
  { seats: "500+", price: "Custom", note: "Enterprise SSO, dedicated CSM, invoiced annually." },
];

function PricingPage() {
  useA11ySettings();
  const [yearly, setYearly] = useState(false);
  const [request, setRequest] = useState<string | null>(null);

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
            <Link to="/practice" className="hover:text-[#1e2a52] dark:hover:text-amber-300">Practice</Link>
            <Link to="/pricing" className="font-semibold text-[#1e2a52] dark:text-amber-300">Pricing</Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#1e2a52] dark:text-amber-300">Pricing</p>
          <h1 className="mb-4 text-5xl font-bold leading-tight">Simple plans. Serious learning.</h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-zinc-300">
            Start free and upgrade when you're ready. Cancel anytime, no questions asked.
          </p>
          <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-slate-300 bg-white p-1 text-sm shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
            <button
              onClick={() => setYearly(false)}
              className={`rounded-full px-4 py-1.5 transition ${!yearly ? "bg-[#1e2a52] text-white" : "text-slate-600 dark:text-zinc-300"}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setYearly(true)}
              className={`rounded-full px-4 py-1.5 transition ${yearly ? "bg-[#1e2a52] text-white" : "text-slate-600 dark:text-zinc-300"}`}
            >
              Yearly <span className="ml-1 text-xs text-amber-400">save 25%</span>
            </button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {PLANS.map((p) => {
            const price = yearly ? p.priceYearly : p.priceMonthly;
            return (
              <div
                key={p.name}
                className={`relative flex flex-col rounded-2xl border bg-white p-8 transition-all dark:bg-zinc-900 ${
                  p.highlight
                    ? "border-[#1e2a52] shadow-2xl dark:border-amber-400 dark:shadow-amber-400/10 scale-[1.02]"
                    : "border-slate-200 dark:border-zinc-800 hover:-translate-y-1 hover:shadow-xl"
                }`}
              >
                {p.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-amber-400 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#1e2a52]">
                    {p.badge}
                  </span>
                )}
                <h2 className="mb-1 text-2xl font-bold">{p.name}</h2>
                <p className="mb-6 min-h-[3rem] text-sm text-slate-600 dark:text-zinc-400">{p.tagline}</p>
                <div className="mb-6">
                  <span className="text-5xl font-bold">${price}</span>
                  <span className="text-sm text-slate-500 dark:text-zinc-400">{price === 0 ? " forever" : yearly ? "/yr" : "/mo"}</span>
                </div>
                <ul className="mb-8 flex-1 space-y-3 text-sm">
                  {p.features.map((f) => (
                    <li key={f} className="flex gap-2">
                      <span className="text-emerald-500">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => setRequest(p.name)}
                  className={`rounded-md px-4 py-3 font-semibold transition ${
                    p.highlight
                      ? "bg-[#1e2a52] text-white hover:bg-[#162247] dark:bg-amber-400 dark:text-[#10183a] dark:hover:bg-amber-300"
                      : "border border-slate-300 hover:bg-slate-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
                  }`}
                >
                  {p.cta}
                </button>
              </div>
            );
          })}
        </div>

        <section className="mt-20 rounded-2xl border border-slate-200 bg-gradient-to-br from-[#10183a] via-[#1e2a52] to-[#2d3f7a] p-10 text-amber-50 shadow-2xl dark:border-zinc-800">
          <div className="grid items-center gap-8 md:grid-cols-[1.2fr_1fr]">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-amber-300">For schools & businesses</p>
              <h2 className="mb-3 text-3xl font-bold">Bulk seats for your organization</h2>
              <p className="mb-6 text-amber-100/80">
                Equip your team, classroom, or whole district with the full Scholaris library. Volume pricing, SSO, admin dashboards, and dedicated support.
              </p>
              <ul className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                {["SAML SSO & SCIM provisioning", "Custom learning paths", "Usage analytics & reporting", "Dedicated success manager", "Bulk invoicing", "Priority support"].map((f) => (
                  <li key={f} className="flex gap-2"><span className="text-amber-300">✓</span>{f}</li>
                ))}
              </ul>
              <button onClick={() => setRequest("School & business")} className="mt-6 rounded-md bg-amber-400 px-6 py-3 font-bold text-[#10183a] transition hover:bg-amber-300">
                Talk to sales
              </button>
            </div>
            <div className="space-y-3">
              {BUSINESS_TIERS.map((t) => (
                <div key={t.seats} className="rounded-lg border border-amber-300/20 bg-white/5 p-4 backdrop-blur">
                  <div className="flex items-baseline justify-between">
                    <span className="text-lg font-bold">{t.seats} seats</span>
                    <span className="text-amber-300 font-bold">{t.price}</span>
                  </div>
                  <p className="mt-1 text-xs text-amber-100/70">{t.note}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-20">
          <h2 className="mb-8 text-center text-3xl font-bold">Frequently asked questions</h2>
          <div className="mx-auto max-w-3xl grid gap-4">
            {[
              ["Can I cancel anytime?", "Yes — cancel from your account settings. Your access continues until the end of the current billing period."],
              ["Do you offer student or teacher discounts?", "Verified students and educators get 50% off Scholar through our partnership with SheerID."],
              ["What payment methods do you accept?", "All major credit cards, Apple Pay, Google Pay, and bank transfer for annual plans."],
              ["Is there a refund policy?", "If you're not satisfied within 30 days of subscribing, we'll issue a full refund — no questions asked."],
            ].map(([q, a]) => (
              <details key={q} className="group rounded-lg border border-slate-200 bg-white p-5 transition dark:border-zinc-800 dark:bg-zinc-900">
                <summary className="cursor-pointer list-none font-semibold flex justify-between items-center">
                  {q}
                  <span className="text-slate-400 transition group-open:rotate-180">▾</span>
                </summary>
                <p className="mt-3 text-sm text-slate-600 dark:text-zinc-400">{a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 py-8 text-center text-xs text-slate-500 dark:border-zinc-800 dark:text-zinc-400">
        © 2026 Scholaris Learning Institute · <Link to="/" className="hover:underline">Home</Link>
      </footer>
    </div>
  );
}
