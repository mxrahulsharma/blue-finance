import bcrypt from "bcrypt";
import sanitizeHtml from "sanitize-html";
import { pool } from "../config/db.js";
import { signToken } from "../utils/jwt.js";


export const register = async (req, res) => {
  try {
    let { email, password, first_name, last_name, mobile_no } = req.body;

    // Sanitize
    email = sanitizeHtml(email);
    first_name = sanitizeHtml(first_name);
    last_name = sanitizeHtml(last_name);
    mobile_no = sanitizeHtml(mobile_no || "");

    // Check existing user
    const existing = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );
    if (existing.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user (match imported schema)
    const result = await pool.query(
      `INSERT INTO users 
       (email, password, first_name, last_name, mobile_no, signup_type)
       VALUES ($1, $2, $3, $4, $5, 'e')
       RETURNING id, email, first_name, last_name`,
      [email, hashedPassword, first_name, last_name, mobile_no]
    );

    return res.status(201).json({
      success: true,
      user: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Registration failed",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      "SELECT id, email, password, first_name, last_name FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = signToken({ id: user.id, email: user.email });

    return res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};

/**
 * Firebase sign-in endpoint for Postman testing
 * Signs in with Firebase and returns an ID token
 */
export const firebaseSignIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Firebase REST API endpoint
    const firebaseApiKey = process.env.FIREBASE_API_KEY || "AIzaSyAbwTSS5L5RTKrNZWKiwkNmj2G1UvNfVKk";
    
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${firebaseApiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(401).json({
        success: false,
        message: data.error?.message || "Firebase sign-in failed",
        error: data.error,
      });
    }

    return res.json({
      success: true,
      idToken: data.idToken,
      refreshToken: data.refreshToken,
      expiresIn: data.expiresIn,
      localId: data.localId,
      email: data.email,
      message: "✅ Use this idToken in Postman Authorization header as: Bearer <idToken>",
    });
  } catch (error) {
    console.error("Firebase sign-in error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Firebase sign-in failed",
    });
  }
};
