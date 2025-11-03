import express from "express";
import dotenv from "dotenv";
import cors from "cors";


import connectDB from "./db/connectDB.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();



const app= express();


app.use(cors({
  origin: "http://localhost:5173",  // your React dev server URL
  credentials: true,                // 👈 crucial line
}));
app.use(express.json());
app.use(cookieParser());

//routes

app.use("/api/v1/auth",authRoutes);



const PORT=process.env.PORT || 5000;
app.get("/",(req,res)=>{
    console.log("Hello from backend of Advance Auth system");
})

app.listen(PORT,()=>{ 
    //database connection
    connectDB();
    console.log(`Server running on port ${PORT}`)

});