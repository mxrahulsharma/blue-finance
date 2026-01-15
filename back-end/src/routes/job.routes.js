import express from "express";
import { body } from "express-validator";

import { requireFirebaseAuth } from "../middleware/firebaseAuth.middleware.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { validate } from "../middleware/validate.js";

import {
  createJob,
  getMyJobs,
  getJobById,
  updateJob,
  deleteJob,
  getJobStats,
} from "../controllers/job.controller.js";

const router = express.Router();

/* =========================
   POST A JOB
========================= */
router.post(
  "/",
  requireFirebaseAuth,
  requireAuth,
  [
    body("job_title").notEmpty().withMessage("Job title is required"),
    body("job_type").notEmpty().withMessage("Job type is required"),
    body("experience_level").notEmpty().withMessage("Experience level is required"),
    body("work_mode").notEmpty().withMessage("Work mode is required"),
    body("location").notEmpty().withMessage("Location is required"),
    body("job_description").notEmpty().withMessage("Job description is required"),
    body("salary_min").optional().custom((value) => {
      if (value === null || value === undefined || value === '') return true;
      const num = Number(value);
      return !isNaN(num) && num >= 0;
    }).withMessage("Minimum salary must be a valid number"),
    body("salary_max").optional().custom((value) => {
      if (value === null || value === undefined || value === '') return true;
      const num = Number(value);
      return !isNaN(num) && num >= 0;
    }).withMessage("Maximum salary must be a valid number"),
    body("openings").optional().custom((value) => {
      if (value === null || value === undefined || value === '') return true;
      const num = Number(value);
      return !isNaN(num) && num >= 1;
    }).withMessage("Openings must be at least 1"),
    body("deadline").optional().custom((value) => {
      if (!value) return true;
      return !isNaN(Date.parse(value));
    }).withMessage("Deadline must be a valid date"),
  ],
  validate,
  createJob
);

/* =========================
   GET MY JOBS
========================= */
router.get(
  "/",
  requireFirebaseAuth,
  requireAuth,
  getMyJobs
);

/* =========================
   GET JOB STATS
========================= */
router.get(
  "/stats",
  requireFirebaseAuth,
  requireAuth,
  getJobStats
);

/* =========================
   GET JOB BY ID
========================= */
router.get(
  "/:id",
  requireFirebaseAuth,
  requireAuth,
  getJobById
);

/* =========================
   UPDATE JOB
========================= */
router.put(
  "/:id",
  requireFirebaseAuth,
  requireAuth,
  [
    body("job_title").optional().notEmpty(),
    body("job_type").optional().notEmpty(),
    body("experience_level").optional().notEmpty(),
    body("work_mode").optional().notEmpty(),
    body("location").optional().notEmpty(),
    body("salary_min").optional().isInt({ min: 0 }),
    body("salary_max").optional().isInt({ min: 0 }),
    body("openings").optional().isInt({ min: 1 }),
    body("deadline").optional().isISO8601(),
    body("status").optional().isIn(["Active", "Draft", "Closed"]),
  ],
  validate,
  updateJob
);

/* =========================
   DELETE JOB
========================= */
router.delete(
  "/:id",
  requireFirebaseAuth,
  requireAuth,
  deleteJob
);

export default router;
