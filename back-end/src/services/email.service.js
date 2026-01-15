import admin from "../config/firebase.js";

// Lazy load nodemailer - will be loaded when first needed
let nodemailer = null;
let nodemailerLoaded = false;

const loadNodemailer = async () => {
  if (nodemailerLoaded) {
    return nodemailer;
  }
  
  try {
    const nodemailerModule = await import("nodemailer");
    nodemailer = nodemailerModule.default;
    nodemailerLoaded = true;
    return nodemailer;
  } catch (error) {
    console.error("❌ Failed to load nodemailer:", error.message);
    console.error("⚠️  Please install nodemailer: npm install nodemailer");
    nodemailerLoaded = true; // Mark as attempted to avoid repeated errors
    return null;
  }
};

// Create reusable transporter object using Gmail SMTP
const createTransporter = async () => {
  const nm = await loadNodemailer();
  
  if (!nm) {
    throw new Error("nodemailer is not installed. Please run: npm install nodemailer");
  }
  
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    throw new Error("Gmail credentials not configured. Please set GMAIL_USER and GMAIL_APP_PASSWORD in .env");
  }

  return nm.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD, // Use App Password, not regular password
    },
  });
};

/**
 * Generate email verification link using Firebase Admin SDK
 * @param {string} email - User's email address
 * @returns {Promise<string>} - Email verification link
 */
export const generateVerificationLink = async (email) => {
  try {
    const actionCodeSettings = {
      // URL you want to redirect back to after email verification
      url: process.env.EMAIL_VERIFICATION_REDIRECT_URL || "http://localhost:3000/email-verified",
      handleCodeInApp: false,
    };

    const link = await admin.auth().generateEmailVerificationLink(email, actionCodeSettings);
    return link;
  } catch (error) {
    console.error("Error generating verification link:", error);
    throw error;
  }
};

/**
 * Send email verification email to user
 * @param {string} email - User's email address
 * @param {string} verificationLink - Email verification link
 * @returns {Promise<void>}
 */
export const sendVerificationEmail = async (email, verificationLink) => {
  try {
    const transporter = await createTransporter();

    const mailOptions = {
      from: `"${process.env.APP_NAME || "Company Registration"}" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Verify Your Email Address",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Email</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #f4f4f4; padding: 20px; border-radius: 5px;">
            <h2 style="color: #333;">Email Verification Required</h2>
            <p>Hello,</p>
            <p>Thank you for registering! Please verify your email address to continue using our service.</p>
            <p style="margin: 30px 0;">
              <a href="${verificationLink}" 
                 style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Verify Email Address
              </a>
            </p>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #007bff;">${verificationLink}</p>
            <p style="margin-top: 30px; font-size: 12px; color: #666;">
              If you did not create an account, please ignore this email.
            </p>
          </div>
        </body>
        </html>
      `,
      text: `
        Email Verification Required
        
        Hello,
        
        Thank you for registering! Please verify your email address to continue using our service.
        
        Click the following link to verify your email:
        ${verificationLink}
        
        If you did not create an account, please ignore this email.
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Verification email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Error sending verification email:", error);
    throw error;
  }
};

/**
 * Send email verification email if user's email is not verified
 * @param {string} email - User's email address
 * @returns {Promise<void>}
 */
export const sendVerificationEmailIfNeeded = async (email) => {
  try {
    const verificationLink = await generateVerificationLink(email);
    await sendVerificationEmail(email, verificationLink);
  } catch (error) {
    console.error("Error in sendVerificationEmailIfNeeded:", error);
    throw error;
  }
};
