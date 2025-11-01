import User from "../models/user.model.js";
import { sendPasswordResetEmail } from "../mailer/sendPasswordResetEmail.js";
import crypto from "crypto";

export const forgetPassword=async(req,res)=>{
    const {email}=req.body;

    try {

        const user=await User.findOne({email});

        if(!user){
            return res.status(400).json({
                success:false,
                message:"User not found with this email"
            })
        }

        const resetToken=crypto.randomBytes(20).toString("hex");
        const resetTokenExpiresIn=Date.now()+1*60*60*1000;

        user.resetPasswordToken=resetToken;
        user.resetPasswordTokenExpiresIn=resetTokenExpiresIn;

        await user.save();

        await sendPasswordResetEmail({email:user.email,link:`${process.env.CLIENT_URL}/reset-password/${resetToken}`})
       
       res.status(200).json({success:true,message:"Password reset link emailed"});
        
    } catch (error) {
        console.log("Error in forgotPassword ", error);
		res.status(400).json({ success: false, message: error.message });
    }

};

