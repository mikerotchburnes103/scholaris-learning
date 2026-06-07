import { createServerFn } from "@tanstack/react-start";
import { getCookie, setCookie } from "@tanstack/react-start/server";
import { z } from "zod";
import {
  ARCADE_COOKIE_NAME,
  ARCADE_COOKIE_TOKEN,
  ARCADE_PASSWORDS,
  ADMIN_COOKIE_NAME,
  ADMIN_COOKIE_TOKEN,
  ADMIN_PASSWORDS,
} from "./arcade.server";

const encoder = new TextEncoder();
const ADMIN_SESSION_MS = 6 * 60 * 60 * 1000;

const toHex = (buffer: ArrayBuffer) =>
  [...new Uint8Array(buffer)].map((b) => b.toString(16).padStart(2, "0")).join("");

const signAdminExpiry = async (expiresAt: number) => {
  const key = await crypto.subtle.importKey("raw", encoder.encode(ADMIN_COOKIE_TOKEN), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return toHex(await crypto.subtle.sign("HMAC", key, encoder.encode(String(expiresAt))));
};

const createAdminToken = async () => {
  const expiresAt = Date.now() + ADMIN_SESSION_MS;
  return `${expiresAt}.${await signAdminExpiry(expiresAt)}`;
};

const verifyAdminToken = async (token?: string) => {
  if (!token) return false;
  const [expiresAtRaw, signature] = token.split(".");
  const expiresAt = Number(expiresAtRaw);
  if (!Number.isFinite(expiresAt) || expiresAt < Date.now() || !signature) return false;
  return signature === await signAdminExpiry(expiresAt);
};

// ---------- Arcade gate (existing) ----------
export const verifyArcadePassword = createServerFn({ method: "POST" })
  .inputValidator(z.object({ password: z.string().min(1).max(200) }))
  .handler(async ({ data }) => {
    if (!ARCADE_PASSWORDS.includes(data.password)) return { ok: false as const };
    setCookie(ARCADE_COOKIE_NAME, ARCADE_COOKIE_TOKEN, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      maxAge: 60 * 60 * 24 * 30,
    });
    return { ok: true as const, adminToken: await createAdminToken() };
  });

// Cookie-gated public listing of admin games for arcade users.
export const listPublicAdminGames = createServerFn({ method: "GET" }).handler(async () => {
  if (getCookie(ARCADE_COOKIE_NAME) !== ARCADE_COOKIE_TOKEN) {
    return [] as Array<{ id: string; name: string; img: string; html: string; genre: string; device: string; added_at: string }>;
  }
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("admin_games")
    .select("id,name,img,html,genre,device,added_at")
    .order("added_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const checkArcadeAuth = createServerFn({ method: "GET" }).handler(async () => {
  return { authorized: getCookie(ARCADE_COOKIE_NAME) === ARCADE_COOKIE_TOKEN };
});

// ---------- Admin gate ----------
export const verifyAdminPassword = createServerFn({ method: "POST" })
  .inputValidator(z.object({ password: z.string().min(1).max(200) }))
  .handler(async ({ data }) => {
    if (!ADMIN_PASSWORDS.includes(data.password)) return { ok: false as const };
    setCookie(ADMIN_COOKIE_NAME, ADMIN_COOKIE_TOKEN, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      maxAge: 60 * 60 * 24 * 30,
    });
    return { ok: true as const };
  });

export const checkAdminAuth = createServerFn({ method: "GET" }).handler(async () => {
  return { authorized: getCookie(ADMIN_COOKIE_NAME) === ADMIN_COOKIE_TOKEN };
});

// ---------- Admin game CRUD ----------
const isAdmin = async (adminToken?: string) => getCookie(ADMIN_COOKIE_NAME) === ADMIN_COOKIE_TOKEN || await verifyAdminToken(adminToken);

const requireAdmin = async (adminToken?: string) => {
  if (!(await isAdmin(adminToken))) {
    throw new Error("Unauthorized");
  }
};

const GameInput = z.object({
  name: z.string().min(1).max(120),
  img: z.string().max(2000).optional().default("/game-soundboard.svg"),
  html: z.string().min(1).max(2_000_000),
  genre: z.string().min(1).max(40).default("Custom"),
  device: z.enum(["mobile+pc", "pc"]).default("mobile+pc"),
});

export const adminCreateGame = createServerFn({ method: "POST" })
  .inputValidator(GameInput.parse)
  .handler(async ({ data }) => {
    requireAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("admin_games")
      .insert({
        name: data.name,
        img: data.img || "/game-soundboard.svg",
        html: data.html,
        genre: data.genre,
        device: data.device,
      })
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

export const adminDeleteGame = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.string().uuid() }).parse)
  .handler(async ({ data }) => {
    requireAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("admin_games").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const adminListGames = createServerFn({ method: "GET" }).handler(async () => {
  requireAdmin();
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("admin_games")
    .select("id, name, img, genre, device, added_at")
    .order("added_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
});

// ---------- Site config (patch notes, toggles) ----------
export const getSiteConfig = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin.from("site_config").select("key,value");
  if (error) throw new Error(error.message);
  const out: Record<string, string> = {};
  for (const row of (data ?? []) as Array<{ key: string; value: string }>) out[row.key] = row.value;
  return out;
});

export const adminSetSiteConfig = createServerFn({ method: "POST" })
  .inputValidator(z.object({
    key: z.enum(["patch_notes", "auto_patch_notes", "patch_version"]),
    value: z.string().max(200_000),
  }).parse)
  .handler(async ({ data }) => {
    requireAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("site_config")
      .upsert({ key: data.key, value: data.value, updated_at: new Date().toISOString() });
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

