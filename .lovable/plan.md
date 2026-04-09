## Plan

### 1. Supabase Integration
- Install `@supabase/supabase-js`
- Create Supabase client config (user will provide URL + anon key as VITE_ env vars)
- Update AuthContext to use Supabase Auth with roles stored in a `user_roles` table

### 2. Database Schema (SQL migrations for user to run)
- `profiles` table (base: id, full_name, email, avatar_url, created_at)
- `student_profiles` table (student-specific: roll_number, department, semester, batch, guardian_name, etc.)
- `faculty_profiles` table (faculty-specific: employee_id, department, designation, specialization, etc.)
- `user_roles` table (user_id, role enum: student/faculty/admin)
- `fee_structures` table (category, amount in INR, due_date, etc.)
- `student_fees` table (student_id, fee_id, paid_amount, payment_date, status)
- `queries` table (student_id, assigned_faculty_id, category, title, description, status, etc.)
- `announcements` table (posted_by, title, content, target_audience, etc.)
- RLS policies for all tables

### 3. Admin System
- Add `admin` to UserRole type
- Create `/admin-login` route with separate login page
- Admin Dashboard with:
  - User management (view/create/edit students & faculty)
  - Fee management (set fee structures, view payments)
  - Query oversight (view all queries, assign/escalate)
  - Announcement management

### 4. Currency Change
- Update FinancePage and all fee displays from `$` to `₹`
- Update mock data amounts to realistic INR values

### 5. Auth Flow Updates
- Student/Faculty login uses Supabase Auth
- Admin login on separate route
- Role-based routing and sidebar