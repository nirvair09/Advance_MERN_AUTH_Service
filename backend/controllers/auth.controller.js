import User from "../models/user.model.js"
import bcrypt from "bcryptjs";
import generateAndSetToken from "../utils/generateAndSetToken.js";
import { sendWelcomeEmail } from "../mailer/sendWelcomeEmail.js";
import { sendVerificationEmail } from "../mailer/sendVerificationEmail.js";

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

        if (!response || !response._id) {
            // this means save failed silently or returned nothing
            return res.status(500).json({
                success: false,
                message: "User not saved to database, cannot generate token",
            });
        }

        //only if save succedded;
        const token = generateAndSetToken({
            email: response.email,
            userId: response._id,
            expiresIn: "7d",
        });
        // console.log("User saved at DataBase", response);
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        await sendWelcomeEmail({email:response.email,name:response.name});
        await sendVerificationEmail({email:response.email,name:response.name,verificationLink:response.verificationToken})
        
        res.status(201)
            .json({
                success: true,
                message: "User saved successfully at MongoDataBase",
                user: {
                    ...response._doc,
                    password: undefined,
                },
                token,
            });


    } catch (error) {
        console.error("❌ Error in SignIn:", error.message);
        res.status(500).json({
            success: false,
            message: error.message || "Something went wrong while saving to DB"
        });
    }
};


export const LogIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Must fill all fields" });
        }

        const response = await User.findOne({ email });

        if (!response)
            return res.status(400).json({ success: false, message: "Invalid credentials" });


        const isMatchedPassword = await bcrypt.compare(password, response.password);


        if (!isMatchedPassword)
            return res.status(400).json({ success: false, message: "Invalid credentials" });

        const token = generateAndSetToken({
            email: response.email,
            userId: response._id,
            expiresIn: "7d",
        });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(201).json({
            success: true,
            message: "Logged In successfully",
            user: {
                ...response._doc,
                password: undefined,
            },
            token,
        });

    } catch (error) {
        res.status(400).json({ success: false, message: "Failed to login ,might be server error" });
    }
};



export const LogOut = async (req, res) => {
    try {
        const token = req.cookies.token;

        if (!token)
            return res.status(400).json({ success: false, message: "No token found" });

        res.clearCookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
        })


        return res.status(200).json({
            sucess: true,
            message: "Successfully logged out"
        })

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Error while logging out"
        })
    }
};