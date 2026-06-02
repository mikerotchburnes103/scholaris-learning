import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type GameStat = { url: string; plays: number; likes: number; dislikes: number };
export type GameStatsMap = Record<string, GameStat>;

const VOTE_KEY = "arcade.votes";
export type VoteState = Record<string, "like" | "dislike" | undefined>;

export const readVotes = (): VoteState => {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(window.localStorage.getItem(VOTE_KEY) || "{}"); } catch { return {}; }
};
export const writeVotes = (v: VoteState) => {
  try { window.localStorage.setItem(VOTE_KEY, JSON.stringify(v)); } catch { /* ignore */ }
};

/**
 * Returns a live map of {url -> {plays,likes,dislikes}} backed by Supabase
 * realtime. Any user's vote or play tick streams into every open client.
 */
export function useGameStats() {
  const [stats, setStats] = useState<GameStatsMap>({});

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await (supabase as any).from("game_stats").select("*");
      if (cancelled || !data) return;
      const next: GameStatsMap = {};
      for (const row of data as GameStat[]) next[row.url] = row;
      setStats(next);
    })();

    const channel = supabase
      .channel("game_stats_live")
      .on(
        // @ts-expect-error - realtime payload types
        "postgres_changes",
        { event: "*", schema: "public", table: "game_stats" },
        (payload: { new: GameStat | null; old: GameStat | null; eventType: string }) => {
          setStats((prev) => {
            const next = { ...prev };
            if (payload.eventType === "DELETE" && payload.old) {
              delete next[payload.old.url];
            } else if (payload.new) {
              next[payload.new.url] = payload.new;
            }
            return next;
          });
        },
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, []);

  return stats;
}

export async function bumpPlay(url: string) {
  try { await (supabase as any).rpc("increment_play", { p_url: url }); } catch (e) { console.error(e); }
}

/**
 * Atomic toggle: if user already likes, undo; if disliked, swap to like; etc.
 * Updates localStorage votes and calls the vote_game RPC with deltas.
 */
export async function castVote(url: string, target: "like" | "dislike"): Promise<VoteState> {
  const votes = readVotes();
  const current = votes[url];
  let dLike = 0;
  let dDislike = 0;

  if (current === target) {
    // Toggle off
    if (target === "like") dLike = -1; else dDislike = -1;
    delete votes[url];
  } else {
    if (current === "like") dLike = -1;
    if (current === "dislike") dDislike = -1;
    if (target === "like") dLike += 1; else dDislike += 1;
    votes[url] = target;
  }
  writeVotes(votes);
  try {
    await (supabase as any).rpc("vote_game", { p_url: url, p_delta_like: dLike, p_delta_dislike: dDislike });
  } catch (e) { console.error(e); }
  return votes;
}
