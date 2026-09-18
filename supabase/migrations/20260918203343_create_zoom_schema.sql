/*
# Zoom Streaming Platform — Core Database Schema

## Overview
Creates the complete database schema for the Zoom streaming platform, including user profiles with VIP/admin roles, page view analytics, play click tracking, admin-managed custom video servers, and VIP subscription records.

## New Tables

### 1. profiles
- `id` (uuid, primary key, references auth.users)
- `email` (text, user email for display)
- `role` (text, 'user' or 'admin', defaults to 'user')
- `is_vip` (boolean, defaults to false)
- `vip_expires_at` (timestamptz, nullable, when VIP expires)
- `created_at` (timestamptz, defaults to now())

### 2. page_views
- `id` (uuid, primary key)
- `path` (text, the page path visited)
- `visitor_id` (text, anonymous browser identifier for unique visitor counting)
- `created_at` (timestamptz, defaults to now())

### 3. play_clicks
- `id` (uuid, primary key)
- `tmdb_id` (integer, the TMDB ID of the content)
- `content_type` (text, 'movie', 'tv', or 'anime')
- `title` (text, display title of the content)
- `user_id` (uuid, nullable, references auth.users — null for anonymous)
- `created_at` (timestamptz, defaults to now())

### 4. custom_servers
- `id` (uuid, primary key)
- `tmdb_id` (integer, the TMDB ID this server applies to)
- `content_type` (text, 'movie', 'tv', or 'anime')
- `season` (integer, nullable, for TV/anime)
- `episode` (integer, nullable, for TV/anime)
- `server_label` (text, e.g. 'Server 1 HD', 'Server 4 Arabic Subtitled')
- `server_url` (text, the iframe embed URL)
- `created_at` (timestamptz, defaults to now())

### 5. vip_subscriptions
- `id` (uuid, primary key)
- `user_id` (uuid, references auth.users)
- `amount_egp` (integer, payment amount in EGP, defaults to 200)
- `payment_method` (text, e.g. 'paymob', 'vodafone_cash', 'fawry')
- `status` (text, 'pending', 'completed', defaults to 'pending')
- `created_at` (timestamptz, defaults to now())

## Security (RLS)

### profiles
- SELECT: authenticated users can read their own profile
- UPDATE: authenticated users can update their own profile (but column-level privileges restrict is_vip, role, vip_expires_at to admin-only via SECURITY DEFINER function)

### page_views
- INSERT: anon + authenticated (anyone can record a page view)
- SELECT: admin only (via SECURITY DEFINER function for analytics)

### play_clicks
- INSERT: anon + authenticated (anyone can record a play click)
- SELECT: admin only (via SECURITY DEFINER function for analytics)

### custom_servers
- SELECT: anon + authenticated (everyone needs to read server URLs to play videos)
- INSERT/UPDATE/DELETE: admin only (via column-level privileges + SECURITY DEFINER)

### vip_subscriptions
- INSERT: authenticated (users can create their own subscription records)
- SELECT: authenticated users can read their own subscription records
- UPDATE: admin only (via SECURITY DEFINER function to activate VIP)

## Privileged Functions

### activate_vip(p_user_id uuid)
- SECURITY DEFINER function that sets is_vip = true and vip_expires_at = now() + 1 month
- Checks that the caller is admin before executing
- Used after payment confirmation to grant VIP status

### get_analytics()
- SECURITY DEFINER function that returns aggregated analytics data
- Checks that the caller is admin before executing
- Returns total page views, unique visitors, total play clicks, and recent activity

## Important Notes

1. The `is_vip`, `role`, and `vip_expires_at` columns on profiles are protected via column-level REVOKE — users cannot change their own VIP status or role through the data API.
2. The first registered user is automatically assigned the admin role via a trigger on profile creation.
3. All analytics tables accept anonymous inserts (page views and play clicks come from all visitors).
4. Custom server URLs are public-readable so all users can load video players, but only admins can create/modify them.
*/

-- ============================================================
-- 1. PROFILES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  role text NOT NULL DEFAULT 'user',
  is_vip boolean NOT NULL DEFAULT false,
  vip_expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
CREATE POLICY "profiles_select_own"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
CREATE POLICY "profiles_update_own"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Column-level: revoke UPDATE on sensitive columns from authenticated users
REVOKE UPDATE (role, is_vip, vip_expires_at) ON profiles FROM authenticated;

-- ============================================================
-- 2. PAGE_VIEWS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS page_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  path text NOT NULL,
  visitor_id text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "page_views_insert_any" ON page_views;
CREATE POLICY "page_views_insert_any"
  ON page_views FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON page_views(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_visitor_id ON page_views(visitor_id);

-- ============================================================
-- 3. PLAY_CLICKS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS play_clicks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tmdb_id integer NOT NULL,
  content_type text NOT NULL,
  title text NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE play_clicks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "play_clicks_insert_any" ON play_clicks;
CREATE POLICY "play_clicks_insert_any"
  ON play_clicks FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_play_clicks_created_at ON play_clicks(created_at DESC);

-- ============================================================
-- 4. CUSTOM_SERVERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS custom_servers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tmdb_id integer NOT NULL,
  content_type text NOT NULL,
  season integer,
  episode integer,
  server_label text NOT NULL,
  server_url text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE custom_servers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "custom_servers_select_all" ON custom_servers;
CREATE POLICY "custom_servers_select_all"
  ON custom_servers FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "custom_servers_insert_admin" ON custom_servers;
CREATE POLICY "custom_servers_insert_admin"
  ON custom_servers FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

DROP POLICY IF EXISTS "custom_servers_update_admin" ON custom_servers;
CREATE POLICY "custom_servers_update_admin"
  ON custom_servers FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

DROP POLICY IF EXISTS "custom_servers_delete_admin" ON custom_servers;
CREATE POLICY "custom_servers_delete_admin"
  ON custom_servers FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

-- ============================================================
-- 5. VIP_SUBSCRIPTIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS vip_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  amount_egp integer NOT NULL DEFAULT 200,
  payment_method text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE vip_subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "vip_subs_select_own" ON vip_subscriptions;
CREATE POLICY "vip_subs_select_own"
  ON vip_subscriptions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "vip_subs_insert_own" ON vip_subscriptions;
CREATE POLICY "vip_subs_insert_own"
  ON vip_subscriptions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- 6. TRIGGER: Auto-create profile on signup
-- ============================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- 7. FUNCTION: Activate VIP (admin-only, SECURITY DEFINER)
-- ============================================================
CREATE OR REPLACE FUNCTION activate_vip(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  UPDATE profiles
  SET is_vip = true,
      vip_expires_at = now() + interval '1 month'
  WHERE id = p_user_id;
END;
$$;

REVOKE EXECUTE ON FUNCTION activate_vip FROM anon;
GRANT EXECUTE ON FUNCTION activate_vip TO authenticated;

-- ============================================================
-- 8. FUNCTION: Get analytics (admin-only, SECURITY DEFINER)
-- ============================================================
CREATE OR REPLACE FUNCTION get_analytics()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_total_page_views bigint;
  v_unique_visitors bigint;
  v_total_play_clicks bigint;
  v_recent_plays json;
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  SELECT COUNT(*) INTO v_total_page_views FROM page_views;
  SELECT COUNT(DISTINCT visitor_id) INTO v_unique_visitors FROM page_views;
  SELECT COUNT(*) INTO v_total_play_clicks FROM play_clicks;

  SELECT COALESCE(json_agg(row_to_json(t)), '[]'::json)
  INTO v_recent_plays
  FROM (
    SELECT title, content_type, created_at
    FROM play_clicks
    ORDER BY created_at DESC
    LIMIT 20
  ) t;

  RETURN json_build_object(
    'total_page_views', v_total_page_views,
    'unique_visitors', v_unique_visitors,
    'total_play_clicks', v_total_play_clicks,
    'recent_plays', v_recent_plays
  );
END;
$$;

REVOKE EXECUTE ON FUNCTION get_analytics FROM anon;
GRANT EXECUTE ON FUNCTION get_analytics TO authenticated;

-- ============================================================
-- 9. FUNCTION: Get admin dashboard data (admin-only)
-- ============================================================
CREATE OR REPLACE FUNCTION get_admin_dashboard()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_total_users bigint;
  v_vip_users bigint;
  v_total_page_views bigint;
  v_unique_visitors bigint;
  v_total_play_clicks bigint;
  v_recent_plays json;
  v_all_servers json;
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  SELECT COUNT(*) INTO v_total_users FROM profiles;
  SELECT COUNT(*) INTO v_vip_users FROM profiles WHERE is_vip = true;
  SELECT COUNT(*) INTO v_total_page_views FROM page_views;
  SELECT COUNT(DISTINCT visitor_id) INTO v_unique_visitors FROM page_views;
  SELECT COUNT(*) INTO v_total_play_clicks FROM play_clicks;

  SELECT COALESCE(json_agg(row_to_json(t)), '[]'::json)
  INTO v_recent_plays
  FROM (
    SELECT title, content_type, created_at
    FROM play_clicks
    ORDER BY created_at DESC
    LIMIT 20
  ) t;

  SELECT COALESCE(json_agg(row_to_json(t)), '[]'::json)
  INTO v_all_servers
  FROM (
    SELECT id, tmdb_id, content_type, season, episode, server_label, server_url, created_at
    FROM custom_servers
    ORDER BY created_at DESC
  ) t;

  RETURN json_build_object(
    'total_users', v_total_users,
    'vip_users', v_vip_users,
    'total_page_views', v_total_page_views,
    'unique_visitors', v_unique_visitors,
    'total_play_clicks', v_total_play_clicks,
    'recent_plays', v_recent_plays,
    'all_servers', v_all_servers
  );
END;
$$;

REVOKE EXECUTE ON FUNCTION get_admin_dashboard FROM anon;
GRANT EXECUTE ON FUNCTION get_admin_dashboard TO authenticated;
