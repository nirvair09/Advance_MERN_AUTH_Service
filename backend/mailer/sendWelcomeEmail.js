import nodemailer from "nodemailer";

export const sendWelcomeEmail = async ({ email, name }) => {
  try {
    console.log("🔹 Step 1: Preparing to send welcome email...");
    console.log("📧 Email:", email);
    console.log("👤 Name:", name);

    console.log("🔹 Step 2: Creating transporter...");
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Gmail ID
        pass: process.env.EMAIL_PASS, // App password
      },
    });

    console.log("Email credentials loaded:", !!process.env.EMAIL_USER, !!process.env.EMAIL_PASS);


    console.log("🔹 Step 3: Verifying transporter connection...");
    await transporter.verify();
    console.log("✅ Transporter verified successfully. Ready to send mail.");

    console.log("🔹 Step 4: Creating email HTML content...");
    const htmlContent = `
      <div style="font-family:sans-serif;line-height:1.6;color:#333;">
        <h2>Welcome to SecurePass, ${name}!</h2>
        <p>We're thrilled to have you on board 🎉</p>
        <p>If you didn’t create this account, you can ignore this email.</p>
      </div>
    `;

    console.log("🔹 Step 5: Defining mail options...");
    const mailOptions = {
      from: `"MERN Auth" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Welcome to MERN Authentication",
      html: htmlContent,
    };

    console.log("🔹 Step 6: Sending email...");
    const info = await transporter.sendMail(mailOptions);

    console.log("✅ Email sent successfully!");
    console.log("📨 Response:", info.response);
  } catch (error) {
    console.error("❌ Email send error occurred.");
    console.error("🪲 Error details:", error);
    throw new Error("Email not sent");
  }
};
