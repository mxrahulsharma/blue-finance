import express from "express";
import { body } from "express-validator";

import { requireFirebaseAuth } from "../middleware/firebaseAuth.middleware.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { validate } from "../middleware/validate.js";
import { upload } from "../middleware/upload.middleware.js";
import { isValidPhoneNumber } from "../utils/phoneValidator.js";

import {
  registerCompany,
  getCompanyProfile,
  updateCompanyProfile,
  uploadLogo,
  uploadBanner,
  getAllCompanies,
} from "../controllers/company.controller.js";

const router = express.Router();

/* =========================
   REGISTER COMPANY
========================= */
router.post(
  "/register",
  requireFirebaseAuth, // 🔐 Firebase verifies identity
  requireAuth,         // 🔗 maps firebase → internal user
  [
    body("company_name").notEmpty().withMessage("Company name required"),
    body("industry_type").notEmpty(),
    body("organization_type").notEmpty(),
    body("team_size").notEmpty(),
  ],
  validate,
  registerCompany
);

/* =========================
   GET COMPANY PROFILE
========================= */
router.get(
  "/profile",
  requireFirebaseAuth,
  requireAuth,
  getCompanyProfile
);

/* =========================
   UPDATE COMPANY PROFILE
========================= */
router.put(
  "/profile",
  requireFirebaseAuth,
  requireAuth,
  [
    body("company_name").optional(),
    body("industry_type").optional(),
    body("organization_type").optional(),
    body("team_size").optional(),
    body("about_company").optional(),
    body("company_website").optional({ checkFalsy: true }).custom((value) => {
      if (!value || value.trim() === '') return true;
      try {
        new URL(value);
        return true;
      } catch {
        throw new Error("Company website must be a valid URL");
      }
    }),
    body("map_location_url").optional({ checkFalsy: true }).custom((value) => {
      if (!value || value.trim() === '') return true;
      try {
        new URL(value);
        return true;
      } catch {
        throw new Error("Map location URL must be a valid URL");
      }
    }),
    body("company_vision").optional(),
    body("headquarter_phone_no").optional({ checkFalsy: true }).custom(isValidPhoneNumber),
    body("careers_link").optional({ checkFalsy: true }).custom((value) => {
      if (!value || value.trim() === '') return true;
      try {
        new URL(value);
        return true;
      } catch {
        throw new Error("Careers link must be a valid URL");
      }
    }),
    body("social_links").optional(),
  ],
  validate,
  updateCompanyProfile
);

/* =========================
   UPLOAD COMPANY LOGO
========================= */
router.post(
  "/upload/logo",
  requireFirebaseAuth,
  requireAuth,
  upload.single("logo"),
  uploadLogo
);

/* =========================
   UPLOAD COMPANY BANNER
========================= */
router.post(
  "/upload/banner",
  requireFirebaseAuth,
  requireAuth,
  upload.single("banner"),
  uploadBanner
);

/* =========================
   GET ALL COMPANIES (Public - no auth required)
========================= */
router.get(
  "/all",
  getAllCompanies
);

export default router;
