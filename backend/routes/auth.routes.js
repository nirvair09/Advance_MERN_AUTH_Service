import express from "express"
import { LogIn, SignIn,LogOut } from "../controllers/auth.controller.js";

const router=express.Router();

router.post("/sign-in",SignIn);
router.post("/log-in",LogIn);
router.post("/log-out",LogOut);


export default router;