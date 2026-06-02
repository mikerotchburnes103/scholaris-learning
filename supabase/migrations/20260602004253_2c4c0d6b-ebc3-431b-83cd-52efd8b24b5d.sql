
CREATE TABLE public.game_stats (
  url TEXT PRIMARY KEY,
  plays BIGINT NOT NULL DEFAULT 0,
  likes BIGINT NOT NULL DEFAULT 0,
  dislikes BIGINT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.game_stats TO anon, authenticated;
GRANT ALL ON public.game_stats TO service_role;

ALTER TABLE public.game_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read game stats"
  ON public.game_stats FOR SELECT
  TO anon, authenticated
  USING (true);

-- Safe increment RPCs (SECURITY DEFINER so anon can use them without write grants)
CREATE OR REPLACE FUNCTION public.increment_play(p_url TEXT)
RETURNS public.game_stats
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE row public.game_stats;
BEGIN
  INSERT INTO public.game_stats (url, plays) VALUES (p_url, 1)
  ON CONFLICT (url) DO UPDATE SET plays = public.game_stats.plays + 1, updated_at = now()
  RETURNING * INTO row;
  RETURN row;
END $$;

CREATE OR REPLACE FUNCTION public.vote_game(p_url TEXT, p_delta_like INT, p_delta_dislike INT)
RETURNS public.game_stats
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE row public.game_stats;
BEGIN
  IF p_delta_like NOT IN (-1, 0, 1) OR p_delta_dislike NOT IN (-1, 0, 1) THEN
    RAISE EXCEPTION 'invalid delta';
  END IF;
  INSERT INTO public.game_stats (url, likes, dislikes)
  VALUES (p_url, GREATEST(p_delta_like, 0), GREATEST(p_delta_dislike, 0))
  ON CONFLICT (url) DO UPDATE SET
    likes = GREATEST(public.game_stats.likes + p_delta_like, 0),
    dislikes = GREATEST(public.game_stats.dislikes + p_delta_dislike, 0),
    updated_at = now()
  RETURNING * INTO row;
  RETURN row;
END $$;

GRANT EXECUTE ON FUNCTION public.increment_play(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.vote_game(TEXT, INT, INT) TO anon, authenticated;

ALTER PUBLICATION supabase_realtime ADD TABLE public.game_stats;
ALTER TABLE public.game_stats REPLICA IDENTITY FULL;
