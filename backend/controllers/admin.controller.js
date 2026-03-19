import bcrypt from "bcryptjs"
import jwt from 'jsonwebtoken'
import * as z from "zod";
import config from "../config.js";
import { Admin } from "../models/admin.model.js";


export const signUp = async (req,res)=>{
    
  const {name, lastname , email , password} =req.body
  
   
  const adminSchema = z.object({
  name: z.string().min(3, { message: "name must be at least 3 characters long" }),
  lastname: z.string().min(3, { message: "lastname must be at least 3 characters long" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "password must be at least 6 characters long" }),
});


  const validateData = adminSchema.safeParse(req.body);

    if (!validateData.success) {
    return res.status(400).json({
        errors: validateData.error.issues.map(err => err.message),
    });
    }

  const hashedPassword = await bcrypt.hash(password,10);


  try {
    const exsitingadmin = await Admin.findOne({email:email})

   if(exsitingadmin){
    return res.status(400).json({errors:"admin already exist"})
   }

   const newAdmin = new Admin ({
    name,
    lastname,
    email,
    password:hashedPassword
})
    await newAdmin.save();

    res.status(201).json({
        message:"signUp successfully",
        newAdmin
  
    })
   } catch (error) {
    res.status(500).json({error:"error in signup"})
    console.log("error in signup",error)
    
   }

}

export const logIn = async(req,res)=>{
     const {email,password} = req.body;
     
     try {
        const admin = await Admin.findOne({email:email})
        const isPasswordCorrect = await bcrypt.compare(password, admin.password)

        if(!admin || !isPasswordCorrect){
            return res.status(403).json({error:"Invalid credentials"})
        }

        // jwt token

       const token = jwt.sign({
          id:admin._id,
       },
        process.env.JWT_ADMIN_PASSWORD,
        {expiresIn:"1d"}
      );
      const cookieOptions ={
        expires:new Date(Date.now() + 24*60 *60 *1000),
        httpOnly:true,
        secure:process.env.NODE_ENV ==="production",
        sameSite:"strict"
      }
      res.cookie("jwt",token,cookieOptions)

       res.status(201).json({message:"Login Successfully",admin,token})
     } catch (error) {
        res.status(500).json({errors:"Error in login"})
        console.log("error in login",error)
     }
};

export const logout = (req, res) => {
  try {
    // cookie exist nahi karti
    if (!req.cookies || !req.cookies.jwt) {
      return res.status(401).json({ error: "kindly login first" });
    }

    // cookie clear
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production"
    });

    return res.status(200).json({
      message: "Logout successful"
    });

  } catch (error) {
    console.log("error in logout", error);
    return res.status(500).json({
      error: "error in logout"
    });
  }
};