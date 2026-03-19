import { logIn, logout, purchases, signUp } from '../controllers/user.controller.js'


import express from 'express'
import userMiddleware from '../middleware/user.mid.js'
const router = express.Router()


router.post("/signup",signUp)
router.post("/login",logIn)
router.get("/logout",logout)

router.get("/purchases",userMiddleware,purchases)



export default router