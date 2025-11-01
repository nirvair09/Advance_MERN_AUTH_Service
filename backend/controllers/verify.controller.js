import User from "../models/user.model.js";
import { sendWelcomeEmail } from "../mailer/sendWelcomeEmail.js";


export const verifyEmail = async (req, res) => {
    const {code}=req.body;
    try {

        const user=await User.findOne({
            verificationToken: code,
            verificationTokenExpiresIn:{$gt: Date.now() },
        })

        if (!user) {
			return res.status(400).json({ success: false, message: "Invalid or expired verification code" });
		}

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresIn = undefined;

        await user.save();
        
        await sendWelcomeEmail(user.email,user.name);

        res.status(200).json({
			success: true,
			message: "Email verified successfully",
			user: {
				...user._doc,
				password: undefined,
			},
		});
    } catch (error) {
        res.status(401).json({
            success: false,
            message: "Failed to hit verify route"
        })
    }
}