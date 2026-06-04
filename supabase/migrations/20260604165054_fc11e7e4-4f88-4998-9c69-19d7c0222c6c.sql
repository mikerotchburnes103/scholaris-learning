CREATE TABLE public.admin_games (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  img text NOT NULL DEFAULT '/game-soundboard.svg',
  html text NOT NULL,
  genre text NOT NULL DEFAULT 'Custom',
  device text NOT NULL DEFAULT 'mobile+pc',
  added_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.admin_games TO anon, authenticated;
GRANT ALL ON public.admin_games TO service_role;

ALTER TABLE public.admin_games ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read admin games"
  ON public.admin_games FOR SELECT
  TO anon, authenticated
  USING (true);