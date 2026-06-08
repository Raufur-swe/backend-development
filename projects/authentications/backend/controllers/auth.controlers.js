import { codec, json } from "zod"
import { registrationSchema } from "../config/zod.js"
import TryCatch from "../middlewars/TryCatch.middleware.js"
import sanitize from "mongo-sanitize"
import { redisClient } from "../index.js"
import mongoose from "mongoose"
import { userModel } from "../models/User.model.js"
import bcrypt from "bcrypt"
import crypto from"crypto"

const authController = {

    // signup 
    register: TryCatch(async (req, res) => {
        // make a senirized body
        const sanitizedBody = sanitize(req.body)

        //creat valoidations
        const validation = registrationSchema.safeParse(sanitizedBody)

        // since we have email , pass and name in regiterschema we donot need this line cont{} = req.boy

       if (!validation.success) {
    const errors = validation.error.issues.map((issue) => ({
        field: issue.path.join(".") || "unknown",
        message: issue.message,
        code: issue.code
    }));

    return res.status(400).json({
        message:  "Invalid credentials",
        errors
    });
}


const { name, email, password } = validation.data

//impliments rate limits
const rateLlimitKey = `rergister-rate-limit:${req.ip}:${email}`
if(await redisClient.get(rateLlimitKey)){
    return res.status(429).json({
        message : "Too many request , try again later"
    })
}

// find existing email
 const existUser = await userModel.findOne({email})
 if(existUser){
    return res.status(400),json({
        message : "email already exists"
    })
 }
 
 //hash password
 const hashPassword = await bcrypt.hash(password ,10)

 //create a verify token

 const verifyToken = crypto.randomBytes(32).toString("hex")

 const verifyKey = `verify${verifyToken}` 

 const dataStore =JSON.stringify({
    name,
    email,
    password : hashPassword,
 })

// send data and key to raddis for just 3min
await redisClient.set(verifyKey , dataStore,{EX : 300});

        res.json({
            email,
            name,
            password
        })

    })
}

export default authController