-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- User profiles (supplement Supabase auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'athlete', 'admin')),
  school TEXT,
  onboarding JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Mood check-ins
CREATE TABLE mood_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  mood INTEGER NOT NULL CHECK (mood >= 1 AND mood <= 5),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Journal entries
CREATE TABLE journal_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  category TEXT NOT NULL,
  prompt TEXT,
  content TEXT NOT NULL,
  closer TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Community story submissions
CREATE TABLE story_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  situation TEXT NOT NULL,
  story TEXT NOT NULL,
  helped TEXT NOT NULL,
  advice TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tool usage tracking
CREATE TABLE tool_usage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  tool TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_mood_entries_user_date ON mood_entries(user_id, date DESC);
CREATE INDEX idx_journal_entries_user ON journal_entries(user_id, created_at DESC);
CREATE INDEX idx_story_submissions_status ON story_submissions(status, created_at DESC);
CREATE INDEX idx_tool_usage_user ON tool_usage(user_id, created_at DESC);
CREATE INDEX idx_profiles_school ON profiles(school);

-- Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE mood_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tool_usage ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Mood entries policies
CREATE POLICY "Users can view own moods" ON mood_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own moods" ON mood_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own moods" ON mood_entries FOR UPDATE USING (auth.uid() = user_id);

-- Journal entries policies
CREATE POLICY "Users can view own journals" ON journal_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own journals" ON journal_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own journals" ON journal_entries FOR DELETE USING (auth.uid() = user_id);

-- Story submissions policies
CREATE POLICY "Users can view approved stories" ON story_submissions FOR SELECT USING (status = 'approved');
CREATE POLICY "Users can insert own stories" ON story_submissions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Tool usage policies
CREATE POLICY "Users can view own tool usage" ON tool_usage FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own tool usage" ON tool_usage FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
