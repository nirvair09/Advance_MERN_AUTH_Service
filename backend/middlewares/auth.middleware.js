import jwt from "jsonwebtoken";
import User from "../models/user.model";

export const verifyToken=async(req,res,next)=>{
    try {
        const token=req.cookies?.token;

        if(!token){
            return res.status(401).json({
                success:false,
                message:"No token provided"
            })
        };

        const decoded=jwt.verify(token,process.env.JWT_SECRET);

        const user=await User.findOne(decoded.id).select(-password);

        if(!user){
            return res.status(401).json({success:false,message:"Invalid token"});


        }

        req.user=user;

        next();

    } catch (error) {
        console.error("❌ Token verification failed:", error.message);
    res.status(401).json({
      success: false,
      message: "Token invalid or expired. Please log in again."
    });
    }
}