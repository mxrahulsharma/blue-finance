import jwt from "jsonwebtoken";

export const requireAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // 1️⃣ Token missing
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization token missing",
      });
    }

    // 2️⃣ Extract token
    const token = authHeader.split(" ")[1];

    // 3️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4️⃣ Normalize user object (matches company controller expectations)
    req.user = {
      id: decoded.id,   // 👈 Matches company controller (req.user.id)
      userId: decoded.id, // Keep both for compatibility
      email: decoded.email // optional
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};
