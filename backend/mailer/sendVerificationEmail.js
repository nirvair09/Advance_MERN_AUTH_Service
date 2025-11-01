// utils/sendVerificationEmail.js
import nodemailer from "nodemailer";

export const sendVerificationEmail = async ({ email, name, verificationLink }) => {
  try {
    console.log("🚀 Sending verification email to:", email);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const htmlContent = `
      <div style="font-family:sans-serif;line-height:1.6;color:#333;">
        <h2>Welcome to SecurePass, ${name}!</h2>
        <p>Click below to verify your account:</p>
        <a href="${verificationLink}" 
          style="background:#4CAF50;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;">
          Verify My Account
        </a>
        <p>This link will expire in 24 hours.</p>
      </div>
    `;

    const mailOptions = {
      from: `"SecurePass" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify your SecurePass account",
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Verification email sent:", info.response);

  } catch (err) {
    console.error("❌ Verification email failed:", err.message);
    throw new Error("Email not sent");
  }
};
