import express from "express"
import { LogIn, SignIn } from "../controllers/auth.controller.js";

const router=express.Router();

router.post("/sign-in",SignIn);
router.post("/log-in",LogIn);


export default router;