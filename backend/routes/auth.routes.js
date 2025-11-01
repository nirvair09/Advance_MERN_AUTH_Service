import express from "express"
import { LogIn, SignIn,LogOut } from "../controllers/auth.controller.js";
import { verifyEmail } from "../controllers/verify.controller.js";
// import { verifyToken } from "../middlewares/auth.middleware.js";
import { forgetPassword } from "../controllers/forget.controller.js";
import { resetPassword } from "../controllers/reset.controller.js";

const router=express.Router();

router.post("/sign-in",SignIn);
router.post("/log-in",LogIn);
router.post("/log-out",LogOut);

router.post("/verify/:token",verifyEmail);

router.post("/forgetPassword",forgetPassword);
router.post("/password-reset/:resetPasswordToken",resetPassword);

export default router;