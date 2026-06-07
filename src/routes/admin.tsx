import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { checkAdminAuth, verifyAdminPassword, adminListGames, adminCreateGame, adminDeleteGame, getSiteConfig, adminSetSiteConfig } from "@/lib/arcade.functions";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Scholaris" }, { name: "robots", content: "noindex,nofollow" }] }),
  beforeLoad: async () => {
    const { authorized } = await checkAdminAuth();
    return { authorized };
  },
  component: AdminRoute,
});

type Row = { id: string; name: string; img: string; genre: string; device: string; added_at: string };
const ADMIN_TOKEN_KEY = "scholaris.adminToken";

function AdminRoute() {
  const { authorized } = Route.useRouteContext();
  const [authed, setAuthed] = useState(authorized);
  const [adminToken, setAdminToken] = useState(() => typeof window === "undefined" ? "" : sessionStorage.getItem(ADMIN_TOKEN_KEY) || "");
  return authed ? <AdminPanel adminToken={adminToken} /> : <AdminLogin onAuthed={(token) => { sessionStorage.setItem(ADMIN_TOKEN_KEY, token); setAdminToken(token); setAuthed(true); }} />;
}

function AdminLogin({ onAuthed }: { onAuthed: (token: string) => void }) {
  const verify = useServerFn(verifyAdminPassword);
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-zinc-100 px-4">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true); setErr("");
          try {
            const r = await verify({ data: { password: pw } });
            if (r.ok) onAuthed(r.adminToken);
            else setErr("Wrong password");
          } catch { setErr("Failed"); }
          setBusy(false);
        }}
        className="w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-4"
      >
        <h1 className="text-2xl font-bold">Admin</h1>
        <input
          type="password" autoFocus value={pw} onChange={(e) => setPw(e.target.value)}
          placeholder="Password"
          className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-fuchsia-500"
        />
        {err && <p className="text-xs text-rose-400">{err}</p>}
        <button disabled={busy || !pw} className="w-full rounded-md bg-fuchsia-600 py-2 text-sm font-semibold disabled:opacity-40">
          {busy ? "…" : "Enter"}
        </button>
      </form>
    </div>
  );
}

function AdminPanel({ adminToken }: { adminToken: string }) {
  const list = useServerFn(adminListGames);
  const create = useServerFn(adminCreateGame);
  const del = useServerFn(adminDeleteGame);
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [name, setName] = useState("");
  const [genre, setGenre] = useState("Custom");
  const [device, setDevice] = useState<"mobile+pc" | "pc">("mobile+pc");
  const [img, setImg] = useState("");
  const [html, setHtml] = useState("");
  const [busy, setBusy] = useState(false);

  const refresh = async () => {
    setLoading(true);
    try { setRows((await list({ data: { adminToken } })) as Row[]); setErr(""); }
    catch (e) { setErr(e instanceof Error ? e.message : "Failed"); }
    setLoading(false);
  };
  useEffect(() => { void refresh(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  const readFile = (file: File, as: "text" | "dataURL") => new Promise<string>((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(String(r.result));
    r.onerror = () => rej(r.error);
    if (as === "text") r.readAsText(file); else r.readAsDataURL(file);
  });

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 px-6 py-10">
      <div className="mx-auto max-w-4xl space-y-8">
        <header className="flex items-center justify-between">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 to-cyan-400">Admin · Games</h1>
          <a href="/games" className="text-sm text-zinc-400 hover:text-white">→ View arcade</a>
        </header>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-3">
          <h2 className="text-lg font-semibold">Push a new game (server-wide)</h2>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm" />
          <div className="grid grid-cols-2 gap-2">
            <input value={genre} onChange={(e) => setGenre(e.target.value)} placeholder="Genre" className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm" />
            <select value={device} onChange={(e) => setDevice(e.target.value as "mobile+pc" | "pc")} className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm">
              <option value="mobile+pc">Mobile + PC</option>
              <option value="pc">PC only</option>
            </select>
          </div>
          <div className="flex gap-2">
            <input value={img.startsWith("data:") ? "" : img} onChange={(e) => setImg(e.target.value)} placeholder="Image URL (optional)" className="flex-1 rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm" />
            <label className="cursor-pointer rounded-md border border-zinc-700 px-3 py-2 text-xs hover:border-white">
              Upload<input type="file" accept="image/*" className="hidden" onChange={async (e) => { const f = e.target.files?.[0]; if (f) setImg(await readFile(f, "dataURL")); }} />
            </label>
          </div>
          {img && <img src={img} alt="" className="h-16 w-16 rounded object-cover" />}
          <textarea value={html} onChange={(e) => setHtml(e.target.value)} placeholder="<!doctype html>…" rows={8} className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 font-mono text-xs" />
          <label className="inline-block cursor-pointer text-xs text-zinc-400 underline hover:text-white">
            Or upload .html<input type="file" accept=".html,.htm,.txt,text/html,text/plain" className="hidden" onChange={async (e) => { const f = e.target.files?.[0]; if (f) setHtml(await readFile(f, "text")); }} />
          </label>
          <button
            disabled={!name.trim() || !html.trim() || busy}
            onClick={async () => {
              setBusy(true); setErr("");
              try {
                await create({ data: { adminToken, name: name.trim(), genre: genre.trim() || "Custom", device, img: img || "/game-soundboard.svg", html } });
                setName(""); setGenre("Custom"); setImg(""); setHtml("");
                await refresh();
              } catch (e) { setErr(e instanceof Error ? e.message : "Failed"); }
              setBusy(false);
            }}
            className="w-full rounded-md bg-gradient-to-r from-fuchsia-500 to-cyan-500 py-2 text-sm font-semibold text-black disabled:opacity-40"
          >
            {busy ? "Pushing…" : "Push to all users"}
          </button>
          {err && <p className="text-xs text-rose-400">{err}</p>}
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">Live games ({rows.length})</h2>
          {loading ? <p className="text-sm text-zinc-500">Loading…</p> : (
            <ul className="space-y-2">
              {rows.map((g) => (
                <li key={g.id} className="flex items-center gap-3 rounded-md border border-zinc-800 bg-zinc-900/40 p-2">
                  <img src={g.img} alt="" className="h-10 w-10 rounded object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="truncate text-sm font-medium">{g.name}</div>
                    <div className="truncate text-[11px] text-zinc-500">{g.genre} · {g.device} · {new Date(g.added_at).toLocaleString()}</div>
                  </div>
                  <button
                    onClick={async () => { if (!confirm(`Delete ${g.name}?`)) return; await del({ data: { adminToken, id: g.id } }); await refresh(); }}
                    className="rounded-md border border-zinc-700 px-2 py-1 text-xs text-rose-400 hover:border-rose-500"
                  >Delete</button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <PatchNotesEditor adminToken={adminToken} />
      </div>
    </div>
  );
}

function PatchNotesEditor({ adminToken }: { adminToken: string }) {
  const load = useServerFn(getSiteConfig);
  const save = useServerFn(adminSetSiteConfig);
  const [md, setMd] = useState("");
  const [version, setVersion] = useState("1");
  const [auto, setAuto] = useState(true);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");

  useEffect(() => {
    load().then((cfg) => {
      setMd((cfg.patch_notes as string) || "");
      setVersion((cfg.patch_version as string) || "1");
      setAuto((cfg.auto_patch_notes as string) !== "0");
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [load]);

  const saveAll = async (bumpVersion: boolean) => {
    setStatus("Saving…");
    try {
      const nextVer = bumpVersion ? String((parseInt(version, 10) || 0) + 1) : version;
      await save({ data: { adminToken, key: "patch_notes", value: md } });
      await save({ data: { adminToken, key: "auto_patch_notes", value: auto ? "1" : "0" } });
      await save({ data: { adminToken, key: "patch_version", value: nextVer } });
      setVersion(nextVer);
      setStatus(bumpVersion ? `Saved & published v${nextVer} (will pop up for every user)` : "Saved");
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Failed");
    }
  };

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-3">
      <h2 className="text-lg font-semibold">Patch notes (server-wide)</h2>
      {loading ? <p className="text-sm text-zinc-500">Loading…</p> : (
        <>
          <textarea
            value={md}
            onChange={(e) => setMd(e.target.value)}
            rows={10}
            className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 font-mono text-xs"
            placeholder="# What's new&#10;- ..."
          />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={auto} onChange={(e) => setAuto(e.target.checked)} className="h-4 w-4" />
            Auto patch notes (append recently added games to the popup)
          </label>
          <div className="flex flex-wrap items-center gap-2">
            <button onClick={() => saveAll(false)} className="rounded-md border border-zinc-700 px-3 py-1.5 text-xs hover:border-white">Save</button>
            <button onClick={() => saveAll(true)} className="rounded-md bg-gradient-to-r from-fuchsia-500 to-cyan-500 px-3 py-1.5 text-xs font-semibold text-black">Save &amp; publish (bump version → re-popup)</button>
            <span className="text-xs text-zinc-500">Current version: v{version}</span>
          </div>
          {status && <p className="text-xs text-zinc-400">{status}</p>}
        </>
      )}
    </section>
  );
}

