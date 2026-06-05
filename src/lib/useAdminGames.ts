import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { listPublicAdminGames } from "@/lib/arcade.functions";

export type AdminGame = {
  id: string;
  name: string;
  img: string;
  html: string;
  genre: string;
  device: "mobile+pc" | "pc";
  added_at: string;
};

// Cookie-gated fetch of admin-published games. The admin_games table is no longer
// publicly readable via the Supabase API — access goes through a server fn that
// validates the arcade auth cookie. Polled every 30s to pick up new pushes.
export function useAdminGames() {
  const [rows, setRows] = useState<AdminGame[]>([]);
  const list = useServerFn(listPublicAdminGames);
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const data = await list();
        if (!cancelled && data) setRows(data as AdminGame[]);
      } catch {
        /* not authorized or transient — ignore */
      }
    };
    void load();
    const t = setInterval(load, 30_000);
    return () => { cancelled = true; clearInterval(t); };
  }, [list]);
  return rows;
}
