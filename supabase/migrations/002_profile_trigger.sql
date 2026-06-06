-- Fix: create profile rows automatically via a trigger on auth.users.
--
-- Why: the client-side INSERT after signUp() fires before the user is
-- authenticated (email confirmation is pending), so auth.uid() is NULL
-- and the RLS policy WITH CHECK (auth.uid() = id) rejects the insert.
--
-- This trigger runs as SECURITY DEFINER (DB owner), bypassing RLS, and
-- pulls name/role from the user metadata passed during signUp().
--
-- Run this in the Supabase SQL editor after 001_initial.sql.

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
    COALESCE(NEW.raw_user_meta_data->>'role', 'student')
  )
  ON CONFLICT (id) DO NOTHING;  -- safe to re-run; skip if profile already exists
  RETURN NEW;
END;
$$;

-- Drop existing trigger if re-running this migration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
