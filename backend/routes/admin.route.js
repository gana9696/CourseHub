import express from 'express'
import { logIn, logout, signUp } from '../controllers/admin.controller.js'

const router = express.Router()


router.post("/signup",signUp)
router.post("/login",logIn)
router.get("/logout",logout)




export default router