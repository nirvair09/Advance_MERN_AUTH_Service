import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/connectDB.js";

dotenv.config();
//database connection
connectDB();

const app= express();
const PORT=process.env.PORT || 5000;
app.get("/",(req,res)=>{
    console.log("Hello from backend of Advance Auth system");
})

app.listen(PORT,()=> console.log(`Server running on port ${PORT}`));