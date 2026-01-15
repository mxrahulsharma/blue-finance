import sanitizeHtml from "sanitize-html";
import { pool } from "../config/db.js";
import { AppError } from "../utils/AppError.js";

/* =========================
   POST A JOB
========================= */
export const createJob = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get company ID for the user
    const companyResult = await pool.query(
      "SELECT id FROM company_profile WHERE owner_id = $1",
      [userId]
    );

    if (!companyResult.rows.length) {
      return next(new AppError("Company profile not found. Please complete company setup first.", 404));
    }

    const companyId = companyResult.rows[0].id;

    const {
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
    } = req.body;

    // Sanitize text fields
    const cleanDescription = sanitizeHtml(job_description || "", {
      allowedTags: [],
      allowedAttributes: {},
    });

    // Parse skills if it's a string
    let skillsArray = [];
    if (required_skills) {
      if (typeof required_skills === 'string') {
        skillsArray = required_skills.split(',').map(s => s.trim()).filter(s => s);
      } else if (Array.isArray(required_skills)) {
        skillsArray = required_skills;
      }
    }

    // Convert and validate salary values
    const salaryMin = salary_min ? parseInt(salary_min) : null;
    const salaryMax = salary_max ? parseInt(salary_max) : null;
    const jobOpenings = openings ? parseInt(openings) : 1;

    // Format deadline - accept both ISO and YYYY-MM-DD formats
    let formattedDeadline = null;
    if (deadline) {
      try {
        const date = new Date(deadline);
        if (!isNaN(date.getTime())) {
          formattedDeadline = date.toISOString().split('T')[0]; // YYYY-MM-DD format
        }
      } catch (e) {
        // Invalid date, will be stored as null
      }
    }

    const result = await pool.query(
      `
      INSERT INTO job_postings
      (company_id, job_title, job_type, experience_level, work_mode, location, 
       salary_min, salary_max, job_description, required_skills, openings, deadline, status, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'Active', CURRENT_TIMESTAMP)
      RETURNING *
      `,
      [
        companyId,
        job_title,
        job_type,
        experience_level,
        work_mode,
        location,
        salaryMin,
        salaryMax,
        cleanDescription,
        JSON.stringify(skillsArray),
        jobOpenings,
        formattedDeadline,
      ]
    );

    res.status(201).json({
      success: true,
      job: result.rows[0],
    });
  } catch (error) {
    console.error('Error creating job:', error);
    
    // Check if it's a database table error
    if (error.message.includes('relation "job_postings" does not exist')) {
      return next(new AppError("Database table not found. Please run the SQL migration to create the job_postings table.", 500));
    }
    
    // Check for other database errors
    if (error.code === '42P01') {
      return next(new AppError("Database table 'job_postings' does not exist. Please run the migration script.", 500));
    }
    
    next(new AppError(error.message, 500));
  }
};

/* =========================
   GET MY JOBS (All jobs for logged in user's company)
========================= */
export const getMyJobs = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get company ID for the user
    const companyResult = await pool.query(
      "SELECT id FROM company_profile WHERE owner_id = $1",
      [userId]
    );

    if (!companyResult.rows.length) {
      return res.json({
        success: true,
        jobs: [],
      });
    }

    const companyId = companyResult.rows[0].id;

    const result = await pool.query(
      `
      SELECT 
        j.*,
        COUNT(DISTINCT a.id) as application_count
      FROM job_postings j
      LEFT JOIN applications a ON j.id = a.job_posting_id
      WHERE j.company_id = $1
      GROUP BY j.id
      ORDER BY j.created_at DESC
      `,
      [companyId]
    );

    // Parse skills JSON
    const jobs = result.rows.map(job => ({
      ...job,
      required_skills: job.required_skills ? JSON.parse(job.required_skills) : [],
      application_count: parseInt(job.application_count) || 0,
    }));

    res.json({
      success: true,
      jobs,
    });
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};

/* =========================
   GET JOB BY ID
========================= */
export const getJobById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const jobId = req.params.id;

    // Get company ID for the user
    const companyResult = await pool.query(
      "SELECT id FROM company_profile WHERE owner_id = $1",
      [userId]
    );

    if (!companyResult.rows.length) {
      return next(new AppError("Company profile not found", 404));
    }

    const companyId = companyResult.rows[0].id;

    const result = await pool.query(
      "SELECT * FROM job_postings WHERE id = $1 AND company_id = $2",
      [jobId, companyId]
    );

    if (!result.rows.length) {
      return next(new AppError("Job not found", 404));
    }

    const job = result.rows[0];
    job.required_skills = job.required_skills ? JSON.parse(job.required_skills) : [];

    res.json({
      success: true,
      job,
    });
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};

/* =========================
   UPDATE JOB
========================= */
export const updateJob = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const jobId = req.params.id;

    // Get company ID for the user
    const companyResult = await pool.query(
      "SELECT id FROM company_profile WHERE owner_id = $1",
      [userId]
    );

    if (!companyResult.rows.length) {
      return next(new AppError("Company profile not found", 404));
    }

    const companyId = companyResult.rows[0].id;

    // Verify job belongs to user's company
    const jobCheck = await pool.query(
      "SELECT id FROM job_postings WHERE id = $1 AND company_id = $2",
      [jobId, companyId]
    );

    if (!jobCheck.rows.length) {
      return next(new AppError("Job not found", 404));
    }

    const fieldMapping = {
      job_title: "job_title",
      job_type: "job_type",
      experience_level: "experience_level",
      work_mode: "work_mode",
      location: "location",
      salary_min: "salary_min",
      salary_max: "salary_max",
      job_description: "job_description",
      required_skills: "required_skills",
      openings: "openings",
      deadline: "deadline",
      status: "status",
    };

    const updates = [];
    const values = [];

    Object.keys(fieldMapping).forEach((field) => {
      if (req.body[field] !== undefined) {
        let value = req.body[field];
        
        // Sanitize description
        if (field === 'job_description') {
          value = sanitizeHtml(value || "", {
            allowedTags: [],
            allowedAttributes: {},
          });
        }
        
        // Handle skills array
        if (field === 'required_skills') {
          if (typeof value === 'string') {
            const skillsArray = value.split(',').map(s => s.trim()).filter(s => s);
            value = JSON.stringify(skillsArray);
          } else if (Array.isArray(value)) {
            value = JSON.stringify(value);
          }
        }

        values.push(value);
        updates.push(`${fieldMapping[field]} = $${values.length}`);
      }
    });

    if (!updates.length) {
      return next(new AppError("No valid fields to update", 400));
    }

    const query = `
      UPDATE job_postings
      SET ${updates.join(", ")}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${values.length + 1} AND company_id = $${values.length + 2}
      RETURNING *
    `;

    const result = await pool.query(query, [...values, jobId, companyId]);

    const job = result.rows[0];
    job.required_skills = job.required_skills ? JSON.parse(job.required_skills) : [];

    res.json({
      success: true,
      job,
    });
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};

/* =========================
   DELETE JOB
========================= */
export const deleteJob = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const jobId = req.params.id;

    // Get company ID for the user
    const companyResult = await pool.query(
      "SELECT id FROM company_profile WHERE owner_id = $1",
      [userId]
    );

    if (!companyResult.rows.length) {
      return next(new AppError("Company profile not found", 404));
    }

    const companyId = companyResult.rows[0].id;

    const result = await pool.query(
      "DELETE FROM job_postings WHERE id = $1 AND company_id = $2 RETURNING id",
      [jobId, companyId]
    );

    if (!result.rows.length) {
      return next(new AppError("Job not found", 404));
    }

    res.json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};

/* =========================
   GET JOB STATS
========================= */
export const getJobStats = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get company ID for the user
    const companyResult = await pool.query(
      "SELECT id FROM company_profile WHERE owner_id = $1",
      [userId]
    );

    if (!companyResult.rows.length) {
      return res.json({
        success: true,
        stats: {
          total_jobs: 0,
          active_jobs: 0,
          total_applications: 0,
        },
      });
    }

    const companyId = companyResult.rows[0].id;

    const statsResult = await pool.query(
      `
      SELECT 
        COUNT(*) as total_jobs,
        COUNT(CASE WHEN status = 'Active' THEN 1 END) as active_jobs,
        COALESCE(SUM(application_count), 0) as total_applications
      FROM (
        SELECT 
          j.id,
          j.status,
          COUNT(DISTINCT a.id) as application_count
        FROM job_postings j
        LEFT JOIN applications a ON j.id = a.job_posting_id
        WHERE j.company_id = $1
        GROUP BY j.id, j.status
      ) job_stats
      `,
      [companyId]
    );

    const stats = statsResult.rows[0];

    res.json({
      success: true,
      stats: {
        total_jobs: parseInt(stats.total_jobs) || 0,
        active_jobs: parseInt(stats.active_jobs) || 0,
        total_applications: parseInt(stats.total_applications) || 0,
      },
    });
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};
