import express from 'express'
import authMiddleware from '../middleware/auth.middlewarer.js'
import accountController from '../controllers/account.controller.js'

const router = express.Router()

router.post("/" , authMiddleware , accountController.createAccount)

export default router