CREATE TABLE public.demo_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  full_name text NOT NULL CHECK (char_length(full_name) BETWEEN 1 AND 120),
  email text NOT NULL CHECK (char_length(email) BETWEEN 3 AND 255),
  job_title text NOT NULL CHECK (char_length(job_title) BETWEEN 1 AND 120),
  school_name text NOT NULL CHECK (char_length(school_name) BETWEEN 1 AND 160),
  school_location text NOT NULL CHECK (char_length(school_location) BETWEEN 1 AND 160),
  enrollment text NOT NULL CHECK (char_length(enrollment) <= 40),
  current_software text[] NOT NULL DEFAULT '{}',
  other_software text CHECK (other_software IS NULL OR char_length(other_software) <= 200),
  interests text[] NOT NULL CHECK (cardinality(interests) BETWEEN 1 AND 10),
  package_preference text CHECK (package_preference IS NULL OR char_length(package_preference) <= 40),
  notes text CHECK (notes IS NULL OR char_length(notes) <= 2000)
);
GRANT INSERT ON public.demo_requests TO anon, authenticated;
GRANT ALL ON public.demo_requests TO service_role;
ALTER TABLE public.demo_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit a demo request" ON public.demo_requests FOR INSERT TO anon, authenticated WITH CHECK (true);
