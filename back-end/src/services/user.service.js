import pool from "../config/db.js";

export const findOrCreateUserByFirebase = async ({ uid, email, phone }) => {
  // Check if user already exists
  const existing = await pool.query(
    "SELECT id FROM users WHERE firebase_uid = $1",
    [uid]
  );

  const isNewUser = existing.rows.length === 0;

  const result = await pool.query(
    `
    INSERT INTO users (firebase_uid, email, mobile_no)
    VALUES ($1, $2, $3)
    ON CONFLICT (firebase_uid)
    DO UPDATE SET
      email = EXCLUDED.email,
      mobile_no = EXCLUDED.mobile_no
    RETURNING id
    `,
    [uid, email, phone]
  );

  return { 
    id: result.rows[0].id,
    isNewUser 
  };
};
