import sanitizeHtml from "sanitize-html";
import { pool } from "../config/db.js";
import { AppError } from "../utils/AppError.js";

/* ======================================================
   HELPERS
====================================================== */
const sanitizeText = (value = "") =>
  sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} });

const normalizeSkills = (skills) => {
  if (!skills) return [];
  if (Array.isArray(skills)) return skills;
  if (typeof skills === "string") {
    return skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
};

const getCompanyIdForUser = async (userId) => {
  const result = await pool.query(
    "SELECT company_id FROM users WHERE id = $1",
    [userId]
  );
  return result.rows[0]?.company_id || null;
};

/* ======================================================
   POST A JOB
====================================================== */
export const createJob = async (req, res, next) => {
  try {
    console.log("DEBUG req.user =>", req.user);
    const userId = req.user.id;
    const companyId = await getCompanyIdForUser(userId);

    if (!companyId) {
      return next(
        new AppError(
          "Company not linked to user. Complete company setup first.",
          403
        )
      );
    }

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

    // Validate required fields
    if (!job_title || !job_type || !experience_level || !work_mode) {
      return next(
        new AppError(
          "Missing required fields: job_title, job_type, experience_level, work_mode",
          400
        )
      );
    }

    const result = await pool.query(
      `
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
        status
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,'Active'
      )
      RETURNING *
      `,
      [
        companyId,
        job_title,
        job_type,
        experience_level,
        work_mode,
        location || null,
        salary_min ? Number(salary_min) : null,
        salary_max ? Number(salary_max) : null,
        sanitizeText(job_description),
        normalizeSkills(required_skills),
        openings ? Number(openings) : 1,
        deadline || null,
      ]
    );

    res.status(201).json({
      success: true,
      job: {
        ...result.rows[0],
        required_skills: result.rows[0].required_skills || [],
      },
    });
  } catch (err) {
    console.error("Error creating job:", err);
    next(new AppError("Failed to create job", 500));
  }
};

/* ======================================================
   GET MY JOBS
====================================================== */
export const getMyJobs = async (req, res, next) => {
  try {
    const companyId = await getCompanyIdForUser(req.user.id);

    if (!companyId) {
      return res.json({ success: true, jobs: [] });
    }

    const result = await pool.query(
      `
      SELECT 
        j.*,
        COUNT(a.id) AS application_count
      FROM job_postings j
      LEFT JOIN applications a ON a.job_posting_id = j.id
      WHERE j.company_id = $1
      GROUP BY j.id
      ORDER BY j.created_at DESC
      `,
      [companyId]
    );

    const jobs = result.rows.map((job) => ({
      ...job,
      required_skills: job.required_skills || [],
      application_count: Number(job.application_count) || 0,
    }));

    res.json({ success: true, jobs });
  } catch (err) {
    console.error("Error fetching jobs:", err);
    next(new AppError("Failed to load jobs", 500));
  }
};

/* ======================================================
   GET JOB BY ID
====================================================== */
export const getJobById = async (req, res, next) => {
  try {
    const companyId = await getCompanyIdForUser(req.user.id);
    const jobId = req.params.id;

    if (!companyId) {
      return next(
        new AppError(
          "Company not linked to user. Complete company setup first.",
          403
        )
      );
    }

    const result = await pool.query(
      `
      SELECT *
      FROM job_postings
      WHERE id = $1 AND company_id = $2
      `,
      [jobId, companyId]
    );

    if (!result.rows.length) {
      return next(new AppError("Job not found", 404));
    }

    res.json({
      success: true,
      job: {
        ...result.rows[0],
        required_skills: result.rows[0].required_skills || [],
      },
    });
  } catch (err) {
    console.error("Error fetching job:", err);
    next(new AppError("Failed to fetch job", 500));
  }
};

/* ======================================================
   UPDATE JOB
====================================================== */
export const updateJob = async (req, res, next) => {
  try {
    const companyId = await getCompanyIdForUser(req.user.id);
    const jobId = req.params.id;

    if (!companyId) {
      return next(
        new AppError(
          "Company not linked to user. Complete company setup first.",
          403
        )
      );
    }

    const fields = [];
    const values = [];

    const map = {
      job_title: req.body.job_title,
      job_type: req.body.job_type,
      experience_level: req.body.experience_level,
      work_mode: req.body.work_mode,
      location: req.body.location,
      salary_min: req.body.salary_min ? Number(req.body.salary_min) : undefined,
      salary_max: req.body.salary_max ? Number(req.body.salary_max) : undefined,
      job_description: req.body.job_description ? sanitizeText(req.body.job_description) : undefined,
      required_skills: req.body.required_skills ? normalizeSkills(req.body.required_skills) : undefined,
      openings: req.body.openings ? Number(req.body.openings) : undefined,
      deadline: req.body.deadline,
      status: req.body.status,
    };

    Object.entries(map).forEach(([key, value]) => {
      if (value !== undefined) {
        values.push(value);
        fields.push(`${key} = $${values.length}`);
      }
    });

    if (!fields.length) {
      return next(new AppError("No valid fields to update", 400));
    }

    const result = await pool.query(
      `
      UPDATE job_postings
      SET ${fields.join(", ")}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${values.length + 1}
        AND company_id = $${values.length + 2}
      RETURNING *
      `,
      [...values, jobId, companyId]
    );

    if (!result.rows.length) {
      return next(new AppError("Job not found or unauthorized", 404));
    }

    res.json({
      success: true,
      job: {
        ...result.rows[0],
        required_skills: result.rows[0].required_skills || [],
      },
    });
  } catch (err) {
    console.error("Error updating job:", err);
    next(new AppError("Failed to update job", 500));
  }
};

/* ======================================================
   DELETE JOB
====================================================== */
export const deleteJob = async (req, res, next) => {
  try {
    const companyId = await getCompanyIdForUser(req.user.id);
    const jobId = req.params.id;

    if (!companyId) {
      return next(
        new AppError(
          "Company not linked to user. Complete company setup first.",
          403
        )
      );
    }

    const result = await pool.query(
      `
      DELETE FROM job_postings
      WHERE id = $1 AND company_id = $2
      RETURNING id
      `,
      [jobId, companyId]
    );

    if (!result.rows.length) {
      return next(new AppError("Job not found or unauthorized", 404));
    }

    res.json({ success: true, message: "Job deleted successfully" });
  } catch (err) {
    console.error("Error deleting job:", err);
    next(new AppError("Failed to delete job", 500));
  }
};

/* ======================================================
   JOB STATS
====================================================== */
export const getJobStats = async (req, res, next) => {
  try {
    const companyId = await getCompanyIdForUser(req.user.id);

    if (!companyId) {
      return res.json({
        success: true,
        stats: { total_jobs: 0, active_jobs: 0, total_applications: 0 },
      });
    }

    const jobsResult = await pool.query(
      `
      SELECT
        COUNT(*) AS total_jobs,
        COUNT(*) FILTER (WHERE status = 'Active') AS active_jobs
      FROM job_postings
      WHERE company_id = $1
      `,
      [companyId]
    );

    const applicationsResult = await pool.query(
      `
      SELECT COUNT(*) AS total_applications
      FROM applications a
      JOIN job_postings j ON j.id = a.job_posting_id
      WHERE j.company_id = $1
      `,
      [companyId]
    );

    res.json({
      success: true,
      stats: {
        total_jobs: Number(jobsResult.rows[0].total_jobs),
        active_jobs: Number(jobsResult.rows[0].active_jobs),
        total_applications: Number(applicationsResult.rows[0].total_applications),
      },
    });
  } catch (err) {
    console.error("Error fetching job stats:", err);
    next(new AppError("Failed to fetch job stats", 500));
  }
};