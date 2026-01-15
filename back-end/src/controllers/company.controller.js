import sanitizeHtml from "sanitize-html";
import { pool } from "../config/db.js";
import { uploadToCloudinary } from "../services/cloudinary.service.js";
import { AppError } from "../utils/AppError.js";


/* =========================
   REGISTER COMPANY
========================= */
export const registerCompany = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const exists = await pool.query(
      "SELECT id FROM company_profile WHERE owner_id = $1",
      [userId]
    );

    if (exists.rows.length) {
      return res.status(400).json({
        success: false,
        message: "Company already registered for this user",
      });
    }

    const {
      company_name,
      industry_type,
      organization_type,
      team_size,
      company_website,
    } = req.body;

    // ✅ SANITIZE FREE TEXT
    const about_company = sanitizeHtml(req.body.about_company || "", {
      allowedTags: [],
      allowedAttributes: {},
    });

    const result = await pool.query(
      `
      INSERT INTO company_profile
      (company_name, industry_type, organizations_type, team_size, about_company, company_website, owner_id)
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING *
      `,
      [
        company_name,
        industry_type,
        organization_type,
        team_size,
        about_company,
        company_website,
        userId,
      ]
    );

    res.status(201).json({
      success: true,
      company: result.rows[0],
    });
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};

/* =========================
   GET COMPANY PROFILE
========================= */
export const getCompanyProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT * FROM company_profile WHERE owner_id = $1`,
      [userId]
    );

    if (!result.rows.length) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    res.json({
      success: true,
      company: result.rows[0],
    });
  } catch (error) {
    next(new AppError("Company not found", 404));
  }
};

/* =========================
   UPDATE COMPANY PROFILE
========================= */
export const updateCompanyProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Check if company profile exists for this user
    const companyCheck = await pool.query(
      "SELECT id FROM company_profile WHERE owner_id = $1",
      [userId]
    );

    if (!companyCheck.rows.length) {
      return next(new AppError("Company profile not found. Please register your company first.", 404));
    }

    // Map API field names to database column names
    const fieldMapping = {
      "company_name": "company_name",
      "industry_type": "industry_type",
      "organization_type": "organizations_type", // API uses singular, DB uses plural
      "team_size": "team_size",
      "company_website": "company_website",
      "map_location_url": "map_location_url",
      "careers_link": "careers_link",
      "headquarter_phone_no": "headquarter_phone_no",
      "social_links": "social_links",
    };

    const normalFields = [
      "company_name",
      "industry_type",
      "organization_type",
      "team_size",
      "company_website",
      "map_location_url",
      "careers_link",
      "headquarter_phone_no",
      "social_links",
    ];

    const sanitizedTextFields = [
      "about_company",
      "company_vision",
    ];

    const updates = [];
    const values = [];

    // Normal fields (no sanitization)
    normalFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        values.push(req.body[field]);
        const dbColumnName = fieldMapping[field] || field;
        updates.push(`${dbColumnName} = $${values.length}`);
      }
    });

    // ✅ Sanitized text fields
    sanitizedTextFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        const cleanValue = sanitizeHtml(req.body[field], {
          allowedTags: [],
          allowedAttributes: {},
        });
        values.push(cleanValue);
        updates.push(`${field} = $${values.length}`);
      }
    });

    if (!updates.length) {
        return next(new AppError("No valid fields to update", 400));
    }

    const query = `
      UPDATE company_profile
      SET ${updates.join(", ")}, updated_at = CURRENT_TIMESTAMP
      WHERE owner_id = $${values.length + 1}
      RETURNING *
    `;

    const result = await pool.query(query, [...values, userId]);

    if (!result.rows.length) {
      return next(new AppError("Company profile not found or update failed", 404));
    }

    res.json({
      success: true,
      company: result.rows[0],
    });
  } catch (error) {
    console.error('Error updating company profile:', error);
    next(new AppError(error.message || "Failed to update company profile", 500));
  }
};

/* =========================
   UPLOAD LOGO
========================= */
export const uploadLogo = async (req, res, next) => {
  try {
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const result = await uploadToCloudinary(req.file.buffer, "company/logo");

    await pool.query(
      "UPDATE company_profile SET company_logo_url = $1 WHERE owner_id = $2",
      [result.secure_url, userId]
    );

    res.json({
      success: true,
      company_logo_url: result.secure_url,
    });
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};

/* =========================
   UPLOAD BANNER
========================= */
export const uploadBanner = async (req, res, next) => {
  try {
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const result = await uploadToCloudinary(req.file.buffer, "company/banner");

    await pool.query(
      "UPDATE company_profile SET company_banner_url = $1 WHERE owner_id = $2",
      [result.secure_url, userId]
    );

    res.json({
      success: true,
      company_banner_url: result.secure_url,
    });
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};

/* =========================
   GET ALL COMPANIES (Public)
========================= */
export const getAllCompanies = async (req, res, next) => {
  try {
    const { search, industry_type } = req.query;
    
    let query = "SELECT * FROM company_profile WHERE 1=1";
    const params = [];
    let paramCount = 0;

    // Add search filter
    if (search) {
      paramCount++;
      query += ` AND (company_name ILIKE $${paramCount} OR about_company ILIKE $${paramCount} OR industry_type ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    // Add industry filter
    if (industry_type) {
      paramCount++;
      query += ` AND industry_type = $${paramCount}`;
      params.push(industry_type);
    }

    query += " ORDER BY created_at DESC";

    const result = await pool.query(query, params);

    res.json({
      success: true,
      companies: result.rows,
      count: result.rows.length,
    });
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};
