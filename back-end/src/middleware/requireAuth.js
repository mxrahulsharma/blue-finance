import { pool } from "../config/db.js";
import { findOrCreateUserByFirebase } from "../services/user.service.js";

export const requireAuth = async (req, res, next) => {
  try {
    if (!req.firebase || !req.firebase.uid) {
      return res.status(401).json({
        success: false,
        message: "Firebase user not found in request",
      });
    }

    // 1️⃣ Find or create user using Firebase UID
    const user = await findOrCreateUserByFirebase({
      uid: req.firebase.uid,
      email: req.firebase.email || null,
      phone: req.firebase.phone || null,
    });

    // 2️⃣ Fetch company_id from users table
    const result = await pool.query(
      "SELECT company_id, email FROM users WHERE id = $1",
      [user.id]
    );

    const companyId = result.rows[0]?.company_id || null;
    const email = result.rows[0]?.email || null;

    // 3️⃣ Attach FULL user context
    req.user = {
      id: user.id,
      firebase_uid: req.firebase.uid,
      email,
      company_id: companyId,
    };

    console.log("DEBUG req.user =>", req.user);

    next();
  } catch (error) {
    console.error("requireAuth error:", error);
    return res.status(500).json({
      success: false,
      message: "User authentication failed",
    });
  }
};
