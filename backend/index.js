import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/connectDB.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();



const app= express();

app.use(cors());
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