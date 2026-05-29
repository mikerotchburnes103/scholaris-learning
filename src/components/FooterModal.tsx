import { useA11ySettings } from "@/lib/a11y";

export type FooterPanel = "privacy" | "terms" | "accessibility" | "contact" | null;

export function FooterModal({ panel, onClose }: { panel: FooterPanel; onClose: () => void }) {
  const { textSize, setTextSize, theme, setTheme } = useA11ySettings();
  if (!panel) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-xl bg-white text-slate-800 p-6 shadow-2xl dark:bg-zinc-900 dark:text-zinc-100 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {panel === "privacy" && (
          <>
            <h2 className="mb-3 text-2xl font-bold">Privacy Policy</h2>
            <div className="space-y-3 text-sm leading-relaxed">
              <p>Scholaris values your privacy. We collect minimal information needed to operate your account and deliver lessons.</p>
              <p><strong>What we collect:</strong> account email, lesson progress, and anonymous performance metrics.</p>
              <p><strong>What we never sell:</strong> your personal data, learning history, or contact information.</p>
              <p><strong>Cookies:</strong> we use essential cookies for sign-in and optional analytics cookies you can disable in your browser.</p>
              <p>Last updated: January 14, 2026.</p>
            </div>
          </>
        )}

        {panel === "terms" && (
          <>
            <h2 className="mb-3 text-2xl font-bold">Terms of Service</h2>
            <div className="space-y-3 text-sm leading-relaxed">
              <p>By using Scholaris you agree to these terms.</p>
              <p><strong>1. Accounts.</strong> You are responsible for safeguarding your password and any activity under your account.</p>
              <p><strong>2. Acceptable use.</strong> Do not scrape, redistribute, or resell course materials without written permission.</p>
              <p><strong>3. Free courses.</strong> Most lessons are provided free of charge. Premium tracks may carry a separate subscription.</p>
              <p><strong>4. Disclaimer.</strong> Course content is provided "as is" for educational purposes.</p>
              <p>Effective date: January 14, 2026.</p>
            </div>
          </>
        )}

        {panel === "contact" && (
          <>
            <h2 className="mb-3 text-2xl font-bold">Contact Us</h2>
            <p className="mb-4 text-sm text-slate-600 dark:text-zinc-400">We typically reply within one business day.</p>
            <div className="space-y-2 text-sm">
              <p><strong>General support:</strong> help@scholaris-learning.org</p>
              <p><strong>Partnerships:</strong> partners@scholaris-learning.org</p>
              <p><strong>Phone:</strong> +1 (800) 555-0199</p>
              <p><strong>Mail:</strong> 240 Library Lane, Suite 400, Cambridge, MA 02138</p>
            </div>
            <form className="mt-5 space-y-3" onSubmit={(e) => { e.preventDefault(); onClose(); }}>
              <input className="w-full rounded-md border border-slate-300 dark:border-zinc-700 dark:bg-zinc-800 px-3 py-2 text-sm" placeholder="Your name" />
              <input className="w-full rounded-md border border-slate-300 dark:border-zinc-700 dark:bg-zinc-800 px-3 py-2 text-sm" placeholder="Email" />
              <textarea className="w-full rounded-md border border-slate-300 dark:border-zinc-700 dark:bg-zinc-800 px-3 py-2 text-sm" rows={3} placeholder="How can we help?" />
              <button className="w-full rounded-md bg-emerald-700 py-2 text-sm font-semibold text-white hover:bg-emerald-800 transition">Send message</button>
            </form>
          </>
        )}

        {panel === "accessibility" && (
          <>
            <h2 className="mb-1 text-2xl font-bold">Accessibility</h2>
            <p className="mb-5 text-sm text-slate-600 dark:text-zinc-400">Adjust your reading experience. Changes are saved on this device.</p>

            <div className="mb-6">
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-semibold">Text size</label>
                <span className="text-xs font-mono text-slate-500 dark:text-zinc-400">{textSize}%</span>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => setTextSize(Math.max(80, textSize - 10))} className="h-9 w-9 rounded-md border border-slate-300 dark:border-zinc-700 text-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition" aria-label="Decrease text size">A−</button>
                <input
                  type="range"
                  min={80}
                  max={150}
                  step={5}
                  value={textSize}
                  onChange={(e) => setTextSize(Number(e.target.value))}
                  className="flex-1 accent-emerald-700"
                  aria-label="Text size"
                />
                <button onClick={() => setTextSize(Math.min(150, textSize + 10))} className="h-9 w-9 rounded-md border border-slate-300 dark:border-zinc-700 text-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition" aria-label="Increase text size">A+</button>
              </div>
              <button onClick={() => setTextSize(100)} className="mt-2 text-xs text-emerald-700 dark:text-emerald-400 hover:underline">Reset to default</button>
            </div>

            <div className="mb-2">
              <label className="mb-2 block text-sm font-semibold">Theme</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setTheme("light")}
                  className={`rounded-md border px-3 py-3 text-sm font-medium transition ${theme === "light" ? "border-emerald-700 bg-emerald-50 text-emerald-900 dark:bg-emerald-900/20" : "border-slate-300 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800"}`}
                >
                  ☀ Light
                </button>
                <button
                  onClick={() => setTheme("dark")}
                  className={`rounded-md border px-3 py-3 text-sm font-medium transition ${theme === "dark" ? "border-emerald-500 bg-emerald-900/20 text-emerald-100" : "border-slate-300 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800"}`}
                >
                  ☾ Dark
                </button>
              </div>
            </div>
          </>
        )}

        <button onClick={onClose} className="mt-6 w-full rounded-md border border-slate-300 dark:border-zinc-700 py-2 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-zinc-800 transition">Close</button>
      </div>
    </div>
  );
}
