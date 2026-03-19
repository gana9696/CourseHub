import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import courseRoutes  from "./routes/course.route.js"
import userRoutes  from "./routes/user.route.js"
import adminRoutes  from "./routes/admin.route.js"
import connectDB from "./config/db.js";
import fileUpload from "express-fileupload";
import { v2 as cloudinary } from 'cloudinary';
import cookieParser from "cookie-parser";
import cors from 'cors'
import orderData from './routes/order.routes.js'


const app = express();
const PORT = process.env.PORT || 5000;

//db connection
connectDB()

//cors

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

//middleWere
app.use(express.json())
app.use(cookieParser())
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir :'/tmp/'
}));

//route
app.use("/api/v1/course",courseRoutes)
app.use("/api/v1/user",userRoutes)
app.use("/api/v1/admin",adminRoutes)
app.use("/api/v1/order",orderData)

// Configuration cloudinary code

 cloudinary.config({ 
        cloud_name:process.env.cloud_name, 
        api_key:process.env.api_key, 
        api_secret:process.env.api_secret // Click 'View API Keys' above to copy your API secret
    });
    
// server start
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});