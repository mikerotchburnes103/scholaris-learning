// Server-only — .server.ts is blocked from the client bundle.
// Values come from env vars; fallbacks keep dev working but should be overridden in production.

const splitEnv = (v: string | undefined) =>
  (v ?? "").split(",").map((s) => s.trim()).filter(Boolean);

export const ARCADE_PASSWORDS =
  splitEnv(process.env.ARCADE_PASSWORDS).length > 0
    ? splitEnv(process.env.ARCADE_PASSWORDS)
    : ["nofemboys", "femboy", "8008"];
export const ARCADE_COOKIE_NAME = "arcade_auth";
export const ARCADE_COOKIE_TOKEN =
  process.env.ARCADE_COOKIE_TOKEN || "v1.7Qf3kP9LmZ2xR4tN8wYbHdCsVgJqW6uA";

export const ADMIN_PASSWORDS =
  splitEnv(process.env.ADMIN_PASSWORDS).length > 0
    ? splitEnv(process.env.ADMIN_PASSWORDS)
    : ["green_apples"];
export const ADMIN_COOKIE_NAME = "arcade_admin";
export const ADMIN_COOKIE_TOKEN =
  process.env.ADMIN_COOKIE_TOKEN || "v1.Adm9XqL2nP7tR4kZ8wYbHdCsVgJqW6uM3F";
