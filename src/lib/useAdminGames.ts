import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type AdminGame = {
  id: string;
  name: string;
  img: string;
  html: string;
  genre: string;
  device: "mobile+pc" | "pc";
  added_at: string;
};

// Public read of admin-published games. RLS allows SELECT for everyone.
export function useAdminGames() {
  const [rows, setRows] = useState<AdminGame[]>([]);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await (supabase as any)
        .from("admin_games")
        .select("id,name,img,html,genre,device,added_at")
        .order("added_at", { ascending: false });
      if (!cancelled && data) setRows(data as AdminGame[]);
    })();
    const ch = supabase.channel("admin_games_live").on(
      // @ts-expect-error realtime types
      "postgres_changes",
      { event: "*", schema: "public", table: "admin_games" },
      () => {
        (supabase as any).from("admin_games").select("id,name,img,html,genre,device,added_at").order("added_at", { ascending: false }).then(({ data }: any) => {
          if (data) setRows(data as AdminGame[]);
        });
      },
    ).subscribe();
    return () => { cancelled = true; supabase.removeChannel(ch); };
  }, []);
  return rows;
}
