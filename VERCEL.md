# Vercel deployment

This project ships with a Cloudflare Workers build by default (Lovable hosts it for you).
To deploy the same codebase to **Vercel**:

1. **Push the repo to GitHub** (Lovable → GitHub button).
2. **Import the repo in Vercel**.
3. Vercel will detect `vercel.json`, which sets `NITRO_PRESET=vercel`.
   That tells the Nitro build adapter to emit a Vercel-compatible serverless function instead of a Cloudflare Worker.
4. **Set the same environment variables** you have in Lovable Cloud:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
   - `VITE_SUPABASE_PROJECT_ID`
   - `SUPABASE_URL`
   - `SUPABASE_PUBLISHABLE_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `SUPABASE_DB_URL` (optional)

   `VITE_*` vars are read at build time. The others are runtime server secrets.
5. Click **Deploy**.

The same files build for both targets — switching is just the `NITRO_PRESET` env var.
