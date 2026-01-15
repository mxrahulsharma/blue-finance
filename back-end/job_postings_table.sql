-- Create job_postings table
CREATE TABLE IF NOT EXISTS job_postings (
  id SERIAL PRIMARY KEY,
  company_id INTEGER NOT NULL REFERENCES company_profile(id) ON DELETE CASCADE,
  job_title VARCHAR(255) NOT NULL,
  job_type VARCHAR(50) NOT NULL,
  experience_level VARCHAR(50) NOT NULL,
  work_mode VARCHAR(50) NOT NULL,
  location VARCHAR(255) NOT NULL,
  salary_min INTEGER,
  salary_max INTEGER,
  job_description TEXT,
  required_skills JSONB,
  openings INTEGER DEFAULT 1,
  deadline DATE,
  status VARCHAR(20) DEFAULT 'Active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_job_postings_company_id ON job_postings(company_id);
CREATE INDEX IF NOT EXISTS idx_job_postings_status ON job_postings(status);
CREATE INDEX IF NOT EXISTS idx_job_postings_created_at ON job_postings(created_at DESC);

-- Optional: Create applications table for future use
CREATE TABLE IF NOT EXISTS applications (
  id SERIAL PRIMARY KEY,
  job_posting_id INTEGER NOT NULL REFERENCES job_postings(id) ON DELETE CASCADE,
  candidate_id INTEGER,
  candidate_name VARCHAR(255),
  candidate_email VARCHAR(255),
  candidate_phone VARCHAR(50),
  resume_url TEXT,
  cover_letter TEXT,
  status VARCHAR(50) DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_applications_job_posting_id ON applications(job_posting_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
