CREATE OR REPLACE FUNCTION public.increment_play(p_url text)
 RETURNS game_stats
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE row public.game_stats;
BEGIN
  IF p_url IS NULL OR length(p_url) > 100 OR p_url !~ '^/games/[a-z0-9-]+\.html$' THEN
    RAISE EXCEPTION 'invalid game url';
  END IF;
  INSERT INTO public.game_stats (url, plays) VALUES (p_url, 1)
  ON CONFLICT (url) DO UPDATE SET plays = public.game_stats.plays + 1, updated_at = now()
  RETURNING * INTO row;
  RETURN row;
END $function$;

CREATE OR REPLACE FUNCTION public.vote_game(p_url text, p_delta_like integer, p_delta_dislike integer)
 RETURNS game_stats
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE row public.game_stats;
BEGIN
  IF p_url IS NULL OR length(p_url) > 100 OR p_url !~ '^/games/[a-z0-9-]+\.html$' THEN
    RAISE EXCEPTION 'invalid game url';
  END IF;
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
END $function$;