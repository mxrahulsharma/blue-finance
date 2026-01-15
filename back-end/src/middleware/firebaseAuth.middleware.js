import admin from "../config/firebase.js";

export const requireFirebaseAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authorization header missing",
      });
    }

    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({
        success: false,
        message: "Invalid Authorization header format",
      });
    }

    const decoded = await admin.auth().verifyIdToken(token);

    req.firebase = {
      uid: decoded.uid,
      email: decoded.email || null,
      phone: decoded.phone_number || null,
    };

    next();
  } catch (error) {
    console.error("Firebase auth error:", error.message);
    
    // Handle specific Firebase auth errors with user-friendly messages
    if (error.code === "auth/id-token-expired") {
      return res.status(401).json({
        success: false,
        message: "Your session has expired. Please sign in again.",
        code: "TOKEN_EXPIRED",
      });
    }
    
    if (error.code === "auth/argument-error") {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token. Please sign in again.",
        code: "INVALID_TOKEN",
      });
    }
    
    // Handle incorrect issuer (custom token instead of ID token)
    if (error.message && error.message.includes("issuer") && error.message.includes("identitytoolkit")) {
      return res.status(401).json({
        success: false,
        message: "Invalid token type. You are using a custom token. Please use an ID token from Firebase client SDK signInWithEmailAndPassword() or getIdToken().",
        code: "INVALID_TOKEN_TYPE",
        hint: "Use Firebase client SDK to sign in and get an ID token, not a custom token",
      });
    }
    
    return res.status(401).json({
      success: false,
      message: error.message || "User authentication failed",
      code: error.code || "AUTH_ERROR",
    });
  }
};
