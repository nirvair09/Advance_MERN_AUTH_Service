import express from "express"
import { SignIn } from "../controllers/auth.controller.js";

const router=express.Router();

router.post("/sign-in",SignIn);



export default router;