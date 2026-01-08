-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.awards (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  profile_id uuid,
  title character varying NOT NULL,
  issuer character varying,
  date date,
  content jsonb,
  created_at timestamp with time zone DEFAULT now(),
  locale character varying DEFAULT 'ko'::character varying,
  description text,
  slug character varying,
  preview_image text,
  CONSTRAINT awards_pkey PRIMARY KEY (id),
  CONSTRAINT awards_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.certifications (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  profile_id uuid,
  name character varying NOT NULL,
  issuer character varying,
  issue_date date,
  expiry_date date,
  created_at timestamp with time zone DEFAULT now(),
  locale character varying DEFAULT 'ko'::character varying,
  content jsonb,
  description text,
  slug character varying,
  preview_image text,
  CONSTRAINT certifications_pkey PRIMARY KEY (id),
  CONSTRAINT certifications_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.clubs (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  profile_id uuid,
  name character varying NOT NULL,
  role character varying,
  start_date date,
  end_date date,
  content jsonb,
  created_at timestamp with time zone DEFAULT now(),
  locale character varying DEFAULT 'ko'::character varying,
  description text,
  slug character varying,
  preview_image text,
  CONSTRAINT clubs_pkey PRIMARY KEY (id),
  CONSTRAINT clubs_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.education (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  profile_id uuid,
  institution character varying NOT NULL,
  degree character varying,
  field character varying,
  start_date date,
  end_date date,
  content jsonb,
  location character varying,
  created_at timestamp with time zone DEFAULT now(),
  locale character varying DEFAULT 'ko'::character varying,
  description text,
  slug character varying,
  preview_image text,
  type text,
  CONSTRAINT education_pkey PRIMARY KEY (id),
  CONSTRAINT education_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.experiences (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  profile_id uuid,
  title character varying NOT NULL,
  type character varying,
  date date,
  content jsonb,
  images ARRAY,
  created_at timestamp with time zone DEFAULT now(),
  locale character varying DEFAULT 'ko'::character varying,
  organization character varying,
  preview_image text,
  description text,
  slug character varying,
  CONSTRAINT experiences_pkey PRIMARY KEY (id),
  CONSTRAINT experiences_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.hobbies (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  profile_id uuid,
  name character varying NOT NULL,
  content jsonb,
  created_at timestamp with time zone DEFAULT now(),
  locale character varying DEFAULT 'ko'::character varying,
  description text,
  slug character varying,
  preview_image text,
  CONSTRAINT hobbies_pkey PRIMARY KEY (id),
  CONSTRAINT hobbies_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.languages (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  profile_id uuid,
  language character varying NOT NULL,
  proficiency_level character varying NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  nation character varying,
  CONSTRAINT languages_pkey PRIMARY KEY (id),
  CONSTRAINT languages_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.post_tags (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  post_id uuid,
  tag character varying NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT post_tags_pkey PRIMARY KEY (id),
  CONSTRAINT post_tags_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id)
);
CREATE TABLE public.posts (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  title character varying NOT NULL,
  slug character varying NOT NULL,
  content jsonb,
  excerpt text,
  cover_image text,
  published boolean DEFAULT false,
  published_at timestamp with time zone,
  locale character varying DEFAULT 'ko'::character varying,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT posts_pkey PRIMARY KEY (id)
);
CREATE TABLE public.profiles (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name character varying NOT NULL,
  birth_date date,
  gender character varying,
  nationality character varying,
  email character varying,
  phone character varying,
  military_service text,
  profile_image_url text,
  bio text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  markdown_content jsonb,
  CONSTRAINT profiles_pkey PRIMARY KEY (id)
);
CREATE TABLE public.projects (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  title character varying NOT NULL,
  slug character varying NOT NULL,
  description text,
  technologies ARRAY,
  demo_url text,
  github_url text,
  start_date date,
  end_date date,
  featured boolean DEFAULT false,
  display_order integer DEFAULT 0,
  locale character varying DEFAULT 'ko'::character varying,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  contents jsonb,
  status character varying DEFAULT 'in_progress'::character varying,
  cover_image text,
  CONSTRAINT projects_pkey PRIMARY KEY (id)
);
CREATE TABLE public.skills (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  title character varying NOT NULL,
  slug character varying NOT NULL,
  description text,
  contents jsonb,
  technologies ARRAY,
  icon text,
  level character varying,
  category character varying,
  display_order integer DEFAULT 0,
  locale character varying DEFAULT 'ko'::character varying,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  cover_image text,
  CONSTRAINT skills_pkey PRIMARY KEY (id)
);
CREATE TABLE public.social_links (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  profile_id uuid,
  platform character varying NOT NULL,
  url text NOT NULL,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT social_links_pkey PRIMARY KEY (id),
  CONSTRAINT social_links_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.work_experience (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  profile_id uuid,
  company character varying NOT NULL,
  position character varying NOT NULL,
  employment_type character varying,
  start_date date,
  end_date date,
  content jsonb,
  location character varying,
  created_at timestamp with time zone DEFAULT now(),
  locale character varying DEFAULT 'ko'::character varying,
  description text,
  slug character varying,
  preview_image text,
  type text,
  CONSTRAINT work_experience_pkey PRIMARY KEY (id),
  CONSTRAINT work_experience_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profiles(id)
);