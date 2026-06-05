import express from "express"
import authMiddleware from "../middleware/auth.middlewarer.js"
import transactionController from "../controllers/transaction.controller.js"

const router = express.Router()

router.post("/" , authMiddleware ,  transactionController.creatTransaction)

export default router

