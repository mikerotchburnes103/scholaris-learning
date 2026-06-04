// Server-only — .server.ts is blocked from the client bundle.
export const ARCADE_PASSWORDS = ["nofemboys", "femboy", "8008"];
export const ARCADE_COOKIE_NAME = "arcade_auth";
// Unguessable opaque token; never reaches the browser as JS.
export const ARCADE_COOKIE_TOKEN = "v1.7Qf3kP9LmZ2xR4tN8wYbHdCsVgJqW6uA";

// Admin (you-only) — completely separate from arcade access.
export const ADMIN_PASSWORDS = ["green_apples"];
export const ADMIN_COOKIE_NAME = "arcade_admin";
export const ADMIN_COOKIE_TOKEN = "v1.Adm9XqL2nP7tR4kZ8wYbHdCsVgJqW6uM3F";
