import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader, setResponseHeaders } from "@tanstack/react-start/server";
import { z } from "zod";
import {
  ARCADE_COOKIE_NAME,
  ARCADE_COOKIE_TOKEN,
  ARCADE_PASSWORDS,
} from "./arcade.server";

// Password verification runs server-side. The password list never ships
// to the browser; on success an httpOnly cookie is set that the /games
// route loader checks before allowing the page to render.
export const verifyArcadePassword = createServerFn({ method: "POST" })
  .inputValidator(z.object({ password: z.string().min(1).max(200) }))
  .handler(async ({ data }) => {
    if (!ARCADE_PASSWORDS.includes(data.password)) {
      return { ok: false as const };
    }
    setResponseHeaders(
      new Headers({
        "Set-Cookie": `${ARCADE_COOKIE_NAME}=${ARCADE_COOKIE_TOKEN}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000`,
      }),
    );
    return { ok: true as const };
  });

export const checkArcadeAuth = createServerFn({ method: "GET" }).handler(async () => {
  const cookie = getRequestHeader("cookie") || "";
  const parts = cookie.split(/;\s*/);
  const match = parts.find((c) => c.startsWith(`${ARCADE_COOKIE_NAME}=`));
  const value = match ? match.slice(ARCADE_COOKIE_NAME.length + 1) : "";
  return { authorized: value === ARCADE_COOKIE_TOKEN };
});
