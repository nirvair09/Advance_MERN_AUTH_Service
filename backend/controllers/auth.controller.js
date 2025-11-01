import User from "../models/user.model.js"
import bcrypt from "bcryptjs";


export const SignIn = async (req, res) => {
    try {
        //req is an object not a function !!
        const { email, password, name } = req.body;

        if (!name || !password || !email) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const preExistingUser = await User.findOne({ email });

        if (preExistingUser) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "User already exists with same email_ID , try login"
                })
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const verificationToken = email + Date.now().toString();

        const userToBeCreated = new User({
            email,
            password: hashedPassword,
            name,
            verificationToken,
            verificationTokenExpiresIn: Date.now() + 24 * 60 * 60 * 1000 // 1 day on login
        });

        const response = await userToBeCreated.save();
        
        const token=jwt.sign(
            {id:response._id,email:response.email},
            process.env.JWT_SECRET,
            {expiresIn:"7d"}
        );
        // console.log("User saved at DataBase", response);
        res.cookie("token",token,{
            httpOnly:true,
            secure:process.env.NODE_ENV === "production",
            sameSite:"strict",
            maxAge:7*24*60*60*1000,
        })
        res
            .status(201)
            .json({
                success: true,
                message: "User saved successfully at MongoDataBase",
                user: {
                    ...response._doc,
                    password: undefined,
                },
            });


    } catch (error) {
        console.error("❌ Error in SignIn:", error.message);
        res.status(500).json({
            success: false,
            message: error.message || "Something went wrong while saving to DB"
        });
    }
}