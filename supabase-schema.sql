-- ============================================
-- CampusFlow Database Schema
-- Run this in your Supabase SQL Editor
-- ============================================

-- 1. Create role enum
CREATE TYPE public.app_role AS ENUM ('student', 'faculty', 'admin');

-- 2. Profiles table (shared base for all users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. User roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 4. Student profiles table
CREATE TABLE public.student_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  roll_number TEXT,
  department TEXT,
  semester INTEGER,
  batch TEXT,
  section TEXT,
  guardian_name TEXT,
  guardian_phone TEXT,
  address TEXT,
  date_of_birth DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;

-- 5. Faculty profiles table
CREATE TABLE public.faculty_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  employee_id TEXT,
  department TEXT,
  designation TEXT,
  specialization TEXT,
  qualification TEXT,
  joining_date DATE,
  office_room TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.faculty_profiles ENABLE ROW LEVEL SECURITY;

-- 6. Fee structures table
CREATE TABLE public.fee_structures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  amount NUMERIC NOT NULL DEFAULT 0,
  due_date TEXT,
  academic_year TEXT DEFAULT '2024-25',
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.fee_structures ENABLE ROW LEVEL SECURITY;

-- 7. Student fees / payments table
CREATE TABLE public.student_fees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  fee_structure_id UUID REFERENCES public.fee_structures(id) ON DELETE CASCADE NOT NULL,
  paid_amount NUMERIC DEFAULT 0,
  payment_date TIMESTAMPTZ,
  payment_method TEXT,
  transaction_id TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'partial', 'paid')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.student_fees ENABLE ROW LEVEL SECURITY;

-- 8. Queries table
CREATE TABLE public.queries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  assigned_faculty_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'resolved')),
  attachment_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.queries ENABLE ROW LEVEL SECURITY;

-- 9. Query responses table
CREATE TABLE public.query_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query_id UUID REFERENCES public.queries(id) ON DELETE CASCADE NOT NULL,
  responder_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  message TEXT NOT NULL,
  attachment_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.query_responses ENABLE ROW LEVEL SECURITY;

-- 10. Announcements table
CREATE TABLE public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  posted_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'General',
  target_audience TEXT DEFAULT 'all' CHECK (target_audience IN ('all', 'students', 'faculty')),
  is_pinned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- ============================================
-- Security Definer Function for role checks
-- ============================================
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- ============================================
-- RLS Policies
-- ============================================

-- Profiles: users can read all profiles, update own
CREATE POLICY "Anyone can read profiles" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid());
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (id = auth.uid());

-- User roles: users can read own, admins read all
CREATE POLICY "Users can read own role" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can insert own role" ON public.user_roles FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- Student profiles: own read/write, admin read all
CREATE POLICY "Students read own profile" ON public.student_profiles FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Students update own profile" ON public.student_profiles FOR UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Students insert own profile" ON public.student_profiles FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- Faculty profiles: own read/write, admin read all
CREATE POLICY "Faculty read own profile" ON public.faculty_profiles FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Faculty update own profile" ON public.faculty_profiles FOR UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Faculty insert own profile" ON public.faculty_profiles FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- Fee structures: everyone can read, admin can manage
CREATE POLICY "Anyone can read fees" ON public.fee_structures FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins manage fees" ON public.fee_structures FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Student fees: students read own, admin reads all
CREATE POLICY "Students read own fees" ON public.student_fees FOR SELECT TO authenticated USING (student_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage student fees" ON public.student_fees FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Queries: students read own, faculty read assigned, admin reads all
CREATE POLICY "Students read own queries" ON public.queries FOR SELECT TO authenticated USING (student_id = auth.uid() OR assigned_faculty_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Students create queries" ON public.queries FOR INSERT TO authenticated WITH CHECK (student_id = auth.uid());
CREATE POLICY "Faculty/Admin update queries" ON public.queries FOR UPDATE TO authenticated USING (assigned_faculty_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- Query responses: linked to query access
CREATE POLICY "Read responses for accessible queries" ON public.query_responses FOR SELECT TO authenticated USING (
  EXISTS (
    SELECT 1 FROM public.queries q WHERE q.id = query_id
    AND (q.student_id = auth.uid() OR q.assigned_faculty_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
  )
);
CREATE POLICY "Faculty/Admin create responses" ON public.query_responses FOR INSERT TO authenticated WITH CHECK (responder_id = auth.uid());

-- Announcements: all read, faculty/admin create
CREATE POLICY "Anyone can read announcements" ON public.announcements FOR SELECT TO authenticated USING (true);
CREATE POLICY "Faculty/Admin post announcements" ON public.announcements FOR INSERT TO authenticated WITH CHECK (
  public.has_role(auth.uid(), 'faculty') OR public.has_role(auth.uid(), 'admin')
);

-- ============================================
-- Trigger: auto-create profile on signup
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.email
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- Sample Data: Fee Structures (in INR)
-- ============================================
INSERT INTO public.fee_structures (category, amount, due_date) VALUES
  ('Tuition Fees', 125000, 'Mar 31'),
  ('Security Deposit', 15000, 'At Admission'),
  ('Transport Fees', 24000, 'Jan 15'),
  ('Hostel Fees', 48000, 'Apr 15'),
  ('Examination Fees', 8500, 'Apr 30'),
  ('Library Fees', 3000, 'At Admission'),
  ('Lab Fees', 12000, 'Feb 28'),
  ('Miscellaneous', 5000, 'At Admission');
