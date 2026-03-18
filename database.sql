-- BCS Platform Database Schema
-- Supabase SQL Editor-এ সম্পূর্ণটা paste করে Run করুন

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL, slug text UNIQUE NOT NULL, icon text,
  description text, order_index int DEFAULT 0,
  is_published bool DEFAULT false, created_at timestamptz DEFAULT now()
);
CREATE TABLE sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id uuid REFERENCES subjects ON DELETE CASCADE,
  name text NOT NULL, slug text NOT NULL,
  order_index int DEFAULT 0, is_published bool DEFAULT false
);
CREATE TABLE subsections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id uuid REFERENCES sections ON DELETE CASCADE,
  name text NOT NULL, slug text NOT NULL,
  order_index int DEFAULT 0, is_published bool DEFAULT false
);
CREATE TABLE topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subsection_id uuid REFERENCES subsections ON DELETE CASCADE,
  name text NOT NULL, slug text NOT NULL, pdf_url text,
  pdf_pages int DEFAULT 1, order_index int DEFAULT 0,
  is_published bool DEFAULT false, meta_title text,
  meta_description text, created_at timestamptz DEFAULT now()
);
CREATE TABLE mcq (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id uuid REFERENCES topics ON DELETE SET NULL,
  subject_id uuid REFERENCES subjects ON DELETE CASCADE,
  question text NOT NULL, option_a text NOT NULL,
  option_b text NOT NULL, option_c text NOT NULL, option_d text NOT NULL,
  correct_option char(1) NOT NULL CHECK (correct_option IN ('a','b','c','d')),
  explanation text, difficulty text CHECK (difficulty IN ('easy','medium','hard')),
  source text, year int, tags text[] DEFAULT '{}',
  status text DEFAULT 'draft' CHECK (status IN ('draft','published','review')),
  created_at timestamptz DEFAULT now()
);
CREATE TABLE exams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL, description text,
  starts_at timestamptz NOT NULL, duration_minutes int NOT NULL,
  total_questions int NOT NULL, marks_correct numeric(4,2) DEFAULT 1,
  marks_wrong numeric(4,2) DEFAULT 0.5, subject_ids uuid[] DEFAULT '{}',
  status text DEFAULT 'scheduled' CHECK (status IN ('scheduled','live','ended','archived')),
  created_at timestamptz DEFAULT now()
);
CREATE TABLE exam_questions (
  exam_id uuid REFERENCES exams ON DELETE CASCADE,
  mcq_id uuid REFERENCES mcq ON DELETE CASCADE,
  order_index int DEFAULT 0, PRIMARY KEY (exam_id, mcq_id)
);
CREATE TABLE exam_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id uuid REFERENCES exams ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  answers jsonb DEFAULT '{}', score numeric(6,2) DEFAULT 0,
  correct_count int DEFAULT 0, wrong_count int DEFAULT 0,
  skipped_count int DEFAULT 0, time_taken_seconds int DEFAULT 0,
  tab_violations int DEFAULT 0,
  submitted_at timestamptz DEFAULT now(), UNIQUE (exam_id, user_id)
);
CREATE TABLE practice_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  topic_id uuid REFERENCES topics ON DELETE SET NULL,
  subject_id uuid REFERENCES subjects ON DELETE SET NULL,
  answers jsonb DEFAULT '{}', score numeric(6,2) DEFAULT 0,
  correct_count int DEFAULT 0, wrong_count int DEFAULT 0,
  skipped_count int DEFAULT 0, time_taken_seconds int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
CREATE TABLE topic_progress (
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  topic_id uuid REFERENCES topics ON DELETE CASCADE,
  is_completed bool DEFAULT false, last_read_at timestamptz,
  PRIMARY KEY (user_id, topic_id)
);
CREATE TABLE saved_mcq (
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  mcq_id uuid REFERENCES mcq ON DELETE CASCADE,
  saved_at timestamptz DEFAULT now(), PRIMARY KEY (user_id, mcq_id)
);
CREATE TABLE user_notes (
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  topic_id uuid REFERENCES topics ON DELETE CASCADE,
  content text DEFAULT '', updated_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, topic_id)
);
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name text, avatar_url text, target_exam text DEFAULT 'BCS',
  is_admin bool DEFAULT false, streak_current int DEFAULT 0,
  streak_best int DEFAULT 0, last_active_date date,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE topic_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_mcq ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE subsections ENABLE ROW LEVEL SECURITY;
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE mcq ENABLE ROW LEVEL SECURITY;
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read subjects" ON subjects FOR SELECT USING (is_published=true);
CREATE POLICY "public read sections" ON sections FOR SELECT USING (is_published=true);
CREATE POLICY "public read subsections" ON subsections FOR SELECT USING (is_published=true);
CREATE POLICY "public read topics" ON topics FOR SELECT USING (is_published=true);
CREATE POLICY "public read mcq" ON mcq FOR SELECT USING (status='published');
CREATE POLICY "public read exams" ON exams FOR SELECT USING (status IN ('live','archived','scheduled'));
CREATE POLICY "public read exam_qs" ON exam_questions FOR SELECT USING (true);
CREATE POLICY "own profile" ON profiles FOR ALL USING (auth.uid()=id);
CREATE POLICY "own progress" ON topic_progress FOR ALL USING (auth.uid()=user_id);
CREATE POLICY "own saved" ON saved_mcq FOR ALL USING (auth.uid()=user_id);
CREATE POLICY "own notes" ON user_notes FOR ALL USING (auth.uid()=user_id);
CREATE POLICY "own attempts" ON exam_attempts FOR ALL USING (auth.uid()=user_id);
CREATE POLICY "own practice" ON practice_sessions FOR ALL USING (auth.uid()=user_id);

CREATE OR REPLACE FUNCTION handle_new_user() RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();