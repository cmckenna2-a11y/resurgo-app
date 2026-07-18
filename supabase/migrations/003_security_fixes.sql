-- Security fixes: close both privilege-escalation paths to the admin role.
--
-- Path 1: signUp() metadata — handle_new_user copied raw_user_meta_data->>'role'
-- unvalidated, so anyone could sign up with { role: 'admin' }.
--
-- Path 2: the "Users can update own profile" RLS policy has no column
-- restrictions, so any logged-in user could UPDATE profiles SET role='admin'
-- with the public anon key.
--
-- Run this in the Supabase SQL editor after 002_profile_trigger.sql.

-- ── Path 1: whitelist the role coming from signup metadata ──
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    -- Only student/athlete may come from client-supplied metadata.
    -- Admins are created manually (SQL editor / service role).
    CASE
      WHEN NEW.raw_user_meta_data->>'role' IN ('student', 'athlete')
        THEN NEW.raw_user_meta_data->>'role'
      ELSE 'student'
    END
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- ── Path 2: block self-promotion to admin at the trigger level ──
-- The app legitimately toggles student <-> athlete from the client, so we
-- can't just freeze the column. Instead, reject any UPDATE that changes role
-- TO 'admin' unless it comes from the service role or the SQL editor.
CREATE OR REPLACE FUNCTION public.prevent_role_escalation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.role IS DISTINCT FROM OLD.role AND NEW.role = 'admin' THEN
    -- auth.role() is the JWT role of the caller: 'authenticated' for app
    -- users, 'service_role' for the backend. Direct SQL-editor sessions run
    -- as postgres/supabase_admin and have no JWT.
    IF COALESCE(auth.role(), 'none') <> 'service_role'
       AND current_user NOT IN ('postgres', 'supabase_admin') THEN
      RAISE EXCEPTION 'Changing role to admin is not allowed';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_prevent_role_escalation ON public.profiles;

CREATE TRIGGER profiles_prevent_role_escalation
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_role_escalation();
