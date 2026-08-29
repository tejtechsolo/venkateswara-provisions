# Supabase setup

1. Create a free Supabase project.
2. Run `schema.sql` in the SQL Editor.
3. Copy the project URL and anon key into `.env.local` using `.env.example`.
4. Keep service-role keys server-side only.
5. Add authentication policies before exposing multi-user data.

The app is designed so Supabase is optional during the initial UI stage and becomes the persistent backend once credentials are supplied.
