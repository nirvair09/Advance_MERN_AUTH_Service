import nodemailer from "nodemailer";

export const sendPasswordResetEmail = async ({ email, link }) => {
    try {

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const htmlContent = `
      <div style="font-family:sans-serif;line-height:1.6;color:#333;">
        <h2>Welcome to SecurePass, ${email}!</h2>
        <p>Click below to reset your password:</p>
        <a href="${link}" 
          style="background:#4CAF50;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;">
          Reset My Password
        </a>
        <p>This link will expire in 24 hours.</p>
      </div>
    `;

        const mailOptions = {
            from: `"SecurePass" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Reset Your Password",
            html: htmlContent,
        }

        const info = await transporter.sendMail(mailOptions);

        console.log(" Verification email sent:", info.response);

    } catch (error) {
        console.error(" Verification email failed:", error.message);
        throw new Error("Email not sent");
    }
};