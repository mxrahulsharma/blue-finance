import { findOrCreateUserByFirebase } from "../services/user.service.js";

export const requireAuth = async (req, res, next) => {
  try {
    // 🔑 MUST read from req.firebase (set by requireFirebaseAuth)
    if (!req.firebase || !req.firebase.uid) {
      return res.status(401).json({
        success: false,
        message: "Firebase user not found in request",
      });
    }

    const user = await findOrCreateUserByFirebase({
        uid: req.firebase.uid,
        email: req.firebase.email,
        phone: req.firebase.phone,
      });
      

    req.user = {
      id: user.id,
      firebase_uid: req.firebase.uid,
    };

    next();
  } catch (error) {
    console.error("requireAuth error:", error.message);
    return res.status(500).json({
      success: false,
      message: "User authentication failed",
    });
  }
};
