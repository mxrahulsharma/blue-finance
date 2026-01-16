import sanitizeHtml from "sanitize-html";
import { pool } from "../config/db.js";
import { uploadToCloudinary } from "../services/cloudinary.service.js";
import { AppError } from "../utils/AppError.js";

/* =========================
   REGISTER COMPANY
========================= */
export const registerCompany = async (req, res, next) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const userId = req.user.id;

    // Check if user already has a company
    const userCheck = await client.query(
      "SELECT company_id FROM users WHERE id = $1",
      [userId]
    );

    if (userCheck.rows[0]?.company_id) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        message: "User already has a company linked",
      });
    }

    // Check if company already exists for this user
    const companyCheck = await client.query(
      "SELECT id FROM company_profile WHERE owner_id = $1",
      [userId]
    );

    if (companyCheck.rows.length) {
      await client.query('ROLLBACK');
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
      map_location_url,
      company_vision,
      careers_link,
      headquarter_phone_no,
      social_links,
      headquarter_mail_id,
      company_app_link,
    } = req.body;

    // ✅ SANITIZE FREE TEXT
    const about_company = sanitizeHtml(req.body.about_company || "", {
      allowedTags: [],
      allowedAttributes: {},
    });

    const sanitized_company_vision = sanitizeHtml(company_vision || "", {
      allowedTags: [],
      allowedAttributes: {},
    });

    // Insert company profile
    const companyResult = await client.query(
      `
      INSERT INTO company_profile
      (company_name, industry_type, organizations_type, team_size, about_company, 
       company_website, map_location_url, company_vision, careers_link, 
       headquarter_phone_no, social_links, headquarter_mail_id, 
       company_app_link, owner_id, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING *
      `,
      [
        company_name,
        industry_type,
        organization_type,
        team_size,
        about_company,
        company_website || null,
        map_location_url || null,
        sanitized_company_vision || null,
        careers_link || null,
        headquarter_phone_no || null,
        social_links || null,
        headquarter_mail_id || null,
        company_app_link || null,
        userId,
      ]
    );

    const companyId = companyResult.rows[0].id;

    // **CRITICAL FIX** - Update users table with company_id
    await client.query(
      `UPDATE users SET company_id = $1 WHERE id = $2`,
      [companyId, userId]
    );

    await client.query('COMMIT');

    res.status(201).json({
      success: true,
      message: 'Company registered successfully',
      company: companyResult.rows[0],
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error registering company:', error);
    next(new AppError(error.message || 'Failed to register company', 500));
  } finally {
    client.release();
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
    console.error('Error fetching company profile:', error);
    next(new AppError("Company not found", 404));
  }
};

/* =========================
   UPDATE COMPANY PROFILE
========================= */
export const updateCompanyProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    console.log('Update company profile request - userId:', userId);
    console.log('Update company profile request - body:', JSON.stringify(req.body, null, 2));

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
      "headquarter_mail_id": "headquarter_mail_id",
      "company_app_link": "company_app_link",
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
      "headquarter_mail_id",
      "company_app_link",
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
      console.log('No valid fields to update');
      return next(new AppError("No valid fields to update", 400));
    }

    console.log('Update query fields:', updates);
    console.log('Update values:', values);

    const query = `
      UPDATE company_profile
      SET ${updates.join(", ")}, updated_at = CURRENT_TIMESTAMP
      WHERE owner_id = $${values.length + 1}
      RETURNING *
    `;

    console.log('Executing query:', query);
    const result = await pool.query(query, [...values, userId]);
    console.log('Update successful, rows affected:', result.rows.length);

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
      return res.status(400).json({ 
        success: false,
        message: "No file uploaded" 
      });
    }

    // Check if company exists
    const companyCheck = await pool.query(
      "SELECT id FROM company_profile WHERE owner_id = $1",
      [userId]
    );

    if (!companyCheck.rows.length) {
      return next(new AppError("Company profile not found", 404));
    }

    const result = await uploadToCloudinary(req.file.buffer, "company/logo");

    await pool.query(
      "UPDATE company_profile SET company_logo_url = $1, updated_at = CURRENT_TIMESTAMP WHERE owner_id = $2",
      [result.secure_url, userId]
    );

    res.json({
      success: true,
      company_logo_url: result.secure_url,
    });
  } catch (error) {
    console.error('Error uploading logo:', error);
    next(new AppError(error.message || "Failed to upload logo", 500));
  }
};

/* =========================
   UPLOAD BANNER
========================= */
export const uploadBanner = async (req, res, next) => {
  try {
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        message: "No file uploaded" 
      });
    }

    // Check if company exists
    const companyCheck = await pool.query(
      "SELECT id FROM company_profile WHERE owner_id = $1",
      [userId]
    );

    if (!companyCheck.rows.length) {
      return next(new AppError("Company profile not found", 404));
    }

    const result = await uploadToCloudinary(req.file.buffer, "company/banner");

    await pool.query(
      "UPDATE company_profile SET company_banner_url = $1, updated_at = CURRENT_TIMESTAMP WHERE owner_id = $2",
      [result.secure_url, userId]
    );

    res.json({
      success: true,
      company_banner_url: result.secure_url,
    });
  } catch (error) {
    console.error('Error uploading banner:', error);
    next(new AppError(error.message || "Failed to upload banner", 500));
  }
};

/* =========================
   GET ALL COMPANIES (Public)
========================= */
export const getAllCompanies = async (req, res, next) => {
  try {
    const { search, industry_type, page = 1, limit = 10 } = req.query;
    
    const offset = (page - 1) * limit;
    
    let query = "SELECT * FROM company_profile WHERE 1=1";
    let countQuery = "SELECT COUNT(*) FROM company_profile WHERE 1=1";
    const params = [];
    let paramCount = 0;

    // Add search filter
    if (search) {
      paramCount++;
      const searchCondition = ` AND (company_name ILIKE $${paramCount} OR about_company ILIKE $${paramCount} OR industry_type ILIKE $${paramCount})`;
      query += searchCondition;
      countQuery += searchCondition;
      params.push(`%${search}%`);
    }

    // Add industry filter
    if (industry_type) {
      paramCount++;
      const industryCondition = ` AND industry_type = $${paramCount}`;
      query += industryCondition;
      countQuery += industryCondition;
      params.push(industry_type);
    }

    // Get total count
    const countResult = await pool.query(countQuery, params);
    const totalCount = parseInt(countResult.rows[0].count);

    // Add pagination
    query += ` ORDER BY created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    
    const result = await pool.query(query, [...params, limit, offset]);

    res.json({
      success: true,
      companies: result.rows,
      count: result.rows.length,
      total: totalCount,
      page: parseInt(page),
      totalPages: Math.ceil(totalCount / limit),
    });
  } catch (error) {
    console.error('Error fetching companies:', error);
    next(new AppError(error.message || "Failed to fetch companies", 500));
  }
};