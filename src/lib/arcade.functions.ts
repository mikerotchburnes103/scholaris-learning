import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader, setResponseHeaders } from "@tanstack/react-start/server";
import { z } from "zod";
import {
  ARCADE_COOKIE_NAME,
  ARCADE_COOKIE_TOKEN,
  ARCADE_PASSWORDS,
  ADMIN_COOKIE_NAME,
  ADMIN_COOKIE_TOKEN,
  ADMIN_PASSWORDS,
} from "./arcade.server";

const getCookie = (name: string) => {
  const cookie = getRequestHeader("cookie") || "";
  const parts = cookie.split(/;\s*/);
  const match = parts.find((c) => c.startsWith(`${name}=`));
  return match ? match.slice(name.length + 1) : "";
};

// ---------- Arcade gate (existing) ----------
export const verifyArcadePassword = createServerFn({ method: "POST" })
  .inputValidator(z.object({ password: z.string().min(1).max(200) }))
  .handler(async ({ data }) => {
    if (!ARCADE_PASSWORDS.includes(data.password)) return { ok: false as const };
    setResponseHeaders(
      new Headers({
        "Set-Cookie": `${ARCADE_COOKIE_NAME}=${ARCADE_COOKIE_TOKEN}; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=2592000`,
      }),
    );
    return { ok: true as const };
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
    setResponseHeaders(
      new Headers({
        "Set-Cookie": `${ADMIN_COOKIE_NAME}=${ADMIN_COOKIE_TOKEN}; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=2592000`,
      }),
    );
    return { ok: true as const };
  });

export const checkAdminAuth = createServerFn({ method: "GET" }).handler(async () => {
  return { authorized: getCookie(ADMIN_COOKIE_NAME) === ADMIN_COOKIE_TOKEN };
});

// ---------- Admin game CRUD ----------
const requireAdmin = () => {
  if (getCookie(ADMIN_COOKIE_NAME) !== ADMIN_COOKIE_TOKEN) {
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
