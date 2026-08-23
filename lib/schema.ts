import { pool } from './db'

// Database schema for TalentOS Platform
export async function createDatabaseSchema() {
  // Enable UUID extension
  await pool.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto"')

  // Users table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS public.users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK (role IN ('Applicant', 'Recruiter')),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `)

  // Applicant profiles table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS public.applicant_profiles (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      headline TEXT,
      summary TEXT,
      open_to_work BOOLEAN DEFAULT true,
      links JSONB DEFAULT '[]'::jsonb,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE(user_id)
    )
  `)

  // Recruiter profiles table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS public.recruiter_profiles (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      company TEXT NOT NULL,
      position TEXT,
      contact_info JSONB DEFAULT '{}'::jsonb,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE(user_id)
    )
  `)

  // Skills table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS public.skills (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      applicant_profile_id UUID NOT NULL REFERENCES public.applicant_profiles(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      proficiency TEXT CHECK (proficiency IN ('Beginner', 'Intermediate', 'Advanced', 'Expert')),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `)

  // Jobs table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS public.jobs (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      recruiter_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      company TEXT NOT NULL,
      description TEXT NOT NULL,
      requirements TEXT,
      responsibilities TEXT,
      qualifications TEXT,
      location TEXT NOT NULL DEFAULT 'Remote',
      salary_min INTEGER,
      salary_max INTEGER,
      status TEXT NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft', 'Published', 'Closed')),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `)

  // Applications table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS public.applications (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
      applicant_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
      status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Reviewed', 'Shortlisted', 'Rejected', 'Accepted')),
      cover_letter TEXT,
      submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE(job_id, applicant_id)
    )
  `)

  // Documents table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS public.documents (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      applicant_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      file_url TEXT NOT NULL,
      file_type TEXT NOT NULL,
      file_size INTEGER NOT NULL,
      document_type TEXT CHECK (document_type IN ('CV', 'Certificate', 'Other')),
      uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `)

  // Interviews table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS public.interviews (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
      job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
      applicant_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
      recruiter_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
      scheduled_date TIMESTAMPTZ NOT NULL,
      duration INTEGER DEFAULT 60,
      status TEXT NOT NULL DEFAULT 'Scheduled' CHECK (status IN ('Scheduled', 'Completed', 'Cancelled', 'Rescheduled')),
      notes TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `)

  // Notifications table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS public.notifications (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      type TEXT CHECK (type IN ('Application', 'Interview', 'Job', 'System')),
      is_read BOOLEAN DEFAULT false,
      related_id UUID,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `)

  // Refresh tokens table for JWT authentication
  await pool.query(`
    CREATE TABLE IF NOT EXISTS public.refresh_tokens (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
      token TEXT NOT NULL UNIQUE,
      expires_at TIMESTAMPTZ NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      revoked_at TIMESTAMPTZ
    )
  `)

  // Create indexes for better performance
  await pool.query('CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email)')
  await pool.query('CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role)')
  await pool.query('CREATE INDEX IF NOT EXISTS idx_jobs_recruiter_id ON public.jobs(recruiter_id)')
  await pool.query('CREATE INDEX IF NOT EXISTS idx_jobs_status ON public.jobs(status)')
  await pool.query('CREATE INDEX IF NOT EXISTS idx_applications_job_id ON public.applications(job_id)')
  await pool.query('CREATE INDEX IF NOT EXISTS idx_applications_applicant_id ON public.applications(applicant_id)')
  await pool.query('CREATE INDEX IF NOT EXISTS idx_applications_status ON public.applications(status)')
  await pool.query('CREATE INDEX IF NOT EXISTS idx_interviews_applicant_id ON public.interviews(applicant_id)')
  await pool.query('CREATE INDEX IF NOT EXISTS idx_interviews_recruiter_id ON public.interviews(recruiter_id)')
  await pool.query('CREATE INDEX IF NOT EXISTS idx_interviews_scheduled_date ON public.interviews(scheduled_date)')
  await pool.query('CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id)')
  await pool.query('CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read)')
  await pool.query('CREATE INDEX IF NOT EXISTS idx_documents_applicant_id ON public.documents(applicant_id)')
  await pool.query('CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token ON public.refresh_tokens(token)')
  await pool.query('CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON public.refresh_tokens(user_id)')

  console.log('Database schema created successfully')
}