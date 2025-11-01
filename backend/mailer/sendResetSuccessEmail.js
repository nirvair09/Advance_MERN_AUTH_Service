import nodemailer from "nodemailer";

export const sendResetSuccessEmail = async ({ email }) => {

  try {
    console.log("Sending password change confirmation to", email);

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
        <p>This is to verify that your accounts password was reset successfully </p>
        
      </div>
    `;

    const mailOptions = {
      from: `SecurePass<${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Confirmation for password reset",
      html: htmlContent,
    }

    const info = await transporter.sendMail(mailOptions);
    console.log("Password reset Confirmation mail sent ", info.response);
  } catch (error) {
    console.error(" Verification email failed:", error.message);
    throw new Error("Email not sent");
  }

};

