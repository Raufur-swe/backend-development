import express from "express"
import authController from "../controllers/auth.controller.js"
const router = express.Router()

/* all routes api/auth/.. */
router.post("/signup" , authController.signup)
router.post("/login",authController.login)


export default router