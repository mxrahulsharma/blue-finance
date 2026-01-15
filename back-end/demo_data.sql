-- ============================================
-- DEMO DATA FOR GENIUS MARKET
-- ============================================
-- This script inserts sample companies and job postings
-- Run this after setting up your database to see visually appealing data

-- First, ensure you have at least one user in the users table
-- If not, you'll need to register through the app first

-- ============================================
-- SAMPLE COMPANIES
-- ============================================

-- Note: Replace owner_id values with actual user IDs from your users table
-- You can find user IDs by running: SELECT id, email, firebase_uid FROM users;

-- Company 1: TechCorp Solutions
INSERT INTO company_profile (
  company_name,
  industry_type,
  organizations_type,
  team_size,
  about_company,
  company_website,
  company_logo_url,
  company_banner_url,
  company_vision,
  map_location_url,
  headquarter_phone_no,
  careers_link,
  social_links,
  owner_id,
  created_at
) VALUES (
  'TechCorp Solutions',
  'Technology',
  'Private Limited',
  '500-1000',
  'TechCorp Solutions is a leading technology company specializing in enterprise software solutions, cloud computing, and AI-driven applications. With over 15 years of experience, we help businesses transform their digital infrastructure and achieve operational excellence.',
  'https://www.techcorp-solutions.com',
  'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200',
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200',
  'To empower businesses worldwide through innovative technology solutions and create a more connected, efficient world.',
  'https://maps.google.com/?q=1600+Amphitheatre+Parkway,+Mountain+View,+CA',
  '+1-555-0100',
  'https://www.techcorp-solutions.com/careers',
  '{"linkedin": "https://linkedin.com/company/techcorp", "twitter": "https://twitter.com/techcorp", "facebook": "https://facebook.com/techcorp"}',
  1, -- Replace with actual user ID
  CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;

-- Company 2: GreenEnergy Innovations
INSERT INTO company_profile (
  company_name,
  industry_type,
  organizations_type,
  team_size,
  about_company,
  company_website,
  company_logo_url,
  company_banner_url,
  company_vision,
  map_location_url,
  headquarter_phone_no,
  careers_link,
  social_links,
  owner_id,
  created_at
) VALUES (
  'GreenEnergy Innovations',
  'Renewable Energy',
  'Public Limited',
  '200-500',
  'GreenEnergy Innovations is at the forefront of renewable energy solutions, developing cutting-edge solar and wind technologies. Our mission is to accelerate the transition to clean energy and create a sustainable future for generations to come.',
  'https://www.greenenergy-innovations.com',
  'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=200',
  'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=1200',
  'To lead the global transition to renewable energy and create a carbon-neutral world by 2030.',
  'https://maps.google.com/?q=123+Solar+Street,+San+Francisco,+CA',
  '+1-555-0200',
  'https://www.greenenergy-innovations.com/careers',
  '{"linkedin": "https://linkedin.com/company/greenenergy", "twitter": "https://twitter.com/greenenergy", "instagram": "https://instagram.com/greenenergy"}',
  1, -- Replace with actual user ID
  CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;

-- Company 3: HealthCare Plus
INSERT INTO company_profile (
  company_name,
  industry_type,
  organizations_type,
  team_size,
  about_company,
  company_website,
  company_logo_url,
  company_banner_url,
  company_vision,
  map_location_url,
  headquarter_phone_no,
  careers_link,
  social_links,
  owner_id,
  created_at
) VALUES (
  'HealthCare Plus',
  'Healthcare',
  'Private Limited',
  '1000+',
  'HealthCare Plus is a comprehensive healthcare services provider offering medical consultations, telemedicine, and preventive care programs. We leverage technology to make healthcare accessible and affordable for everyone.',
  'https://www.healthcare-plus.com',
  'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=200',
  'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200',
  'To provide accessible, affordable, and high-quality healthcare services to communities worldwide.',
  'https://maps.google.com/?q=789+Medical+Center+Drive,+Boston,+MA',
  '+1-555-0300',
  'https://www.healthcare-plus.com/careers',
  '{"linkedin": "https://linkedin.com/company/healthcareplus", "twitter": "https://twitter.com/healthcareplus", "facebook": "https://facebook.com/healthcareplus"}',
  1, -- Replace with actual user ID
  CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;

-- Company 4: EduTech Academy
INSERT INTO company_profile (
  company_name,
  industry_type,
  organizations_type,
  team_size,
  about_company,
  company_website,
  company_logo_url,
  company_banner_url,
  company_vision,
  map_location_url,
  headquarter_phone_no,
  careers_link,
  social_links,
  owner_id,
  created_at
) VALUES (
  'EduTech Academy',
  'Education',
  'Private Limited',
  '100-200',
  'EduTech Academy revolutionizes online learning through interactive courses, AI-powered tutoring, and personalized learning paths. We make quality education accessible to millions of learners worldwide.',
  'https://www.edutech-academy.com',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=200',
  'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=1200',
  'To democratize education and empower learners to achieve their full potential through innovative technology.',
  'https://maps.google.com/?q=456+Education+Avenue,+Seattle,+WA',
  '+1-555-0400',
  'https://www.edutech-academy.com/careers',
  '{"linkedin": "https://linkedin.com/company/edutech", "twitter": "https://twitter.com/edutech", "youtube": "https://youtube.com/edutech"}',
  1, -- Replace with actual user ID
  CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;

-- Company 5: FinSecure Banking
INSERT INTO company_profile (
  company_name,
  industry_type,
  organizations_type,
  team_size,
  about_company,
  company_website,
  company_logo_url,
  company_banner_url,
  company_vision,
  map_location_url,
  headquarter_phone_no,
  careers_link,
  social_links,
  owner_id,
  created_at
) VALUES (
  'FinSecure Banking',
  'Finance',
  'Public Limited',
  '5000+',
  'FinSecure Banking is a trusted financial institution providing digital banking solutions, investment services, and fintech innovations. We serve millions of customers with secure, convenient, and cutting-edge financial products.',
  'https://www.finsecure-banking.com',
  'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=200',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200',
  'To revolutionize the banking industry through digital innovation and provide financial freedom to all.',
  'https://maps.google.com/?q=321+Wall+Street,+New+York,+NY',
  '+1-555-0500',
  'https://www.finsecure-banking.com/careers',
  '{"linkedin": "https://linkedin.com/company/finsecure", "twitter": "https://twitter.com/finsecure", "facebook": "https://facebook.com/finsecure"}',
  1, -- Replace with actual user ID
  CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;

-- ============================================
-- SAMPLE JOB POSTINGS
-- ============================================

-- Note: Replace company_id values with actual company IDs from company_profile table
-- You can find company IDs by running: SELECT id, company_name FROM company_profile;

-- Job 1: Senior Software Engineer at TechCorp
INSERT INTO job_postings (
  company_id,
  job_title,
  job_type,
  experience_level,
  work_mode,
  location,
  salary_min,
  salary_max,
  job_description,
  required_skills,
  openings,
  deadline,
  status,
  created_at
) VALUES (
  (SELECT id FROM company_profile WHERE company_name = 'TechCorp Solutions' LIMIT 1),
  'Senior Software Engineer',
  'Full-time',
  'Senior Level',
  'Hybrid',
  'San Francisco, CA',
  120000,
  180000,
  'We are seeking a talented Senior Software Engineer to join our dynamic team. You will be responsible for designing and developing scalable web applications, collaborating with cross-functional teams, and mentoring junior developers. The ideal candidate should have strong problem-solving skills and a passion for cutting-edge technology.',
  '["JavaScript", "React", "Node.js", "Python", "AWS", "Docker", "PostgreSQL"]',
  3,
  CURRENT_DATE + INTERVAL '30 days',
  'Active',
  CURRENT_TIMESTAMP
);

-- Job 2: Data Scientist at TechCorp
INSERT INTO job_postings (
  company_id,
  job_title,
  job_type,
  experience_level,
  work_mode,
  location,
  salary_min,
  salary_max,
  job_description,
  required_skills,
  openings,
  deadline,
  status,
  created_at
) VALUES (
  (SELECT id FROM company_profile WHERE company_name = 'TechCorp Solutions' LIMIT 1),
  'Data Scientist',
  'Full-time',
  'Mid Level',
  'Remote',
  'Remote',
  100000,
  150000,
  'Join our data science team to build machine learning models and derive insights from large datasets. You will work on challenging problems in NLP, computer vision, and predictive analytics. We offer a collaborative environment with opportunities for growth.',
  '["Python", "Machine Learning", "TensorFlow", "SQL", "Statistics", "Data Analysis"]',
  2,
  CURRENT_DATE + INTERVAL '45 days',
  'Active',
  CURRENT_TIMESTAMP
);

-- Job 3: Renewable Energy Engineer at GreenEnergy
INSERT INTO job_postings (
  company_id,
  job_title,
  job_type,
  experience_level,
  work_mode,
  location,
  salary_min,
  salary_max,
  job_description,
  required_skills,
  openings,
  deadline,
  status,
  created_at
) VALUES (
  (SELECT id FROM company_profile WHERE company_name = 'GreenEnergy Innovations' LIMIT 1),
  'Renewable Energy Engineer',
  'Full-time',
  'Mid Level',
  'On-site',
  'San Francisco, CA',
  90000,
  130000,
  'We are looking for a Renewable Energy Engineer to design and implement solar and wind energy systems. You will conduct site assessments, create technical specifications, and oversee project implementation. Experience with renewable energy technologies is essential.',
  '["Solar Energy", "Wind Energy", "CAD", "Project Management", "Electrical Engineering"]',
  5,
  CURRENT_DATE + INTERVAL '60 days',
  'Active',
  CURRENT_TIMESTAMP
);

-- Job 4: Medical Doctor at HealthCare Plus
INSERT INTO job_postings (
  company_id,
  job_title,
  job_type,
  experience_level,
  work_mode,
  location,
  salary_min,
  salary_max,
  job_description,
  required_skills,
  openings,
  deadline,
  status,
  created_at
) VALUES (
  (SELECT id FROM company_profile WHERE company_name = 'HealthCare Plus' LIMIT 1),
  'Medical Doctor',
  'Full-time',
  'Senior Level',
  'Hybrid',
  'Boston, MA',
  180000,
  250000,
  'Join our team of experienced medical professionals providing quality healthcare services. You will conduct patient consultations, diagnose and treat medical conditions, and collaborate with healthcare teams. Board certification and state license required.',
  '["Medicine", "Patient Care", "Medical Diagnosis", "Telemedicine", "EMR Systems"]',
  8,
  CURRENT_DATE + INTERVAL '30 days',
  'Active',
  CURRENT_TIMESTAMP
);

-- Job 5: Curriculum Developer at EduTech
INSERT INTO job_postings (
  company_id,
  job_title,
  job_type,
  experience_level,
  work_mode,
  location,
  salary_min,
  salary_max,
  job_description,
  required_skills,
  openings,
  deadline,
  status,
  created_at
) VALUES (
  (SELECT id FROM company_profile WHERE company_name = 'EduTech Academy' LIMIT 1),
  'Curriculum Developer',
  'Full-time',
  'Mid Level',
  'Remote',
  'Remote',
  70000,
  95000,
  'Create engaging and effective online learning content for our educational platform. You will design courses, develop interactive materials, and work with subject matter experts. Strong writing skills and educational background required.',
  '["Curriculum Design", "Instructional Design", "E-Learning", "Content Writing", "Educational Technology"]',
  4,
  CURRENT_DATE + INTERVAL '40 days',
  'Active',
  CURRENT_TIMESTAMP
);

-- Job 6: Financial Analyst at FinSecure
INSERT INTO job_postings (
  company_id,
  job_title,
  job_type,
  experience_level,
  work_mode,
  location,
  salary_min,
  salary_max,
  job_description,
  required_skills,
  openings,
  deadline,
  status,
  created_at
) VALUES (
  (SELECT id FROM company_profile WHERE company_name = 'FinSecure Banking' LIMIT 1),
  'Financial Analyst',
  'Full-time',
  'Entry Level',
  'On-site',
  'New York, NY',
  65000,
  85000,
  'Kickstart your career in finance with our dynamic team. You will analyze financial data, prepare reports, and support investment decision-making. We provide comprehensive training and mentorship for recent graduates.',
  '["Financial Analysis", "Excel", "SQL", "Financial Modeling", "Analytical Skills"]',
  10,
  CURRENT_DATE + INTERVAL '35 days',
  'Active',
  CURRENT_TIMESTAMP
);

-- Job 7: DevOps Engineer at TechCorp
INSERT INTO job_postings (
  company_id,
  job_title,
  job_type,
  experience_level,
  work_mode,
  location,
  salary_min,
  salary_max,
  job_description,
  required_skills,
  openings,
  deadline,
  status,
  created_at
) VALUES (
  (SELECT id FROM company_profile WHERE company_name = 'TechCorp Solutions' LIMIT 1),
  'DevOps Engineer',
  'Full-time',
  'Mid Level',
  'Remote',
  'Remote',
  110000,
  160000,
  'Manage and optimize our cloud infrastructure, CI/CD pipelines, and deployment processes. You will work closely with development teams to ensure reliable and scalable systems. Strong experience with cloud platforms and automation tools required.',
  '["AWS", "Docker", "Kubernetes", "Jenkins", "Terraform", "Linux", "CI/CD"]',
  2,
  CURRENT_DATE + INTERVAL '50 days',
  'Active',
  CURRENT_TIMESTAMP
);

-- Job 8: UX Designer at EduTech
INSERT INTO job_postings (
  company_id,
  job_title,
  job_type,
  experience_level,
  work_mode,
  location,
  salary_min,
  salary_max,
  job_description,
  required_skills,
  openings,
  deadline,
  status,
  created_at
) VALUES (
  (SELECT id FROM company_profile WHERE company_name = 'EduTech Academy' LIMIT 1),
  'UX Designer',
  'Full-time',
  'Mid Level',
  'Hybrid',
  'Seattle, WA',
  80000,
  110000,
  'Design intuitive and engaging user experiences for our learning platform. You will conduct user research, create wireframes and prototypes, and collaborate with product and engineering teams. Portfolio showcasing educational products is a plus.',
  '["User Research", "Figma", "Wireframing", "Prototyping", "UI/UX Design", "Usability Testing"]',
  3,
  CURRENT_DATE + INTERVAL '45 days',
  'Active',
  CURRENT_TIMESTAMP
);

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check inserted companies
-- SELECT id, company_name, industry_type, team_size FROM company_profile;

-- Check inserted jobs
-- SELECT j.id, j.job_title, c.company_name, j.location, j.salary_min, j.salary_max 
-- FROM job_postings j 
-- JOIN company_profile c ON j.company_id = c.id 
-- ORDER BY j.created_at DESC;
