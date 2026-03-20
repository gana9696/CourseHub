import { User } from "../models/user.model.js"
import bcrypt from "bcryptjs"
import jwt from 'jsonwebtoken'
import * as z from "zod";
import config from "../config.js";
import { Purchase } from "../models/purchase.model.js";
import { Course } from "../models/course.model.js";

export const signUp = async (req,res)=>{
    
  const {name, lastname , email , password} =req.body
  
   
  const userSchema = z.object({
  name: z.string().min(3, { message: "name must be at least 3 characters long" }),
  lastname: z.string().min(3, { message: "lastname must be at least 3 characters long" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "password must be at least 6 characters long" }),
});


  const validateData = userSchema.safeParse(req.body);

    if (!validateData.success) {
    return res.status(400).json({
        errors: validateData.error.issues.map(err => err.message),
    });
    }

  const hashedPassword = await bcrypt.hash(password,10);


  try {
    const exsitingUser = await User.findOne({email:email})

   if(exsitingUser){
    return res.status(400).json({errors:"User already exist"})
   }

   const newUser = new User ({
    name,
    lastname,
    email,
    password:hashedPassword
})
    await newUser.save();

    res.status(201).json({
        message:"signUp successfully",
        newUser
    })
   } catch (error) {
    res.status(500).json({error:"error in signup"})
    console.log("error in signup",error)
    
   }

}

export const logIn = async(req,res)=>{
     const {email,password} = req.body;
     
     try {
        const user = await User.findOne({email:email})
        const isPasswordCorrect = await bcrypt.compare(password, user.password)

        if(!user || !isPasswordCorrect){
            return res.status(403).json({errors:"Invalid credentials"})
        }

        // jwt token

       const token = jwt.sign({
          id:user._id,
       },
        process.env.JWT_USER_PASSWORD,
        {expiresIn:"1d"}
      );
      const cookieOptions ={
        expires:new Date(Date.now() + 24*60 *60 *1000),
        httpOnly:true,
        secure:process.env.NODE_ENV ==="production",
        sameSite:"Strict"
      }
      res.cookie("jwt",token,cookieOptions)

       res.status(201).json({message:"Login Successfully",user,token})
     } catch (error) {
        res.status(500).json({errors:"Error in login"})
        console.log("error in login",error)
     }
};

export const logout = (req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: true,
      sameSite: "none"
    });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ errors: "Error in logout" });
    console.log("Error in logout", error);
  }
};

export const purchases = async (req,res)=>{
  const userId =req.userId
  console.log("userId",userId)

  try {
    const purchased = await Purchase.find({userId}).populate("courseId");
     console.log("purchased records:", purchased);
      let purchaseCourseID = purchased
          .filter(p => p.courseId !== null)   // ✅ null हटाओ
          .map(p => p.courseId._id)
      const courseData = await Course.find({
        _id: { $in: purchaseCourseID }
      })

        console.log("courseData:", courseData);
    res.status(200).json({purchased ,courseData})
  } catch (error) {
    res.status(500).json({errors:"error in purchase"})
    console.log("error in purchase",error)
  }
}