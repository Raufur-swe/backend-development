import express from "express"
import authMiddleware from "../middleware/auth.middlewarer.js"

const transaction = express.Router()

transaction.post("/" , authMiddleware)