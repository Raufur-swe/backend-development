import express from "express"
import authMiddleware from "../middleware/auth.middlewarer.js"
import transactionController from "../controllers/transaction.controller.js"
import systemMiddleware from "../middleware/system.middleware.js"

const router = express.Router()

router.post("/" , authMiddleware ,  transactionController.creatTransaction)
router.post("/system/initial-funds" , systemMiddleware , transactionController.initialFundsTransaction)


export default router

