import { Course } from "../models/course.model.js"
import { v2 as cloudinary } from 'cloudinary';
import { Purchase } from "../models/purchase.model.js";

export const createCourse = async (req,res)=>{
    // console.log("Course created")

    const adminId = req.adminId

    const {title,description,price}= req.body;

    try {
        if(!title || !description|| !price){
            return res.status(400).json({errors:"All fields are required"})
        }
        
       
        const {image} = req.files

        if(!req.files || Object.keys(req.files).length===0){
            return res.status(400).json({errors:"No files upload"})
        }

        const allowedFormate =["image/png" ,"image/jpeg"]
        if(!allowedFormate.includes(image.mimetype)){
            return res.status(400).json({
                errors:"invalid file formate.Only PNG and jpeg allowed"
            })
        }

    /// cloudinary code 

        const cloud_response = await cloudinary.uploader.upload(image.tempFilePath)
        if(!cloud_response || cloud_response.error){
            return res.status(400).json({
                errors:"error uploading file on cloudinary"
            })
        }

        const courseData ={
            title,
            description,
            price,
            image:{
                public_id:cloud_response.public_id,
                url:cloud_response.secure_url
            },
            creatorId:adminId,
        };

       const course = await Course.create(courseData) 
       res.json({
        message:"Course created successfully",
        course
       })

       } catch (error) {
        console.log(error)
        res.status(500).json({error:"Error creating course"})
    }
   
}


export const updateCourse =async(req,res)=>{
     const adminId = req.adminId
    const {courseId} =req.params;
    const {title,description, price,image} =req.body;
    
    try {
        const courseSearch = await Course.findById(courseId)
        if(!courseSearch){
            return res.status(400).json({errors:"course not found"})
        }
        const course = await Course.findOneAndUpdate({
            _id:courseId,
            creatorId:adminId
        },{
            title,
            description,
            price,
            image:{
                public_id:image?.public_id,
                url:image?.url,
            }
        })
        if(!course){
            return res.status(400).json({errors:"can't update,created by other admin"})
        }
        
        res.status(201).json({message:"course updated successfully",course})
    } catch (error) {
        res.status(500).json({error:"error in course updating"})
        console.log("Error in course updating",error)
    }


}

export const deleteCourse =async(req,res)=>{
    const adminId =  req.adminId
    const {courseId} = req.params

    try {
        const course = await Course.findOneAndDelete({
            _id:courseId,
            creatorId:adminId

        })

        if(!course){
            return res.status(404).json({
                errors:"can't delete,created by other admin"
            })
        }
        res.status(200).json({
            message:"Course delete successfully"
        })

    } catch (error) {
        res.status(500).json({error:"error in course deleting"})
        console.log("error in course deleting",error)
    }
}


export const getCourse = async(req,res)=>{

    try {
        const courses = await Course.find({});
        res.status(200).json({courses})
        
    } catch (error) {
        res.status(500).json({errors:"error in getting courses"})
        console.log("error to get course",error)
    }
}


export const courseDetails = async(req,res)=>{

    const {courseId}= req.params

    try {
        
        const course = await Course.findById(courseId);
        if(!course){
            return res.status(404).json({
                error:"CourseDetails not found"
            })
        }
        res.status(200).json({
            message:"CourseDetials found  successfully",
            course,
        })
    } catch (error) {
        res.status(500).json({error:"error in course details"})
        console.log("error in course details",error)
        
    }
}

import Stripe from "stripe";
import config from '../config.js';
const stripe = new Stripe(config.STRIPE_SECRET_KEY)
console.log(config.STRIPE_SECRET_KEY)

export const buyCourses = async(req,res)=>{
   

   const userId = req.userId;
    const {courseId}= req.params

    try {
     const course = await Course.findById(courseId)
     
     if(!course){
        return res.status(400).json({errors:"course not  found"})
     }
     const exsitingUser = await Purchase.findOne({userId ,courseId});
     if(exsitingUser){
       return res.status(400).json({errors:"User has already purchase this course"})
     }

    // stripe payment gatway 
    const amount = course.price;
    const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: "usd",
    payment_method_types:["card"]
  });



     res.status(201).json({
        message:"course purchase successfully",
        course,
        clientSecret: paymentIntent.client_secret,
     })

        
    } catch (error) {
    res.status(500).json({errors:"error in course buying"})
     console.log("error in course buying")
        
    }

}