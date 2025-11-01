import User from "../models/user.model.js";
import { sendResetSuccessEmail } from "../mailer/sendResetSuccessEmail.js";
import bcrypt from "bcryptjs";

export const resetPassword = async (req, res) => {
    const { resetPasswordToken } = req.params;
    const { newPassword } = req.body;
    try {

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordTokenExpiresIn: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "No user found with this link to reset password",
            })
        };


        const hashedPassword = await bcrypt.hash(newPassword, 12);

        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpiresIn = undefined;

        await user.save();

        await sendResetSuccessEmail({ email: user.email });

        res.status(200).json({ success: true, message: "Password reset successful" });

    } catch (error) {
        console.log("Error in resetPassword ", error);
        res.status(400).json({ success: false, message: error.message });
    }
}