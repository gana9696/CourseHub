import { buyCourses, courseDetails, createCourse, deleteCourse, getCourse, updateCourse } from "../controllers/course.controller.js"



import express from "express";
import userMiddleware from "../middleware/user.mid.js";
import adminMiddleware from "../middleware/admin.mid.js";
const router = express.Router()

router.post("/create",adminMiddleware,createCourse)
router.put("/update/:courseId",adminMiddleware,updateCourse)
router.delete("/delete/:courseId",adminMiddleware,deleteCourse)
router.get("/courses",getCourse)
router.get("/:courseId",courseDetails)


// buy courses
router.post("/buy/:courseId",userMiddleware,buyCourses)



export default router;
