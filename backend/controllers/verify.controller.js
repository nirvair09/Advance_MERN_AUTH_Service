// controllers/verify.controller.js
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params; // /verify/:token

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });

    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    if (user.isVerified) return res.json({ success: true, message: "Already verified" });

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresIn = undefined;
    await user.save();

    res.json({
      success: true,
      message: "✅ Email verified successfully! You can now log in.",
    });
  } catch (err) {
    console.error("❌ Verification error:", err.message);
    res.status(400).json({ success: false, message: "Invalid or expired token" });
  }
};
