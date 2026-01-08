-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- TABLES
-- ============================================================================

-- 1. Profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  birth_date DATE,
  gender VARCHAR(50),
  nationality VARCHAR(100),
  email VARCHAR(255),
  phone VARCHAR(50),
  military_service TEXT,
  profile_image_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Social links table
CREATE TABLE social_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  platform VARCHAR(100) NOT NULL,
  url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Languages table
CREATE TABLE languages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  language VARCHAR(100) NOT NULL,
  proficiency_level VARCHAR(50) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Hobbies table
CREATE TABLE hobbies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  hobby VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Education table
CREATE TABLE education (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  institution VARCHAR(255) NOT NULL,
  degree VARCHAR(255),
  field VARCHAR(255),
  start_date DATE,
  end_date DATE,
  description TEXT,
  location VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Clubs table
CREATE TABLE clubs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255),
  start_date DATE,
  end_date DATE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Work experience table
CREATE TABLE work_experience (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  company VARCHAR(255) NOT NULL,
  position VARCHAR(255) NOT NULL,
  employment_type VARCHAR(100),
  start_date DATE,
  end_date DATE,
  description TEXT,
  location VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Experiences table
CREATE TABLE experiences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  type VARCHAR(100),
  date DATE,
  description TEXT,
  images TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Certifications table
CREATE TABLE certifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  issuer VARCHAR(255),
  issue_date DATE,
  expiry_date DATE,
  credential_id VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Awards table
CREATE TABLE awards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  issuer VARCHAR(255),
  date DATE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  description TEXT,
  technologies TEXT[],
  images TEXT[],
  demo_url TEXT,
  github_url TEXT,
  start_date DATE,
  end_date DATE,
  featured BOOLEAN DEFAULT FALSE,
  display_order INTEGER DEFAULT 0,
  locale VARCHAR(10) DEFAULT 'ko',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(slug, locale)
);

-- 12. Posts table
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  content JSONB,
  excerpt TEXT,
  cover_image TEXT,
  published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  locale VARCHAR(10) DEFAULT 'ko',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(slug, locale)
);

-- 13. Post tags table
CREATE TABLE post_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  tag VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX idx_social_links_profile ON social_links(profile_id);
CREATE INDEX idx_languages_profile ON languages(profile_id);
CREATE INDEX idx_hobbies_profile ON hobbies(profile_id);
CREATE INDEX idx_education_profile ON education(profile_id);
CREATE INDEX idx_clubs_profile ON clubs(profile_id);
CREATE INDEX idx_work_experience_profile ON work_experience(profile_id);
CREATE INDEX idx_experiences_profile ON experiences(profile_id);
CREATE INDEX idx_certifications_profile ON certifications(profile_id);
CREATE INDEX idx_awards_profile ON awards(profile_id);
CREATE INDEX idx_projects_slug ON projects(slug);
CREATE INDEX idx_projects_locale ON projects(locale);
CREATE INDEX idx_posts_slug_locale ON posts(slug, locale);
CREATE INDEX idx_posts_published ON posts(published, published_at);
CREATE INDEX idx_post_tags_post ON post_tags(post_id);
CREATE INDEX idx_post_tags_tag ON post_tags(tag);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE hobbies ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE awards ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_tags ENABLE ROW LEVEL SECURITY;

-- Public read access for all tables
CREATE POLICY "Public read access" ON profiles FOR SELECT USING (true);
CREATE POLICY "Public read access" ON social_links FOR SELECT USING (true);
CREATE POLICY "Public read access" ON languages FOR SELECT USING (true);
CREATE POLICY "Public read access" ON hobbies FOR SELECT USING (true);
CREATE POLICY "Public read access" ON education FOR SELECT USING (true);
CREATE POLICY "Public read access" ON clubs FOR SELECT USING (true);
CREATE POLICY "Public read access" ON work_experience FOR SELECT USING (true);
CREATE POLICY "Public read access" ON experiences FOR SELECT USING (true);
CREATE POLICY "Public read access" ON certifications FOR SELECT USING (true);
CREATE POLICY "Public read access" ON awards FOR SELECT USING (true);
CREATE POLICY "Public read access" ON projects FOR SELECT USING (true);
CREATE POLICY "Public read published posts" ON posts FOR SELECT USING (published = true);
CREATE POLICY "Public read access" ON post_tags FOR SELECT USING (true);

-- Admin write access (authenticated users only)
CREATE POLICY "Admin insert access" ON profiles FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin update access" ON profiles FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admin delete access" ON profiles FOR DELETE TO authenticated USING (true);

CREATE POLICY "Admin insert access" ON social_links FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin update access" ON social_links FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admin delete access" ON social_links FOR DELETE TO authenticated USING (true);

CREATE POLICY "Admin insert access" ON languages FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin update access" ON languages FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admin delete access" ON languages FOR DELETE TO authenticated USING (true);

CREATE POLICY "Admin insert access" ON hobbies FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin update access" ON hobbies FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admin delete access" ON hobbies FOR DELETE TO authenticated USING (true);

CREATE POLICY "Admin insert access" ON education FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin update access" ON education FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admin delete access" ON education FOR DELETE TO authenticated USING (true);

CREATE POLICY "Admin insert access" ON clubs FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin update access" ON clubs FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admin delete access" ON clubs FOR DELETE TO authenticated USING (true);

CREATE POLICY "Admin insert access" ON work_experience FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin update access" ON work_experience FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admin delete access" ON work_experience FOR DELETE TO authenticated USING (true);

CREATE POLICY "Admin insert access" ON experiences FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin update access" ON experiences FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admin delete access" ON experiences FOR DELETE TO authenticated USING (true);

CREATE POLICY "Admin insert access" ON certifications FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin update access" ON certifications FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admin delete access" ON certifications FOR DELETE TO authenticated USING (true);

CREATE POLICY "Admin insert access" ON awards FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin update access" ON awards FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admin delete access" ON awards FOR DELETE TO authenticated USING (true);

CREATE POLICY "Admin insert access" ON projects FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin update access" ON projects FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admin delete access" ON projects FOR DELETE TO authenticated USING (true);

CREATE POLICY "Admin insert access" ON posts FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin update access" ON posts FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admin delete access" ON posts FOR DELETE TO authenticated USING (true);
CREATE POLICY "Admin read all posts" ON posts FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admin insert access" ON post_tags FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin update access" ON post_tags FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admin delete access" ON post_tags FOR DELETE TO authenticated USING (true);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- STORAGE BUCKETS (Run these in Supabase Dashboard or via API)
-- ============================================================================

-- Create storage buckets for media files
-- Note: These should be created via Supabase Dashboard or API
-- 
-- Bucket names:
-- - profile-images (public)
-- - project-images (public)
-- - post-images (public)
-- - media (public)
--
-- Storage RLS policies:
-- - Public read access for all buckets
-- - Authenticated write access for all buckets
