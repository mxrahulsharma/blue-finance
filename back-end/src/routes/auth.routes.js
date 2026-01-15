import express from "express";
import { body } from "express-validator";
import { register, login, firebaseSignIn } from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();
router.post(
    "/register",
    [
      body("email").isEmail(),
      body("password").isLength({ min: 6 }),
      body("first_name").notEmpty(),
      body("last_name").notEmpty(),
      body("mobile_no").optional().isMobilePhone(),
    ],
    validate,
    register
  );
  
  router.post(
    "/login",
    [
      body("email").isEmail(),
      body("password").notEmpty(),
    ],
    validate,
    login
  );

  // Firebase sign-in endpoint for Postman testing
  router.post(
    "/firebase-signin",
    [
      body("email").isEmail(),
      body("password").notEmpty(),
    ],
    validate,
    firebaseSignIn
  );
  
  export default router;
  
