REVOKE SELECT ON public.admin_games FROM anon, authenticated;
DROP POLICY IF EXISTS "Anyone can read admin games" ON public.admin_games;