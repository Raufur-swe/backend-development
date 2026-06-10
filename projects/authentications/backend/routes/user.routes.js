import express from "express"
import authController from "../controllers/auth.controlers.js"
import { isAuth } from "../middlewars/authMiddleware.js"

const router = express.Router()

router.post("/register" , authController.register)
router.post("/verify/:token" , authController.verifyUSer)
router.post("/login" , authController.loginUser)
router.post("/verify" , authController.verifyOtp)
router.get("/me" , isAuth , authController.authenticateUser)

export default router