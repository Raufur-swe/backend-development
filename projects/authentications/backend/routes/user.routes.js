import express from "express"
import authController from "../controllers/auth.controlers.js"

const router = express.Router()

router.post("/register" , authController.register)
router.post("/verify/:token" , authController.verifyUSer)
router.post("/login" , authController.loginUser)

export default router